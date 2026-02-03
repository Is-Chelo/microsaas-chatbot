class Helpers {
	/**
	 * Extrae el número de teléfono (solo dígitos) desde un remoteJid de WhatsApp.
	 * Ej: "521234567890@s.whatsapp.net" -> "521234567890"
	 */
	static extractPhoneFromJid(remoteJid) {
		if (!remoteJid) return '';
		const beforeAt = String(remoteJid).split('@')[0] || '';
		return beforeAt.replace(/\D/g, '');
	}
}
module.exports = Helpers;
