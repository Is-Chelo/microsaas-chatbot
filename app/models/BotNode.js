'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class BotNode extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			this.belongsTo(models.Bot, {foreignKey: 'bot_id'});
			this.hasMany(models.BotNodeOption, {foreignKey: 'bot_node_id'});
			this.hasMany(models.BotNodeOption, {foreignKey: 'next_node_id', as: 'NextNodeOptions'});
			this.hasMany(models.BotConversation, {foreignKey: 'current_node_id'});
		}
	}
	BotNode.init(
		{
			bot_id: DataTypes.INTEGER,
			key: DataTypes.TEXT,
			message: DataTypes.TEXT,
			created_at: DataTypes.DATE,
			updated_at: DataTypes.DATE,
		},
		{
			sequelize,
			modelName: 'BotNode',
			tableName: 'bot_nodes',
			underscored: true,
		}
	);
	return BotNode;
};
