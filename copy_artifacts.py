import os
import shutil

src_dir = "/Users/macos/.gemini/antigravity/brain/4d91cf95-ec41-457b-8aaf-b5ea3d1e830c"
dst_dir = "/Users/macos/Desktop/triallab/public/artifacts2"

os.makedirs(dst_dir, exist_ok=True)

try:
    files = os.listdir(src_dir)
    for f in files:
        if f.endswith('.png'):
            shutil.copy(os.path.join(src_dir, f), os.path.join(dst_dir, f))
    print("Successfully copied artifact images to public/artifacts2")
except Exception as e:
    print(f"Error copying files: {e}")
