#!/usr/bin/env node
/**
 * Syncs the staged `build/` artifacts (produced by `pnpm run build:staging`)
 * into the live `assets/` tree.
 *
 *   build/vendor/tinymce/         -> assets/vendor/tinymce/
 *   build/plugins/<custom>/       -> assets/scripts/tinymce/plugins/<custom>/
 *
 * IMPORTANT: Custom plugins are deliberately NOT mirrored into
 * assets/vendor/tinymce/plugins/. That tree is reserved for upstream
 * TinyMCE only (see scripts/build-plugins.js for rationale).
 */

const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const fg = require('fast-glob');

const addonRoot = path.resolve(__dirname, '..');
const buildRoot = path.join(addonRoot, 'build');
const assetsVendor = path.join(addonRoot, 'assets', 'vendor');
const assetsScriptsPlugins = path.join(addonRoot, 'assets', 'scripts', 'tinymce', 'plugins');

async function ensure(dir){ await fsp.mkdir(dir, { recursive: true }); }

async function copyRecursive(src, dest){
  if (!fs.existsSync(src)) return;
  await ensure(dest);
  const files = fg.sync(['**/*'], { cwd: src, dot: true, onlyFiles: false });
  for (const f of files){
    const s = path.join(src, f);
    const d = path.join(dest, f);
    const st = fs.statSync(s);
    if (st.isDirectory()) await ensure(d);
    else { await ensure(path.dirname(d)); await fsp.copyFile(s, d); }
  }
}

async function main(){
  console.log('[sync-build] syncing build/ -> assets/');

  // Upstream TinyMCE
  await copyRecursive(path.join(buildRoot, 'vendor', 'tinymce'), path.join(assetsVendor, 'tinymce'));

  // Custom plugins
  const buildPlugins = path.join(buildRoot, 'plugins');
  if (fs.existsSync(buildPlugins)){
    await copyRecursive(buildPlugins, assetsScriptsPlugins);
  }

  console.log('[sync-build] done');
}

main().catch(e => { console.error(e); process.exitCode = 1; });
