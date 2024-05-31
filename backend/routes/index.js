const express = require('express');
const router = express.Router();

router.use('/suppliers', require('./suppliers'));
router.use('/products', require('./products'));
router.use('/purchase-orders', require('./purchaseOrders'));

module.exports = router;