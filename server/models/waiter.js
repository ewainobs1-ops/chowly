module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Waiter', {
    WaiterID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    WaiterName: { type: DataTypes.STRING, allowNull: false },
    ContactNumber: { type: DataTypes.STRING, allowNull: true }
  }, { tableName: 'Waiters', timestamps: false });
};
