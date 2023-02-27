const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');

dotenv.config();

const Product = require('../models/Product.js');
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require('./verifyToken');

//CREATE PRODUCT

router.post('/', verifyTokenAndAdmin, (req, res) => {
  const newProduct = new Product(req.body);

  try {
    const savedProduct = newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(200).json(err);
  }
});

//update
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const updateProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updateProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findOneAndDelete(req.params.id);
    res.status(200).json('product has been deleted');
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get a particular user
router.get('/find/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET all products
router.get('/', async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;
    if (qNew) {
      products = await Product.find().sort({ category: -1 }).limit(1);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
