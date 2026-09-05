require('dotenv').config();
const express = require('express');
const cors = require('cors');

const menuRoutes = require('./routes/menu');
const staffRoutes = require('./routes/staff');
const orderRoutes = require('./routes/orders');
const complaintRoutes = require('./routes/complaints');
const paymentRoutes = require('./routes/payments');

const app = express();
app.use(cors());
app.use(express.json());
app.get('/api/ping', (req, res) => res.json({ ok: true }));
app.use('/api/menu', menuRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/payments', paymentRoutes);

module.exports = app;
