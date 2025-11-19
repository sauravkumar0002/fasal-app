"""
Script to prepare dummy dataset for training
This is a placeholder - replace with actual dataset preparation
"""

import os
from pathlib import Path

# Disease labels
DISEASES = ["Rust", "Blight", "Powdery Mildew", "Healthy", "Unknown"]

def create_dataset_structure():
    """Create directory structure for dataset"""
    base_dir = Path("dataset")
    
    for split in ["train", "val", "test"]:
        for disease in DISEASES:
            dir_path = base_dir / split / disease
            dir_path.mkdir(parents=True, exist_ok=True)
    
    print(f"✅ Created dataset structure in {base_dir}")
    print("\nDirectory structure:")
    print("dataset/")
    print("  train/")
    print("    Rust/")
    print("    Blight/")
    print("    Powdery Mildew/")
    print("    Healthy/")
    print("    Unknown/")
    print("  val/")
    print("    ...")
    print("  test/")
    print("    ...")

if __name__ == "__main__":
    create_dataset_structure()
    print("\n📝 Next steps:")
    print("1. Collect crop images for each disease class")
    print("2. Organize images into train/val/test splits")
    print("3. Use PyTorch DataLoader to load images")
    print("4. Train model (see README.md for example)")


