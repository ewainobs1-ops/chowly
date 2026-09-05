module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Payment', {
    PaymentID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    Amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    PaymentMethod: { type: DataTypes.ENUM('Card', 'Cash', 'Transfer'), allowNull: false },
    PaymentDateTime: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    IsPretend: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
  }, { tableName: 'Payments', timestamps: false });
};
