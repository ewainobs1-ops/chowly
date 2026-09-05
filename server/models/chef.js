module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Chef', {
    ChefID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ChefName: { type: DataTypes.STRING, allowNull: false },
    Specialty: { type: DataTypes.STRING, allowNull: true }
  }, { tableName: 'Chefs', timestamps: false });
};
