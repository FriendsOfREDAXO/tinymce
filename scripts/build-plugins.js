#!/usr/bin/env node
const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const { execSync } = require('child_process');
const esbuild = require('esbuild');
const fg = require('fast-glob');

const addonRoot = path.resolve(__dirname, '..');
const customRoot = path.join(addonRoot, 'custom_plugins');
const destRoot = path.join(addonRoot, 'assets', 'scripts', 'tinymce', 'plugins');

function log(...args){ console.log('[build-plugins]', ...args); }

async function ensureDir(dir){ await fsp.mkdir(dir, { recursive: true }); }
async function removeDir(dir){ if (fs.existsSync(dir)) await fsp.rm(dir, { recursive: true, force: true }); }

async function copyRecursive(src, dest){
  // copy everything from src into dest (dir -> dir)
  if (!fs.existsSync(src)) return;
  await ensureDir(dest);
  // prefer fs.cp if available
  if (fsp.cp) return fsp.cp(src, dest, { recursive: true });
  const files = await fg(['**/*'], { cwd: src, dot: true, onlyFiles: false });
  for (const f of files){
    const s = path.join(src, f);
    const d = path.join(dest, f);
    const st = await fsp.stat(s);
    if (st.isDirectory()){
      await ensureDir(d);
    } else {
      await ensureDir(path.dirname(d));
      await fsp.copyFile(s, d);
    }
  }
}

const args = process.argv.slice(2);
const staging = args.includes('--staging');

async function buildPlugin(p){
  const pluginDir = path.join(customRoot, p);
  if (!fs.existsSync(pluginDir)) return;

  log('processing', p);

  const stagingRoot = path.join(addonRoot, staging ? 'build' : 'assets');
  const vendorOut = path.join(stagingRoot, 'vendor', 'tinymce', 'plugins', p);
  const outDir = path.join(staging ? path.join(addonRoot, 'build', 'plugins') : destRoot, p);

  await removeDir(outDir);
  await ensureDir(outDir);

  // Possible prebuilt locations to copy from
  const candidates = [
    path.join(pluginDir, 'dist', p),
    path.join(pluginDir, 'dist'),
    path.join(pluginDir, 'build'),
    path.join(pluginDir, 'lib')
  ];

  for (const c of candidates){
    if (fs.existsSync(c)){
      log('copying prebuilt from', c, '->', outDir);
      await copyRecursive(c, outDir);
      // also place in vendor plugins so Tiny can load plugin via regular plugin path
      try{
        await removeDir(vendorOut);
        await copyRecursive(c, vendorOut);
        log('copied prebuilt into vendor ->', vendorOut);
      }catch(e){ log('failed to copy prebuilt into vendor for', p, e.message); }
      return;
    }
  }

  // If no prebuilt artifact, try to bundle a common entrypoint with esbuild
  const entryCandidates = [
    'src/main/ts/Plugin.ts',
    'src/main/ts/Main.ts',
    'src/main/ts/api/Main.ts',
    'src/main/index.ts',
    'src/main.js',
    'src/index.js'
  ];

  for (const rel of entryCandidates){
    const full = path.join(pluginDir, rel);
    if (!fs.existsSync(full)) continue;

    const outfile = path.join(outDir, p + '.min.js');
    log('bundling', full, '->', outfile);
    try{
      await esbuild.build({
        entryPoints: [full],
        bundle: true,
        minify: true,
        format: 'iife',
        target: ['es2017'],
        outfile: outfile,
        sourcemap: false
      });

      // copy languages if present
      const langsSrc = path.join(pluginDir, 'langs');
      if (fs.existsSync(langsSrc)){
        await copyRecursive(langsSrc, path.join(outDir, 'langs'));
        try{ await ensureDir(vendorOut); await copyRecursive(langsSrc, path.join(vendorOut, 'langs')); }catch(e){}
      }

      // copy built file into vendor plugins (minified + plugin.js fallback)
      try{
        await ensureDir(vendorOut);
        await fsp.copyFile(outfile, path.join(vendorOut, p + '.min.js')).catch(()=>{});
        await fsp.copyFile(outfile, path.join(vendorOut, 'plugin.js')).catch(()=>{});
        log('wrote plugin files into vendor ->', vendorOut);
      }catch(e){ log('failed to write vendor plugin files for', p, e.message); }

      return;
    }catch(err){
      log('esbuild failed for', p, err.message || err);
    }
  }

  log('no build artifacts detected for', p, '- nothing copied');
}

async function main(){
  const args = process.argv.slice(2);
  if (args.includes('--clean')){
    const target = staging ? path.join(addonRoot, 'build', 'plugins') : destRoot;
    log('cleaning plugin assets in', target);
    await removeDir(target);
    return;
  }

  const ensureRoot = staging ? path.join(addonRoot, 'build', 'plugins') : destRoot;
  await ensureDir(ensureRoot);

  if (!fs.existsSync(customRoot)){
    log('no custom_plugins dir found, nothing to do');
    return;
  }

  const items = await fsp.readdir(customRoot, { withFileTypes: true });
  const plugins = items.filter(i => i.isDirectory()).map(i => i.name);

  for (const p of plugins){
    const pluginDir = path.join(customRoot, p);
    const packageJson = path.join(pluginDir, 'package.json');

    if (fs.existsSync(packageJson)){
      try{
        const pkg = JSON.parse(await fsp.readFile(packageJson, 'utf8'));
        if (pkg.scripts && pkg.scripts.build){
          log('running build script for', p);
          try{ execSync('pnpm run build', { stdio: 'inherit', cwd: pluginDir }); }
          catch(e){ log('plugin build failed for', p, '- continuing (error ignored)'); }
        }
      }catch(e){ log('failed reading package.json for', p, e.message); }
    }

    await buildPlugin(p);
  }

  log('done');
}

main().catch(e => { console.error(e); process.exitCode = 1; });
