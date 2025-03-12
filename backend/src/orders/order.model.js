const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    productCreationStatus: {
      type: String,
      enum: ["not_started", "in_progress", "almost_done", "completed"],
      default: "not_started",
    },
    orderStatus: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered"],
      default: "pending",
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      country: String,
      state: String,
      zipcode: String,
    },
    phone: { type: String, required: true },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        tailor: { type: String, default: "" }, // ✅ New field for assigning tailor name
      },
    ],
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    isDelivered: { type: Boolean, default: false },
    completionPercentage: { type: Number, min: 0, max: 100, default: 0 },
  },
  { timestamps: true }
);

orderSchema.pre(/^find/, function (next) {
  this.populate("products.productId", "title coverImage");
  next();
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
