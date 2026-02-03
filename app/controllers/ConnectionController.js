const {Connection} = require('../models/index');
const ApiResponse = require('../utils/ApiResponse');
const {
	getQrForConnection,
	getConnectionStatus,
	ensureConnection,
} = require('../utils/ConnectionManager');
const QRCode = require('qrcode');

module.exports = {
	async getQrByConnetion(req, res) {
		try {
			const connection_id = req.params.connection_id;

			const connection = await Connection.findOne({
				where: {id: connection_id},
			});

			if (connection == null)
				return ApiResponse.error(res, 'No existe el identificador', [
					'no existe el identificador',
				]);

			await ensureConnection(connection_id);  // TODO: FUNCION QUE HACE TODO EL PROCESO DE CONEXION


			const status = getConnectionStatus(connection_id);
			if (status === 'open') {
				return ApiResponse.success(res, 'Ya conectado con WhatsApp', {
					connection_id,
					qr_image: null,
					connected: true,
				});
			}

			const qr = await getQrForConnection(connection_id, 30000);
			const connected = qr === null || getConnectionStatus(connection_id) === 'open';

			if (connected) {
				return ApiResponse.success(res, 'Ya conectado con WhatsApp', {
					connection_id,
					qr_image: null,
					connected: true,
				});
			}

			const qr_image = await QRCode.toDataURL(qr, {
				errorCorrectionLevel: 'H',
				type: 'image/png',
				width: 300,
				margin: 2,
			});

			return ApiResponse.success(res, 'QR generado correctamente', {
				connection_id,
				qr_image,
				connected: false,
			});
		} catch (e) {
			console.error('[getQrByConnection]', e);
			return ApiResponse.error(
				res,
				e.message || 'Error al obtener QR',
				[e.message],
				null,
				null,
				500
			);
		}
	},
};
