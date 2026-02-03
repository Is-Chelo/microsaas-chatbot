'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Contact extends Model {
		static associate(models) {
			this.belongsTo(models.Agency, {foreignKey: 'agency_id'});
			this.belongsTo(models.Connection, {foreignKey: 'connection_id'});
			this.hasMany(models.BotConversation, {foreignKey: 'contact_id'});
		}
	}
	Contact.init(
		{
			name: DataTypes.STRING,
			number: DataTypes.STRING,
			connection_id: DataTypes.INTEGER,
			agency_id: DataTypes.INTEGER,
			created_at: DataTypes.DATE,
			updated_at: DataTypes.DATE,
		},
		{
			sequelize,
			modelName: 'Contact',
			tableName: 'contacts',
			underscored: true,
		}
	);
	return Contact;
};
