'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class BotMessage extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			this.belongsTo(models.BotConversation, {foreignKey: 'bot_conversation_id'});
		}
	}
	BotMessage.init(
		{
			bot_conversation_id: DataTypes.INTEGER,
			direction: DataTypes.ENUM('input', 'output'),
			message: DataTypes.TEXT,
			payload: DataTypes.JSON,
			source: DataTypes.ENUM('user', 'bot', 'ia'),
			type_message: DataTypes.ENUM('text', 'image', 'audio', 'video', 'file', 'location'),
			created_at: DataTypes.DATE,
			updated_at: DataTypes.DATE,
		},
		{
			sequelize,
			modelName: 'BotMessage',
			tableName: 'bot_messages',
			underscored: true,
		}
	);
	return BotMessage;
};
