import Product from '../models/Product.js';
import catchAsync from '../utils/catchAsync.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = catchAsync(async (req, res) => {
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const category = req.query.category 
    ? { category: req.query.category }
    : {};

  const products = await Product.find({ ...keyword, ...category });
  res.json(products);
});

// @desc    Fetch a specific product
// @route   GET /api/products/:id
// @access  Public
const getProductById = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

export {
  getProducts,
  getProductById
};
