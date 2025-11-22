#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const pluginName = 'quote';
const distDir = path.join(__dirname, 'dist', pluginName);
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const buildVersion = pkg.version + '-' + (process.env.BUILD_NUMBER || '0');

// Clean dist
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Build plugin
async function build() {
  try {
    // Check for license header
    let licenseHeader = '';
    if (fs.existsSync('src/text/license-header.js')) {
      licenseHeader = fs.readFileSync('src/text/license-header.js', 'utf8')
        .replace(/@BUILD_NUMBER@/g, buildVersion);
    }

    // Build mit esbuild
    await esbuild.build({
      entryPoints: ['src/main/ts/Plugin.ts'],
      bundle: true,
      minify: true,
      format: 'iife',
      target: ['es2017'],
      outfile: path.join(distDir, 'plugin.min.js'),
      banner: licenseHeader ? { js: licenseHeader } : {},
      external: ['tinymce', '@ephox/*']
    });

    // Copy plugin.min.js to plugin.js (beide minified für Premium-Plugins)
    fs.copyFileSync(
      path.join(distDir, 'plugin.min.js'),
      path.join(distDir, 'plugin.js')
    );

    // Copy files
    ['CHANGELOG.txt', 'LICENSE.txt'].forEach(file => {
      if (fs.existsSync(file)) {
        fs.copyFileSync(file, path.join(distDir, file));
      }
    });

    // Write version
    fs.writeFileSync(path.join(distDir, 'version.txt'), buildVersion);

    console.log(`✓ Build complete: ${pluginName}`);
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();
