require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  { host: process.env.DB_HOST, port: process.env.DB_PORT, dialect: 'postgres', logging: false }
);

const Customer = require('./customer')(sequelize, DataTypes);
const Restaurant = require('./restaurant')(sequelize, DataTypes);
const MenuItem = require('./menuItem')(sequelize, DataTypes);
const Waiter = require('./waiter')(sequelize, DataTypes);
const Chef = require('./chef')(sequelize, DataTypes);
const Bartender = require('./bartender')(sequelize, DataTypes);
const Order = require('./order')(sequelize, DataTypes);
const OrderItem = require('./orderItem')(sequelize, DataTypes);
const Payment = require('./payment')(sequelize, DataTypes);
const Complaint = require('./complaint')(sequelize, DataTypes);

Restaurant.hasMany(MenuItem, { foreignKey: 'RestaurantID' });
MenuItem.belongsTo(Restaurant, { foreignKey: 'RestaurantID' });

Restaurant.hasMany(Waiter, { foreignKey: 'RestaurantID' });
Waiter.belongsTo(Restaurant, { foreignKey: 'RestaurantID' });

Restaurant.hasMany(Chef, { foreignKey: 'RestaurantID' });
Chef.belongsTo(Restaurant, { foreignKey: 'RestaurantID' });

Restaurant.hasMany(Bartender, { foreignKey: 'RestaurantID' });
Bartender.belongsTo(Restaurant, { foreignKey: 'RestaurantID' });

Restaurant.hasMany(Order, { foreignKey: 'RestaurantID' });
Order.belongsTo(Restaurant, { foreignKey: 'RestaurantID' });

Customer.hasMany(Order, { foreignKey: 'CustomerID' });
Order.belongsTo(Customer, { foreignKey: 'CustomerID' });

Waiter.hasMany(Order, { foreignKey: 'WaiterID' });
Order.belongsTo(Waiter, { foreignKey: 'WaiterID' });

Order.hasMany(OrderItem, { foreignKey: 'OrderID' });
OrderItem.belongsTo(Order, { foreignKey: 'OrderID' });

MenuItem.hasMany(OrderItem, { foreignKey: 'MenuItemID' });
OrderItem.belongsTo(MenuItem, { foreignKey: 'MenuItemID' });

Chef.hasMany(OrderItem, { foreignKey: 'ChefID' });
OrderItem.belongsTo(Chef, { foreignKey: 'ChefID' });

Bartender.hasMany(OrderItem, { foreignKey: 'BartenderID' });
OrderItem.belongsTo(Bartender, { foreignKey: 'BartenderID' });

Order.hasOne(Payment, { foreignKey: 'OrderID' });
Payment.belongsTo(Order, { foreignKey: 'OrderID' });

Order.hasMany(Complaint, { foreignKey: 'OrderID' });
Complaint.belongsTo(Order, { foreignKey: 'OrderID' });

Customer.hasMany(Complaint, { foreignKey: 'CustomerID' });
Complaint.belongsTo(Customer, { foreignKey: 'CustomerID' });

module.exports = { sequelize, Customer, Restaurant, MenuItem, Waiter, Chef, Bartender, Order, OrderItem, Payment, Complaint };
