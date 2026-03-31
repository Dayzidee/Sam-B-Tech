import './env';
import { db } from '../src/backend/config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const products = [
  {
    name: 'iPhone 16 Pro Max',
    description: 'The ultimate iPhone with the fastest chip ever and an advanced camera system.',
    price: 2100000,
    stock: 10,
    category: 'Smartphones',
    condition: 'Brand New',
    images: ['https://res.cloudinary.com/dqqpaaysj/image/upload/v1711883200/iphone_16_pro_max.jpg'],
    specs: {
      display: '6.9-inch Super Retina XDR',
      chip: 'A18 Pro chip',
      camera: '48MP Fusion + 48MP Ultra Wide + 12MP Telephoto',
      os: 'iOS 18'
    },
    storage: ['256GB', '512GB', '1TB'],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    name: 'MacBook Pro M3 Max',
    description: 'Performance powerhouse for professionals with the M3 Max chip.',
    price: 4500000,
    stock: 5,
    category: 'Laptops',
    condition: 'Brand New',
    images: ['https://res.cloudinary.com/dqqpaaysj/image/upload/v1711883200/macbook_pro_m3.jpg'],
    specs: {
      display: '16.2-inch Liquid Retina XDR display',
      chip: 'Apple M3 Max chip',
      camera: '1080p FaceTime HD camera',
      os: 'macOS Sonoma'
    },
    storage: ['1TB', '2TB', '4TB'],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    name: 'Google Pixel 9 Pro',
    description: 'The best of Google AI in a sleek, premium design.',
    price: 1200000,
    stock: 15,
    category: 'Smartphones',
    condition: 'Brand New',
    images: ['https://res.cloudinary.com/dqqpaaysj/image/upload/v1711883200/pixel_9_pro.jpg'],
    specs: {
      display: '6.3-inch Super Actua display',
      chip: 'Google Tensor G4',
      camera: '50MP Main + 48MP Ultra Wide + 48MP Telephoto',
      os: 'Android 15'
    },
    storage: ['128GB', '256GB', '512GB'],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }
];

async function seed() {
  console.log('🚀 Seeding demo products...');
  const colRef = collection(db, 'products');
  
  for (const product of products) {
    try {
      const docRef = await addDoc(colRef, product);
      console.log(`✅ Added: ${product.name} (ID: ${docRef.id})`);
    } catch (error) {
      console.error(`❌ Error adding ${product.name}:`, error);
    }
  }
  console.log('✨ Seeding complete!');
  process.exit(0);
}

seed();
