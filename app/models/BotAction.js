'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class BotAction extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			this.belongsTo(models.Bot, {foreignKey: 'bot_id'});
			this.hasMany(models.BotNodeOption, {foreignKey: 'action_id'});
		}
	}
	BotAction.init(
		{
			type: DataTypes.ENUM('text', 'image', 'audio', 'video', 'file', 'location'),
			payload: DataTypes.JSON,
			bot_id: DataTypes.INTEGER,
			created_at: DataTypes.DATE,
			updated_at: DataTypes.DATE,
		},
		{
			sequelize,
			modelName: 'BotAction',
			tableName: 'bot_actions',
			underscored: true,
		}
	);
	return BotAction;
};
