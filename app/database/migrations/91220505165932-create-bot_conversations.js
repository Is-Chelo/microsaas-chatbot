'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('bot_conversations', {
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
			contact_id: {
				type: Sequelize.INTEGER,
				references: {
					model: 'contacts',
					key: 'id',
				},
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			},
			connection_id: {
				type: Sequelize.INTEGER,
				references: {
					model: 'connections',
					key: 'id',
				},
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			},
			current_node_id: {
				type: Sequelize.INTEGER,
				// references: {
				// 	model: 'BotNode',
				// 	key: 'id',
				// },
				// onDelete: 'CASCADE',
				// onUpdate: 'CASCADE',
			},
			current_flow_key: {
				type: Sequelize.STRING,
			},

			is_active: {
				type: Sequelize.BOOLEAN,
			},

			last_interaction_at: {
				type: Sequelize.DATE,
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
		await queryInterface.dropTable('bot_conversations');
	},
};
