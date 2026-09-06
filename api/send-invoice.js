import clientPromise from './lib/mongodb.js';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { orderId } = req.body;
  if (!orderId) {
    return res.status(400).json({ success: false, message: 'Se requiere orderId' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('okn_technology');
    
    // Buscar la orden
    const order = await db.collection('orders').findOne({ _id: new ObjectId(orderId) });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Orden no encontrada' });
    }

    const { customer, items, totalAmount } = order;

    // Buscar detalles de los productos para extraer la garantía
    const productIds = items.map(item => item.id);
    // Suponiendo que los IDs en el carrito son strings
    const productsData = await db.collection('products').find({ id: { $in: productIds } }).toArray();

    // Crear la tabla de productos para el correo
    let itemsHtml = '';
    items.forEach(item => {
      const pData = productsData.find(p => p.id === item.id);
      const warranty = pData?.warranty || '6 meses por defectos de fábrica';
      itemsHtml += `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}x ${item.title}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">$${item.price}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-size: 0.8em; color: #666;">${warranty}</td>
        </tr>
      `;
    });

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #00f2ff; background: #080b1a; padding: 15px; border-radius: 8px;">OKN TECHNOLOGY</h1>
          <h2>Factura y Confirmación de Compra</h2>
        </div>
        
        <p>Hola <strong>${customer.nombre}</strong>,</p>
        <p>¡Hemos confirmado tu pago exitosamente! A continuación te detallamos tu compra y las respectivas garantías:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="background: #f8f9fa;">
              <th style="padding: 10px; text-align: left;">Producto</th>
              <th style="padding: 10px; text-align: left;">Precio</th>
              <th style="padding: 10px; text-align: left;">Garantía Aplicable</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <h3 style="text-align: right; margin-top: 20px; color: #00e676;">Total Pagado: $${totalAmount}</h3>

        <div style="margin-top: 30px; padding: 15px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;">
          <h4 style="margin-top: 0; color: #166534;">Política de Garantía</h4>
          <p style="font-size: 0.9em; color: #166534;">
            Conserve este correo como comprobante. La garantía cubre únicamente defectos de fábrica durante el periodo especificado para cada producto. 
            No aplica por daños físicos, humedad, golpes o alteraciones de software no autorizadas.
          </p>
        </div>
        
        <p style="text-align: center; margin-top: 30px; font-size: 0.9em; color: #888;">
          Gracias por confiar en OKN Technology.<br/>
          Cualquier duda, contáctanos a nuestro WhatsApp.
        </p>
      </div>
    `;

    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
      console.warn("RESEND_API_KEY no está configurada. Simulando envío de email.");
      return res.status(200).json({ success: true, message: 'Email simulado (Falta API Key)', debug: true });
    }

    // Call Resend API using standard fetch
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'OKN Technology <ventas@okntecnology.com>', // TODO: Actualizar cuando se verifique dominio en Resend
        to: [customer.correo],
        subject: `Confirmación de Pago y Factura - Orden #${order.orderId}`,
        html: htmlContent
      })
    });

    if (emailRes.ok) {
      return res.status(200).json({ success: true, message: 'Factura enviada exitosamente' });
    } else {
      const errorData = await emailRes.json();
      throw new Error(errorData.message || 'Error from Resend API');
    }

  } catch (error) {
    console.error('Error enviando factura:', error);
    return res.status(500).json({ success: false, message: 'Error enviando la factura', error: error.message });
  }
}
