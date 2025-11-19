"""
Fasal Rakshak ML Service
FastAPI server for crop disease detection inference
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Optional
import io
import hashlib
from PIL import Image
import numpy as np

app = FastAPI(title="Fasal Rakshak ML Service", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Disease labels (from requirements)
DISEASES = ["Rust", "Blight", "Powdery Mildew", "Healthy", "Unknown"]


def deterministic_inference(image_bytes: bytes, filename: str) -> dict:
    """
    Deterministic inference stub for demo purposes.
    
    In production, replace this with:
    1. Load TorchScript model: torch.jit.load('model.pth')
    2. Preprocess image (resize, normalize, tensor conversion)
    3. Run inference: model(image_tensor)
    4. Post-process outputs (softmax, get top class)
    
    Current implementation uses image hash to deterministically pick a disease.
    """
    # Create hash from image bytes and filename
    hash_input = image_bytes[:1000] + filename.encode()  # Use first 1000 bytes + filename
    hash_value = int(hashlib.md5(hash_input).hexdigest(), 16)
    
    # Deterministically select disease based on hash
    disease_index = hash_value % len(DISEASES)
    disease = DISEASES[disease_index]
    
    # Generate confidence (higher for Healthy, lower for Unknown)
    if disease == "Healthy":
        confidence = 0.85 + (hash_value % 15) / 100  # 0.85-0.99
    elif disease == "Unknown":
        confidence = 0.50 + (hash_value % 30) / 100  # 0.50-0.79
    else:
        confidence = 0.70 + (hash_value % 25) / 100  # 0.70-0.94
    
    return {
        "disease": disease,
        "confidence": round(confidence, 4),
        "bbox": None,  # In production, return bounding box coordinates
    }


def load_real_model():
    """
    TODO: Replace with actual model loading
    
    Example:
    ```python
    import torch
    model = torch.jit.load('models/disease_detector.pth')
    model.eval()
    return model
    ```
    """
    return None


def preprocess_image(image: Image.Image) -> np.ndarray:
    """
    Preprocess image for model inference.
    
    TODO: Implement actual preprocessing:
    - Resize to model input size (e.g., 224x224)
    - Normalize pixel values
    - Convert to tensor
    - Add batch dimension
    """
    # Placeholder: just return image as array
    return np.array(image)


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "ml-inference"}


@app.post("/infer")
async def infer_disease(file: UploadFile = File(...)):
    """
    Infer disease from crop image.
    
    Accepts: multipart/form-data with 'image' field
    Returns: JSON with disease label, confidence, and optional bounding box
    """
    try:
        # Validate file type
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read image
        image_bytes = await file.read()
        
        # Validate image can be opened
        try:
            image = Image.open(io.BytesIO(image_bytes))
            image.verify()  # Verify it's a valid image
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid image file: {str(e)}")
        
        # Reopen image (verify() closes it)
        image = Image.open(io.BytesIO(image_bytes))
        
        # TODO: Replace with real model inference
        # For now, use deterministic stub
        result = deterministic_inference(image_bytes, file.filename or "image.jpg")
        
        # Optional: Add image metadata
        result["image_size"] = {
            "width": image.width,
            "height": image.height,
        }
        
        return JSONResponse(content=result)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "Fasal Rakshak ML Inference",
        "version": "1.0.0",
        "status": "running",
        "note": "Currently using deterministic inference stub. Replace with trained model.",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


