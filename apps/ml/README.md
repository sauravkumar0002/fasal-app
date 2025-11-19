# ML Service - Fasal Rakshak

FastAPI service for crop disease detection using deep learning models.

## Current Implementation

This service uses a **deterministic inference stub** for demo purposes. It returns mock disease labels based on image hash.

## Replacing with Real Model

### Step 1: Train Your Model

```python
# Example: Train ResNet/EfficientNet on disease dataset
import torch
import torch.nn as nn
from torchvision import models

# Load pre-trained model
model = models.resnet50(pretrained=True)
model.fc = nn.Linear(model.fc.in_features, len(DISEASES))  # 5 classes

# Train on your dataset...
# Save as TorchScript
model_scripted = torch.jit.script(model)
model_scripted.save('models/disease_detector.pth')
```

### Step 2: Update `server.py`

Replace `deterministic_inference()` with:

```python
import torch
from torchvision import transforms

# Load model (do this once at startup)
model = torch.jit.load('models/disease_detector.pth')
model.eval()

# Preprocessing
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                        std=[0.229, 0.224, 0.225])
])

def real_inference(image: Image.Image) -> dict:
    # Preprocess
    input_tensor = transform(image).unsqueeze(0)
    
    # Inference
    with torch.no_grad():
        output = model(input_tensor)
        probabilities = torch.nn.functional.softmax(output[0], dim=0)
        confidence, predicted = torch.max(probabilities, 0)
    
    return {
        "disease": DISEASES[predicted.item()],
        "confidence": confidence.item(),
    }
```

### Step 3: Add Model File

Place your trained model in `models/disease_detector.pth` and update the Dockerfile to copy it.

### Step 4: Test

```bash
# Test with sample image
curl -X POST "http://localhost:8000/infer" \
  -F "image=@test_image.jpg"
```

## Model Requirements

- Input: RGB image (recommended: 224x224 or 256x256)
- Output: 5 classes (Rust, Blight, Powdery Mildew, Healthy, Unknown)
- Format: TorchScript (.pth) for production deployment

## Dataset Preparation

See `prepare_dummy_dataset.py` for example dataset structure.

## Performance

- Target latency: <2 seconds per inference
- Batch processing: Can be added for multiple images
- GPU support: Use CUDA-enabled PyTorch for faster inference


