import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  image: { type: String, required: true },
  banner: { type: String }, // Large realistic shop banner image
  rating: { type: Number, default: 0 },
  distance: { type: String }, // Can be calculated or string like '1.5 miles'
  phone: { type: String },
  hours: { type: String },
  location: {
    lat: { type: Number },
    lng: { type: Number }
  },
  country: { type: String },
  region: { type: String },
  inventory: {
    // A map of Product IDs (ObjectIds) to inventory status
    // For simplicity with our mock frontend, we map legacy number IDs or string references
    type: Map,
    of: new mongoose.Schema({
      status: { type: String, enum: ['in-stock', 'low-stock', 'out-of-stock'], default: 'out-of-stock' },
      quantity: { type: Number, default: 0 }
    }, { _id: false })
  }
}, {
  timestamps: true
});

const Store = mongoose.model('Store', storeSchema);
export default Store;
