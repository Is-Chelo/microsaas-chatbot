'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('bot_node_options', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			bot_node_id: {
				type: Sequelize.INTEGER,
				references: {
					model: 'bot_nodes',
					key: 'id',
				},
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			},

			option_key: {
				type: Sequelize.TEXT,
			},

			label: {
				type: Sequelize.TEXT,
			},

			next_node_id: {
				type: Sequelize.INTEGER,
				references: {
					model: 'bot_nodes',
					key: 'id',
				},
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			},

			action_id: {
				type: Sequelize.INTEGER,
				references: {
					model: 'bot_actions',
					key: 'id',
				},
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			},

			order_index: {
				type: Sequelize.INTEGER,
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
		await queryInterface.dropTable('bot_node_options');
	},
};
