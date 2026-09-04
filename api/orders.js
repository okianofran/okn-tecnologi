import clientPromise from './lib/mongodb.js';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db('okn_technology');

    if (req.method === 'POST') {
      const orderData = req.body;
      const order = {
        ...orderData,
        orderId: `OKN-${Date.now().toString().slice(-6)}`,
        status: 'CONFIRMED',
        createdAt: new Date(),
      };

      const result = await db.collection('orders').insertOne(order);
      return res.status(201).json({ success: true, orderId: order.orderId, id: result.insertedId });
    }

    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Método ${req.method} no permitido`);
  } catch (error) {
    console.error('Error en /api/orders:', error);
    return res.status(500).json({ success: false, message: 'Error procesando la orden', error: error.message });
  }
}