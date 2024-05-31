const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Supplier } = require('../models');
const path = require('path');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// @route    GET /api/suppliers
// @desc     Get all suppliers
router.get('/', async (req, res) => {
    try {
        const suppliers = await Supplier.find();
        res.json(suppliers);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// @route    POST /api/suppliers
// @desc     Create a new supplier
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { name, contactName, email, phoneNumber } = req.body;
        const image = req.file ? req.file.path : null;
        const newSupplier = new Supplier({ name, contactName, email, phoneNumber, image });
        await newSupplier.save();
        res.status(201).json(newSupplier);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/suppliers/:id
// @desc    Update a supplier by ID
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const { name, contactName, email, phoneNumber } = req.body;
        const image = req.file ? req.file.path : null;

        const updateData = { name, contactName, email, phoneNumber };
        if (image) {
            updateData.image = image;
        }

        const updatedSupplier = await Supplier.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!updatedSupplier) {
            return res.status(404).json({ msg: 'Supplier not found' });
        }

        res.json(updatedSupplier);
    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ msg: error.message });
        }
        if (error.name === 'CastError') {
            return res.status(400).json({ msg: 'Invalid supplier ID' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/suppliers/:id
// @desc    Delete a supplier by ID
router.delete('/:id', async (req, res) => {
    try {
        const supplier = await Supplier.findByIdAndDelete(req.params.id);

        if (!supplier) {
            return res.status(404).json({ msg: 'Supplier not found' });
        }

        res.json({ msg: 'Supplier removed' });
    } catch (error) {
        console.error(error);
        if (error.name === 'CastError') {
            return res.status(400).json({ msg: 'Invalid supplier ID' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;
