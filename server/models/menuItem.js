module.exports = (sequelize, DataTypes) => {
  return sequelize.define('MenuItem', {
    MenuItemID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ItemName: { type: DataTypes.STRING, allowNull: false },
    ItemType: { type: DataTypes.ENUM('Food', 'Drink'), allowNull: false },
    Price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    AvgWaitingTime: { type: DataTypes.INTEGER, allowNull: false }
  }, { tableName: 'MenuItems', timestamps: false });
};
