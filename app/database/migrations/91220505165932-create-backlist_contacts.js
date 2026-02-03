'use strict';
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('backlist_contacts', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			name: {
				type: Sequelize.STRING,
			},
			number: {
				type: Sequelize.STRING,
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
			agency_id: {
				type: Sequelize.INTEGER,
				references: {
					model: 'agencies',
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
		await queryInterface.dropTable('backlist_contacts');
	},
};
