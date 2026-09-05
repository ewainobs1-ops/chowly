module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Bartender', {
    BartenderID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    BartenderName: { type: DataTypes.STRING, allowNull: false },
    ContactNumber: { type: DataTypes.STRING, allowNull: true }
  }, { tableName: 'Bartenders', timestamps: false });
};
