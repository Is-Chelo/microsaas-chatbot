const {BlackListContact} = require('../models');
const {Op} = require('sequelize');

/**
 * Verifica si un contacto está en la blacklist para la conexión dada.
 */
async function isContactBlacklisted(connection_id, phone_from_jid) {
	if (!phone_from_jid) return true;

	const blacklisted = await BlackListContact.findOne({
		where: {
			connection_id: connection_id,
			[Op.or]: [{number: phone_from_jid}, {number: phone_from_jid.replace(/^0+/, '')}],
		},
	});
	if (blacklisted) {
		console.log(
			`[BOT:${connection_id}] Contacto ${phone_from_jid} en blacklist, no se envía respuesta`
		);
		return true;
	}

	return false;
}

module.exports = {
	isContactBlacklisted,
};
