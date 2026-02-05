'use strict';

const express = require('express');
const app = express();
const {sequelize} = require('./app/models/index');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());

app.use(express.static(path.join(__dirname, '..', 'view')));

// conexion a la base de datos
sequelize
	.authenticate()
	.then(() => {
		console.log('DB Connection exitosa yeeei...');
	})
	.catch((error) => {
		console.log('Failed to Connection DB Local\n', error);
	});
//  fin db

// rutas
app.get('/', (req, res) => {
	return res.json({welcome: 'You proyect IS ready'});
});

app.use('/api/v1', require('./app/routes/router'));

const port = process.env.PORT || 8080;
app.listen(port, () => {
	console.log(`Server is running on port http://localhost:${port}`);
});
