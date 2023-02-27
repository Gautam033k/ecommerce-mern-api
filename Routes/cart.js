const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');

dotenv.config();

const Cart = require('../models/Cart.js');
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require('./verifytoken');

//CREATE PRODUCT

router.post('/', verifyToken, (req, res) => {
  const newCart = new Cart(req.body);

  try {
    const savedCart = newCart.save();
    res.status(200).json(savedCart);
  } catch (err) {
    res.status(200).json(err);
  }
});

//update
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updateCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updateCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findOneAndDelete(req.params.id);
    res.status(200).json('Cart has been deleted');
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get a particular user CART
router.get('/find/:userid', verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userid });

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET all products
router.get('/', verifyTokenAndAdmin, async (req, res) => {
  try {
    const cart = await Cart.find();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
