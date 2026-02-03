'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('bot_messages', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			bot_conversation_id: {
				type: Sequelize.INTEGER,
				references: {
					model: 'bot_conversations',
					key: 'id',
				},
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			},

			direction: {
				type: Sequelize.ENUM,
				values: ['input', 'output'],
			},

			message: {
				type: Sequelize.TEXT,
			},

			payload: {
				type: Sequelize.JSON,
			},
			source: {
				type: Sequelize.ENUM,
				values: ['user', 'bot', 'ia'],
			},
			type_message: {
				type: Sequelize.ENUM,
				values: ['text', 'image', 'audio', 'video', 'file','location'],
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
		await queryInterface.dropTable('bot_messages');
	},
};
