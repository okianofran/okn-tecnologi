import clientPromise from './lib/mongodb.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const client = await clientPromise;
    if (!client) {
      return res.status(500).json({ success: false, message: 'Base de datos MongoDB no conectada' });
    }

    const db = client.db('okn_technology');
    const collection = db.collection('products');

    // GET: List all products
    if (req.method === 'GET') {
      const products = await collection.find({}).toArray();
      const formatted = products.map(p => ({
        ...p,
        id: p.id || p._id.toString()
      }));
      return res.status(200).json({ success: true, data: formatted });
    }

    // POST: Create a new product
    if (req.method === 'POST') {
      const productData = req.body;
      const newProduct = {
        ...productData,
        id: productData.id || `okn-${Date.now()}`,
        createdAt: new Date().toISOString()
      };

      await collection.insertOne(newProduct);
      return res.status(201).json({ success: true, data: newProduct });
    }

    // PUT: Update a product
    if (req.method === 'PUT') {
      const { id, _id, ...updates } = req.body;
      const productId = id || _id;

      if (!productId) {
        return res.status(400).json({ success: false, message: 'Se requiere ID del producto' });
      }

      const result = await collection.findOneAndUpdate(
        { id: productId },
        { $set: { ...updates, updatedAt: new Date().toISOString() } },
        { returnDocument: 'after' }
      );

      if (!result) {
        const resultById = await collection.findOneAndUpdate(
          { _id: productId },
          { $set: { ...updates, updatedAt: new Date().toISOString() } },
          { returnDocument: 'after' }
        );
        return res.status(200).json({ success: true, data: resultById });
      }

      return res.status(200).json({ success: true, data: result });
    }

    // DELETE: Delete a product
    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ success: false, message: 'Se requiere ID del producto' });
      }

      await collection.deleteOne({ $or: [{ id: id }, { _id: id }] });
      return res.status(200).json({ success: true, message: 'Producto eliminado correctamente' });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    return res.status(405).end(`Método ${req.method} no permitido`);

  } catch (error) {
    console.error('Error en /api/products:', error);
    return res.status(500).json({ success: false, message: 'Error procesando productos', error: error.message });
  }
}
