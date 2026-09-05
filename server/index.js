require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const menuRoutes = require('./routes/menu');
const staffRoutes = require('./routes/staff');
const orderRoutes = require('./routes/orders');
const complaintRoutes = require('./routes/complaints');
const paymentRoutes = require('./routes/payments');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/menu', menuRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/payments', paymentRoutes);

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('Unable to sync database:', err));
