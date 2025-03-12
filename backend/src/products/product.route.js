const express = require('express');
const { postAProduct, getAllProducts, getSingleProduct, updateProduct, deleteAProduct } = require('./product.controller');
const verifyAdminToken = require('../middleware/verifyAdminToken');
const router = express.Router();

// POST a product (Create)
router.post("/create-product", verifyAdminToken, postAProduct);

// GET all products
router.get("/", getAllProducts);

// GET a single product by ID
router.get("/:id", getSingleProduct);

// PUT (Update) a product
router.put("/edit/:id", verifyAdminToken, updateProduct); // Ensure this matches the controller function name

// DELETE a product by ID
router.delete("/:id", verifyAdminToken, deleteAProduct);

// New endpoint to update the price based on the percentage slider
router.put("/update-price/:id", verifyAdminToken, async (req, res) => {
    const { id } = req.params;
    const { percentage } = req.body; // Retrieve percentage change

    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const discount = (product.oldPrice * percentage) / 100;
        const finalPrice = product.oldPrice - discount;

        product.finalPrice = finalPrice;
        await product.save();

        res.status(200).json({ message: 'Price updated successfully', finalPrice });
    } catch (err) {
        console.error('Error updating product price:', err);
        res.status(500).json({ message: 'Server error', error: err });
    }
});

module.exports = router;
