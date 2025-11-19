# Fasal Rakshak API Documentation

Base URL: `http://localhost:5000/api/v1`

## Authentication

Most endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Auth

#### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "+919876543210",
  "email": "john@example.com",
  "password": "password123",
  "role": "farmer",
  "language": "en"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": { ... },
  "token": "jwt_token_here"
}
```

#### POST /auth/login
Login with phone/email and password.

**Request Body:**
```json
{
  "phone": "+919876543210",
  "email": "john@example.com", // optional
  "password": "password123"
}
```

#### POST /auth/otp
Send OTP to phone number (demo mode).

**Request Body:**
```json
{
  "phone": "+919876543210"
}
```

### Scan

#### POST /scan
Upload image for disease detection.

**Request:** multipart/form-data
- `image`: Image file
- `farm_id`: UUID (optional)
- `geo`: JSON string with lat/lng (optional)
- `language`: "en" | "hi" (optional)
- `voice_note`: string (optional)

**Response:**
```json
{
  "id": "scan-uuid",
  "disease": "Rust",
  "confidence": 0.92,
  "healthScore": 65,
  "imageUrl": "http://...",
  "treatment": "Recommended treatment for Rust",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### GET /scan/:id
Get scan details by ID.

#### GET /scan
List user's scans (paginated).

**Query Params:**
- `limit`: number (default: 20)
- `offset`: number (default: 0)

### Analytics

#### GET /analytics/heatmap
Get disease heatmap data (admin/expert only).

**Query Params:**
- `from`: YYYY-MM-DD
- `to`: YYYY-MM-DD
- `disease`: string
- `region`: string

### Products

#### GET /products
List products.

**Query Params:**
- `category`: string
- `search`: string
- `limit`: number
- `offset`: number

### Orders

#### POST /orders
Create a new order.

**Request Body:**
```json
{
  "items": [
    {
      "product_id": "uuid",
      "quantity": 2
    }
  ],
  "shipping_address": { ... }
}
```

### Insurance

#### POST /insurance/claim
Submit insurance claim.

**Request Body:**
```json
{
  "scan_id": "uuid",
  "claim_amount": 50000
}
```

#### GET /insurance/status/:claimId
Get claim status.

## Error Responses

All errors follow this format:
```json
{
  "error": "Error message"
}
```

Status codes:
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error


