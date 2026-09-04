import clientPromise from './lib/mongodb.js';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db('okn_technology');

    if (req.method === 'GET') {
      const { category, search } = req.query || {};
      const query = {};

      if (category && category !== 'all') {
        query.category = category;
      }

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }

      const products = await db
        .collection('products')
        .find(query)
        .toArray();

      return res.status(200).json({ success: true, count: products.length, data: products });
    }

    if (req.method === 'POST') {
      const newProduct = req.body;
      if (!newProduct.title || !newProduct.price) {
        return res.status(400).json({ success: false, message: 'Título y precio son requeridos' });
      }

      const result = await db.collection('products').insertOne({
        ...newProduct,
        createdAt: new Date()
      });

      return res.status(201).json({ success: true, insertedId: result.insertedId });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Método ${req.method} no permitido`);
  } catch (error) {
    console.error('Error en /api/products:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
  }
}