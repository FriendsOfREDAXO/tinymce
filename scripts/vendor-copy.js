#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const fsp = fs.promises;

const addonRoot = path.resolve(__dirname, '..');

async function copyRecursive(src, dest){
  const { rmSync, mkdirSync, copyFileSync, existsSync } = require('fs');
  if (!existsSync(src)) return;
  mkdirSync(dest, { recursive: true });
  const files = require('fast-glob').sync(['**/*'], { cwd: src, dot: true, onlyFiles: false });
  for (const f of files){
    const s = path.join(src, f);
    const d = path.join(dest, f);
    const st = fs.statSync(s);
    if (st.isDirectory()){
      mkdirSync(d, { recursive: true });
    } else {
      mkdirSync(path.dirname(d), { recursive: true });
      copyFileSync(s, d);
    }
  }
}

async function main(){
  const args = process.argv.slice(2);
  const staging = args.includes('--staging');

  const vendorSrc = path.join(addonRoot, 'node_modules', 'tinymce');
  const i18nSrc = path.join(addonRoot, 'node_modules', 'tinymce-i18n', 'langs');
  const vendorDest = staging ? path.join(addonRoot, 'build', 'vendor', 'tinymce') : path.join(addonRoot, 'assets', 'vendor', 'tinymce');
  const i18nDest = path.join(vendorDest, 'langs');

  console.log('[vendor-copy] copying tinymce ->', vendorDest);
  await copyRecursive(vendorSrc, vendorDest);
  console.log('[vendor-copy] copying tinymce-i18n/langs ->', i18nDest);
  await copyRecursive(i18nSrc, i18nDest);
  console.log('[vendor-copy] done');
}

main().catch(e => { console.error(e); process.exitCode = 1; });
