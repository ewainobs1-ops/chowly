module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Restaurant', {
    RestaurantID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    RestaurantName: { type: DataTypes.STRING, allowNull: false },
    Location: { type: DataTypes.STRING, allowNull: false },
    ContactNumber: { type: DataTypes.STRING, allowNull: true }
  }, { tableName: 'Restaurants', timestamps: false });
};
