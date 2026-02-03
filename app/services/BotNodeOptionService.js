const {BotNodeOption} = require('../models');

async function buildMessage(current_node, text, number, contact_id) {
	if (current_node == null) return null;

	const bot_node_option = await BotNodeOption.findAll({
		where: {bot_node_id: current_node.id},
		attributes: ['option_key', 'label'],
		order: [['order_index', 'ASC']],
	});

	const options_ext = bot_node_option
		.map((opt) => `*${opt.option_key}*  ${opt.label}`)
		.join('\n');

	const message_to_send = (current_node?.message || null) + '\n\n' + options_ext;

	return message_to_send;
}

module.exports = {
	buildMessage,
};
