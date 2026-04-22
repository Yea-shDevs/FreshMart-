const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, 'public', 'images');

// All images to download with their Pollinations prompts
const images = [
  { name: 'apples.png', prompt: 'fresh shimla apples on clean background 8k photorealistic' },
  { name: 'oranges.png', prompt: 'vibrant nagpur oranges on clean background 8k photorealistic' },
  { name: 'mangoes.png', prompt: 'fresh alphonso mangoes on clean background 8k photorealistic' },
  { name: 'potatoes.png', prompt: 'fresh premium raw potatoes on clean background 8k photorealistic' },
  { name: 'onions.png', prompt: 'fresh red onions on clean background 8k photorealistic' },
  { name: 'tomatoes.png', prompt: 'vine ripened red tomatoes on clean background 8k photorealistic' },
  { name: 'carrots.png', prompt: 'fresh crunchy orange carrots on clean background 8k photorealistic' },
  { name: 'cabbage.png', prompt: 'fresh green cabbage on clean background 8k photorealistic' },
  { name: 'cauliflower.png', prompt: 'fresh white cauliflower on clean background 8k photorealistic' },
  { name: 'capsicum.png', prompt: 'fresh green capsicum bell peppers on clean background 8k photorealistic' },
  { name: 'garlic.png', prompt: 'fresh garlic bulbs on clean background 8k photorealistic' },
  { name: 'ginger.png', prompt: 'fresh ginger root on clean background 8k photorealistic' },
  { name: 'curd.png', prompt: 'smooth white creamy fresh curd yogurt in a bowl photorealistic' },
  { name: 'butter.png', prompt: 'block of rich yellow creamy butter on premium background' },
  { name: 'cheese.png', prompt: 'slices of premium soft cheese photorealistic' },
  { name: 'paneer.png', prompt: 'block of soft fresh white paneer cheese photorealistic' },
  { name: 'cream.png', prompt: 'bowl of thick fresh dairy cream photorealistic' },
  { name: 'burgerbuns.png', prompt: 'freshly baked golden burger buns photorealistic' },
  { name: 'pav.png', prompt: 'soft mumbai pav bread buns photorealistic' },
  { name: 'biscuits.png', prompt: 'crispy golden butter biscuits cookies photorealistic' },
  { name: 'cake.png', prompt: 'decadent chocolate cake slice photorealistic' },
  { name: 'rusks.png', prompt: 'premium golden baked tea rusks photorealistic' },
  { name: 'mutton.png', prompt: 'tender raw mutton meat cuts photorealistic' },
  { name: 'fish.png', prompt: 'fresh catch rohu fish photorealistic' },
  { name: 'prawns.png', prompt: 'fresh tiger prawns seafood photorealistic' },
  { name: 'crab.png', prompt: 'premium fresh crab seafood photorealistic' },
  { name: 'atta.png', prompt: 'premium whole wheat atta flour in a bowl photorealistic' },
  { name: 'dal.png', prompt: 'unpolished toor dal yellow lentils in a bowl photorealistic' },
  { name: 'sugar.png', prompt: 'bowl of refined white sugar crystals photorealistic' },
  { name: 'salt.png', prompt: 'bowl of premium iodized salt photorealistic' },
  { name: 'noodles.png', prompt: 'spicy masala instant noodles photorealistic' },
  { name: 'mineralwater.png', prompt: 'bottle of purified mineral water photorealistic' },
];

function buildUrl(prompt) {
  const encoded = encodeURIComponent(prompt).replace(/%20/g, '%20');
  return `https://image.pollinations.ai/prompt/${encoded}?width=800&height=800&nologo=true`;
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const makeRequest = (currentUrl, redirectCount = 0) => {
      if (redirectCount > 10) { reject(new Error('Too many redirects')); return; }
      const client = currentUrl.startsWith('https') ? https : http;
      const req = client.get(currentUrl, { timeout: 30000 }, (response) => {
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          makeRequest(response.headers.location, redirectCount + 1);
          return;
        }
        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode}`));
          return;
        }
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        fileStream.on('finish', () => { fileStream.close(); resolve(); });
        fileStream.on('error', reject);
      });
      req.on('error', reject);
      req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
    };
    makeRequest(url);
  });
}

async function main() {
  // Filter out already-existing images
  const toDownload = images.filter(img => {
    const filepath = path.join(IMAGES_DIR, img.name);
    return !fs.existsSync(filepath) || fs.statSync(filepath).size < 1000;
  });

  console.log(`\n🔽 Need to download ${toDownload.length} images (${images.length - toDownload.length} already exist)\n`);

  let success = 0, failed = 0;

  for (const img of toDownload) {
    const filepath = path.join(IMAGES_DIR, img.name);
    const url = buildUrl(img.prompt);
    process.stdout.write(`  ⏳ ${img.name} ... `);
    try {
      await downloadImage(url, filepath);
      const stats = fs.statSync(filepath);
      if (stats.size < 1000) {
        fs.unlinkSync(filepath);
        throw new Error('File too small, likely error');
      }
      console.log(`✅ (${(stats.size / 1024).toFixed(0)} KB)`);
      success++;
    } catch (err) {
      console.log(`❌ ${err.message}`);
      failed++;
    }
    // Delay between downloads
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log(`\n📊 Results: ${success} downloaded, ${failed} failed\n`);
}

main().catch(console.error);
