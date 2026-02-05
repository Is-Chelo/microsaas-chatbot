// Baileys se requiere aquí de forma perezosa para evitar dependencia circular
// ConnectionManager → Baileys → BaileysMessageManager → (no ConnectionManager)
function getConnectToWhatsapp() {
	const {connectToWhatsappForConnection} = require('./Baileys');
	return connectToWhatsappForConnection;
}

// Socket por conexión (en memoria)
const socketsByConnectionId = {};

// Último QR emitido por conexión
const lastQrByConnectionId = {};

// Promesas pendientes de QR por conexión
const pendingQrResolversByConnectionId = {};

// Handler global para mensajes entrantes normalizados
// let globalOnMessageHandler = null;

// Valores típicos: 'connecting' | 'open' | 'close' | 'unknown'
const connectionStatusByConnectionId = {};

function getPendingList(connectionId) {
	if (!pendingQrResolversByConnectionId[connectionId]) {
		pendingQrResolversByConnectionId[connectionId] = [];
	}
	return pendingQrResolversByConnectionId[connectionId];
}

function setLastQr(connectionId, qr) {
	lastQrByConnectionId[connectionId] = qr;
	const pendingList = getPendingList(connectionId);
	while (pendingList.length) {
		const resolve = pendingList.shift();
		resolve(qr);
	}
}

function setConnectionStatus(connectionId, status) {
	connectionStatusByConnectionId[connectionId] = status || 'unknown';
	if (status === 'open') {
		// Una vez conectado, ya no tiene sentido servir un QR anterior
		delete lastQrByConnectionId[connectionId];
		// Resolver esperas de QR con null = "ya conectado, no hay QR"
		const pendingList = getPendingList(connectionId);
		while (pendingList.length) {
			const resolve = pendingList.shift();
			resolve(null);
		}
	}
}

function getConnectionStatus(connectionId) {
	return connectionStatusByConnectionId[connectionId] || 'unknown';
}

async function ensureConnection(connectionId) {
	if (socketsByConnectionId[connectionId]) {
		return socketsByConnectionId[connectionId];
	}

	const connectToWhatsappForConnection = getConnectToWhatsapp();
	const sockPromise = connectToWhatsappForConnection({
		connectionId,
		onQr: (qr) => {
			setLastQr(connectionId, qr);
		},
		onConnectionUpdate: (update) => {
			const status = update?.connection;
			if (status) {
				setConnectionStatus(connectionId, status);
			}
		},
	});

	socketsByConnectionId[connectionId] = await sockPromise;
	return socketsByConnectionId[connectionId];
}

/**
 * Devuelve el QR actual o espera a que se genere uno nuevo.
 * @param {string} connectionId
 * @param {number} timeoutMs
 * @returns {Promise<string>}
 */
async function getQrForConnection(connectionId, timeoutMs = 30000) {
	// Asegurar conexión iniciada
	await ensureConnection(connectionId);

	// Si ya hay un QR conocido, devolverlo inmediatamente
	if (lastQrByConnectionId[connectionId]) {
		return lastQrByConnectionId[connectionId];
	}

	// Esperar a que llegue un nuevo QR
	return new Promise((resolve, reject) => {
		const pendingList = getPendingList(connectionId);
		pendingList.push(resolve);

		const timer = setTimeout(() => {
			const idx = pendingList.indexOf(resolve);
			if (idx !== -1) {
				pendingList.splice(idx, 1);
			}
			reject(new Error(`Timeout waiting for QR for connection ${connectionId}`));
		}, timeoutMs);

		// Envolver resolve para limpiar el timeout
		const originalResolve = resolve;
		pendingList[pendingList.length - 1] = (qr) => {
			clearTimeout(timer);
			originalResolve(qr);
		};
	});
}

/**
 * Permite registrar un callback global para mensajes entrantes normalizados.
 * Este callback puede, por ejemplo, llamar a un caso de uso o a un endpoint interno.
 */
function setOnIncomingMessage(handler) {
	globalOnMessageHandler = handler;
}

/**
 * Enviar un mensaje usando una conexión específica.
 * `content` es el payload que espera Baileys, por ejemplo:
 *   { text: 'Hola' }
 *   { image: { url: '...' }, caption: '...' }
 *   { document: { url: '...' }, fileName: '...', caption: '...' }
 */
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const randomDelay = (minMs, maxMs) => delay(minMs + Math.random() * (maxMs - minMs));

async function sendMessage(connectionId, remoteJid, content) {
	console.log('SEND MENSAJE');
	console.log({connectionId, remoteJid, content});
	const sock = await ensureConnection(connectionId);

	// Retardo aleatorio 1-3 segundos para parecer más humano y reducir detección por Meta
	await randomDelay(1000, 3000);
	await sock.sendPresenceUpdate('composing', remoteJid); //Envía el estado “composing” → el contacto ve “escribiendo…” (o “typing…”)
	// Duración aleatoria de "escribiendo..." (1-4 seg) para variar el patrón
	await randomDelay(1000, 4000);
	await sock.sendPresenceUpdate('paused', remoteJid); //Envía el estado “paused” → el contacto ve “escribiendo…” (o “typing…”)

	return sock.sendMessage(remoteJid, content);
}

module.exports = {
	ensureConnection,
	getQrForConnection,
	setOnIncomingMessage,
	sendMessage,
	getConnectionStatus,
};
