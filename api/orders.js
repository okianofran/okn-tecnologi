import clientPromise from './lib/mongodb.js';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db('okn_technology');
    const collection = db.collection('orders');

    // GET: List all orders for the Admin Dashboard
    if (req.method === 'GET') {
      const orders = await collection.find({}).sort({ createdAt: -1 }).toArray();
      return res.status(200).json({ success: true, data: orders });
    }

    // POST: Create a new order (Status: PENDING by default)
    if (req.method === 'POST') {
      const orderData = req.body;
      const order = {
        ...orderData,
        orderId: `OKN-${Date.now().toString().slice(-6)}`,
        status: 'PENDING', // Changed from CONFIRMED to PENDING
        createdAt: new Date(),
      };

      const result = await collection.insertOne(order);
      return res.status(201).json({ success: true, orderId: order.orderId, id: result.insertedId });
    }

    // PUT: Update an order status (e.g. from PENDING to CONFIRMED)
    if (req.method === 'PUT') {
      const { id, status } = req.body;
      
      if (!id || !status) {
        return res.status(400).json({ success: false, message: 'Faltan campos obligatorios (id, status)' });
      }

      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { status, updatedAt: new Date() } },
        { returnDocument: 'after' }
      );

      // Si el estado es CONFIRMED, llamamos de manera interna (o se encarga el frontend) al envío de email
      // Por ahora solo actualizamos el estado. El envío de email se hará en otro endpoint o desde el frontend.
      
      return res.status(200).json({ success: true, data: result });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    return res.status(405).end(`Método ${req.method} no permitido`);
  } catch (error) {
    console.error('Error en /api/orders:', error);
    return res.status(500).json({ success: false, message: 'Error procesando la orden', error: error.message });
  }
}
