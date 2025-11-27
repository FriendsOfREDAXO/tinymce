const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const outDir = 'dist/snippets';

// Ensure output directory exists
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

esbuild.build({
    entryPoints: ['src/main/ts/Main.ts'],
    bundle: true,
    outfile: path.join(outDir, 'plugin.js'),
    minify: true,
    sourcemap: false,
    target: ['es2017'],
    format: 'iife',
}).then(() => {
    // Create plugin.min.js as a copy (TinyMCE often looks for minified versions)
    fs.copyFileSync(path.join(outDir, 'plugin.js'), path.join(outDir, 'plugin.min.js'));
}).catch(() => process.exit(1));
