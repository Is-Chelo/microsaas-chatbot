'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class BotNodeOption extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			this.belongsTo(models.BotNode, {foreignKey: 'bot_node_id'});
			this.belongsTo(models.BotNode, {foreignKey: 'next_node_id', as: 'NextNode'});
			this.belongsTo(models.BotAction, {foreignKey: 'action_id'});
		}
	}
	BotNodeOption.init(
		{
			bot_node_id: DataTypes.INTEGER,
			option_key: DataTypes.TEXT,
			label: DataTypes.TEXT,
			next_node_id: DataTypes.INTEGER,
			action_id: DataTypes.INTEGER,
			order_index: DataTypes.INTEGER,
			created_at: DataTypes.DATE,
			updated_at: DataTypes.DATE,
		},
		{
			sequelize,
			modelName: 'BotNodeOption',
			tableName: 'bot_node_options',
			underscored: true,
		}
	);
	return BotNodeOption;
};
