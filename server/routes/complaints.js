const express = require('express');
const router = express.Router();
const { Order, Complaint } = require('../models');

router.post('/:orderId', async (req, res) => {
  const { description, rating } = req.body;
  if (!description || !rating) {
    return res.status(400).json({ error: 'description and rating are required.' });
  }
  try {
    const order = await Order.findByPk(req.params.orderId);
    if (!order) return res.status(404).json({ error: 'Order not found.' });

    const complaint = await Complaint.create({
      OrderID: order.OrderID,
      CustomerID: order.CustomerID,
      ComplaintDescription: description,
      Rating: rating
    });

    res.status(201).json(complaint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
