#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const pluginName = 'for_markdown';
const distDir = path.join(__dirname, 'dist', pluginName);
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const buildVersion = pkg.version + '-' + (process.env.BUILD_NUMBER || '0');

if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

async function build() {
  try {
    await esbuild.build({
      entryPoints: ['src/main/ts/Main.ts'],
      bundle: true,
      minify: true,
      format: 'iife',
      target: ['es2017'],
      outfile: path.join(distDir, 'plugin.min.js'),
      external: ['tinymce'],
    });

    fs.copyFileSync(
      path.join(distDir, 'plugin.min.js'),
      path.join(distDir, 'plugin.js')
    );

    fs.writeFileSync(path.join(distDir, 'version.txt'), buildVersion);
    console.log(`\u2713 Build complete: ${pluginName}`);
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();
