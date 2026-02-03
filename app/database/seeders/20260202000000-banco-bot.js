'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		// 1. Crear Agencia
		await queryInterface.bulkInsert('agencies', [
			{
				name: 'Banco Crédito Seguro',
				status: 'active',
				company_id: 'BCS-2026',
				connection_limit: 10,
				created_at: new Date(),
				updated_at: new Date(),
			},
		]);

		// Obtener el ID de la agencia creada
		const [agency] = await queryInterface.sequelize.query(
			`SELECT id FROM agencies WHERE name = 'Banco Crédito Seguro' LIMIT 1`
		);
		const agencyId = agency[0].id;

		// 2. Crear Conexión
		await queryInterface.bulkInsert('connections', [
			{
				name: 'WhatsApp Banco Crédito',
				cellphone: '+591 70000000',
				status: 'active',
				type: 'whatsapp',
				agency_id: agencyId,
				baileys_qr_code: null,
				baileys_auth: null,
				created_at: new Date(),
				updated_at: new Date(),
			},
		]);

		// Obtener el ID de la conexión creada
		const [connection] = await queryInterface.sequelize.query(
			`SELECT id FROM connections WHERE name = 'WhatsApp Banco Crédito' LIMIT 1`
		);
		const connectionId = connection[0].id;

		// 3. Crear Bot
		await queryInterface.bulkInsert('bots', [
			{
				agency_id: agencyId,
				connection_id: connectionId,
				trigger_word: 'hola',
				active: true,
				welcome_message: 'Hola! Bienvenido a Banco Credito Seguro',
				created_at: new Date(),
				updated_at: new Date(),
			},
		]);

		// Obtener el ID del bot creado
		const [bot] = await queryInterface.sequelize.query(
			`SELECT id FROM bots WHERE trigger_word = 'hola' AND agency_id = ${agencyId} LIMIT 1`
		);
		const botId = bot[0].id;

		// 4. Crear Nodos del Bot
		await queryInterface.bulkInsert('bot_nodes', [
			{
				bot_id: botId,
				key: 'main',
				message:
					'*Bienvenido a Banco Credito Seguro*\n\nSelecciona una *opcion* para continuar:',
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				bot_id: botId,
				key: 'prestamos',
				message: '*Tipos de Prestamos Disponibles*\n\nSelecciona el que te interesa:',
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				bot_id: botId,
				key: 'hipotecario',
				message: '*Prestamo Hipotecario*\n\nFinancia la casa de tus suenos',
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				bot_id: botId,
				key: 'vehicular',
				message: '*Prestamo Vehicular*\n\nEstrena auto hoy mismo',
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				bot_id: botId,
				key: 'personal',
				message: '*Prestamo Personal*\n\nDinero rapido para lo que necesites',
				created_at: new Date(),
				updated_at: new Date(),
			},
		]);

		// Obtener los IDs de los nodos creados
		const [nodes] = await queryInterface.sequelize.query(
			`SELECT id, \`key\` FROM bot_nodes WHERE bot_id = ${botId} ORDER BY id`
		);

		const nodeMap = {};
		nodes.forEach((node) => {
			nodeMap[node.key] = node.id;
		});

		// 5. Crear Acciones del Bot
		await queryInterface.bulkInsert('bot_actions', [
			{
				bot_id: botId,
				type: 'location',
				payload: JSON.stringify({
					location: {
						degreesLatitude: -17.783312,
						degreesLongitude: -63.182129,
						address: 'Av. Principal #456 - Centro',
					},
				}),
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				bot_id: botId,
				type: 'file',
				payload: JSON.stringify({
					document: {
						url: 'https://www.supersociedades.gov.co/documents/107391/3472445/GTI-MA-003_ManualDesarrolloSoftware.pdf',
					},
					fileName: 'Requisitos-Prestamos-2026.pdf',
					caption: '📌 Aquí encontrarás todos los requisitos para solicitar un préstamo.',
				}),
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				bot_id: botId,
				type: 'text',
				payload: JSON.stringify({
					text: '👋 Un asesor se comunicará contigo en breve.\n\n📞 También puedes llamarnos al *800-123-456*',
				}),
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				bot_id: botId,
				type: 'text',
				payload: JSON.stringify({
					text: '✔️ Hasta 20 años de plazo\n✔️ Tasas desde 6.5%\n✔️ Financiamiento hasta el 80%',
				}),
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				bot_id: botId,
				type: 'image',
				payload: JSON.stringify({
					image: {
						url: 'https://blumbitvirtual.edtics.com/pluginfile.php/5252/course/overviewfiles/post-fullstack-9-junio%20%281%29.png',
					},
					caption: '🏡 Tu nuevo hogar comienza aquí',
				}),
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				bot_id: botId,
				type: 'text',
				payload: JSON.stringify({
					text: '🚘 Autos nuevos y usados\n📆 Plazos hasta 5 años\n💸 Tasas preferenciales',
				}),
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				bot_id: botId,
				type: 'text',
				payload: JSON.stringify({
					text: '⚡ Aprobación rápida\n📄 Pocos requisitos\n💰 Montos flexibles',
				}),
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				bot_id: botId,
				type: 'text',
				payload: JSON.stringify({
					text: '📩 Déjanos tu nombre y un asesor te contactará.',
				}),
				created_at: new Date(),
				updated_at: new Date(),
			},
		]);

		// Obtener los IDs de las acciones creadas
		const [actions] = await queryInterface.sequelize.query(
			`SELECT id FROM bot_actions WHERE bot_id = ${botId} ORDER BY id`
		);

		// 6. Crear Opciones de Nodos
		await queryInterface.bulkInsert('bot_node_options', [
			// === OPCIONES DEL MENÚ PRINCIPAL (main) ===
			{
				bot_node_id: nodeMap['main'],
				option_key: 'A',
				label: 'Prestamos Disponibles',
				next_node_id: nodeMap['prestamos'],
				action_id: null,
				order_index: 1,
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				bot_node_id: nodeMap['main'],
				option_key: 'B',
				label: 'Nuestras Sucursales',
				next_node_id: null,
				action_id: actions[0].id,
				order_index: 2,
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				bot_node_id: nodeMap['main'],
				option_key: 'C',
				label: 'Requisitos Generales',
				next_node_id: null,
				action_id: actions[1].id,
				order_index: 3,
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				bot_node_id: nodeMap['main'],
				option_key: 'D',
				label: 'Hablar con un Asesor',
				next_node_id: null,
				action_id: actions[2].id,
				order_index: 4,
				created_at: new Date(),
				updated_at: new Date(),
			},

			// === OPCIONES DEL MENÚ PRÉSTAMOS ===
			{
				bot_node_id: nodeMap['prestamos'],
				option_key: '1',
				label: 'Prestamo Hipotecario',
				next_node_id: nodeMap['hipotecario'],
				action_id: null,
				order_index: 1,
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				bot_node_id: nodeMap['prestamos'],
				option_key: '2',
				label: 'Prestamo Vehicular',
				next_node_id: nodeMap['vehicular'],
				action_id: null,
				order_index: 2,
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				bot_node_id: nodeMap['prestamos'],
				option_key: '3',
				label: 'Prestamo Personal',
				next_node_id: nodeMap['personal'],
				action_id: null,
				order_index: 3,
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				bot_node_id: nodeMap['prestamos'],
				option_key: '4',
				label: 'Volver al Menu Principal',
				next_node_id: nodeMap['main'],
				action_id: null,
				order_index: 4,
				created_at: new Date(),
				updated_at: new Date(),
			},

			// === OPCIONES DEL MENÚ HIPOTECARIO ===
			{
				bot_node_id: nodeMap['hipotecario'],
				option_key: 'A',
				label: 'Ver Detalles',
				next_node_id: null,
				action_id: actions[3].id,
				order_index: 1,
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				bot_node_id: nodeMap['hipotecario'],
				option_key: 'B',
				label: 'Ver Ejemplo',
				next_node_id: null,
				action_id: actions[4].id,
				order_index: 2,
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				bot_node_id: nodeMap['hipotecario'],
				option_key: 'C',
				label: 'Volver',
				next_node_id: nodeMap['prestamos'],
				action_id: null,
				order_index: 3,
				created_at: new Date(),
				updated_at: new Date(),
			},

			// === OPCIONES DEL MENÚ VEHICULAR ===
			{
				bot_node_id: nodeMap['vehicular'],
				option_key: 'A',
				label: 'Informacion',
				next_node_id: null,
				action_id: actions[5].id,
				order_index: 1,
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				bot_node_id: nodeMap['vehicular'],
				option_key: 'B',
				label: 'Volver',
				next_node_id: nodeMap['prestamos'],
				action_id: null,
				order_index: 2,
				created_at: new Date(),
				updated_at: new Date(),
			},

			// === OPCIONES DEL MENÚ PERSONAL ===
			{
				bot_node_id: nodeMap['personal'],
				option_key: 'A',
				label: 'Beneficios',
				next_node_id: null,
				action_id: actions[6].id,
				order_index: 1,
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				bot_node_id: nodeMap['personal'],
				option_key: 'B',
				label: 'Solicitar Informacion',
				next_node_id: null,
				action_id: actions[7].id,
				order_index: 2,
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				bot_node_id: nodeMap['personal'],
				option_key: 'C',
				label: 'Volver',
				next_node_id: nodeMap['prestamos'],
				action_id: null,
				order_index: 3,
				created_at: new Date(),
				updated_at: new Date(),
			},
		]);
	},

	async down(queryInterface, Sequelize) {
		// Obtener el ID de la agencia
		const [agency] = await queryInterface.sequelize.query(
			`SELECT id FROM agencies WHERE name = 'Banco Crédito Seguro' LIMIT 1`
		);

		if (agency && agency[0]) {
			const agencyId = agency[0].id;

			// Eliminar en orden inverso debido a las foreign keys
			await queryInterface.sequelize.query(
				`DELETE FROM bot_node_options WHERE bot_node_id IN (SELECT id FROM bot_nodes WHERE bot_id IN (SELECT id FROM bots WHERE agency_id = ${agencyId}))`
			);
			await queryInterface.sequelize.query(
				`DELETE FROM bot_actions WHERE bot_id IN (SELECT id FROM bots WHERE agency_id = ${agencyId})`
			);
			await queryInterface.sequelize.query(
				`DELETE FROM bot_nodes WHERE bot_id IN (SELECT id FROM bots WHERE agency_id = ${agencyId})`
			);
			await queryInterface.sequelize.query(`DELETE FROM bots WHERE agency_id = ${agencyId}`);
			await queryInterface.sequelize.query(
				`DELETE FROM connections WHERE agency_id = ${agencyId}`
			);
			await queryInterface.sequelize.query(`DELETE FROM agencies WHERE id = ${agencyId}`);
		}
	},
};
