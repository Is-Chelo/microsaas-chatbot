'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addIndex('contacts', ['connection_id', 'number'], {
			unique: true,
			name: 'contacts_connection_id_number_unique',
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.removeIndex('contacts', 'contacts_connection_id_number_unique');
	},
};
