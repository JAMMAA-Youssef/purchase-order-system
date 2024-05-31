const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    supplier: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Supplier',
        required: true 
    },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 } ,
    image: { type: String } // Add image field
    // ... other relevant details
});

module.exports = mongoose.model('Product', productSchema);