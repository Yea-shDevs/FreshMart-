#!/bin/bash
SRC="/Users/macos/.gemini/antigravity/brain/ea3bda7c-f1dd-4174-8771-acf7c9523ebc"
DST="/Users/macos/Desktop/triallab/public/images"

echo "Copying generated images..."

cp "$SRC/apples_1776803116954.png" "$DST/apples.png" 2>&1
cp "$SRC/oranges_1776803131161.png" "$DST/oranges.png" 2>&1
cp "$SRC/mangoes_1776803147262.png" "$DST/mangoes.png" 2>&1
cp "$SRC/potatoes_1776803179842.png" "$DST/potatoes.png" 2>&1
cp "$SRC/onions_1776803194237.png" "$DST/onions.png" 2>&1
cp "$SRC/tomatoes_1776803209480.png" "$DST/tomatoes.png" 2>&1
cp "$SRC/carrots_1776803245359.png" "$DST/carrots.png" 2>&1
cp "$SRC/cabbage_1776803260739.png" "$DST/cabbage.png" 2>&1
cp "$SRC/cauliflower_1776803280250.png" "$DST/cauliflower.png" 2>&1
cp "$SRC/capsicum_1776803320493.png" "$DST/capsicum.png" 2>&1
cp "$SRC/garlic_1776803333192.png" "$DST/garlic.png" 2>&1
cp "$SRC/ginger_1776803348674.png" "$DST/ginger.png" 2>&1
cp "$SRC/curd_1776803392459.png" "$DST/curd.png" 2>&1
cp "$SRC/butter_1776803407478.png" "$DST/butter.png" 2>&1
cp "$SRC/cheese_1776803424091.png" "$DST/cheese.png" 2>&1
cp "$SRC/paneer_1776803472900.png" "$DST/paneer.png" 2>&1
cp "$SRC/coconut_water_1776799613371.png" "$DST/coconutwater.png" 2>&1

echo ""
echo "Checking results..."
COUNT=$(ls "$DST"/*.png 2>/dev/null | wc -l)
echo "Found $COUNT .png files in images folder"
ls -la "$DST"/*.png 2>/dev/null
