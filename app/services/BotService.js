const {Bot, Agency, Connection, BotConversation, Contact} = require('../models');
const {Op} = require('sequelize');

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

async function buildMessageFromJson(bot, contact, connection_id, text, number) {
	text = String(text).trim().toUpperCase();

	const bot_conversation = await BotConversation.findOne({
		where: {
			connection_id,
			bot_id: bot.id,
			contact_id: contact.id,
			is_active: true,
		},
	});

	// ============================
	// NUEVA CONVERSACIÓN
	// ============================
	if (!bot_conversation) {
		await BotConversation.create({
			contact_id: contact.id,
			bot_id: bot.id,
			connection_id,
			current_flow_key: 'main',
			is_active: true,
			last_interaction_at: new Date(),
		});

		return sendOptionByKey(bot.flow, 'main');
	}

	// ============================
	// CONVERSACIÓN EXISTENTE
	// ============================
	let current_flow_key = bot_conversation.current_flow_key;
	if (current_flow_key == null) {
		await bot_conversation.update({
			current_flow_key: 'main',
		});
		current_flow_key = 'main';
	}

	const menu = bot.flow[current_flow_key];
	if (!menu) return 'Opcion inválida.';
	// ===

	const selected_option = menu.options[text];
	if (!selected_option) return sendOptionByKey(bot.flow, current_flow_key); // si no existe la opcion se envia de nuevo el flujo


	// ============================
	// RESPUESTA DIRECTA
	// ============================
	if (selected_option.response) {
		await bot_conversation.update({
			last_interaction_at: new Date(),
		});

		return selected_option.response.msg;
	}

	// ============================
	// SUBMENU
	// ============================
	if (selected_option.submenu) {
		await bot_conversation.update({
			current_flow_key: selected_option.submenu,
			last_interaction_at: new Date(),
		});

		return sendOptionByKey(bot.flow, selected_option.submenu);
	}
}

async function sendOptionByKey(bot_flow, menu_key) {
	const menu = bot_flow[menu_key];

	if (!menu) return '⚠ Menú no encontrado';

	const optionText = Object.entries(menu.options)
		.map(([key, option]) => `👉 *${key}*: ${option.text}`)
		.join('\n');

	return `${menu.message}\n\n${optionText}\n\n> *Indícanos qué opción te interesa conocer!*`;
}

module.exports = {
	getActiveBotByConnectionId,
	buildMessageFromJson,
};



