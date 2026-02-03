'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Agency extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			this.hasMany(models.Connection, {foreignKey: 'agency_id'});
			this.hasMany(models.Contact, {foreignKey: 'agency_id'});
			this.hasMany(models.Bot, {foreignKey: 'agency_id'});
			this.hasMany(models.BlackListContact, {foreignKey: 'agency_id'});
		}
	}
	Agency.init(
		{
			name: DataTypes.STRING,
			status: DataTypes.ENUM('active', 'inactive'),
			company_id: DataTypes.STRING,
			connection_limit: DataTypes.INTEGER,
			created_at: DataTypes.DATE,
			updated_at: DataTypes.DATE,
		},
		{
			sequelize,
			modelName: 'Agency',
			tableName: 'agencies',
			underscored: true,
		}
	);
	return Agency;
};
