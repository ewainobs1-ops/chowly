const express = require('express');
const router = express.Router();
const { MenuItem } = require('../models');

router.get('/', async (req, res) => {
  try {
    const items = await MenuItem.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
