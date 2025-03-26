const mongoose = require("mongoose");

const ColorSchema = new mongoose.Schema({
  colorName: { type: String, required: true },
  image: { type: String, required: true },
});

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },

    translations: {
      en: { title: String, description: String },
      fr: { title: String, description: String },
      ar: { title: String, description: String },
    },

    category: { type: String, required: true },
    coverImage: { type: String, required: true },
    colors: { type: [ColorSchema], required: true },
    oldPrice: { type: Number, required: true },
    newPrice: { type: Number, required: true },
    stockQuantity: { type: Number, required: true },
    trending: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
