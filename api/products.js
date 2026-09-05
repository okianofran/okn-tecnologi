import { ObjectId } from 'mongodb';
import clientPromise from './lib/mongodb.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const client = await clientPromise;
    const db = client.db('okn_technology');
    const collection = db.collection('products');

    if (req.method === 'GET') {
      const { category, search } = req.query || {};
      const query = {};

      if (category && category !== 'all') {
        query.category = category;
      }

      if (search) {
        query['$or'] = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }

      const rawProducts = await collection.find(query).toArray();
      const products = rawProducts.map(p => ({
        ...p,
        id: p.id || p._id.toString()
      }));

      return res.status(200).json({ success: true, count: products.length, data: products });
    }

    if (req.method === 'POST') {
      const newProduct = req.body;
      if (!newProduct || !newProduct.title || !newProduct.price) {
        return res.status(400).json({ success: false, message: 'Título y precio son requeridos' });
      }

      const productToInsert = {
        title: newProduct.title,
        price: Number(newProduct.price),
        originalPrice: newProduct.originalPrice ? Number(newProduct.originalPrice) : Math.round(Number(newProduct.price) * 1.25),
        stock: newProduct.stock !== undefined ? Number(newProduct.stock) : 10,
        category: newProduct.category || 'tecnologia',
        image: newProduct.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
        description: newProduct.description || '',
        badge: newProduct.badge || 'NUEVO',
        rating: 5.0,
        reviewsCount: 1,
        installments: newProduct.installments || '12x sin interés',
        freeShipping: newProduct.freeShipping !== undefined ? newProduct.freeShipping : true,
        fullShipping: newProduct.fullShipping !== undefined ? newProduct.fullShipping : true,
        specs: Array.isArray(newProduct.specs) ? newProduct.specs : ['Garantía oficial OKN', 'Envío prioritario'],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await collection.insertOne(productToInsert);
      const insertedProduct = {
        ...productToInsert,
        id: result.insertedId.toString(),
        _id: result.insertedId.toString()
      };

      return res.status(201).json({ success: true, data: insertedProduct });
    }

    if (req.method === 'PUT') {
      const { id, _id, ...updateData } = req.body || {};
      const targetId = id || _id;
      if (!targetId) {
        return res.status(400).json({ success: false, message: 'ID de producto requerido' });
      }

      let filter = { id: targetId };
      if (ObjectId.isValid(targetId)) {
        filter = { $or: [{ _id: new ObjectId(targetId) }, { id: targetId }] };
      }

      const updateDoc = {
        ...updateData,
        updatedAt: new Date()
      };

      if (updateDoc.price) updateDoc.price = Number(updateDoc.price);
      if (updateDoc.originalPrice) updateDoc.originalPrice = Number(updateDoc.originalPrice);
      if (updateDoc.stock !== undefined) updateDoc.stock = Number(updateDoc.stock);

      await collection.updateOne(filter, { $set: updateDoc });
      return res.status(200).json({ success: true, message: 'Producto actualizado exitosamente' });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query || {};
      if (!id) {
        return res.status(400).json({ success: false, message: 'ID requerido para eliminar' });
      }

      let filter = { id: id };
      if (ObjectId.isValid(id)) {
        filter = { $or: [{ _id: new ObjectId(id) }, { id: id }] };
      }

      await collection.deleteOne(filter);
      return res.status(200).json({ success: true, message: 'Producto eliminado exitosamente' });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    return res.status(405).end(`Método ${req.method} no permitido`);
  } catch (error) {
    console.error('Error en /api/products:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
  }
}
