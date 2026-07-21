let orders = [];

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () => {
    try {
      const payload = body ? JSON.parse(body) : {};
      const order = {
        id: orders.length + 1,
        ...payload,
        createdAt: payload.createdAt || new Date().toISOString()
      };
      orders.push(order);
      res.status(201).json({ success: true, order });
    } catch (error) {
      res.status(400).json({ error: 'Invalid JSON' });
    }
  });
};
