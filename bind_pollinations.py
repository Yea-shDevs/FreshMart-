import os
import re

file_path = '/Users/macos/Desktop/triallab/data/products.js'

with open(file_path, 'r', encoding='utf8') as f:
    content = f.read()

# Define the products that need generated images and their prompts
missingProducts = {
    'apples': "fresh%20shimla%20apples%20on%20clean%20background%208k%20photorealistic",
    'oranges': "vibrant%20nagpur%20oranges%20on%20clean%20background%208k%20photorealistic",
    'mangoes': "fresh%20alphonso%20mangoes%20on%20clean%20background%208k%20photorealistic",
    'potatoes': "fresh%20premium%20raw%20potatoes%20on%20clean%20background%208k%20photorealistic",
    'onions': "fresh%20red%20onions%20on%20clean%20background%208k%20photorealistic",
    'tomatoes': "vine%20ripened%20red%20tomatoes%20on%20clean%20background%208k%20photorealistic",
    'carrots': "fresh%20crunchy%20orange%20carrots%20on%20clean%20background%208k%20photorealistic",
    'cabbage': "fresh%20green%20cabbage%20on%20clean%20background%208k%20photorealistic",
    'cauliflower': "fresh%20white%20cauliflower%20on%20clean%20background%208k%20photorealistic",
    'capsicum': "fresh%20green%20capsicum%20bell%20peppers%20on%20clean%20background%208k%20photorealistic",
    'garlic': "fresh%20garlic%20bulbs%20on%20clean%20background%208k%20photorealistic",
    'ginger': "fresh%20ginger%20root%20on%20clean%20background%208k%20photorealistic",
    'curd': "smooth%20white%20creamy%20fresh%20curd%20yogurt%20in%20a%20bowl%20photorealistic",
    'butter': "block%20of%20rich%20yellow%20creamy%20butter%20on%20premium%20background",
    'cheese': "slices%20of%20premium%20soft%20cheese%20photorealistic",
    'paneer': "block%20of%20soft%20fresh%20white%20paneer%20cheese%20photorealistic",
    'cream': "bowl%20of%20thick%20fresh%20dairy%20cream%20photorealistic",
    'buns': "freshly%20baked%20golden%20burger%20buns%20photorealistic",
    'pav': "soft%20mumbai%20pav%20bread%20buns%20photorealistic",
    'biscuits': "crispy%20golden%20butter%20biscuits%20photorealistic",
    'cake': "decadent%20chocolate%20cake%20slice%20photorealistic",
    'rusks': "premium%20golden%20baked%20tea%20rusks%20photorealistic",
    'mutton': "tender%20raw%20mutton%20meat%20cuts%20photorealistic",
    'fish': "fresh%20catch%20rohu%20fish%20photorealistic",
    'prawns': "fresh%20tiger%20prawns%20seafood%20photorealistic",
    'crab': "premium%20fresh%20crab%20seafood%20photorealistic",
    'atta': "premium%20whole%20wheat%20atta%20flour%20in%20a%20bowl%20photorealistic",
    'dal': "unpolished%20toor%20dal%20yellow%20lentils%20in%20a%20bowl%20photorealistic",
    'cookingoil': "bottle%20of%20refined%20sunflower%20cooking%20oil%20photorealistic",
    'sugar': "bowl%20of%20refined%20white%20sugar%20crystals%20photorealistic",
    'salt': "bowl%20of%20premium%20iodized%20salt%20photorealistic",
    'spices': "authentic%20indian%20garam%20masala%20powder%20photorealistic",
    'tealeaves': "assam%20kadak%20tea%20leaves%20photorealistic",
    'coffeepowder': "authentic%20filter%20coffee%20powder%20photorealistic",
    'noodles': "spicy%20masala%20instant%20noodles%20photorealistic",
    'dryfruits': "premium%20mixed%20dry%20fruits%20almonds%20cashews%20photorealistic",
    'water': "bottle%20of%20purified%20mineral%20water%20photorealistic",
    'icedtea': "glass%20of%20refreshing%20lemon%20iced%20tea%20photorealistic",
    'softdrinks': "can%20of%20chilled%20cola%20soft%20drink%20photorealistic",
    'coconutwater': "natural%20tender%20coconut%20water%20drink%20photorealistic"
}

# The user might have local urls like "/images/apples.svg", "/artifacts2/apples_...png"
# This regex will find all lines with 'image:' and we replace it if it's one of the missing products
import json

lines = content.split('\n')
for i in range(len(lines)):
    line = lines[i]
    if 'image:' in line:
        # Determine which product it is by looking slightly above this line
        # Or parse standard keys. But easier to regex the image line:
        name_match = re.search(r'name:\s*"([^"]+)"', '\n'.join(lines[max(0, i-10):i]))
        if name_match:
            full_name = name_match.group(1).lower()
            # Match the product key from missingProducts
            matched_key = None
            for key in missingProducts.keys():
                if key in full_name or (key == 'paneer' and 'paneer' in full_name): 
                    matched_key = key
                    break
            
            if not matched_key:
                # fallbacks for tricky names
                if 'shimla apples' in full_name: matched_key = 'apples'
                elif 'nagpur oranges' in full_name: matched_key = 'oranges'
                elif 'alphonso mangoes' in full_name: matched_key = 'mangoes'
                elif 'grade potatoes' in full_name: matched_key = 'potatoes'
            
            if matched_key:
                prompt = missingProducts[matched_key]
                new_image_url = f"https://image.pollinations.ai/prompt/{prompt}?width=800&height=800&nologo=true"
                # Replace the image line entirely
                lines[i] = re.sub(r'image:\s*".*?"', f'image: "{new_image_url}"', lines[i])

with open(file_path, 'w', encoding='utf8') as f:
    f.write('\n'.join(lines))

print('Updated products.js to use dynamically generated images via pollinations.ai.')
