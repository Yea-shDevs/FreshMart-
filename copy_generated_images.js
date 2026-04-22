const fs = require('fs');
const path = require('path');

const SRC_DIR = '/Users/macos/.gemini/antigravity/brain/ea3bda7c-f1dd-4174-8771-acf7c9523ebc';
const DST_DIR = '/Users/macos/Desktop/triallab/public/images';

// Map: destination filename -> source filename (with timestamps)
const imageFiles = {
  'apples.png': 'apples_1776803116954.png',
  'oranges.png': 'oranges_1776803131161.png',
  'mangoes.png': 'mangoes_1776803147262.png',
  'potatoes.png': 'potatoes_1776803179842.png',
  'onions.png': 'onions_1776803194237.png',
  'tomatoes.png': 'tomatoes_1776803209480.png',
  'carrots.png': 'carrots_1776803245359.png',
  'cabbage.png': 'cabbage_1776803260739.png',
  'cauliflower.png': 'cauliflower_1776803280250.png',
  'capsicum.png': 'capsicum_1776803320493.png',
  'garlic.png': 'garlic_1776803333192.png',
  'ginger.png': 'ginger_1776803348674.png',
  'curd.png': 'curd_1776803392459.png',
  'butter.png': 'butter_1776803407478.png',
  'cheese.png': 'cheese_1776803424091.png',
  'paneer.png': 'paneer_1776803472900.png',
  'coconutwater.png': 'coconut_water_1776799613371.png',
};

console.log(`\n📁 Copying ${Object.keys(imageFiles).length} generated images to ${DST_DIR}...\n`);

let success = 0;
let failed = 0;

for (const [destName, srcName] of Object.entries(imageFiles)) {
  const src = path.join(SRC_DIR, srcName);
  const dst = path.join(DST_DIR, destName);
  try {
    fs.copyFileSync(src, dst);
    const stats = fs.statSync(dst);
    console.log(`  ✅ ${destName} (${(stats.size / 1024).toFixed(0)} KB)`);
    success++;
  } catch (err) {
    console.log(`  ❌ ${destName}: ${err.message}`);
    failed++;
  }
}

console.log(`\n📊 Results: ${success} copied, ${failed} failed\n`);

// Now update products.js
console.log('📝 Updating products.js with local image paths...\n');

const productsFile = '/Users/macos/Desktop/triallab/data/products.js';
let content = fs.readFileSync(productsFile, 'utf8');

const urlToLocal = {
  'https://image.pollinations.ai/prompt/fresh%20shimla%20apples%20on%20clean%20background%208k%20photorealistic?width=800&height=800&nologo=true': '/images/apples.png',
  'https://image.pollinations.ai/prompt/vibrant%20nagpur%20oranges%20on%20clean%20background%208k%20photorealistic?width=800&height=800&nologo=true': '/images/oranges.png',
  'https://image.pollinations.ai/prompt/fresh%20alphonso%20mangoes%20on%20clean%20background%208k%20photorealistic?width=800&height=800&nologo=true': '/images/mangoes.png',
  'https://image.pollinations.ai/prompt/fresh%20premium%20raw%20potatoes%20on%20clean%20background%208k%20photorealistic?width=800&height=800&nologo=true': '/images/potatoes.png',
  'https://image.pollinations.ai/prompt/fresh%20red%20onions%20on%20clean%20background%208k%20photorealistic?width=800&height=800&nologo=true': '/images/onions.png',
  'https://image.pollinations.ai/prompt/vine%20ripened%20red%20tomatoes%20on%20clean%20background%208k%20photorealistic?width=800&height=800&nologo=true': '/images/tomatoes.png',
  'https://image.pollinations.ai/prompt/fresh%20crunchy%20orange%20carrots%20on%20clean%20background%208k%20photorealistic?width=800&height=800&nologo=true': '/images/carrots.png',
  'https://image.pollinations.ai/prompt/fresh%20green%20cabbage%20on%20clean%20background%208k%20photorealistic?width=800&height=800&nologo=true': '/images/cabbage.png',
  'https://image.pollinations.ai/prompt/fresh%20white%20cauliflower%20on%20clean%20background%208k%20photorealistic?width=800&height=800&nologo=true': '/images/cauliflower.png',
  'https://image.pollinations.ai/prompt/fresh%20green%20capsicum%20bell%20peppers%20on%20clean%20background%208k%20photorealistic?width=800&height=800&nologo=true': '/images/capsicum.png',
  'https://image.pollinations.ai/prompt/fresh%20garlic%20bulbs%20on%20clean%20background%208k%20photorealistic?width=800&height=800&nologo=true': '/images/garlic.png',
  'https://image.pollinations.ai/prompt/fresh%20ginger%20root%20on%20clean%20background%208k%20photorealistic?width=800&height=800&nologo=true': '/images/ginger.png',
  'https://image.pollinations.ai/prompt/smooth%20white%20creamy%20fresh%20curd%20yogurt%20in%20a%20bowl%20photorealistic?width=800&height=800&nologo=true': '/images/curd.png',
  'https://image.pollinations.ai/prompt/block%20of%20rich%20yellow%20creamy%20butter%20on%20premium%20background?width=800&height=800&nologo=true': '/images/butter.png',
  'https://image.pollinations.ai/prompt/slices%20of%20premium%20soft%20cheese%20photorealistic?width=800&height=800&nologo=true': '/images/cheese.png',
  'https://image.pollinations.ai/prompt/block%20of%20soft%20fresh%20white%20paneer%20cheese%20photorealistic?width=800&height=800&nologo=true': '/images/paneer.png',
};

let replacements = 0;
for (const [url, localPath] of Object.entries(urlToLocal)) {
  if (content.includes(url)) {
    content = content.split(url).join(localPath);
    replacements++;
    console.log(`  ✅ Replaced URL -> ${localPath}`);
  }
}

// Also update coconutwater
if (content.includes('/images/coconutwater.png')) {
  console.log('  ✅ coconutwater.png path already set');
}

fs.writeFileSync(productsFile, content);
console.log(`\n📝 Updated ${replacements} image references in products.js`);
console.log('\n🎉 Done! Run your server to see the local images.\n');
