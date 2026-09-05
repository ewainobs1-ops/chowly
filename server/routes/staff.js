const express = require('express');
const router = express.Router();
const { Waiter, Chef, Bartender } = require('../models');

router.get('/', async (req, res) => {
  try {
    const waiters = await Waiter.findAll();
    const chefs = await Chef.findAll();
    const bartenders = await Bartender.findAll();
    res.json({ waiters, chefs, bartenders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
