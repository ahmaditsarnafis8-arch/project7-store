const products = [
  {
    id: 1,
    name: 'Aurora Headset',
    price: 699000,
    description: 'Suara jernih, desain premium, baterai tahan lama.',
    emoji: '🎧',
    category: 'Elektronik',
    rating: 4.9,
    badge: 'Best Seller',
    details: 'Headset wireless dengan noise canceling, baterai 40 jam, dan koneksi cepat.'
  },
  {
    id: 2,
    name: 'Nova Tote Bag',
    price: 349000,
    description: 'Tas stylish untuk kerja dan weekend yang praktis.',
    emoji: '👜',
    category: 'Fashion',
    rating: 4.8,
    badge: 'Baru',
    details: 'Tas premium dengan ruang luas, material tahan air, dan desain minimalis.'
  },
  {
    id: 3,
    name: 'Lumen Lamp',
    price: 249000,
    description: 'Pencahayaan hangat dengan tampilan modern.',
    emoji: '💡',
    category: 'Lifestyle',
    rating: 4.7,
    badge: 'Promo',
    details: 'Lampu meja pintar dengan tiga mode pencahayaan dan kontrol warna lembut.'
  }
];

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  res.status(200).json({ products });
};
