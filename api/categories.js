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
    if (!client) {
      return res.status(500).json({
        success: false,
        message: 'MONGODB_URI no está configurada en las Variables de Entorno de Vercel.',
        error: 'Por favor agrega MONGODB_URI en Vercel (Settings -> Environment Variables) y haz Redeploy.'
      });
    }

    const db = client.db('okn_technology');

    if (req.method === 'GET') {
      const categories = await db
        .collection('categories')
        .find({})
        .toArray();

      return res.status(200).json({ success: true, data: categories });
    }

    res.setHeader('Allow', ['GET']);
    return res.status(405).end('Método no permitido');
  } catch (error) {
    console.error('Error en /api/categories:', error);
    return res.status(500).json({
      success: false,
      message: 'Error de conexión con MongoDB Atlas',
      error: error.message || 'Verifica MONGODB_URI en Vercel y Network Access 0.0.0.0/0 en MongoDB Atlas.'
    });
  }
}
