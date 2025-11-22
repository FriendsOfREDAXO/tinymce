#!/usr/bin/env node
const fs = require('fs');
const fsp = fs.promises;
const path = require('path');

const addonRoot = path.resolve(__dirname, '..');
const buildRoot = path.join(addonRoot, 'build');

async function remove(dir){ if (fs.existsSync(dir)) await fsp.rm(dir, { recursive: true, force: true }); }

async function main(){
  console.log('[clean-build] removing', buildRoot);
  await remove(buildRoot);
  console.log('[clean-build] done');
}

main().catch(e => { console.error(e); process.exitCode = 1 });
