# Fasal Rakshak - Crop Disease Detection & Management Platform

**Team CodeMatrix**

Fasal Rakshak is a comprehensive agricultural technology platform that enables farmers to detect crop diseases in under 60 seconds using AI-powered image analysis. The platform provides disease detection, treatment recommendations, community support, e-commerce integration, and insurance claim verification.

> **Reference Document**: See project requirements and analysis in `/mnt/data/Fasal Rakshak By Team CodeMatrix.pdf` (if available) or refer to the feature specifications below.

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)
- Python 3.9+ (for ML service)
- PostgreSQL 14+ (optional, if not using Docker)

### Run with Docker (Recommended)

```bash
# Clone and navigate to project
cd "webdev-fasal app"

# Copy environment variables
cp .env.example .env

# Start all services
docker-compose up --build

# Services will be available at:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:5000
# - ML Service: http://localhost:8000
# - MinIO (S3): http://localhost:9000 (admin/minio123)
# - Redis: localhost:6379
# - PostgreSQL: localhost:5432
```

### Run Locally (Development)

#### Backend
```bash
cd apps/backend
npm install
npm run dev
# Runs on http://localhost:5000
```

#### Frontend
```bash
cd apps/frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

#### ML Service
```bash
cd apps/ml
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python server.py
# Runs on http://localhost:8000
```

#### Database Setup
```bash
# Using Docker PostgreSQL
docker-compose up -d postgres

# Run migrations
cd apps/backend
npm run migrate

# Seed demo data
npm run seed
```

## 📁 Project Structure

```
/
├── README.md
├── .env.example
├── docker-compose.yml
├── TODO.md
├── apps/
│   ├── frontend/          # Next.js React app (mobile-first)
│   ├── mobile/            # React Native stub (optional)
│   ├── backend/           # Node.js + Express + TypeScript
│   └── ml/                # Python FastAPI ML service
├── scripts/
│   ├── init_db.sql        # Database schema
│   └── seed_demo_data.js  # Demo data seeder
├── tests/
│   ├── frontend/
│   ├── backend/
│   └── ml/
└── docs/
    ├── API.md             # API documentation
    └── ARCHITECTURE.md    # System architecture
```

## 🎯 Features

### For Farmers
- **Fast Disease Detection**: Upload crop image and get results in <60 seconds
- **Treatment Recommendations**: AI-powered suggestions with chemical calculator
- **Crop Health Timeline**: Track weekly scans and health scores
- **Community Feed**: Q&A forum and knowledge sharing
- **Offline Support**: Store scans locally and sync when online
- **E-commerce Integration**: Buy agricultural inputs directly
- **Insurance Claims**: Automated claim processing with blockchain verification

### For Experts/Admins
- **Heatmap Dashboard**: Disease aggregation by location with filters
- **Research Pipeline**: Review flagged samples and new disease reports
- **Analytics**: Regional crop health insights

## 🔧 Environment Variables

See `.env.example` for all required variables. Key ones:

```bash
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fasal_rakshak
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret

# Storage
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin

# ML Service
ML_SERVICE_URL=http://localhost:8000

# Integrations (Demo mode if not set)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

## 🧪 Testing

```bash
# Frontend tests
cd apps/frontend
npm test

# Backend tests
cd apps/backend
npm test

# ML service tests
cd apps/ml
pytest
```

## 📊 Demo Data

After running migrations, seed demo data:

```bash
cd apps/backend
npm run seed
```

This creates:
- 10 sample users (farmers, experts, admin)
- 30 scans across 5 regions
- Sample products and orders
- Heatmap data for visualization

## 🔄 CI/CD

GitHub Actions workflows are configured in `.github/workflows/`:
- Lint and format checks
- Unit tests
- Docker image builds
- Deployment (configure secrets for production)

## 🤖 ML Model Integration

### Current Implementation
The ML service uses a **deterministic stub** for demo purposes. It returns mock disease labels based on image metadata.

### Replacing with Real Model

1. **Train your model** (PyTorch recommended):
   ```python
   # Example: Train ResNet/EfficientNet on disease dataset
   # Export to TorchScript: model_scripted = torch.jit.script(model)
   # Save: model_scripted.save('model.pth')
   ```

2. **Update ML service** (`apps/ml/server.py`):
   - Replace `deterministic_inference()` with model loading
   - Load TorchScript model: `torch.jit.load('model.pth')`
   - Process image through model pipeline

3. **See `apps/ml/README.md`** for detailed instructions

## 🌐 Internationalization

Currently supports:
- English (en)
- Hindi (hi)

Add more languages by creating translation files in `apps/frontend/locales/`.

## 📱 Mobile App

The `/apps/mobile` directory contains a React Native stub. For now, the web app is fully responsive and mobile-first. To build native apps:

```bash
cd apps/mobile
npm install
# Follow Expo/React Native setup
```

## 🔐 Security Notes

- **Production**: Use strong JWT secrets, enable HTTPS, configure CORS properly
- **Secrets**: Store API keys in environment variables or secret management (Vault, AWS Secrets Manager)
- **Rate Limiting**: Scan endpoint is rate-limited (see backend config)
- **File Uploads**: Images are validated and stored in S3-compatible storage

## 🚧 Roadmap

See `TODO.md` for prioritized improvements and post-hackathon enhancements.

## 🚀 Deployment

### Quick Deploy to Vercel (Frontend)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/fasal-rakshak.git
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set **Root Directory** to `apps/frontend`
   - Add environment variables:
     - `NEXT_PUBLIC_API_URL` (your backend URL)
     - `NEXT_PUBLIC_ML_SERVICE_URL` (your ML service URL)

3. **Deploy Backend & ML Service:**
   - Use **Railway** or **Render** (see `DEPLOYMENT.md` for detailed instructions)
   - Or use Docker on a VPS

📖 **Full deployment guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete instructions.

⚠️ **Important**: Only the frontend can be deployed on Vercel. Backend and ML service need separate hosting (Railway, Render, or VPS).

## 📄 License

MIT License - See LICENSE file for details

## 👥 Team

**Team CodeMatrix** - Smart India Hackathon 2024

---

**Note**: This is a hackathon-ready implementation. For production deployment, review security, scalability, and replace all mock/stub services with real implementations.

