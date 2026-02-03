'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		// 1. Crear Agencia
		await queryInterface.bulkInsert(
			'agencies',
			[
				{
					name: 'Banco Crédito Seguro',
					status: 'active',
					company_id: 'BCS-2026',
					connection_limit: 10,
					created_at: new Date(),
					updated_at: new Date(),
				},
			],
			{}
		);

		// 2. Crear Conexión
		await queryInterface.bulkInsert(
			'connections',
			[
				{
					name: 'WhatsApp Banco Crédito',
					cellphone: '+591 70000000',
					status: 'active',
					type: 'whatsapp',
					agency_id: 1,
					baileys_qr_code: null,
					baileys_auth: null,
					created_at: new Date(),
					updated_at: new Date(),
				},
			],
			{}
		);

		// 3. Crear Bot
		await queryInterface.bulkInsert(
			'bots',
			[
				{
					agency_id: 1,
					connection_id: 1,
					trigger_word: 'hola',
					active: true,
					welcome_message: '¡Hola! Bienvenido a Banco Crédito Seguro 🏦',
					created_at: new Date(),
					updated_at: new Date(),
				},
			],
			{}
		);

		// 4. Crear Nodos del Bot
		await queryInterface.bulkInsert(
			'bot_nodes',
			[
				// Nodo Principal (main)
				{
					bot_id: 1,
					key: 'main',
					message:
						'*🏦 Bienvenido a Banco Crédito Seguro* 💰\n\nSelecciona una *opción* para continuar:',
					created_at: new Date(),
					updated_at: new Date(),
				},
				// Nodo Préstamos
				{
					bot_id: 1,
					key: 'prestamos',
					message:
						'*💵 Tipos de Préstamos Disponibles*\n\nSelecciona el que te interesa:',
					created_at: new Date(),
					updated_at: new Date(),
				},
				// Nodo Hipotecario
				{
					bot_id: 1,
					key: 'hipotecario',
					message: '*🏠 Préstamo Hipotecario*\n\nFinancia la casa de tus sueños 💙',
					created_at: new Date(),
					updated_at: new Date(),
				},
				// Nodo Vehicular
				{
					bot_id: 1,
					key: 'vehicular',
					message: '*🚗 Préstamo Vehicular*\n\nEstrena auto hoy mismo 😎',
					created_at: new Date(),
					updated_at: new Date(),
				},
				// Nodo Personal
				{
					bot_id: 1,
					key: 'personal',
					message: '*📱 Préstamo Personal*\n\nDinero rápido para lo que necesites 💳',
					created_at: new Date(),
					updated_at: new Date(),
				},
			],
			{}
		);

		// 5. Crear Acciones del Bot
		await queryInterface.bulkInsert(
			'bot_actions',
			[
				// Acción: Ubicación Sucursal
				{
					bot_id: 1,
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
				// Acción: Documento Requisitos
				{
					bot_id: 1,
					type: 'file',
					payload: JSON.stringify({
						document: {
							url: 'https://www.supersociedades.gov.co/documents/107391/3472445/GTI-MA-003_ManualDesarrolloSoftware.pdf',
						},
						fileName: 'Requisitos-Prestamos-2026.pdf',
						caption:
							'📌 Aquí encontrarás todos los requisitos para solicitar un préstamo.',
					}),
					created_at: new Date(),
					updated_at: new Date(),
				},
				// Acción: Hablar con Asesor
				{
					bot_id: 1,
					type: 'text',
					payload: JSON.stringify({
						text: '👋 Un asesor se comunicará contigo en breve.\n\n📞 También puedes llamarnos al *800-123-456*',
					}),
					created_at: new Date(),
					updated_at: new Date(),
				},
				// Acción: Detalles Hipotecario
				{
					bot_id: 1,
					type: 'text',
					payload: JSON.stringify({
						text: '✔️ Hasta 20 años de plazo\n✔️ Tasas desde 6.5%\n✔️ Financiamiento hasta el 80%',
					}),
					created_at: new Date(),
					updated_at: new Date(),
				},
				// Acción: Imagen Hipotecario
				{
					bot_id: 1,
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
				// Acción: Info Vehicular
				{
					bot_id: 1,
					type: 'text',
					payload: JSON.stringify({
						text: '🚘 Autos nuevos y usados\n📆 Plazos hasta 5 años\n💸 Tasas preferenciales',
					}),
					created_at: new Date(),
					updated_at: new Date(),
				},
				// Acción: Beneficios Personal
				{
					bot_id: 1,
					type: 'text',
					payload: JSON.stringify({
						text: '⚡ Aprobación rápida\n📄 Pocos requisitos\n💰 Montos flexibles',
					}),
					created_at: new Date(),
					updated_at: new Date(),
				},
				// Acción: Solicitar Info Personal
				{
					bot_id: 1,
					type: 'text',
					payload: JSON.stringify({
						text: '📩 Déjanos tu nombre y un asesor te contactará.',
					}),
					created_at: new Date(),
					updated_at: new Date(),
				},
			],
			{}
		);

		// 6. Crear Opciones de Nodos
		await queryInterface.bulkInsert('bot_node_options', [
			// === OPCIONES DEL MENÚ PRINCIPAL (main) ===
			{
				id: 1,
				bot_node_id: 1,
				option_key: 'A',
				label: '💵 Préstamos Disponibles',
				next_node_id: 2,
				action_id: null,
				order_index: 1,
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				id: 2,
				bot_node_id: 1,
				option_key: 'B',
				label: '📍 Nuestras Sucursales',
				next_node_id: null,
				action_id: 1, // Acción de ubicación
				order_index: 2,
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				id: 3,
				bot_node_id: 1,
				option_key: 'C',
				label: '📄 Requisitos Generales',
				next_node_id: null,
				action_id: 2, // Acción de documento
				order_index: 3,
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				id: 4,
				bot_node_id: 1,
				option_key: 'D',
				label: '👩‍💼 Hablar con un Asesor',
				next_node_id: null,
				action_id: 3, // Acción de texto asesor
				order_index: 4,
				created_at: new Date(),
				updated_at: new Date(),
			},

			// === OPCIONES DEL MENÚ PRÉSTAMOS ===
			{
				id: 5,
				bot_node_id: 2,
				option_key: '1',
				label: '🏠 Préstamo Hipotecario',
				next_node_id: 3,
				action_id: null,
				order_index: 1,
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				id: 6,
				bot_node_id: 2,
				option_key: '2',
				label: '🚗 Préstamo Vehicular',
				next_node_id: 4,
				action_id: null,
				order_index: 2,
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				id: 7,
				bot_node_id: 2,
				option_key: '3',
				label: '📱 Préstamo Personal',
				next_node_id: 5,
				action_id: null,
				order_index: 3,
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				id: 8,
				bot_node_id: 2,
				option_key: '4',
				label: '⬅️ Volver al Menú Principal',
				next_node_id: 1,
				action_id: null,
				order_index: 4,
				created_at: new Date(),
				updated_at: new Date(),
			},

			// === OPCIONES DEL MENÚ HIPOTECARIO ===
			{
				id: 9,
				bot_node_id: 3,
				option_key: 'A',
				label: '📊 Ver Detalles',
				next_node_id: null,
				action_id: 4, // Acción detalles hipotecario
				order_index: 1,
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				id: 10,
				bot_node_id: 3,
				option_key: 'B',
				label: '📷 Ver Ejemplo',
				next_node_id: null,
				action_id: 5, // Acción imagen hipotecario
				order_index: 2,
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				id: 11,
				bot_node_id: 3,
				option_key: 'C',
				label: '⬅️ Volver',
				next_node_id: 2,
				action_id: null,
				order_index: 3,
				created_at: new Date(),
				updated_at: new Date(),
			},

			// === OPCIONES DEL MENÚ VEHICULAR ===
			{
				id: 12,
				bot_node_id: 4,
				option_key: 'A',
				label: '📊 Información',
				next_node_id: null,
				action_id: 6, // Acción info vehicular
				order_index: 1,
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				id: 13,
				bot_node_id: 4,
				option_key: 'B',
				label: '⬅️ Volver',
				next_node_id: 2,
				action_id: null,
				order_index: 2,
				created_at: new Date(),
				updated_at: new Date(),
			},

			// === OPCIONES DEL MENÚ PERSONAL ===
			{
				id: 14,
				bot_node_id: 5,
				option_key: 'A',
				label: '💡 Beneficios',
				next_node_id: null,
				action_id: 7, // Acción beneficios personal
				order_index: 1,
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				id: 15,
				bot_node_id: 5,
				option_key: 'B',
				label: '📄 Solicitar Información',
				next_node_id: null,
				action_id: 8, // Acción solicitar info
				order_index: 2,
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				id: 16,
				bot_node_id: 5,
				option_key: 'C',
				label: '⬅️ Volver',
				next_node_id: 2,
				action_id: null,
				order_index: 3,
				created_at: new Date(),
				updated_at: new Date(),
			},
		]);
	},

	async down(queryInterface, Sequelize) {
		// Eliminar en orden inverso debido a las foreign keys
		await queryInterface.bulkDelete('bot_node_options', null, {});
		await queryInterface.bulkDelete('bot_actions', null, {});
		await queryInterface.bulkDelete('bot_nodes', null, {});
		await queryInterface.bulkDelete('bots', null, {});
		await queryInterface.bulkDelete('connections', null, {});
		await queryInterface.bulkDelete('agencies', null, {});
	},
};
