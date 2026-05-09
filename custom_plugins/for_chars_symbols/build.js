#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const pluginName = 'for_chars_symbols';
const distDir = path.join(__dirname, 'dist', pluginName);
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const buildVersion = pkg.version + '-' + (process.env.BUILD_NUMBER || '0');

if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

async function build() {
  try {
    const runtimeDir = path.resolve(__dirname, '..', '..', 'assets', 'scripts', 'tinymce', 'plugins', pluginName);
    const runtimeJs = path.join(runtimeDir, 'plugin.js');
    const runtimeMinJs = path.join(runtimeDir, 'plugin.min.js');

    if (!fs.existsSync(runtimeJs)) {
      throw new Error(`Missing runtime source: ${runtimeJs}`);
    }

    if (fs.existsSync(runtimeMinJs)) {
      fs.copyFileSync(runtimeMinJs, path.join(distDir, 'plugin.min.js'));
    } else {
      fs.copyFileSync(runtimeJs, path.join(distDir, 'plugin.min.js'));
    }
    fs.copyFileSync(runtimeJs, path.join(distDir, 'plugin.js'));

    fs.writeFileSync(path.join(distDir, 'version.txt'), buildVersion);
    console.log(`\u2713 Build complete: ${pluginName}`);
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();
