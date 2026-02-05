const Helpers = require('../utils/Helpers');
const {findOrCreateContact} = require('../services/ContactService');
const {getActiveBotByConnectionId, buildMessageFromJson} = require('../services/BotService');
const {getOrCreateContextByNumber} = require('../services/BotConversationService');
const {buildMessage} = require('../services/BotNodeOptionService');
const {ensureConnection} = require('./ConnectionManager');

/**
 * Procesa un mensaje entrante. Las dependencias (sendMessage, etc.) se inyectan
 * para evitar dependencias circulares entre módulos.
 * @param {string} connectionId
 * @param {object} message - { remoteJid, fromMe, text, ... }
 * @param {object} deps - { sendMessage(connectionId, remoteJid, content) }
 */
async function handleIncomingMessage(connectionId, message, deps = {}) {
	const {sendMessage, sock} = deps;
	console.log(`[BOT:${connectionId}] Mensaje recibido:`, message);

	const {remoteJidAlt, remoteJid, text = ''} = message;
	if (!remoteJidAlt || !sendMessage) return;

	try {
		const number = Helpers.extractPhoneFromJid(remoteJidAlt); // saneados el numero

		// TODO: Obtenemos el bot activo
		const bot = await getActiveBotByConnectionId(connectionId);
		if (!bot) return;

		const {contact} = await findOrCreateContact(connectionId, number, message.pushName);

		/* FUNCIONA CON ESTRUCTURA DE DB
		// // Contexto por número de teléfono para evitar varios contextos para el mismo usuario (varios contact_id)
		// let context = await getOrCreateContextByNumber(connectionId, bot.id, number, contact.id);

		// // Si no hay contexto válido, no responder (o responder con mensaje de inicio)
		// if (!context) {
		// 	await sendMessage(connectionId, number, {
		// 		text: bot.welcome_message || 'Hola, ¿en qué puedo ayudarte?',
		// 	});
		// 	return;
		// }

		// // TODO: Enviar mensaje según el nodo actual del contexto
		// const message_to_send = await buildMessage(context, text, number, contact.id);
		// if (message_to_send == null) return;
		// await sendMessage(connectionId, remoteJidAlt, {text: message_to_send});
		*/

		// FUNCIONA CON EL JSOOON
		console.log('PREPERAMOS EL MENSAJE');
		const message_to_send = await buildMessageFromJson(
			bot,
			contact,
			connectionId,
			text,
			number
		);
		if (message_to_send == null) return;

		const payload =
			typeof message_to_send === 'string' ? {text: message_to_send} : message_to_send;

		console.log('RESPUESTA payload ' + JSON.stringify(payload));
		// const sock = await ensureConnection(connectionId);
		// console.log(sock);

		// Retardo aleatorio 1-3 segundos para parecer más humano y reducir detección por Meta
		await randomDelay(1000, 2000);
		await sock.sendPresenceUpdate('composing', remoteJid); //Envía el estado “composing” → el contacto ve “escribiendo…” (o “typing…”)
		// Duración aleatoria de "escribiendo..." (1-4 seg) para variar el patrón
		await randomDelay(1000, 3000);
		await sock.sendPresenceUpdate('paused', remoteJid); //Envía el estado “paused” → el contacto ve “escribiendo…” (o “typing…”)

		await sock.sendMessage(remoteJid, payload);

		// await sendMessage(connectionId, remoteJid, payload);
	} catch (err) {
		console.error(`[BOT:${connectionId}] Error al enviar respuesta:`, err);
		return;
	}
}

module.exports = {handleIncomingMessage};
