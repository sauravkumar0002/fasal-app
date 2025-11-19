"""
Simple test for ML service
Run: pytest test_server.py
"""

import pytest
from fastapi.testclient import TestClient
from server import app
from PIL import Image
import io

client = TestClient(app)


def create_test_image() -> bytes:
    """Create a simple test image"""
    img = Image.new('RGB', (224, 224), color='green')
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='JPEG')
    img_bytes.seek(0)
    return img_bytes.read()


def test_health_check():
    """Test health endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_infer_endpoint():
    """Test inference endpoint"""
    image_bytes = create_test_image()
    
    response = client.post(
        "/infer",
        files={"file": ("test.jpg", image_bytes, "image/jpeg")}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "disease" in data
    assert "confidence" in data
    assert data["disease"] in ["Rust", "Blight", "Powdery Mildew", "Healthy", "Unknown"]
    assert 0 <= data["confidence"] <= 1


def test_infer_invalid_file():
    """Test inference with invalid file"""
    response = client.post(
        "/infer",
        files={"file": ("test.txt", b"not an image", "text/plain")}
    )
    
    assert response.status_code == 400


if __name__ == "__main__":
    pytest.main([__file__, "-v"])


