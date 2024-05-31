const mongoose = require('mongoose');

const purchaseOrderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: { type: Number, required: true, min: 1 }
});

const purchaseOrderSchema = new mongoose.Schema({
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        required: true
    },
    items: [purchaseOrderItemSchema],
    orderDate: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ['Pending', 'Received', 'Partial', 'Cancelled'], 
        default: 'Pending'
    }
    // ... other relevant details
});

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);