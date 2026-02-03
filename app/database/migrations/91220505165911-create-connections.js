'use strict';
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('connections', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			name: {
				type: Sequelize.STRING,
			},
			// welcome_message: {
			// 	type: Sequelize.STRING,
			// },
			cellphone: {
				type: Sequelize.STRING,
			},
			status: {
				type: Sequelize.STRING,
			},
			type: {
				type: Sequelize.STRING,
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

			baileys_qr_code: {
				type: Sequelize.STRING,
			},
			baileys_auth: {
				type: Sequelize.STRING,
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
		await queryInterface.dropTable('connections');
	},
};
