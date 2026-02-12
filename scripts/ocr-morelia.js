const fs = require('fs');
const path = require('path');
const Tesseract = require('tesseract.js');

async function run() {
  const imagesDir = path.join(__dirname, '..', 'public', 'images', 'morelia');
  const outFile = path.join(__dirname, '..', 'ocr-morelia.json');

  if (!fs.existsSync(imagesDir)) {
    console.error('Images directory not found:', imagesDir);
    process.exit(1);
  }

  const files = fs.readdirSync(imagesDir).filter(f => /(\.jpe?g|\.png|\.webp)$/i.test(f));
  if (!files.length) {
    console.error('No image files found in', imagesDir);
    process.exit(1);
  }

  const results = [];
  for (const file of files) {
    const filePath = path.join(imagesDir, file);
    console.log('\n--- OCR:', file, '---');
    try {
      const { data: { text } } = await Tesseract.recognize(filePath, 'eng+spa', { logger: m => console.log(m) });
      const cleaned = (text || '').trim();
      console.log(cleaned.substring(0, 400));
      results.push({ file, text: cleaned });
      // write incrementally so progress is saved
      fs.writeFileSync(outFile, JSON.stringify(results, null, 2));
    } catch (err) {
      console.error('Failed to OCR', file, err.message || err);
      results.push({ file, error: String(err) });
    }
  }
  // no explicit worker termination when using the top-level API
  console.log('\nOCR complete. Results written to', outFile);
}

run().catch(err => {
  console.error('Unhandled error', err);
  process.exit(1);
});
