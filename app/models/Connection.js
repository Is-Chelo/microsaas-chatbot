'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Connection extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			this.belongsTo(models.Agency, {foreignKey: 'agency_id'});
			this.hasMany(models.Contact, {foreignKey: 'connection_id'});
			this.hasMany(models.Bot, {foreignKey: 'connection_id'});
			this.hasMany(models.BotConversation, {foreignKey: 'connection_id'});
			this.hasMany(models.BlackListContact, {foreignKey: 'connection_id'});
		}
	}
	Connection.init(
		{
			name: DataTypes.STRING,
			// welcome_message: DataTypes.STRING,
			cellphone: DataTypes.STRING,
			status: DataTypes.STRING,
			type: DataTypes.STRING,
			agency_id: DataTypes.INTEGER,
			baileys_qr_code: DataTypes.STRING,
			baileys_auth: DataTypes.STRING,
			created_at: DataTypes.DATE,
			updated_at: DataTypes.DATE,
		},
		{
			sequelize,
			modelName: 'Connection',
			tableName: 'connections',
			underscored: true, // Usa created_at y updated_at en lugar de createdAt y updatedAt
		}
	);
	return Connection;
};
