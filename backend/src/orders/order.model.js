const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      zipcode: { type: String, required: true },
    },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        color: {
          colorName: { type: String, required: true }, // ✅ Always store a color name
          image: { type: String, required: true }, // ✅ Always store a color image
        },
      },
    ],
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    isDelivered: { type: Boolean, default: false },

    // ✅ Persistent product progress tracking
    productProgress: {
      type: Map,
      of: Number, // Example: { "productId123|Blue": 20, "productId456|Red": 40 }
      default: {},
    },

    // ✅ Tailor assignment per product
    tailorAssignments: {
      type: Map,
      of: String, // Stores `{ productId|colorName -> tailorName }`
      default: {},
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
