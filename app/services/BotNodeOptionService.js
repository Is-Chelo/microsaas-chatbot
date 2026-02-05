const {BotNodeOption, BotAction, BotNode, BotConversation} = require('../models');

async function buildMessage(context, text, number, contactId) {
	if (!context || !context.conversation) {
		// return '⚠ Conversación no encontrada.';
		context = await getOrCreateContextByNumber(connectionId, botId, number, contactId);
		const options = context.currentNode?.options || [];
		const options_ext = options.map((opt) => `*${opt.option_key}*  ${opt.label}`).join('\n');
		return (
			(context.currentNode?.message || '') + (options_ext ? '\n\n' + options_ext : '')
		).trim();
	}

	text = String(text).trim();

	let options_ext = null;
	let current_node = context.currentNode;

	// Buscar opción dentro del nodo actual
	const botNodeOption = await BotNodeOption.findOne({
		where: {
			option_key: text,
			bot_node_id: context.conversation.current_node_id,
		},
	});

	if (botNodeOption == null) {
		const options = context.currentNode?.options || [];
		const options_ext = options.map((opt) => `*${opt.option_key}*  ${opt.label}`).join('\n');
		return (
			(context.currentNode?.message || 'Seleccione una opción:') +
			(options_ext ? '\n\n' + options_ext : '')
		).trim();
	}

	// CASO SUBMENU

	if (botNodeOption.next_node_id) {
		// actualizar conversación en DB
		await BotConversation.update(
			{
				current_node_id: botNodeOption.next_node_id,
				last_interaction_at: new Date(),
			},
			{
				where: {id: context.conversation.id},
			}
		);

		// obtener nuevo nodo
		current_node = await BotNode.findOne({
			where: {
				id: botNodeOption.next_node_id,
				bot_id: context.conversation.bot_id,
			},
		});

		if (!current_node) {
			return '⚠ Nodo no encontrado.';
		}

		// obtener nuevas opciones
		const options = await BotNodeOption.findAll({
			where: {bot_node_id: current_node.id},
			attributes: ['option_key', 'label'],
			order: [['order_index', 'ASC']],
		});

		options_ext = options.map((opt) => `*${opt.option_key}*  ${opt.label}`).join('\n');
	}

	// CASO ACTION
	else if (botNodeOption.action_id) {
		const botAction = await BotAction.findOne({
			where: {
				id: botNodeOption.action_id,
				bot_id: context.conversation.bot_id,
			},
		});

		if (!botAction) {
			return '⚠ Acción no encontrada.';
		}

		options_ext = botAction.payload;
	}

	// Construcción mensaje final

	const message_to_send =
		(current_node?.message || '') + (options_ext ? '\n\n' + options_ext : '');

	return message_to_send.trim();
}

module.exports = {buildMessage};
