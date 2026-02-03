const {Contact, Connection} = require('../models');
// const Helpers = require('../utils/Helpers');

async function findOrCreateContact(connection_id, number, username) {
	// const number = Helpers.extractPhoneFromJid(phone_from_jid);
	if (!number) {
		throw new Error('ContactService.findOrCreateContact: numberOrJid inválido');
	}

	const connection = await Connection.findByPk(connection_id, {attributes: ['agency_id']});
	const agency_id = connection?.agency_id ?? null;

	try {
		const [contact, created] = await Contact.findOrCreate({
			where: {connection_id, number},
			defaults: {
				connection_id,
				agency_id,
				number,
				name: username,
			},
		});
		return {contact, created};
	} catch (err) {
		// Condición de carrera: otro proceso creó el contacto entre find y create
		if (err.name === 'SequelizeUniqueConstraintError') {
			const contact = await Contact.findOne({
				where: {connection_id, number},
			});
			if (contact) return {contact, created: false};
		}
		throw err;
	}
}

module.exports = {
	findOrCreateContact,
};
