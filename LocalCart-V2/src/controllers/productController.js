import { products } from '../data/mockData.js';
import catchAsync from '../utils/catchAsync.js';

const getProducts = catchAsync(async (req, res) => {
  res.json(products);
});


const getProductById = catchAsync(async (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));

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
