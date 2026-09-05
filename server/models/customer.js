module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Customer', {
    CustomerID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    CustomerName: { type: DataTypes.STRING, allowNull: false },
    PhoneNumber: { type: DataTypes.STRING, allowNull: false },
    Email: { type: DataTypes.STRING, allowNull: true }
  }, { tableName: 'Customers', timestamps: false });
};
