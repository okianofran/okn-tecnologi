// API products.js - Uses GitHub as live database
// Required env vars: GITHUB_TOKEN, GITHUB_REPO_OWNER, GITHUB_REPO_NAME

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_REPO_OWNER || 'okianofran';
const GITHUB_REPO = process.env.GITHUB_REPO_NAME || 'okn-tecnologi';
const FILE_PATH = 'data/products-live.json';
const API_BASE = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}`;

async function getProductsFromGitHub() {
  const res = await fetch(API_BASE, {
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github+json'
    }
  });
  if (!res.ok) throw new Error('No se pudo leer products-live.json desde GitHub');
  const json = await res.json();
  const decoded = Buffer.from(json.content, 'base64').toString('utf8');
  return { products: JSON.parse(decoded), sha: json.sha };
}

async function saveProductsToGitHub(products, sha, message) {
  const content = Buffer.from(JSON.stringify(products, null, 2)).toString('base64');
  const res = await fetch(API_BASE, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message, content, sha })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Error guardando en GitHub');
  }
  return res.json();
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');

  // ---- GET ----
  if (req.method === 'GET') {
    try {
      if (!GITHUB_TOKEN) {
        // Return empty to fallback to local data
        return res.status(200).json({ success: false, message: 'GITHUB_TOKEN no configurado' });
      }
      const { products } = await getProductsFromGitHub();
      return res.status(200).json({ success: true, data: products });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // ---- POST (Add product) ----
  if (req.method === 'POST') {
    try {
      const { products, sha } = await getProductsFromGitHub();
      const newProduct = {
        ...req.body,
        id: `okn-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      products.unshift(newProduct);
      await saveProductsToGitHub(products, sha, `Producto agregado: ${newProduct.title}`);
      return res.status(201).json({ success: true, data: newProduct });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // ---- PUT (Update product) ----
  if (req.method === 'PUT') {
    try {
      const { id, ...updates } = req.body;
      const { products, sha } = await getProductsFromGitHub();
      const idx = products.findIndex(p => p.id === id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Producto no encontrado' });
      products[idx] = { ...products[idx], ...updates, updatedAt: new Date().toISOString() };
      await saveProductsToGitHub(products, sha, `Producto actualizado: ${products[idx].title}`);
      return res.status(200).json({ success: true, data: products[idx] });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // ---- DELETE ----
  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      const { products, sha } = await getProductsFromGitHub();
      const updated = products.filter(p => p.id !== id);
      await saveProductsToGitHub(updated, sha, `Producto eliminado: ${id}`);
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  return res.status(405).end(`Método ${req.method} no permitido`);
}