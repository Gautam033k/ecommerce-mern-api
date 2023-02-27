const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');

dotenv.configOrder;
const Order = require('../models/Order.js');
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require('./verifytoken');

//CREATE PRODUCT

router.post('/', verifyToken, (req, res) => {
  const newOrder = new Cart(req.body);

  try {
    const savedOrder = newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(200).json(err);
  }
});

//update
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const updateOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updateOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findOneAndDelete(req.params.id);
    res.status(200).json('Order has been deleted');
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get a particular user CART
router.get('/find/:userid', verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userid });

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET all products
router.get('/', verifyTokenAndAdmin, async (req, res) => {
  try {
    const order = await Order.find();
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
