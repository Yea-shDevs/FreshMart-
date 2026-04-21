import os
import re

file_path = '/Users/macos/Desktop/triallab/data/products.js'

with open(file_path, 'r', encoding='utf8') as f:
    content = f.read()

replacements = {
    # Generated photorealistic images
    'mangoes.webp': '/artifacts2/mangoes_1776743848582.png',
    '/artifacts/mangoes_1776714100314.png': '/artifacts2/mangoes_1776743848582.png',
    
    'tomatoes.webp': '/artifacts2/tomatoes_1776743863902.png',
    
    'carrots.webp': '/artifacts2/carrots_1776743880061.png',
    '/artifacts/carrots_1776714130371.png': '/artifacts2/carrots_1776743880061.png',
    
    'cabbage.webp': '/artifacts2/cabbage_1776743896028.png',
    '/artifacts/cabbage_1776714146800.png': '/artifacts2/cabbage_1776743896028.png',

    'cauliflower.webp': '/artifacts2/cauliflower_1776743911992.png',
    '/artifacts/cauliflower_1776714163242.png': '/artifacts2/cauliflower_1776743911992.png',

    'capsicum.webp': '/artifacts2/capsicum_1776743927066.png',
    '/artifacts/capsicum_1776714178714.png': '/artifacts2/capsicum_1776743927066.png',

    'apples.webp': '/artifacts2/apples_1776744062067.png',
    '/artifacts/apples_1776714064071.png': '/artifacts2/apples_1776744062067.png',

    'oranges.webp': '/artifacts2/oranges_1776744076869.png',
    '/artifacts/oranges_1776714079649.png': '/artifacts2/oranges_1776744076869.png',

    'potatoes.webp': '/artifacts2/potatoes_1776744092512.png',
    '/artifacts/potatoes_1776714114200.png': '/artifacts2/potatoes_1776744092512.png',

    'onions.webp': '/artifacts2/onions_1776744110431.png',
    'garlic.webp': '/artifacts2/garlic_1776744780240.png',
    'ginger.webp': '/artifacts2/ginger_1776744794441.png',
    'curd.webp': '/artifacts2/curd_1776744810781.png',
    'butter.webp': '/artifacts2/butter_1776744824935.png',
    'cheese.webp': '/artifacts2/cheese_1776744841626.png',

    # Generated SVG images
    'paneer.webp': 'paneer.svg',
    'cream.webp': 'cream.svg',
    'buns.webp': 'buns.svg',
    'pav.webp': 'pav.svg',
    'biscuits.webp': 'biscuits.svg',
    'cake.webp': 'cake.svg',
    'rusks.webp': 'rusks.svg',
    'mutton.webp': 'mutton.svg',
    'fish.webp': 'fish.svg',
    'prawns.webp': 'prawns.svg',
    'crab.webp': 'crab.svg',
    'atta.webp': 'atta.svg',
    'dal.webp': 'dal.svg',
    'cookingoil.webp': 'cookingoil.svg',
    'sugar.webp': 'sugar.svg',
    'salt.webp': 'salt.svg',
    'spices.webp': 'spices.svg',
    'tealeaves.webp': 'tealeaves.svg',
    'coffeepowder.webp': 'coffeepowder.svg',
    'noodles.webp': 'noodles.svg',
    'dryfruits.webp': 'dryfruits.svg',
    'water.webp': 'water.svg',
    'icedtea.webp': 'icedtea.svg',
    'softdrinks.webp': 'softdrinks.svg',
    'coconutwater.webp': 'coconutwater.svg'
}

for old_val, new_val in replacements.items():
    is_artifact = new_val.startswith('/artifacts2/')
    
    if old_val.startswith('/artifacts/'):
        # Exact match for old artifact mappings
        content = content.replace(f'image: "{old_val}",', f'image: "{new_val}",')
    else:
        # Standard replacements mapping from /images/*.webp
        replacement_str = new_val if is_artifact else f'/images/{new_val}'
        content = content.replace(f'image: "/images/{old_val}",', f'image: "{replacement_str}",')

with open(file_path, 'w', encoding='utf8') as f:
    f.write(content)

print('Updated products.js successfully.')
