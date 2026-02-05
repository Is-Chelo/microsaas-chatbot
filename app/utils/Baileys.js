const {isContactBlacklisted} = require('../services/BlackListContactService');
const {handleIncomingMessage} = require('./BaileysMessageManager');
const {sendMessage} = require('./ConnectionManager');
const Helpers = require('./Helpers');

let connectionContexts = {};
let baileysPromise;
async function getBaileys() {
	if (!baileysPromise) {
		baileysPromise = import('baileys');
	}
	return baileysPromise;
}

function getUserContextForConnection(connectionId) {
	if (!connectionContexts[connectionId]) {
		connectionContexts[connectionId] = {};
	}
	return connectionContexts[connectionId];
}

async function connectToWhatsappForConnection({
	connectionId,
	onQr,
	onRawEvent,
	onConnectionUpdate,
}) {
	if (!connectionId) {
		throw new Error('connectionId is required to create a WhatsApp connection');
	}

	const {default: makeWASocket, useMultiFileAuthState, DisconnectReason} = await getBaileys();

	const authDir = `auth/auth_info_baileys_${connectionId}`;

	// const userContext = getUserContextForConnection(connectionId);

	// TODO: HACEMOS LA CONNECION
	const {state, saveCreds} = await useMultiFileAuthState(authDir);
	const sock = makeWASocket({
		auth: state,
	});
	sock.ev.on('creds.update', saveCreds);

	// TODO: CONEXION...
	sock.ev.on('connection.update', async (update) => {
		const {connection, lastDisconnect, qr} = update;

		if (onConnectionUpdate) {
			try {
				onConnectionUpdate(update, {connectionId});
			} catch (e) {
				console.error(`[BOT:${connectionId}] Error in onConnectionUpdate handler:`, e);
			}
		}

		if (connection === 'close') {
			if (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
				console.log(`[BOT:${connectionId}] Conexión cerrada, intentando reconectar...`);
				connectToWhatsappForConnection({
					connectionId,
					onQr,
					onRawEvent,
					onConnectionUpdate,
				});
			} else {
				console.log(`[BOT:${connectionId}] Sesión cerrada definitivamente (logged out).`);
			}
		} else if (connection === 'open') {
			console.log(`[BOT:${connectionId}] Conexión abierta con WhatsApp`);
		}

		if (qr) {
			if (onQr) {
				onQr(qr, {connectionId});
			} else {
				// Fallback: mostrar en consola
				console.log(`[BOT:${connectionId}] Escanea este QR para conectar la sesión:`);
				// console.log(await QRCode.toString(qr, {type: 'terminal', small: true}));
			}
		}
	});

	// TODO:Recibir mensajes (solo receive, sin enviar)
	sock.ev.on('messages.upsert', async (event) => {
		// console.log(JSON.stringify(event, undefined, 2));

		for (const m of event.messages) {
			const remoteJid = m.key.remoteJid;
			const remoteJidAlt = m.key.remoteJidAlt || remoteJid || '';
			const fromMe = m.key.fromMe || false;
			const messageId = m.key.id;

			// TODO: Verificamos si esta en la blacklist De momento por conection
			const phone_from_jid = Helpers.extractPhoneFromJid(remoteJid);
			const blacklisted = await isContactBlacklisted(connectionId, phone_from_jid);
			if (blacklisted) return true;

			// TODO: Validar si el mensaje es de un grupo o de un contacto normal
			if (
				remoteJidAlt == '' ||
				event.type != 'notify' || //Cualquier evento que no sea notify (solo se aceptan notificaciones normales de mensajes)
				m.key.fromMe || //Si el mensaje es propio, no se procesa
				remoteJidAlt.includes('@g.us') || //Si el mensaje es de un grupo, no se procesa
				remoteJid.includes('@g.us') || //Si el mensaje es de un grupo, no se procesa
				remoteJidAlt.includes('@broadcast') || //Si el mensaje es de un broadcast, no se procesa
				remoteJid.includes('@broadcast') //Si el mensaje es de un broadcast, no se procesa
			) {
				return true;
			}

			// Obtener texto del mensaje (varios formatos de Baileys)
			const text =
				m.message?.conversation ||
				m.message?.extendedTextMessage?.text ||
				m.message?.imageMessage?.caption ||
				m.message?.videoMessage?.caption ||
				'';

			const messageData = {
				connectionId: connectionId,
				remoteJid,
				remoteJidAlt,
				fromMe,
				messageId,
				text,
				eventType: event.type,
				message: m.message, // objeto completo por si necesitas imagen, audio, etc.
				pushName: m.pushName || null,
			};

			try {
				handleIncomingMessage(connectionId, messageData, {sendMessage, sock});
			} catch (err) {
				console.error(`[BOT:${connectionId}] Error en handleIncomingMessage:`, err);
			}
		}
	});

	return sock;
}

module.exports = {
	connectToWhatsappForConnection,
};
