#!/usr/bin/env node
/**
 * Cleans up build artefacts and historical leftovers.
 *
 *   - Removes build/ (staging output)
 *   - Removes any custom-plugin folders that mistakenly landed in
 *     assets/vendor/tinymce/plugins/ (legacy <= v8.10.2 behaviour where
 *     build-plugins.js copied custom plugins into the vendor tree too).
 */

const fs = require('fs');
const fsp = fs.promises;
const path = require('path');

const addonRoot = path.resolve(__dirname, '..');
const buildRoot = path.join(addonRoot, 'build');
const customRoot = path.join(addonRoot, 'custom_plugins');
const vendorPlugins = path.join(addonRoot, 'assets', 'vendor', 'tinymce', 'plugins');

async function remove(dir){
  if (!fs.existsSync(dir)) return false;
  await fsp.rm(dir, { recursive: true, force: true });
  return true;
}

async function main(){
  console.log('[clean-build] removing', path.relative(addonRoot, buildRoot));
  await remove(buildRoot);

  if (fs.existsSync(customRoot) && fs.existsSync(vendorPlugins)){
    const customNames = (await fsp.readdir(customRoot, { withFileTypes: true }))
      .filter(i => i.isDirectory())
      .map(i => i.name);

    for (const name of customNames){
      const stray = path.join(vendorPlugins, name);
      if (await remove(stray)){
        console.log('[clean-build] removed stray custom plugin from vendor tree:', path.relative(addonRoot, stray));
      }
    }
  }

  console.log('[clean-build] done');
}

main().catch(e => { console.error(e); process.exitCode = 1; });
