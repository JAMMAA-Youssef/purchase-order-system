const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Product } = require('../models');

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Ensure the 'uploads' directory exists
const fs = require('fs');
const path = require('path');
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// @route    GET /api/products
// @desc     Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('supplier', 'name'); // Populate supplier name
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// @route    POST /api/products
// @desc     Create a new product
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, description, supplier, price, stock } = req.body; 
    const newProduct = new Product({ name, description, supplier, price, stock });

    if (req.file) {
      newProduct.image = `uploads/${req.file.filename}`;
    }

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product by ID
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    res.json({ msg: 'Product removed' });
  } catch (error) {
    console.error(error);
    if (error.name === 'CastError') {
      return res.status(400).json({ msg: 'Invalid product ID' });
    }
    res.status(500).send('Server Error'); 
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product by ID
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, description, supplier, price, stock } = req.body; 
    const updateData = { name, description, supplier, price, stock };

    if (req.file) {
      updateData.image = `uploads/${req.file.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true } // This option returns the updated document
    ).populate('supplier', 'name');

    if (!updatedProduct) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ msg: error.message });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ msg: 'Invalid product ID or supplier ID' });
    }
    res.status(500).send('Server Error'); 
  }
});

module.exports = router;
