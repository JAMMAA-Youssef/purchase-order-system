const express = require('express');
const router = express.Router();
const { PurchaseOrder } = require('../models');

// @route    GET /api/purchase-orders
// @desc     Get all purchase orders
router.get('/', async (req, res) => {
    try {
        const purchaseOrders = await PurchaseOrder.find()
            .populate('supplier', 'name')
            .populate('items.product', 'name price');
        res.json(purchaseOrders);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// @route    POST /api/purchase-orders
// @desc     Create a new purchase order
router.post('/', async (req, res) => {
    try {
        const { supplier, items, status } = req.body; 
        const newPurchaseOrder = new PurchaseOrder({ supplier, items, status }); 
        await newPurchaseOrder.save();
        res.status(201).json(newPurchaseOrder); 
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// ... (Add routes for updating status, getting order by ID, etc.)

module.exports = router;