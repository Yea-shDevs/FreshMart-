const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 8765;
const IMAGES_DIR = path.join(__dirname, 'public', 'images');

app.use(cors());

// Accept raw binary body up to 10MB
app.use(express.raw({ type: '*/*', limit: '10mb' }));

// Endpoint to save an image
app.post('/save-image/:name', (req, res) => {
  const filename = req.params.name;
  if (!filename.endsWith('.png')) {
    return res.status(400).json({ error: 'Only .png files allowed' });
  }
  const filepath = path.join(IMAGES_DIR, filename);
  fs.writeFileSync(filepath, req.body);
  const size = fs.statSync(filepath).size;
  console.log(`  ✅ Saved ${filename} (${(size / 1024).toFixed(0)} KB)`);
  res.json({ ok: true, size });
});

// Serve status page
app.get('/', (req, res) => {
  const htmlPath = path.join(__dirname, 'public', 'download_and_save.html');
  res.sendFile(htmlPath);
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`\n🔽 Image saver running at http://localhost:${PORT}`);
  console.log(`   Open this URL in your browser to download & save images\n`);
});
