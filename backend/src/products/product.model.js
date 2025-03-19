const mongoose = require("mongoose");

const ColorSchema = new mongoose.Schema({
  colorName: { type: String, required: true },
  image: { type: String, required: true },
});

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    coverImage: { type: String, required: true }, // ✅ This will match the first color image
    colors: { type: [ColorSchema], required: true }, // ✅ Ensure at least one color is stored
    oldPrice: { type: Number, required: true },
    newPrice: { type: Number, required: true },
    stockQuantity: { type: Number, required: true },
    trending: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
