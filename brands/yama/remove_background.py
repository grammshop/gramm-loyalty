#!/usr/bin/env python3
"""
Remove white background from logo.jpg and create transparent PNG
"""
from PIL import Image
import numpy as np

def remove_white_background(input_path, output_path, threshold=240):
    """
    Remove white/light background from image and save as transparent PNG
    
    Args:
        input_path: Path to input image (JPG)
        output_path: Path to output image (PNG)
        threshold: Brightness threshold for background removal (0-255)
    """
    # Open image
    img = Image.open(input_path)
    
    # Convert to RGBA if not already
    img = img.convert("RGBA")
    
    # Get image data as numpy array
    data = np.array(img)
    
    # Get RGB channels
    r, g, b, a = data[:, :, 0], data[:, :, 1], data[:, :, 2], data[:, :, 3]
    
    # Create mask for white/light pixels
    # A pixel is considered background if all RGB values are above threshold
    mask = (r > threshold) & (g > threshold) & (b > threshold)
    
    # Set alpha channel to 0 (transparent) for background pixels
    data[mask, 3] = 0
    
    # Create new image from modified data
    result = Image.fromarray(data, mode='RGBA')
    
    # Save as PNG
    result.save(output_path, 'PNG')
    print(f"✅ Successfully created transparent PNG: {output_path}")
    print(f"   Original size: {img.size}")
    print(f"   Removed pixels with brightness > {threshold}")

if __name__ == "__main__":
    input_file = "logo.jpg"
    output_file = "logo.png"
    
    print(f"🎨 Removing white background from {input_file}...")
    remove_white_background(input_file, output_file, threshold=240)
