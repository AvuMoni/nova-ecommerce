const Order = require("../models/Order");

/*
=========================================================
GET ALL ORDERS
=========================================================

GET /api/admin/orders

Admin only.
Returns all customer orders, newest first.
*/

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate(
        "user",
        "name email"
      )
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error(
      "Get all orders error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve orders.",
    });
  }
};

/*
=========================================================
GET SINGLE ORDER
=========================================================

GET /api/admin/orders/:id

Admin only.
*/

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate(
        "user",
        "name email"
      )
      .lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(
      "Get admin order error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve the order.",
    });
  }
};

/*
=========================================================
UPDATE ORDER STATUS
=========================================================

PATCH /api/admin/orders/:id/status

Admin only.

Allowed statuses:

pending
processing
shipped
delivered
cancelled
*/

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const allowedStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!orderStatus) {
      return res.status(400).json({
        success: false,
        message: "Order status is required.",
      });
    }

    if (!allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status.",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    order.orderStatus = orderStatus;

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      order: {
        id: order._id,
        reference: order.paymentReference,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        updatedAt: order.updatedAt,
      },
    });
  } catch (error) {
    console.error(
      "Update order status error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to update order status.",
    });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};

