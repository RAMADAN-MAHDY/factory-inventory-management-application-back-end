import Product from '../models/Product.js';

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getProducts = async (req, res) => {
  try {
    const rawSearch = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    const search = rawSearch.slice(0, 100);

    const filter = {};
    if (search) {
      filter.name = { $regex: escapeRegex(search), $options: 'i' };
    }

    const products = await Product.find(filter).sort({ quantity: 1, _id: -1 }).lean();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createProduct = async (req, res) => {
  const product = new Product(req.body);
  const createdProduct = await product.save();
  const io = req.app.get('io');
  io.emit('product:created', createdProduct);
  res.status(201).json(createdProduct);
};

const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    product.name = req.body.name || product.name;
    product.quantity = req.body.quantity ?? product.quantity;
    product.criticalThreshold = req.body.criticalThreshold || product.criticalThreshold;
    product.imageUrl = req.body.imageUrl || product.imageUrl;
    product.description = req.body.description || product.description;
    const updatedProduct = await product.save();
    const io = req.app.get('io');
    io.emit('product:updated', updatedProduct);
    res.json(updatedProduct);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

const addStockLog = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    const { type, quantity, notes } = req.body;
    product.logs.unshift({ type, quantity, notes });
    if (type === 'in') {
      product.quantity += quantity;
    } else if (type === 'out') {
      product.quantity -= quantity;
    }
    const updatedProduct = await product.save();
    const io = req.app.get('io');
    io.emit('product:updated', updatedProduct);
    res.json(updatedProduct);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.deleteOne();
    const io = req.app.get('io');
    io.emit('product:deleted', product._id);
    res.json({ message: 'Product removed' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

export { getProducts, createProduct, updateProduct, addStockLog, deleteProduct };
