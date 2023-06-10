
const fs = require('fs');
const archiver = require('archiver');
const path = require('path');
function toZip() {

const uploadsFolder = path.join(process.cwd(), '../FinalMockups');
 
const output = fs.createWriteStream(path.join(process.cwd(), '../toZip/compressedImages.zip'));
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  console.log('Compression completed');
});

archive.on('error', (err) => {
  console.error('Compression error:', err);
});

archive.pipe(output);

archive.directory(uploadsFolder, false);

archive.finalize();

}
toZip();
module.exports = toZip;