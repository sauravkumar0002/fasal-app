/**
 * Demo Data Seeder for Fasal Rakshak
 * Run: node scripts/seed_demo_data.js
 */

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/fasal_rakshak',
});

const diseases = ['Rust', 'Blight', 'Powdery Mildew', 'Healthy', 'Unknown'];
const regions = [
  { name: 'Punjab', lat: 30.7333, lng: 76.7794 },
  { name: 'Haryana', lat: 29.0588, lng: 76.0856 },
  { name: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462 },
  { name: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
  { name: 'Karnataka', lat: 12.9716, lng: 77.5946 },
];

const products = [
  { name: 'Fungicide - Rust Control', price: 450, category: 'pesticide', sku: 'FUNG-RUST-001' },
  { name: 'Blight Treatment Spray', price: 380, category: 'pesticide', sku: 'BLIGHT-001' },
  { name: 'NPK Fertilizer 19-19-19', price: 1200, category: 'fertilizer', sku: 'FERT-NPK-001' },
  { name: 'Organic Compost 50kg', price: 800, category: 'fertilizer', sku: 'COMP-ORG-001' },
  { name: 'Wheat Seed - Premium', price: 2500, category: 'seed', sku: 'SEED-WHT-001' },
];

async function seed() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Clear existing data (optional - comment out if you want to keep data)
    console.log('Clearing existing data...');
    await client.query('TRUNCATE TABLE comments, posts, reports, claims, orders, products, scans, farms, refresh_tokens, otps, users CASCADE');

    // 1. Create users
    console.log('Creating users...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const users = [];

    // Admin user
    const adminResult = await client.query(
      `INSERT INTO users (id, name, email, phone, password_hash, role, language, is_verified)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [uuidv4(), 'Admin User', 'admin@fasalrakshak.com', '+919999999999', hashedPassword, 'admin', 'en', true]
    );
    users.push({ id: adminResult.rows[0].id, role: 'admin' });

    // Expert users
    for (let i = 1; i <= 2; i++) {
      const result = await client.query(
        `INSERT INTO users (id, name, email, phone, password_hash, role, language, is_verified)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
        [uuidv4(), `Expert ${i}`, `expert${i}@fasalrakshak.com`, `+91999999999${i}`, hashedPassword, 'expert', 'en', true]
      );
      users.push({ id: result.rows[0].id, role: 'expert' });
    }

    // Farmer users
    for (let i = 1; i <= 7; i++) {
      const region = regions[i % regions.length];
      const result = await client.query(
        `INSERT INTO users (id, name, email, phone, password_hash, role, language, is_verified)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
        [uuidv4(), `Farmer ${i}`, `farmer${i}@example.com`, `+9198765432${i.toString().padStart(2, '0')}`, hashedPassword, 'farmer', i % 2 === 0 ? 'hi' : 'en', true]
      );
      users.push({ id: result.rows[0].id, role: 'farmer', region });
    }

    // 2. Create farms
    console.log('Creating farms...');
    const farms = [];
    const farmerUsers = users.filter(u => u.role === 'farmer');
    for (const user of farmerUsers) {
      const region = user.region || regions[0];
      const result = await client.query(
        `INSERT INTO farms (id, user_id, name, geojson, area_hectares, crop_type)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [
          uuidv4(),
          user.id,
          `${user.role} Farm`,
          JSON.stringify({
            type: 'Polygon',
            coordinates: [[
              [region.lng - 0.01, region.lat - 0.01],
              [region.lng + 0.01, region.lat - 0.01],
              [region.lng + 0.01, region.lat + 0.01],
              [region.lng - 0.01, region.lat + 0.01],
              [region.lng - 0.01, region.lat - 0.01],
            ]]
          }),
          Math.random() * 10 + 2, // 2-12 hectares
          'Wheat'
        ]
      );
      farms.push({ id: result.rows[0].id, user_id: user.id, region });
    }

    // 3. Create products
    console.log('Creating products...');
    const productIds = [];
    for (const product of products) {
      const result = await client.query(
        `INSERT INTO products (id, name, description, sku, price, quantity, category)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        [
          uuidv4(),
          product.name,
          `High quality ${product.name.toLowerCase()} for agricultural use`,
          product.sku,
          product.price,
          Math.floor(Math.random() * 100) + 50,
          product.category
        ]
      );
      productIds.push(result.rows[0].id);
    }

    // 4. Create scans
    console.log('Creating scans...');
    const scanIds = [];
    const now = new Date();
    for (let i = 0; i < 30; i++) {
      const farm = farms[Math.floor(Math.random() * farms.length)];
      const disease = diseases[Math.floor(Math.random() * diseases.length)];
      const confidence = disease === 'Healthy' ? 0.95 : (0.7 + Math.random() * 0.25);
      const healthScore = disease === 'Healthy' ? 85 + Math.floor(Math.random() * 15) : (30 + Math.floor(Math.random() * 50));
      const scanDate = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000); // Last 30 days
      
      const result = await client.query(
        `INSERT INTO scans (id, user_id, farm_id, image_url, disease_label, confidence, health_score, metadata, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
        [
          uuidv4(),
          farm.user_id,
          farm.id,
          `https://example.com/scans/scan-${i + 1}.jpg`,
          disease,
          confidence,
          healthScore,
          JSON.stringify({
            geo: { lat: farm.region.lat, lng: farm.region.lng },
            language: 'en',
            region: farm.region.name,
            treatment: `Recommended treatment for ${disease}`,
          }),
          'completed'
        ]
      );
      scanIds.push({ id: result.rows[0].id, disease, region: farm.region });
    }

    // 5. Create orders
    console.log('Creating orders...');
    for (let i = 0; i < 5; i++) {
      const user = farmerUsers[Math.floor(Math.random() * farmerUsers.length)];
      const itemCount = Math.floor(Math.random() * 3) + 1;
      const items = [];
      let total = 0;
      
      for (let j = 0; j < itemCount; j++) {
        const productIdx = Math.floor(Math.random() * productIds.length);
        const quantity = Math.floor(Math.random() * 3) + 1;
        const price = products[productIdx].price;
        items.push({
          product_id: productIds[productIdx],
          quantity,
          price,
        });
        total += price * quantity;
      }

      await client.query(
        `INSERT INTO orders (id, user_id, items, total_amount, status)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          uuidv4(),
          user.id,
          JSON.stringify(items),
          total,
          ['pending', 'confirmed', 'shipped'][Math.floor(Math.random() * 3)]
        ]
      );
    }

    // 6. Create claims
    console.log('Creating insurance claims...');
    for (let i = 0; i < 3; i++) {
      const scan = scanIds[Math.floor(Math.random() * scanIds.length)];
      const user = farmerUsers[Math.floor(Math.random() * farmerUsers.length)];
      await client.query(
        `INSERT INTO claims (id, user_id, scan_id, wheat_health_score, claim_amount, status)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          uuidv4(),
          user.id,
          scan.id,
          Math.floor(Math.random() * 30) + 40,
          Math.floor(Math.random() * 50000) + 10000,
          ['pending', 'verified', 'approved'][Math.floor(Math.random() * 3)]
        ]
      );
    }

    // 7. Create community posts
    console.log('Creating community posts...');
    const postTitles = [
      'How to prevent rust in wheat?',
      'Best time to apply fungicide?',
      'Organic alternatives to chemical pesticides',
      'Crop rotation benefits',
      'Weather impact on crop health',
    ];
    for (let i = 0; i < 5; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const result = await client.query(
        `INSERT INTO posts (id, user_id, title, content, category, upvotes)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [
          uuidv4(),
          user.id,
          postTitles[i],
          `This is a sample post about ${postTitles[i].toLowerCase()}. Farmers can share their experiences and get help from the community.`,
          'question',
          Math.floor(Math.random() * 20)
        ]
      );
    }

    await client.query('COMMIT');
    console.log('✅ Demo data seeded successfully!');
    console.log(`   - ${users.length} users (1 admin, 2 experts, ${farmerUsers.length} farmers)`);
    console.log(`   - ${farms.length} farms`);
    console.log(`   - ${products.length} products`);
    console.log(`   - ${scanIds.length} scans`);
    console.log(`   - 5 orders`);
    console.log(`   - 3 insurance claims`);
    console.log(`   - 5 community posts`);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error seeding data:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch(console.error);


