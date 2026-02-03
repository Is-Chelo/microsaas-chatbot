'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('bot_nodes', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
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

			key: {
				type: Sequelize.TEXT,
			},

			message: {
				type: Sequelize.TEXT,
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
		await queryInterface.dropTable('bot_nodes');
	},
};
