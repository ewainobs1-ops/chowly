const express = require('express');
const router = express.Router();
const { Order, Payment } = require('../models');

router.post('/:orderId', async (req, res) => {
  const { amount, method } = req.body;
  if (!amount || !method) {
    return res.status(400).json({ error: 'amount and method are required.' });
  }
  try {
    const order = await Order.findByPk(req.params.orderId);
    if (!order) return res.status(404).json({ error: 'Order not found.' });

    const payment = await Payment.create({
      OrderID: order.OrderID,
      Amount: amount,
      PaymentMethod: method,
      IsPretend: true
    });

    order.OrderStatus = 'Paid';
    await order.save();

    res.status(201).json({ message: 'Payment recorded (pretend payment).', payment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
