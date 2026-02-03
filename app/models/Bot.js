'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Bot extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			this.belongsTo(models.Agency, {foreignKey: 'agency_id'});
			this.belongsTo(models.Connection, {foreignKey: 'connection_id'});
			this.hasMany(models.BotConversation, {foreignKey: 'bot_id'});
			this.hasMany(models.BotNode, {foreignKey: 'bot_id'});
			this.hasMany(models.BotAction, {foreignKey: 'bot_id'});
		}
	}
	Bot.init(
		{
			agency_id: DataTypes.INTEGER,
			connection_id: DataTypes.INTEGER,
			trigger_word: DataTypes.STRING,
			active: DataTypes.BOOLEAN,
			welcome_message: DataTypes.TEXT,
			created_at: DataTypes.DATE,
			updated_at: DataTypes.DATE,
		},
		{
			sequelize,
			modelName: 'Bot',
			tableName: 'bots',
			underscored: true,
		}
	);
	return Bot;
};
