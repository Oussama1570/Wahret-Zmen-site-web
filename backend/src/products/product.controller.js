const Product = require("./product.model");

// ✅ Create a New Product
const postAProduct = async (req, res) => {
    try {
        let { newPrice, oldPrice, finalPrice, stockQuantity } = req.body;

        // Ensure stockQuantity is a number and default to 10 if not provided
        stockQuantity = stockQuantity ? parseInt(stockQuantity, 10) : 10;

        if (!finalPrice) {
            finalPrice = newPrice || oldPrice;
        }

        const newProduct = new Product({
            ...req.body,
            finalPrice,
            stockQuantity, // ✅ Include stock quantity in the new product
        });

        await newProduct.save();
        res.status(200).send({ message: "Product posted successfully", product: newProduct });
    } catch (error) {
        console.error("Error creating product", error);
        res.status(500).send({ message: "Failed to create product" });
    }
};

// ✅ Get All Products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).send(products);
    } catch (error) {
        console.error("Error fetching products", error);
        res.status(500).send({ message: "Failed to fetch products" });
    }
};

// ✅ Get a Single Product by ID
const getSingleProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).send({ message: "Product not found!" });
        }
        res.status(200).send(product);
    } catch (error) {
        console.error("Error fetching product", error);
        res.status(500).send({ message: "Failed to fetch product" });
    }
};

// ✅ Update Product (Including Stock)
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedProduct) {
            return res.status(404).send({ message: "Product not found!" });
        }

        res.status(200).send({
            message: "Product updated successfully",
            product: updatedProduct,
        });
    } catch (error) {
        console.error("Error updating product", error);
        res.status(500).send({ message: "Failed to update product" });
    }
};

// ✅ Delete a Product
const deleteAProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).send({ message: "Product not found!" });
        }

        res.status(200).send({
            message: "Product deleted successfully",
            product: deletedProduct,
        });
    } catch (error) {
        console.error("Error deleting a product", error);
        res.status(500).send({ message: "Failed to delete product" });
    }
};

module.exports = {
    postAProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteAProduct,
};
