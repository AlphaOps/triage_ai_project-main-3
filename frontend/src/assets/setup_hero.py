import shutil
import os

# Relative path from /Users/malayverma796/Desktop/AI
source_rel = '../../.gemini/antigravity/brain/dbe37999-36c4-4c93-93f2-8eed4b973ff0/premium_medical_hero_1771111789017.png'
dest_rel = 'src/assets/hero-hospital.png'

# Convert to absolute paths based on CWD
base_dir = os.getcwd()
source = os.path.abspath(os.path.join(base_dir, source_rel))
dest = os.path.abspath(os.path.join(base_dir, dest_rel))

print(f"Base Dir: {base_dir}")
print(f"Attempting to copy from: {source}")
print(f"To: {dest}")

try:
    if os.path.exists(source):
        shutil.copy2(source, dest)
        print("Success: File copied.")
    else:
        print(f"Error: Source file not found at {source}")
except Exception as e:
    print(f"Error: {e}")
