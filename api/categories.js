import clientPromise from './lib/mongodb.js';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db('okn_technology');

    if (req.method === 'GET') {
      const categories = await db
        .collection('categories')
        .find({})
        .toArray();

      return res.status(200).json({ success: true, data: categories });
    }

    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Método ${req.method} no permitido`);
  } catch (error) {
    console.error('Error en /api/categories:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
  }
}