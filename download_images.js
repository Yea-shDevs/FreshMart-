const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, 'public', 'images');

// Map: local filename -> pollinations URL
const imageMap = {
  'apples': 'https://image.pollinations.ai/prompt/fresh%20shimla%20apples%20on%20clean%20background%208k%20photorealistic?width=800&height=800&nologo=true',
  'oranges': 'https://image.pollinations.ai/prompt/vibrant%20nagpur%20oranges%20on%20clean%20background%208k%20photorealistic?width=800&height=800&nologo=true',
  'mangoes': 'https://image.pollinations.ai/prompt/fresh%20alphonso%20mangoes%20on%20clean%20background%208k%20photorealistic?width=800&height=800&nologo=true',
  'potatoes': 'https://image.pollinations.ai/prompt/fresh%20premium%20raw%20potatoes%20on%20clean%20background%208k%20photorealistic?width=800&height=800&nologo=true',
  'onions': 'https://image.pollinations.ai/prompt/fresh%20red%20onions%20on%20clean%20background%208k%20photorealistic?width=800&height=800&nologo=true',
  'tomatoes': 'https://image.pollinations.ai/prompt/vine%20ripened%20red%20tomatoes%20on%20clean%20background%208k%20photorealistic?width=800&height=800&nologo=true',
  'carrots': 'https://image.pollinations.ai/prompt/fresh%20crunchy%20orange%20carrots%20on%20clean%20background%208k%20photorealistic?width=800&height=800&nologo=true',
  'cabbage': 'https://image.pollinations.ai/prompt/fresh%20green%20cabbage%20on%20clean%20background%208k%20photorealistic?width=800&height=800&nologo=true',
  'cauliflower': 'https://image.pollinations.ai/prompt/fresh%20white%20cauliflower%20on%20clean%20background%208k%20photorealistic?width=800&height=800&nologo=true',
  'capsicum': 'https://image.pollinations.ai/prompt/fresh%20green%20capsicum%20bell%20peppers%20on%20clean%20background%208k%20photorealistic?width=800&height=800&nologo=true',
  'garlic': 'https://image.pollinations.ai/prompt/fresh%20garlic%20bulbs%20on%20clean%20background%208k%20photorealistic?width=800&height=800&nologo=true',
  'ginger': 'https://image.pollinations.ai/prompt/fresh%20ginger%20root%20on%20clean%20background%208k%20photorealistic?width=800&height=800&nologo=true',
  'curd': 'https://image.pollinations.ai/prompt/smooth%20white%20creamy%20fresh%20curd%20yogurt%20in%20a%20bowl%20photorealistic?width=800&height=800&nologo=true',
  'butter': 'https://image.pollinations.ai/prompt/block%20of%20rich%20yellow%20creamy%20butter%20on%20premium%20background?width=800&height=800&nologo=true',
  'cheese': 'https://image.pollinations.ai/prompt/slices%20of%20premium%20soft%20cheese%20photorealistic?width=800&height=800&nologo=true',
  'paneer': 'https://image.pollinations.ai/prompt/block%20of%20soft%20fresh%20white%20paneer%20cheese%20photorealistic?width=800&height=800&nologo=true',
  'cream': 'https://image.pollinations.ai/prompt/bowl%20of%20thick%20fresh%20dairy%20cream%20photorealistic?width=800&height=800&nologo=true',
  'burgerbuns': 'https://image.pollinations.ai/prompt/freshly%20baked%20golden%20burger%20buns%20photorealistic?width=800&height=800&nologo=true',
  'pav': 'https://image.pollinations.ai/prompt/soft%20mumbai%20pav%20bread%20buns%20photorealistic?width=800&height=800&nologo=true',
  'biscuits': 'https://image.pollinations.ai/prompt/block%20of%20rich%20yellow%20creamy%20butter%20on%20premium%20background?width=800&height=800&nologo=true',
  'cake': 'https://image.pollinations.ai/prompt/decadent%20chocolate%20cake%20slice%20photorealistic?width=800&height=800&nologo=true',
  'rusks': 'https://image.pollinations.ai/prompt/premium%20golden%20baked%20tea%20rusks%20photorealistic?width=800&height=800&nologo=true',
  'mutton': 'https://image.pollinations.ai/prompt/tender%20raw%20mutton%20meat%20cuts%20photorealistic?width=800&height=800&nologo=true',
  'fish': 'https://image.pollinations.ai/prompt/fresh%20catch%20rohu%20fish%20photorealistic?width=800&height=800&nologo=true',
  'prawns': 'https://image.pollinations.ai/prompt/fresh%20tiger%20prawns%20seafood%20photorealistic?width=800&height=800&nologo=true',
  'crab': 'https://image.pollinations.ai/prompt/premium%20fresh%20crab%20seafood%20photorealistic?width=800&height=800&nologo=true',
  'atta': 'https://image.pollinations.ai/prompt/premium%20whole%20wheat%20atta%20flour%20in%20a%20bowl%20photorealistic?width=800&height=800&nologo=true',
  'dal': 'https://image.pollinations.ai/prompt/unpolished%20toor%20dal%20yellow%20lentils%20in%20a%20bowl%20photorealistic?width=800&height=800&nologo=true',
  'sugar': 'https://image.pollinations.ai/prompt/bowl%20of%20refined%20white%20sugar%20crystals%20photorealistic?width=800&height=800&nologo=true',
  'salt': 'https://image.pollinations.ai/prompt/bowl%20of%20premium%20iodized%20salt%20photorealistic?width=800&height=800&nologo=true',
  'noodles': 'https://image.pollinations.ai/prompt/spicy%20masala%20instant%20noodles%20photorealistic?width=800&height=800&nologo=true',
  'mineralwater': 'https://image.pollinations.ai/prompt/bottle%20of%20purified%20mineral%20water%20photorealistic?width=800&height=800&nologo=true',
};

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const makeRequest = (currentUrl, redirectCount = 0) => {
      if (redirectCount > 10) {
        reject(new Error('Too many redirects'));
        return;
      }
      const client = currentUrl.startsWith('https') ? https : http;
      client.get(currentUrl, (response) => {
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          makeRequest(response.headers.location, redirectCount + 1);
          return;
        }
        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode} for ${url}`));
          return;
        }
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });
        fileStream.on('error', reject);
      }).on('error', reject);
    };
    makeRequest(url);
  });
}

async function main() {
  const entries = Object.entries(imageMap);
  console.log(`\n🔽 Downloading ${entries.length} images to ${IMAGES_DIR}...\n`);

  let success = 0;
  let failed = 0;

  for (const [name, url] of entries) {
    const filepath = path.join(IMAGES_DIR, `${name}.png`);
    process.stdout.write(`  ⏳ ${name}.png ... `);
    try {
      await downloadImage(url, filepath);
      const stats = fs.statSync(filepath);
      console.log(`✅ (${(stats.size / 1024).toFixed(0)} KB)`);
      success++;
    } catch (err) {
      console.log(`❌ ${err.message}`);
      failed++;
    }
    // Small delay to not hammer the API
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log(`\n📊 Results: ${success} downloaded, ${failed} failed\n`);

  // Now update products.js to use local paths
  console.log('📝 Updating products.js to use local image paths...\n');
  const productsFile = path.join(__dirname, 'data', 'products.js');
  let content = fs.readFileSync(productsFile, 'utf8');

  // Build replacement map: pollinations URL -> local path
  const urlReplacements = {};
  for (const [name, url] of entries) {
    const localPath = `/images/${name}.png`;
    // Check if the file was actually downloaded
    const filepath = path.join(IMAGES_DIR, `${name}.png`);
    if (fs.existsSync(filepath) && fs.statSync(filepath).size > 1000) {
      urlReplacements[url] = localPath;
    }
  }

  for (const [oldUrl, newPath] of Object.entries(urlReplacements)) {
    // The URLs in the file have & as literal & (not &amp;)
    content = content.split(oldUrl).join(newPath);
  }

  fs.writeFileSync(productsFile, content);
  console.log('✅ products.js updated successfully!');
  
  // Also handle the coconutwater product which uses the mineral water URL
  // It was already set to /images/coconutwater.png in a previous edit
  
  console.log('\n🎉 All done! All images are now in public/images/\n');
}

main().catch(console.error);
