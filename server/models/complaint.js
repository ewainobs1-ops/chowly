module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Complaint', {
    ComplaintID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ComplaintDescription: { type: DataTypes.TEXT, allowNull: false },
    Rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
    ComplaintDateTime: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  }, { tableName: 'Complaints', timestamps: false });
};
