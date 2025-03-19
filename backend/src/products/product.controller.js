const Product = require("./product.model");

// ✅ Create a New Product
const postAProduct = async (req, res) => {
    try {
        let { newPrice, oldPrice, finalPrice, stockQuantity, colors } = req.body;

        // Ensure at least one color is provided
        if (!Array.isArray(colors) || colors.length === 0) {
            return res.status(400).json({ success: false, message: "At least one color must be provided." });
        }

        // Use the first color's image as the cover image
        const coverImage = colors[0]?.image || "";

        const productData = {
            ...req.body,
            coverImage,
            finalPrice: finalPrice || newPrice || oldPrice,
            stockQuantity: stockQuantity ? parseInt(stockQuantity, 10) : 10,
            colors,
        };

        const newProduct = new Product(productData);
        await newProduct.save();

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product: newProduct,
        });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ success: false, message: "Failed to create product" });
    }
};

// ✅ Get All Products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ success: false, message: "Failed to fetch products" });
    }
};

// ✅ Get a Single Product by ID
const getSingleProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found!" });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ success: false, message: "Failed to fetch product" });
    }
};

// ✅ Update Product
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        let { colors, ...rest } = req.body;

        // Ensure colors array is properly formatted
        if (!Array.isArray(colors) || colors.length === 0) {
            return res.status(400).json({ success: false, message: "At least one color must be provided." });
        }

        // Use first color as default cover image
        const coverImage = colors[0]?.image || "";

        const updateData = {
            ...rest,
            coverImage,
            colors,
            finalPrice: rest.finalPrice || rest.newPrice || rest.oldPrice,
            stockQuantity: rest.stockQuantity ? parseInt(rest.stockQuantity, 10) : 10,
        };

        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: "Product not found!" });
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product: updatedProduct,
        });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ success: false, message: "Failed to update product" });
    }
};

// ✅ Delete a Product
const deleteAProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: "Product not found!" });
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            product: deletedProduct,
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ success: false, message: "Failed to delete product" });
    }
};

// ✅ Update product price by percentage
const updateProductPriceByPercentage = async (req, res) => {
    const { id } = req.params;
    const { percentage } = req.body;

    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found!" });
        }

        // Calculate new price
        const discount = (product.oldPrice * percentage) / 100;
        product.finalPrice = product.oldPrice - discount;

        await product.save();

        res.status(200).json({
            success: true,
            message: "Price updated successfully",
            finalPrice: product.finalPrice,
        });
    } catch (error) {
        console.error("Error updating product price:", error);
        res.status(500).json({ success: false, message: "Failed to update product price" });
    }
};

module.exports = {
    postAProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteAProduct,
    updateProductPriceByPercentage,
};
