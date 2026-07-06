import sys
import os
from PIL import Image
from rembg import remove

def main():
    if len(sys.argv) < 3:
        print("Usage: python3 remove_bg.py <input_path> <output_path>")
        sys.exit(1)

    input_path = sys.argv[1]
    output_path = sys.argv[2]

    if not os.path.exists(input_path):
        print(f"Error: Input file {input_path} does not exist")
        sys.exit(1)

    try:
        # Load image
        img = Image.open(input_path)
        # Remove background using U2-Net via rembg
        result = remove(img)
        # Save output image
        result.save(output_path, "PNG")
        print("Background removed successfully")
    except Exception as e:
        print(f"Error processing image: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
