const fs = require('fs');

const file = '/Users/macos/Desktop/triallab/data/products.js';
let content = fs.readFileSync(file, 'utf8');

const localToUrl = {
  '/images/apples.png': 'https://image.pollinations.ai/prompt/fresh%20shimla%20apples%20on%20clean%20background%208k%20photorealistic?width=800&height=800&nologo=true',
  '/images/oranges.png': 'https://image.pollinations.ai/prompt/vibrant%20nagpur%20oranges%20on%20clean%20background%208k%20photorealistic?width=800&height=800&nologo=true',
  '/images/mangoes.png': 'https://image.pollinations.ai/prompt/fresh%20alphonso%20mangoes%20on%20clean%20background%208k%20photorealistic?width=800&height=800&nologo=true',
  '/images/potatoes.png': 'https://image.pollinations.ai/prompt/fresh%20premium%20raw%20potatoes%20on%20clean%20background%208k%20photorealistic?width=800&height=800&nologo=true',
  '/images/onions.png': 'https://image.pollinations.ai/prompt/fresh%20red%20onions%20on%20clean%20background%208k%20photorealistic?width=800&height=800&nologo=true',
  '/images/tomatoes.png': 'https://image.pollinations.ai/prompt/vine%20ripened%20red%20tomatoes%20on%20clean%20background%208k%20photorealistic?width=800&height=800&nologo=true',
  '/images/carrots.png': 'https://image.pollinations.ai/prompt/fresh%20crunchy%20orange%20carrots%20on%20clean%20background%208k%20photorealistic?width=800&height=800&nologo=true',
  '/images/cabbage.png': 'https://image.pollinations.ai/prompt/fresh%20green%20cabbage%20on%20clean%20background%208k%20photorealistic?width=800&height=800&nologo=true',
  '/images/cauliflower.png': 'https://image.pollinations.ai/prompt/fresh%20white%20cauliflower%20on%20clean%20background%208k%20photorealistic?width=800&height=800&nologo=true',
  '/images/capsicum.png': 'https://image.pollinations.ai/prompt/fresh%20green%20capsicum%20bell%20peppers%20on%20clean%20background%208k%20photorealistic?width=800&height=800&nologo=true',
  '/images/garlic.png': 'https://image.pollinations.ai/prompt/fresh%20garlic%20bulbs%20on%20clean%20background%208k%20photorealistic?width=800&height=800&nologo=true',
  '/images/ginger.png': 'https://image.pollinations.ai/prompt/fresh%20ginger%20root%20on%20clean%20background%208k%20photorealistic?width=800&height=800&nologo=true',
  '/images/curd.png': 'https://image.pollinations.ai/prompt/smooth%20white%20creamy%20fresh%20curd%20yogurt%20in%20a%20bowl%20photorealistic?width=800&height=800&nologo=true',
  '/images/butter.png': 'https://image.pollinations.ai/prompt/block%20of%20rich%20yellow%20creamy%20butter%20on%20premium%20background?width=800&height=800&nologo=true',
  '/images/cheese.png': 'https://image.pollinations.ai/prompt/slices%20of%20premium%20soft%20cheese%20photorealistic?width=800&height=800&nologo=true',
  '/images/paneer.png': 'https://image.pollinations.ai/prompt/block%20of%20soft%20fresh%20white%20paneer%20cheese%20photorealistic?width=800&height=800&nologo=true',
  '/images/coconutwater.png': 'https://image.pollinations.ai/prompt/fresh%20tender%20coconut%20water%20in%20a%20glass%20with%20green%20coconut%20photorealistic?width=800&height=800&nologo=true',
};

let count = 0;
for (const [local, url] of Object.entries(localToUrl)) {
  if (content.includes(local)) {
    content = content.split(local).join(url);
    count++;
    console.log(`✅ ${local} -> URL`);
  }
}

fs.writeFileSync(file, content);
console.log(`\n📝 Reverted ${count} image paths back to Pollinations URLs`);
