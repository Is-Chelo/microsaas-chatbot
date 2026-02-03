'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('bot_actions', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			type: {
				type: Sequelize.ENUM,
				values: ['text', 'image', 'audio', 'video', 'file', 'location'],
			},

			payload: {
				type: Sequelize.JSON,
			},

			bot_id: {
				type: Sequelize.INTEGER,
				references: {
					model: 'bots',
					key: 'id',
				},
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			},

			created_at: {
				allowNull: false,
				type: Sequelize.DATE,
			},

			updated_at: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('bot_actions');
	},
};
