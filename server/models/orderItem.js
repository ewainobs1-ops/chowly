module.exports = (sequelize, DataTypes) => {
  return sequelize.define('OrderItem', {
    OrderItemID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    Quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    WaitingTime: { type: DataTypes.INTEGER, allowNull: true }
  }, { tableName: 'OrderItems', timestamps: false });
};
