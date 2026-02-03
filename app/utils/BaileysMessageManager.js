const Helpers = require('../utils/Helpers');
const {findOrCreateContact} = require('../services/ContactService');
const {getActiveBotByConnectionId} = require('../services/BotService');
const {getOrCreateContextByNumber} = require('../services/BotConversationService');
const {buildMessage} = require('../services/BotNodeOptionService');

/**
 * Procesa un mensaje entrante. Las dependencias (sendMessage, etc.) se inyectan
 * para evitar dependencias circulares entre módulos.
 * @param {string} connectionId
 * @param {object} message - { remoteJid, fromMe, text, ... }
 * @param {object} deps - { sendMessage(connectionId, remoteJid, content) }
 */
async function handleIncomingMessage(connectionId, message, deps = {}) {
	const {sendMessage} = deps;
	console.log(`[BOT:${connectionId}] Mensaje recibido:`, message);

	const {remoteJid, text = ''} = message;
	if (!remoteJid || !sendMessage) return;

	try {
		const number = Helpers.extractPhoneFromJid(remoteJid); // saneados el numero

		// TODO: Obtenemos el bot activo
		const bot = await getActiveBotByConnectionId(connectionId);
		if (!bot) return;

		const {contact} = await findOrCreateContact(connectionId, number, message.pushName);

		// Contexto por número de teléfono para evitar varios contextos para el mismo usuario (varios contact_id)
		let context = await getOrCreateContextByNumber(connectionId, bot.id, number, contact.id);

		// Si no hay contexto válido, no responder (o responder con mensaje de inicio)
		if (!context) {
			await sendMessage(connectionId, remoteJid, {
				text: bot.welcome_message || 'Hola, ¿en qué puedo ayudarte?',
			});
			return;
		}

		// TODO: Enviar mensaje según el nodo actual del contexto
		const message_to_send = await buildMessage(context.currentNode, text, number, contact.id);
		if (message_to_send == null) return;
		await sendMessage(connectionId, remoteJid, {text: message_to_send});

	} catch (err) {
		console.error(`[BOT:${connectionId}] Error al enviar respuesta:`, err);
		return;
	}
}

module.exports = {handleIncomingMessage};
