'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('bots', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			agency_id: {
				type: Sequelize.INTEGER,
				references: {
					model: 'agencies',
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

			trigger_word: {
				type: Sequelize.STRING,
			},

			active: {
				type: Sequelize.BOOLEAN,
			},

			welcome_message: {
				type: Sequelize.TEXT,
			},

			flow: {
				type: Sequelize.JSON,
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
		await queryInterface.dropTable('bots');
	},
};
