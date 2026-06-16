import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  criticalThreshold: { type: Number, required: true, min: 1 },
  imageUrl: { type: String },
  description: { type: String },
  logs: [{
    type: { type: String, enum: ['in', 'out'], required: true },
    quantity: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    notes: String
  }]
});

productSchema.index({ name: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
