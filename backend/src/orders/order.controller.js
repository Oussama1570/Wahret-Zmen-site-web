const Order = require("./order.model");
const Product = require("../products/product.model.js");
const nodemailer = require("nodemailer");
require("dotenv").config(); // Load environment variables

// ✅ Create a New Order
const createAOrder = async (req, res) => {
  try {
    const products = await Promise.all(
      req.body.products.map(async (product) => {
        const productData = await Product.findById(product.productId);

        if (!productData) {
          throw new Error(`Product not found: ${product.productId}`);
        }

        const selectedColor = product.color?.colorName
          ? product.color
          : productData.colors[0] || { colorName: "Default", image: productData.coverImage };

        return {
          productId: product.productId,
          quantity: product.quantity,
          color: selectedColor,
        };
      })
    );

    const newOrder = new Order({
      ...req.body,
      products,
    });

    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: error.message || "Failed to create order" });
  }
};

// ✅ Get Orders by Customer Email
const getOrderByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const orders = await Order.find({ email })
      .sort({ createdAt: -1 })
      .populate("products.productId", "title colors coverImage");

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// ✅ Get All Orders (Admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("products.productId", "title colors coverImage")
      .lean();

    const processedOrders = orders.map(order => ({
      ...order,
      products: order.products.map(product => ({
        ...product,
        coverImage: product.productId?.coverImage || "/assets/default-image.png",
      })),
    }));

    res.status(200).json(processedOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// ✅ Update an Order
// ✅ Update an Order
const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { isPaid, isDelivered, productProgress, tailorAssignments } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        isPaid,
        isDelivered,
        productProgress, // ✅ Now saves product progress correctly
        tailorAssignments,
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Failed to update order", error: error.message });
  }
};


// ✅ Delete an Order
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully", deletedOrder });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Failed to delete order" });
  }
};

// ✅ Send Order Notification via Email (per productKey and progress)
const sendOrderNotification = async (req, res) => {
  try {
    const { orderId, email, productKey, progress } = req.body;

    // ✅ Add this line just below the destructuring:
    console.log("📩 Incoming Notification Request:", req.body);

    if (!email || !productKey || progress === undefined) {
      return res.status(400).json({ message: "Missing email, productKey, or progress value" });
    }


    const order = await Order.findById(orderId).populate("products.productId", "title colors coverImage");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const customerName = order.name;
    const [productId, colorName] = productKey.split("|");

    // Find the correct product in the order
    const matchedProduct = order.products.find(
      (p) => p.productId?._id?.toString() === productId && p.color?.colorName === colorName
    );

    if (!matchedProduct) {
      return res.status(404).json({ message: "Product not found in order" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let subject, htmlMessage;

    if (progress < 100) {
      subject = `Wahret Zmen - Product Update (${progress}%)`;
      htmlMessage = `
        <p>Dear ${customerName},</p>
        <p>Your ordered product <strong>${matchedProduct.productId.title}</strong> (Color: ${matchedProduct.color.colorName}) is now <strong>${progress}% completed</strong>.</p>
        <img src="${matchedProduct.color.image}" width="60" />
        <p>We'll notify you again once it's fully ready!</p>
        <p>Best regards,<br/>Wahret Zmen Boutique</p>
      `;
    } else {
      subject = `Wahret Zmen - Product Ready for Pickup!`;
      htmlMessage = `
        <p>Dear ${customerName},</p>
        <p>Your product <strong>${matchedProduct.productId.title}</strong> (Color: ${matchedProduct.color.colorName}) is now <strong>fully completed</strong> and ready for pickup or delivery. 🎉</p>
        <img src="${matchedProduct.color.image}" width="60" />
        <p>Thank you for your trust in Wahret Zmen Boutique!</p>
        <p>Warm regards,<br/>Wahret Zmen Team</p>
      `;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      html: htmlMessage,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Notification sent successfully" });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({ message: "Error sending notification", error: error.message });
  }
};

// ✅ Export all controllers
module.exports = {
  createAOrder,
  getOrderByEmail,
  getAllOrders,
  updateOrder,
  deleteOrder,
  sendOrderNotification,
};
