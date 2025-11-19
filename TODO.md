# TODO - Fasal Rakshak Development Roadmap

## M1 (Day 0-1) - ✅ COMPLETED
- [x] Repo skeleton with Docker Compose
- [x] Frontend basic pages (landing, scan modal)
- [x] Backend auth + health endpoints
- [x] Minimal ML stub with deterministic labels
- [x] Database schema and migrations
- [x] README with run instructions

## M2 (Day 1-2) - IN PROGRESS
- [ ] Complete scan upload flow end-to-end
- [ ] DB seed script with demo data
- [ ] Admin heatmap placeholder with sample data
- [ ] Image storage integration (MinIO)
- [ ] Treatment recommendations API

## M3 (Day 2-3) - PENDING
- [ ] Community feed (posts, comments, Q&A)
- [ ] E-commerce cart and checkout flow
- [ ] Insurance claim submission and status
- [ ] Offline sync with IndexedDB
- [ ] Service worker for caching

## M4 (Post-Hackathon) - FUTURE

### ML & AI
- [ ] Replace mock model with trained PyTorch model (ResNet/EfficientNet)
- [ ] Model training pipeline and dataset preparation
- [ ] Model versioning and A/B testing
- [ ] Confidence threshold tuning
- [ ] Multi-disease detection (bounding boxes)
- [ ] Satellite imagery integration for field-level analysis
- [ ] Weather data integration for disease prediction

### Integrations
- [ ] Real Twilio WhatsApp integration (replace stub)
- [ ] Razorpay payment gateway integration
- [ ] Blockchain smart contract for claim verification (Ethereum/Polygon)
- [ ] SMS OTP service (Twilio/msg91)
- [ ] Email notifications (SendGrid/AWS SES)
- [ ] Push notifications (FCM/OneSignal)

### Features
- [ ] Advanced heatmap with PostGIS spatial queries
- [ ] Real-time disease outbreak alerts
- [ ] Expert consultation booking system
- [ ] Crop calendar and planting recommendations
- [ ] Market price integration
- [ ] Government scheme information
- [ ] Multi-language support expansion (Marathi, Telugu, etc.)

### Performance & Scale
- [ ] Redis caching for frequently accessed data
- [ ] CDN for static assets and images
- [ ] Database query optimization and indexing
- [ ] Horizontal scaling with load balancer
- [ ] Background job queue (Bull/BullMQ)
- [ ] Image compression and optimization
- [ ] API response caching

### Security & Compliance
- [ ] Rate limiting per user/IP
- [ ] Image virus scanning
- [ ] GDPR compliance for user data
- [ ] Audit logging
- [ ] Two-factor authentication
- [ ] OAuth integration (Google, Facebook)
- [ ] API key management for third-party services

### DevOps & Infrastructure
- [ ] Kubernetes manifests for production
- [ ] Terraform for infrastructure as code
- [ ] CI/CD pipeline with automated testing
- [ ] Monitoring and alerting (Prometheus, Grafana)
- [ ] Log aggregation (ELK stack)
- [ ] Backup and disaster recovery
- [ ] Multi-region deployment

### Testing & Quality
- [ ] E2E tests (Playwright/Cypress)
- [ ] Load testing (k6/Locust)
- [ ] Security scanning (OWASP)
- [ ] Code coverage >80%
- [ ] Performance benchmarking

### Documentation
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Architecture diagrams
- [ ] Deployment guides
- [ ] Developer onboarding guide
- [ ] User manuals (multilingual)

### Mobile App
- [ ] React Native app development
- [ ] Native camera integration
- [ ] Offline-first architecture
- [ ] App store deployment (Play Store, App Store)

## Priority Ranking

**High Priority (Next Sprint)**
1. Complete scan flow with real image processing
2. Admin heatmap with real data
3. Community feed basic implementation
4. Offline sync capability

**Medium Priority (Month 1)**
1. Real ML model integration
2. Payment gateway integration
3. WhatsApp notifications
4. Advanced analytics

**Low Priority (Future)**
1. Blockchain integration
2. Satellite imagery
3. Native mobile apps
4. Multi-region deployment


