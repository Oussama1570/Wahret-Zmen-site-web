const express = require("express");
const router = express.Router();

const {
  sendOrderNotification,
  getAllOrders,
  getOrderByEmail,
  createAOrder,
  updateOrder,
  deleteOrder
} = require("./order.controller");

// ✅ Get all orders
router.get("/", getAllOrders);

// ✅ Get orders by email
router.get("/email/:email", getOrderByEmail);

// ✅ Create a new order
router.post("/", createAOrder);

// ✅ Update an order (payment, delivery status, completion percentage)
router.patch("/:id", updateOrder);

// ✅ Delete an order
router.delete("/:id", deleteOrder);

// ✅ Send order notification to customer
router.post("/notify", sendOrderNotification);

module.exports = router;
