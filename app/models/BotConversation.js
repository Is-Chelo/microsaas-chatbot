'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class BotConversation extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			this.belongsTo(models.Bot, {foreignKey: 'bot_id'});
			this.belongsTo(models.Contact, {foreignKey: 'contact_id'});
			this.belongsTo(models.Connection, {foreignKey: 'connection_id'});
			this.belongsTo(models.BotNode, {foreignKey: 'current_node_id', as: 'CurrentNode'});
			this.hasMany(models.BotMessage, {foreignKey: 'bot_conversation_id'});
		}
	}
	BotConversation.init(
		{
			bot_id: DataTypes.INTEGER,
			contact_id: DataTypes.INTEGER,
			connection_id: DataTypes.INTEGER,
			current_node_id: DataTypes.INTEGER,
			current_flow_key: DataTypes.STRING,
			is_active: DataTypes.BOOLEAN,
			last_interaction_at: DataTypes.DATE,
			created_at: DataTypes.DATE,
			updated_at: DataTypes.DATE,
		},
		{
			sequelize,
			modelName: 'BotConversation',
			tableName: 'bot_conversations',
			underscored: true,
		}
	);
	return BotConversation;
};
