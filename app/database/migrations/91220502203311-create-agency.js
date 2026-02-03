'use strict';
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('agencies', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			
			name: {
				type: Sequelize.STRING,
			},
			
			status: {
				type: Sequelize.ENUM,
				values: ['active', 'inactive'],
			},

			company_id: {
				type: Sequelize.STRING,
			},

			connection_limit: {
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
		await queryInterface.dropTable('agencies');
	},
};
