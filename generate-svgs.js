const fs = require('fs');
const path = require('path');

const missingProducts = {
  paneer: "Fresh Paneer",
  cream: "Dairy Cream",
  buns: "Burger Buns",
  pav: "Mumbai Pav",
  biscuits: "Butter Biscuits",
  cake: "Chocolate Cake",
  rusks: "Premium Rusks",
  mutton: "Tender Mutton",
  fish: "Fresh Catch Fish",
  prawns: "Tiger Prawns",
  crab: "Premium Crab",
  atta: "Whole Wheat Atta",
  dal: "Toor Dal",
  cookingoil: "Sunflower Oil",
  sugar: "White Sugar",
  salt: "Iodized Salt",
  spices: "Garam Masala",
  tealeaves: "Assam Tea",
  coffeepowder: "Filter Coffee",
  noodles: "Masala Noodles",
  dryfruits: "Mixed Dry Fruits",
  water: "Mineral Water",
  icedtea: "Iced Tea",
  softdrinks: "Soft Drink",
  coconutwater: "Coconut Water"
};

const outputDir = path.join(__dirname, 'public', 'images');

// Nice premium gradients
const getGradient = (i) => {
  const hues = [120, 200, 340, 45, 270, 15];
  const h = hues[i % hues.length];
  return `<linearGradient id="grad${i}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:hsl(${h}, 40%, 30%);stop-opacity:1" />
      <stop offset="100%" style="stop-color:hsl(${h+30}, 50%, 15%);stop-opacity:1" />
    </linearGradient>`;
};

let i = 0;
for (const [key, title] of Object.entries(missingProducts)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
    <defs>
      ${getGradient(i)}
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="10" stdDeviation="15" flood-color="#000" flood-opacity="0.3"/>
      </filter>
    </defs>
    <rect width="800" height="800" fill="url(#grad${i})" />
    <rect x="50" y="50" width="700" height="700" rx="30" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" stroke-width="2" />
    <circle cx="400" cy="350" r="120" fill="rgba(255,255,255,0.1)" filter="url(#shadow)" />
    <text x="400" y="380" font-family="system-ui, -apple-system, sans-serif" font-size="80" fill="#ffffff" text-anchor="middle" font-weight="bold" opacity="0.8">${title.charAt(0)}</text>
    <text x="400" y="580" font-family="system-ui, -apple-system, sans-serif" font-size="48" fill="#ffffff" text-anchor="middle" font-weight="600" opacity="0.9">${title}</text>
    <text x="400" y="630" font-family="system-ui, -apple-system, sans-serif" font-size="24" fill="#ffffff" text-anchor="middle" opacity="0.6">Premium Quality</text>
  </svg>`;
  
  fs.writeFileSync(path.join(outputDir, `${key}.svg`), svg);
  i++;
}

console.log('Successfully generated SVG placeholders.');
