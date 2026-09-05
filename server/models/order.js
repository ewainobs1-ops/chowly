module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Order', {
    OrderID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    OrderDateTime: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    OrderStatus: {
      type: DataTypes.ENUM('Pending', 'In Progress', 'Served', 'Paid'),
      allowNull: false,
      defaultValue: 'Pending'
    }
  }, { tableName: 'Orders', timestamps: false });
};
