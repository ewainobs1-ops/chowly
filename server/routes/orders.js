const express = require('express');
const router = express.Router();
const { sequelize, Customer, Restaurant, MenuItem, Order, OrderItem, Waiter, Chef, Bartender } = require('../models');

// place an order
router.post('/', async (req, res) => {
  const { customerName, phoneNumber, items } = req.body;
  if (!customerName || !phoneNumber || !items || !items.length) {
    return res.status(400).json({ error: 'customerName, phoneNumber, and at least one item are required.' });
  }

  const t = await sequelize.transaction();
  try {
    const restaurant = await Restaurant.findOne();
    if (!restaurant) throw new Error('No restaurant found. Run the seed script first.');

    let customer = await Customer.findOne({ where: { PhoneNumber: phoneNumber } });
    if (!customer) {
      customer = await Customer.create({ CustomerName: customerName, PhoneNumber: phoneNumber }, { transaction: t });
    }

    const order = await Order.create({
      CustomerID: customer.CustomerID,
      RestaurantID: restaurant.RestaurantID,
      OrderStatus: 'Pending'
    }, { transaction: t });

    let maxWait = 0;
    for (const item of items) {
      const menuItem = await MenuItem.findByPk(item.menuItemId);
      if (!menuItem) throw new Error(`Menu item ${item.menuItemId} not found.`);
      const waitingTime = menuItem.AvgWaitingTime;
      if (waitingTime > maxWait) maxWait = waitingTime;
      await OrderItem.create({
        OrderID: order.OrderID,
        MenuItemID: menuItem.MenuItemID,
        Quantity: item.quantity || 1,
        WaitingTime: waitingTime
      }, { transaction: t });
    }

    await t.commit();

    const fullOrder = await Order.findByPk(order.OrderID, {
      include: [{ model: OrderItem, include: [MenuItem] }, Customer]
    });

    res.status(201).json({ order: fullOrder, estimatedWaitingTime: maxWait });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ error: err.message });
  }
});

// list orders, e.g. for the waiter dashboard. Optional ?status=Pending
router.get('/', async (req, res) => {
  try {
    const where = req.query.status ? { OrderStatus: req.query.status } : {};
    const orders = await Order.findAll({
      where,
      include: [Customer, { model: OrderItem, include: [MenuItem, Chef, Bartender] }, Waiter],
      order: [['OrderDateTime', 'ASC']]
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get one order, e.g. for the customer checking status and waiting time
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [Customer, { model: OrderItem, include: [MenuItem, Chef, Bartender] }, Waiter]
    });
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// waiter opens an order and records who prepared each item
router.patch('/:id/assign', async (req, res) => {
  const { waiterId, assignments } = req.body;
  if (!waiterId || !assignments || !assignments.length) {
    return res.status(400).json({ error: 'waiterId and at least one assignment are required.' });
  }
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found.' });

    for (const a of assignments) {
      const orderItem = await OrderItem.findByPk(a.orderItemId);
      if (!orderItem) continue;
      if (a.chefId) orderItem.ChefID = a.chefId;
      if (a.bartenderId) orderItem.BartenderID = a.bartenderId;
      await orderItem.save();
    }

    order.WaiterID = waiterId;
    order.OrderStatus = 'In Progress';
    await order.save();

    res.json({ message: 'Order assigned successfully.', order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// waiter marks the order as served
router.patch('/:id/serve', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    order.OrderStatus = 'Served';
    await order.save();
    res.json({ message: 'Order marked as served.', order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
