#!/usr/bin/env node
/**
 * Verifies build output consistency according to DEVS.md:
 * - custom plugins must exist only under assets/scripts/tinymce/plugins
 * - no custom plugin folder may exist in assets/vendor/tinymce/plugins
 * - each custom plugin asset folder must contain plugin.js + plugin.min.js
 */

const fs = require('fs');
const fsp = fs.promises;
const path = require('path');

const addonRoot = path.resolve(__dirname, '..');
const customRoot = path.join(addonRoot, 'custom_plugins');
const assetsPluginsRoot = path.join(addonRoot, 'assets', 'scripts', 'tinymce', 'plugins');
const vendorPluginsRoot = path.join(addonRoot, 'assets', 'vendor', 'tinymce', 'plugins');

async function main(){
  const errors = [];

  if (!fs.existsSync(customRoot)) {
    throw new Error('custom_plugins directory not found');
  }

  const pluginNames = (await fsp.readdir(customRoot, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  for (const pluginName of pluginNames) {
    const assetDir = path.join(assetsPluginsRoot, pluginName);
    const pluginJs = path.join(assetDir, 'plugin.js');
    const pluginMinJs = path.join(assetDir, 'plugin.min.js');

    if (!fs.existsSync(assetDir)) {
      errors.push('missing asset plugin directory: ' + path.relative(addonRoot, assetDir));
      continue;
    }

    if (!fs.existsSync(pluginJs)) {
      errors.push('missing plugin.js: ' + path.relative(addonRoot, pluginJs));
    }

    if (!fs.existsSync(pluginMinJs)) {
      errors.push('missing plugin.min.js: ' + path.relative(addonRoot, pluginMinJs));
    }

    const strayVendorDir = path.join(vendorPluginsRoot, pluginName);
    if (fs.existsSync(strayVendorDir)) {
      errors.push('stray custom plugin in vendor tree: ' + path.relative(addonRoot, strayVendorDir));
    }
  }

  if (errors.length > 0) {
    console.error('[verify-build] FAILED');
    for (const error of errors) {
      console.error(' - ' + error);
    }
    process.exit(1);
  }

  console.log('[verify-build] OK');
}

main().catch((error) => {
  console.error('[verify-build] ERROR', error && error.message ? error.message : error);
  process.exit(1);
});
