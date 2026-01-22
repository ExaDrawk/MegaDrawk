import fs from 'fs';
import path from 'path';

const openNextDir = path.resolve('.open-next');
const assetsDir = path.join(openNextDir, 'assets');

console.log('Starting post-build fixup for Cloudflare Pages...');

// Function to move recursive
function moveRecursive(src, dest) {
    if (fs.statSync(src).isDirectory()) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        fs.readdirSync(src).forEach(file => {
            moveRecursive(path.join(src, file), path.join(dest, file));
        });
        fs.rmdirSync(src);
    } else {
        if (fs.existsSync(dest)) {
            fs.unlinkSync(dest);
        }
        fs.renameSync(src, dest);
    }
}

if (fs.existsSync(assetsDir)) {
    console.log('Moving assets from .open-next/assets to .open-next/ root...');
    const files = fs.readdirSync(assetsDir);
    for (const file of files) {
        const src = path.join(assetsDir, file);
        const dest = path.join(openNextDir, file);
        moveRecursive(src, dest);
    }
    fs.rmdirSync(assetsDir);
}

const workerPath = path.join(openNextDir, 'worker.js');
const pagesWorkerPath = path.join(openNextDir, '_worker.js');
if (fs.existsSync(workerPath)) {
    fs.renameSync(workerPath, pagesWorkerPath);
    console.log('Renamed worker.js to _worker.js');
}

console.log('Post-build fixup complete. Ready for Cloudflare Pages deployment.');
