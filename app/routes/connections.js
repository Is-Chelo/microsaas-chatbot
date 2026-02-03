const express = require('express');
const {check} = require('express-validator');

const router = express.Router();
const ConnectionController = require('../controllers/ConnectionController');
// const {validateFields} = require('../middlewares/validateFields');

router.get('/qr/:connection_id', ConnectionController.getQrByConnetion);

module.exports = router;
