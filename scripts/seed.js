import clientPromise from '../api/lib/mongodb.js';
import { PRODUCTS, CATEGORIES } from '../src/data/products.js';

async function seed() {
  console.log('🔄 Conectando a MongoDB Atlas...');
  try {
    const client = await clientPromise;
    const db = client.db('okn_technology');

    console.log('✅ Conexión establecida con éxito.');

    // 1. Seed Categories
    console.log('📦 Actualizando colección de categorías...');
    const categoriesCol = db.collection('categories');
    await categoriesCol.deleteMany({});
    await categoriesCol.insertMany(CATEGORIES);
    console.log(`✅ ${CATEGORIES.length} categorías insertadas.`);

    // 2. Seed Products
    console.log('📦 Actualizando colección de productos...');
    const productsCol = db.collection('products');
    await productsCol.deleteMany({});
    await productsCol.insertMany(PRODUCTS);
    console.log(`✅ ${PRODUCTS.length} productos insertados.`);

    console.log('🎉 ¡Base de datos de OKN TECHNOLOGY poblada exitosamente en MongoDB Atlas!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error conectando o poblando MongoDB:', error);
    process.exit(1);
  }
}

seed();