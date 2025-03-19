const Order = require("./order.model");
const Product = require("../products/product.model.js");
const nodemailer = require("nodemailer");
require("dotenv").config(); // Load environment variables

// ✅ Create a New Order (Ensuring Colors are Correctly Stored)
const createAOrder = async (req, res) => {
  try {
    // Validate each product and ensure colors are correctly set
    const products = await Promise.all(
      req.body.products.map(async (product) => {
        const productData = await Product.findById(product.productId);

        if (!productData) {
          throw new Error(`Product not found: ${product.productId}`);
        }

        // Use the selected color, or default to the first color available
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

// ✅ Get Orders by Customer Email (Ensuring Colors Are Displayed)
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

    // Ensure each product has a valid coverImage
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
const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { isPaid, isDelivered, completionPercentage, tailorAssignments } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        isPaid,
        isDelivered,
        completionPercentage,
        tailorAssignments, // ✅ Save tailor assignments per color
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

// ✅ Send Order Notification via Email
const sendOrderNotification = async (req, res) => {
  const { orderId, email, completionPercentage } = req.body;

  if (!email || completionPercentage === undefined) {
    return res.status(400).json({ message: "Missing email or completion percentage" });
  }

  try {
    // Retrieve order to get the customer's name
    const order = await Order.findById(orderId).populate("products.productId", "title colors coverImage");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const customerName = order.name;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✅ Email Message based on Order Completion
    let subject, htmlMessage;

    if (completionPercentage < 100) {
      subject = `Wahret Zmen Boutique - Order Progress Update (#${orderId})`;
      htmlMessage = `
        <p><strong>Dear ${customerName},</strong></p> 
        <p>We are excited to update you on your order <strong>#${orderId}</strong> at <strong>Wahret Zmen Boutique</strong>.</p>
        
        <p>Your order is currently <strong>${completionPercentage}% completed</strong>. We are carefully preparing your items and will notify you once everything is ready.</p>
        
        <p><strong>Products in your order:</strong></p>
        <ul>
          ${order.products.map(prod => `
            <li>
              ${prod.productId?.title || "Product"} 
              (Quantity: ${prod.quantity}, 
              Color: ${prod.color?.colorName || "Default"}) 
              <img src="${prod.color?.image || prod.productId?.coverImage}" width="50"/>
            </li>
          `).join('')}
        </ul>

        <p>Thank you for your patience and for choosing Wahret Zmen Boutique! 💛</p>
        
        <p>Best regards,</p> 
        <p><strong>Wahret Zmen Boutique Team</strong></p>
      `;
    } else {
      subject = `Wahret Zmen Boutique - Your Order is Ready! (#${orderId})`;
      htmlMessage = `
        <p><strong>Dear ${customerName},</strong></p> 
        <p>Great news! Your order <strong>#${orderId}</strong> at <strong>Wahret Zmen Boutique</strong> is now <strong>fully completed</strong> and ready for pickup or delivery. 🎉</p>

        <p><strong>Your Order Details:</strong></p>
        <ul>
          ${order.products.map(prod => `
            <li>
              ${prod.productId?.title || "Product"} 
              (Quantity: ${prod.quantity}, 
              Color: ${prod.color?.colorName || "Default"}) 
              <img src="${prod.color?.image || prod.productId?.coverImage}" width="50"/>
            </li>
          `).join('')}
        </ul>

        <p>We appreciate your trust in Wahret Zmen Boutique. We hope you enjoy your items!</p>
        
        <p>For any inquiries or assistance, feel free to contact us.</p>

        <p>See you soon! 💛</p>
        
        <p>Best regards,</p>
        <p><strong>Wahret Zmen Boutique Team</strong></p>
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
