const {Op} = require('sequelize');
const {BotConversation, Bot, BotNode, BotNodeOption, BotAction, Contact} = require('../models');

/**
 * Normaliza el número de teléfono para comparación (solo dígitos).
 * @param {string} number
 * @returns {string}
 */
function normalizeNumber(number) {
	if (!number) return '';
	return String(number).replace(/\D/g, '');
}

/**
 * Obtiene el contexto actual de la conversación del chatbot por número de teléfono.
 * Así se evita tener varios contextos para el mismo número cuando hay varios contact_id (mismo usuario).
 *
 * @param {number} connection_id - ID de la conexión
 * @param {number} bot_id - ID del bot
 * @param {string} number - Número de teléfono (se normaliza a solo dígitos)
 * @returns {Promise<Object|null>} Contexto con conversation, currentNode, contact; null si no existe conversación activa
 */
async function getContextByNumber(connection_id, bot_id, number) {
	if (!connection_id || !bot_id || !number) {
		throw new Error(
			'BotConversationService.getContextByNumber: connection_id, bot_id y number son requeridos'
		);
	}
	const normalized = normalizeNumber(number);
	if (!normalized) {
		throw new Error('BotConversationService.getContextByNumber: number inválido');
	}

	const contacts = await Contact.findAll({
		where: {connection_id, number: normalized},
		attributes: ['id'],
	});
	const contactIds = contacts.map((c) => c.id);
	if (contactIds.length === 0) return null;

	const conversation = await BotConversation.findOne({
		where: {
			bot_id,
			connection_id,
			contact_id: {[Op.in]: contactIds},
			is_active: true,
		},
		order: [['last_interaction_at', 'DESC']],
		include: [
			{
				model: BotNode,
				as: 'CurrentNode',
				attributes: ['id', 'key', 'message', 'bot_id'],
				include: [
					{
						model: BotNodeOption,
						attributes: [
							'id',
							'option_key',
							'label',
							'next_node_id',
							'action_id',
							'order_index',
						],
						include: [
							{
								model: BotAction,
								attributes: ['id', 'type', 'payload'],
							},
						],
					},
				],
			},
			{
				model: Contact,
				attributes: ['id', 'name', 'number', 'connection_id'],
			},
		],
	});

	if (!conversation) return null;

	return {
		conversation: {
			id: conversation.id,
			bot_id: conversation.bot_id,
			contact_id: conversation.contact_id,
			connection_id: conversation.connection_id,
			current_node_id: conversation.current_node_id,
			is_active: conversation.is_active,
			last_interaction_at: conversation.last_interaction_at,
		},
		currentNode: conversation.CurrentNode
			? {
					id: conversation.CurrentNode.id,
					key: conversation.CurrentNode.key,
					message: conversation.CurrentNode.message,
					options: conversation.CurrentNode.BotNodeOptions || [],
				}
			: null,
		contact: conversation.Contact,
	};
}

/**
 * Obtiene el contexto actual de la conversación del chatbot para un contacto (por contact_id).
 * Incluye la conversación activa, el nodo actual y sus opciones disponibles.
 *
 * @param {number} contact_id - ID del contacto
 * @param {number} bot_id - ID del bot
 * @param {number} connection_id - ID de la conexión (para distinguir entre varias conexiones con el mismo bot)
 * @returns {Promise<Object|null>} Contexto con conversation, currentNode, options; null si no existe conversación activa
 */
async function getContextByContact(contact_id, bot_id, connection_id) {
	if (!contact_id || !bot_id || !connection_id) {
		throw new Error(
			'BotConversationService.getContextByContact: contact_id, bot_id y connection_id son requeridos'
		);
	}

	const conversation = await BotConversation.findOne({
		where: {
			contact_id,
			bot_id,
			connection_id,
			is_active: true,
		},
		include: [
			{
				model: BotNode,
				as: 'CurrentNode',
				attributes: ['id', 'key', 'message', 'bot_id'],
				include: [
					{
						model: BotNodeOption,
						attributes: [
							'id',
							'option_key',
							'label',
							'next_node_id',
							'action_id',
							'order_index',
						],
						include: [
							{
								model: BotAction,
								attributes: ['id', 'type', 'payload'],
							},
						],
					},
				],
			},
			{
				model: Contact,
				attributes: ['id', 'name', 'number', 'connection_id'],
			},
		],
	});

	if (conversation == null) {
		return null;
	}

	return {
		conversation: {
			id: conversation.id,
			bot_id: conversation.bot_id,
			contact_id: conversation.contact_id,
			connection_id: conversation.connection_id,
			current_node_id: conversation.current_node_id,
			is_active: conversation.is_active,
			last_interaction_at: conversation.last_interaction_at,
		},
		currentNode: conversation.CurrentNode
			? {
					id: conversation.CurrentNode.id,
					key: conversation.CurrentNode.key,
					message: conversation.CurrentNode.message,
					options: conversation.CurrentNode.BotNodeOptions || [],
				}
			: null,
		contact: conversation.Contact,
	};
}

/**
 * Obtiene o crea el contexto de conversación por número de teléfono.
 * Si ya existe una conversación activa para ese número (aunque tenga otro contact_id), la reutiliza.
 * Evita múltiples contextos para el mismo usuario cuando hay varios registros de contacto.
 *
 * @param {number} connection_id - ID de la conexión
 * @param {number} bot_id - ID del bot
 * @param {string} number - Número de teléfono (se normaliza a solo dígitos)
 * @param {number} contact_id - ID del contacto a usar al crear una nueva conversación
 * @returns {Promise<Object>} Contexto con conversation, currentNode, contact
 */
async function getOrCreateContextByNumber(connection_id, bot_id, number, contact_id) {
	if (!connection_id || !bot_id || !number || !contact_id) {
		throw new Error(
			'BotConversationService.getOrCreateContextByNumber: connection_id, bot_id, number y contact_id son requeridos'
		);
	}
	const normalized = normalizeNumber(number);
	if (!normalized) {
		throw new Error('BotConversationService.getOrCreateContextByNumber: number inválido');
	}

	const existingContext = await getContextByNumber(connection_id, bot_id, number);
	if (existingContext) return existingContext;

	// Buscar el nodo inicial del bot
	const start_node = await BotNode.findOne({
		where: {bot_id, key: 'main'},
		attributes: ['id', 'key', 'message'],
	});

	if (!start_node) {
		throw new Error(
			`BotConversationService.getOrCreateContextByNumber: No se encontró nodo inicial (main) para el bot ${bot_id}`
		);
	}

	// Contactos con el mismo número en esta conexión (pueden existir varios contact_id)
	const contactsSameNumber = await Contact.findAll({
		where: {connection_id, number: normalized},
		attributes: ['id'],
	});
	const contactIds = contactsSameNumber.map((c) => c.id);

	// Desactivar conversaciones previas para este número (todos los contact_id que coincidan)
	if (contactIds.length > 0) {
		await BotConversation.update(
			{is_active: false},
			{
				where: {
					bot_id,
					connection_id,
					contact_id: {[Op.in]: contactIds},
				},
			}
		);
	}

	// Crear nueva conversación con el contact_id actual del mensaje
	await BotConversation.create({
		contact_id,
		bot_id,
		connection_id,
		current_node_id: start_node.id,
		is_active: true,
		last_interaction_at: new Date(),
	});

	return getContextByNumber(connection_id, bot_id, number);
}

/**
 * Obtiene o crea el contexto por contact_id (comportamiento anterior).
 * Preferir getOrCreateContextByNumber para evitar duplicados por mismo número.
 *
 * @param {number} contact_id - ID del contacto
 * @param {number} bot_id - ID del bot
 * @param {number} connection_id - ID de la conexión
 * @returns {Promise<Object>} Contexto con conversation, currentNode, options
 */
async function getOrCreateContext(contact_id, bot_id, connection_id) {
	if (!connection_id) {
		throw new Error('BotConversationService.getOrCreateContext: connection_id es requerido');
	}
	const existing_context = await getContextByContact(contact_id, bot_id, connection_id);
	if (existing_context) return existing_context;

	const start_node = await BotNode.findOne({
		where: {bot_id, key: 'main'},
		attributes: ['id', 'key', 'message'],
	});

	if (!start_node) {
		throw new Error(
			`BotConversationService.getOrCreateContext: No se encontró nodo inicial (main) para el bot ${bot_id}`
		);
	}

	await BotConversation.update({is_active: false}, {where: {contact_id, bot_id, connection_id}});

	await BotConversation.create({
		contact_id,
		bot_id,
		connection_id,
		current_node_id: start_node.id,
		is_active: true,
		last_interaction_at: new Date(),
	});

	return getContextByContact(contact_id, bot_id, connection_id);
}

/**
 * Verifica si existe un contexto activo para ese número en la conexión/bot.
 *
 * @param {number} connection_id - ID de la conexión
 * @param {number} bot_id - ID del bot
 * @param {string} number - Número de teléfono (se normaliza)
 * @returns {Promise<boolean>}
 */
async function hasActiveContextByNumber(connection_id, bot_id, number) {
	if (!connection_id || !bot_id || !number) {
		throw new Error(
			'BotConversationService.hasActiveContextByNumber: connection_id, bot_id y number son requeridos'
		);
	}
	const normalized = normalizeNumber(number);
	if (!normalized) return false;

	const contacts = await Contact.findAll({
		where: {connection_id, number: normalized},
		attributes: ['id'],
	});
	const contactIds = contacts.map((c) => c.id);
	if (contactIds.length === 0) return false;

	const count = await BotConversation.count({
		where: {
			bot_id,
			connection_id,
			contact_id: {[Op.in]: contactIds},
			is_active: true,
		},
	});
	return count > 0;
}

/**
 * Verifica si existe un contexto activo para el contacto (por contact_id).
 *
 * @param {number} contact_id - ID del contacto
 * @param {number} bot_id - ID del bot
 * @param {number} connection_id - ID de la conexión
 * @returns {Promise<boolean>} true si existe conversación activa
 */
async function hasActiveContext(contact_id, bot_id, connection_id) {
	if (!contact_id || !bot_id || !connection_id) {
		throw new Error(
			'BotConversationService.hasActiveContext: contact_id, bot_id y connection_id son requeridos'
		);
	}
	const count = await BotConversation.count({
		where: {
			contact_id,
			bot_id,
			connection_id,
			is_active: true,
		},
	});
	return count > 0;
}

module.exports = {
	normalizeNumber,
	getContextByNumber,
	getContextByContact,
	getOrCreateContextByNumber,
	getOrCreateContext,
	hasActiveContextByNumber,
	hasActiveContext,
};
