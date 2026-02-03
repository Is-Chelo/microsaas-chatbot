const {Bot, Agency, Connection, BotConversation} = require('../models');

/**
 * Obtiene el bot activo para una conexión específica con sus relaciones.
 * @param {number} connection_id - ID de la conexión
 * @returns {Promise<Bot|null>} Bot activo con sus relaciones o null si no existe
 */
async function getActiveBotByConnectionId(connection_id) {
	if (!connection_id) {
		throw new Error('BotService.getActiveBotByConnectionId: connection_id es requerido');
	}

	const bot = await Bot.findOne({
		where: {
			connection_id,
			active: true,
		},
		include: [
			{
				model: Agency,
				attributes: ['id', 'name', 'created_at', 'updated_at'],
			},
			{
				model: Connection,
				attributes: ['id', 'name', 'cellphone', 'status', 'type', 'agency_id'],
			},
		],
	});

	return bot;
}

module.exports = {
	getActiveBotByConnectionId,
};
