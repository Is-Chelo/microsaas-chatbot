'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class BlackListContact extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			this.belongsTo(models.Agency, {foreignKey: 'agency_id'});
			this.belongsTo(models.Connection, {foreignKey: 'connection_id'});
		}
	}
	BlackListContact.init(
		{
			name: DataTypes.STRING,
			number: DataTypes.STRING,
			agency_id: DataTypes.INTEGER,
			connection_id: DataTypes.INTEGER,
			created_at: DataTypes.DATE,
			updated_at: DataTypes.DATE,
		},
		{
			sequelize,
			modelName: 'BlackListContact',
			tableName: 'backlist_contacts',
			underscored: true,
		}
	);
	return BlackListContact;
};
