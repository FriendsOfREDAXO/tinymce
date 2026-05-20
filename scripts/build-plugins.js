#!/usr/bin/env node
/**
 * Build pipeline for the addon's CUSTOM TinyMCE plugins.
 *
 * Source:   custom_plugins/<name>/
 * Target:   assets/scripts/tinymce/plugins/<name>/  (or build/plugins/<name>/ with --staging)
 *
 * IMPORTANT: This script must NEVER write into assets/vendor/tinymce/.
 *   - assets/vendor/tinymce/  contains ONLY upstream TinyMCE core
 *     (npm package `tinymce`), maintained exclusively by scripts/vendor-copy.js.
 *   - Our custom plugins are loaded via `external_plugins` URLs that point
 *     into assets/scripts/tinymce/plugins/<name>/plugin.min.js
 *
 * Why the separation matters:
 *   - Mixing custom plugins into the vendor tree made plugin updates from
 *     upstream destructive (custom files would be deleted by vendor-copy).
 *   - It also produced duplicate plugin.min.js with diverging cache busters.
 *   - And it gave the false impression that those plugins ship with TinyMCE.
 */

const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const { execSync } = require('child_process');
const esbuild = require('esbuild');
const fg = require('fast-glob');

const addonRoot = path.resolve(__dirname, '..');
const customRoot = path.join(addonRoot, 'custom_plugins');

const args = process.argv.slice(2);
const staging = args.includes('--staging');

const destRoot = staging
  ? path.join(addonRoot, 'build', 'plugins')
  : path.join(addonRoot, 'assets', 'scripts', 'tinymce', 'plugins');

function log(...a){ console.log('[build-plugins]', ...a); }
async function ensureDir(dir){ await fsp.mkdir(dir, { recursive: true }); }
async function removeDir(dir){ if (fs.existsSync(dir)) await fsp.rm(dir, { recursive: true, force: true }); }

async function copyRecursive(src, dest){
  if (!fs.existsSync(src)) return;
  await ensureDir(dest);
  if (fsp.cp) return fsp.cp(src, dest, { recursive: true });
  const files = await fg(['**/*'], { cwd: src, dot: true, onlyFiles: false });
  for (const f of files){
    const s = path.join(src, f);
    const d = path.join(dest, f);
    const st = await fsp.stat(s);
    if (st.isDirectory()) await ensureDir(d);
    else { await ensureDir(path.dirname(d)); await fsp.copyFile(s, d); }
  }
}

async function buildPlugin(p){
  const pluginDir = path.join(customRoot, p);
  if (!fs.existsSync(pluginDir)) return;

  const outDir = path.join(destRoot, p);
  await removeDir(outDir);
  await ensureDir(outDir);

  // Prefer prebuilt artifacts produced by the plugin's own build script.
  const candidates = [
    path.join(pluginDir, 'dist', p),
    path.join(pluginDir, 'dist'),
    path.join(pluginDir, 'build'),
    path.join(pluginDir, 'lib'),
  ];

  for (const c of candidates){
    if (fs.existsSync(c)){
      log('copy prebuilt', path.relative(addonRoot, c), '->', path.relative(addonRoot, outDir));
      await copyRecursive(c, outDir);
      return;
    }
  }

  // Fallback: bundle a known entrypoint with esbuild.
  // Main.ts MUST come before Plugin.ts: TinyMCE convention is that Plugin.ts
  // only exports the setup function (`export default (): void => {...}`),
  // while Main.ts actually invokes it (`Plugin();`). Picking Plugin.ts as the
  // IIFE entry would produce a bundle that never registers itself.
  const entryCandidates = [
    'src/main/ts/Main.ts',
    'src/main/ts/api/Main.ts',
    'src/main/ts/Plugin.ts',
    'src/main/index.ts',
    'src/main.js',
    'src/index.js',
  ];

  for (const rel of entryCandidates){
    const full = path.join(pluginDir, rel);
    if (!fs.existsSync(full)) continue;

    // TinyMCE/profiles expect `plugin.min.js` (and an accompanying `plugin.js`)
    // inside the plugin directory, not `<pluginname>.min.js`. Match the naming
    // produced by each plugin's own build.js so the fallback is interchangeable.
    const outfile = path.join(outDir, 'plugin.min.js');
    log('bundle', path.relative(addonRoot, full), '->', path.relative(addonRoot, outfile));
    try{
      await esbuild.build({
        entryPoints: [full],
        bundle: true,
        minify: true,
        format: 'iife',
        target: ['es2017'],
        outfile,
        sourcemap: false,
        // Plugins import from `tinymce`; the per-plugin build scripts mark it
        // external so the global `tinymce` runtime is reused. Mirror that here
        // to avoid inlining the entire TinyMCE package into each plugin bundle.
        external: ['tinymce'],
      });

      // Provide an unminified alias used by some profiles / dev tooling.
      try {
        fs.copyFileSync(outfile, path.join(outDir, 'plugin.js'));
      } catch (_e) { /* ignore */ }

      const langsSrc = path.join(pluginDir, 'langs');
      if (fs.existsSync(langsSrc)){
        await copyRecursive(langsSrc, path.join(outDir, 'langs'));
      }
      return;
    } catch (err){
      log('esbuild failed for', p, err.message || err);
    }
  }

  log('no build artifacts detected for', p, '- nothing copied');
}

async function main(){
  if (args.includes('--clean')){
    log('cleaning', path.relative(addonRoot, destRoot));
    await removeDir(destRoot);
    return;
  }

  await ensureDir(destRoot);

  if (!fs.existsSync(customRoot)){
    log('no custom_plugins dir found, nothing to do');
    return;
  }

  const items = await fsp.readdir(customRoot, { withFileTypes: true });
  const plugins = items.filter(i => i.isDirectory()).map(i => i.name);

  for (const p of plugins){
    log('processing', p);
    const pluginDir = path.join(customRoot, p);
    const packageJson = path.join(pluginDir, 'package.json');

    if (fs.existsSync(packageJson)){
      try{
        const pkg = JSON.parse(await fsp.readFile(packageJson, 'utf8'));
        if (pkg.scripts && pkg.scripts.build){
          // In staging mode, avoid running the plugin's `build` script, because
          // it typically chains `build-copy` and writes directly into
          // `assets/scripts/tinymce/plugins/...`. That would dirty the working
          // tree and defeat the purpose of `--staging` (output to `build/`
          // only). Run the plain `build.js` if present, which just produces
          // `dist/<name>/` and lets `buildPlugin()` copy it into `build/`.
          if (staging){
            const buildJs = path.join(pluginDir, 'build.js');
            if (fs.existsSync(buildJs)){
              log('  run plugin build.js (staging, no build-copy)');
              try { execSync('node build.js', { stdio: 'inherit', cwd: pluginDir }); }
              catch (e) { log('  plugin build.js failed for', p, '- continuing (error ignored)'); }
            } else {
              log('  skip plugin build script in staging (no build.js found)');
            }
          } else {
            log('  run plugin build script');
            try { execSync('pnpm run build', { stdio: 'inherit', cwd: pluginDir }); }
            catch (e) { log('  plugin build failed for', p, '- continuing (error ignored)'); }
          }
        }
      } catch (e) { log('failed reading package.json for', p, e.message); }
    }

    await buildPlugin(p);
  }

  log('done. Custom plugins are now in', path.relative(addonRoot, destRoot));
  log('Vendor tree (assets/vendor/tinymce/) was NOT touched - that is intentional.');
}

main().catch(e => { console.error(e); process.exitCode = 1; });
