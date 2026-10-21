const mongoose = require("mongoose");

/*
==================================================
ORDER ITEM SCHEMA
==================================================
*/

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    size: {
      type: String,
      default: null,
      trim: true,
    },

    color: {
      type: String,
      default: null,
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);

/*
==================================================
ORDER SCHEMA
==================================================
*/

const orderSchema = new mongoose.Schema(
  {
    /*
    ----------------------------------------------
    Customer
    ----------------------------------------------
    */

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    customerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    /*
    ----------------------------------------------
    Products
    ----------------------------------------------
    */

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items) =>
          Array.isArray(items) &&
          items.length > 0,
        message:
          "An order must contain at least one item.",
      },
    },

    /*
    ----------------------------------------------
    Pricing
    ----------------------------------------------
    */

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    deliveryFee: {
      type: Number,
      required: true,
      min: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      required: true,
      default: "ZAR",
      uppercase: true,
      trim: true,
    },

    /*
    ----------------------------------------------
    Payment
    ----------------------------------------------
    */

    paymentReference: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    paymentStatus: {
      type: String,
      enum: [
        "pending",
        "processing",
        "paid",
        "failed",
        "refunded",
      ],
      default: "pending",
      index: true,
    },

    /*
    ----------------------------------------------
    Order status
    ----------------------------------------------
    */

    orderStatus: {
      type: String,
      enum: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Order",
  orderSchema
);

