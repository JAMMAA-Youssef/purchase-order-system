const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contactName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String },
    image: { type: String } // Add image field
    // ... other relevant details
});

module.exports = mongoose.model('Supplier', supplierSchema);