const fs = require('fs');
let content = fs.readFileSync('data/products.js', 'utf8');

const enhancedNames = {
  '"Apples",': '"Fresh Shimla Apples",',
  '"Oranges",': '"Juicy Nagpur Oranges",',
  '"Mangoes",': '"Farm Fresh Alphonso Mangoes",',
  '"Potatoes",': '"Premium Grade Potatoes",',
  '"Onions",': '"Fresh Red Onions",',
  '"Tomatoes",': '"Vine-Ripened Tomatoes",',
  '"Carrots",': '"Fresh Crunchy Carrots",',
  '"Cabbage",': '"Farm Fresh Cabbage",',
  '"Cauliflower",': '"Fresh Farm Cauliflower",',
  '"Capsicum",': '"Fresh Green Capsicum",',
  '"Garlic",': '"Premium Garlic Bulbs",',
  '"Ginger",': '"Fresh Ginger Root",',
  '"Fresh Curd",': '"Creamy Fresh Curd",',
  '"Amul Butter",': '"Rich Creamy Butter",',
  '"Cheese Slices",': '"Premium Cheese Slices",',
  '"Fresh Paneer",': '"Soft Fresh Paneer",',
  '"Fresh Cream",': '"Rich Dairy Cream",',
  '"Burger Buns",': '"Fresh Burger Buns",',
  '"Pav Bread",': '"Soft Mumbai Pav",',
  '"Butter Biscuits",': '"Crispy Butter Biscuits",',
  '"Chocolate Cake",': '"Decadent Chocolate Cake",',
  '"Crispy Rusks",': '"Premium Tea Rusks",',
  '"Fresh Mutton",': '"Tender Fresh Mutton",',
  '"Fresh Fish (Rohu)",': '"Fresh Catch Rohu Fish",',
  '"Prawns",': '"Fresh Tiger Prawns",',
  '"Fresh Crab",': '"Premium Fresh Crab",',
  '"Wheat Flour (Atta)",': '"Premium Whole Wheat Atta",',
  '"Toor Dal",': '"Unpolished Toor Dal",',
  '"Sunflower Cooking Oil",': '"Refined Sunflower Oil",',
  '"Sugar",': '"Refined White Sugar",',
  '"Iodized Salt",': '"Premium Iodized Salt",',
  '"Garam Masala",': '"Authentic Garam Masala",',
  '"Premium Tea Leaves",': '"Assam Kadak Tea Leaves",',
  '"Filter Coffee Powder",': '"Authentic Filter Coffee",',
  '"Instant Noodles",': '"Spicy Masala Noodles",',
  '"Dry Fruits Mix",': '"Premium Mixed Dry Fruits",',
  '"Packaged Water",': '"Purified Mineral Water",',
  '"Iced Tea",': '"Refreshing Lemon Iced Tea",',
  '"Soft Drinks",': '"Chilled Cola Soft Drink",',
  '"Coconut Water",': '"Natural Coconut Water",'
};

for (const [k, v] of Object.entries(enhancedNames)) {
  content = content.replace('"name": ' + k, '"name": ' + v);
}

fs.writeFileSync('data/products.js', content);
console.log("Updated product names");
