const axios = require("axios");

const Order = require("../models/Order");
const User = require("../models/User");

const products = [
{
id: "nova-001",
name: "Essential Oversized Tee",
price: 499,
stock: 42,
},
{
id: "nova-002",
name: "Urban Utility Jacket",
price: 1299,
stock: 18,
},
{
id: "nova-003",
name: "Minimalist Leather Sneakers",
price: 1199,
stock: 31,
},
{
id: "nova-004",
name: "Structured Crossbody Bag",
price: 899,
stock: 27,
},
{
id: "nova-005",
name: "Everyday Knit Sweater",
price: 799,
stock: 35,
},
{
id: "nova-006",
name: "Classic Canvas Tote",
price: 399,
stock: 64,
},
{
id: "nova-007",
name: "Premium Ribbed Cap",
price: 299,
stock: 73,
},
{
id: "nova-008",
name: "Modern Lounge Set",
price: 999,
stock: 22,
},
];

const DELIVERY_THRESHOLD = 1000;
const STANDARD_DELIVERY = 99;

/* =========================================================
CREATE CHECKOUT
========================================================= */

const createCheckout = async (req, res) => {
try {
console.log("CHECKOUT AUTH USER:", req.user);


if (!req.user || !req.user.id) {
  return res.status(401).json({
    success: false,
    message: "Authentication is required to checkout.",
  });
}

const user = await User.findById(req.user.id);

if (!user) {
  return res.status(401).json({
    success: false,
    message: "Authenticated user could not be found.",
  });
}

const { items } = req.body;

if (!items || !Array.isArray(items)) {
  return res.status(400).json({
    success: false,
    message: "Cart items are required.",
  });
}

if (items.length === 0) {
  return res.status(400).json({
    success: false,
    message: "Your cart is empty.",
  });
}

const orderItems = [];
let subtotal = 0;

for (const item of items) {
  const productId = String(item.productId || "").trim();

  const product = products.find(
    (product) => product.id === productId
  );

  if (!product) {
    return res.status(400).json({
      success: false,
      message: `Product ${productId} was not found.`,
    });
  }

  const quantity = Number(item.quantity);

  if (!Number.isInteger(quantity) || quantity < 1) {
    return res.status(400).json({
      success: false,
      message: `Invalid quantity for ${product.name}.`,
    });
  }

  if (quantity > product.stock) {
    return res.status(400).json({
      success: false,
      message: `${product.name} does not have enough stock.`,
    });
  }

  const itemTotal = product.price * quantity;

  subtotal += itemTotal;

  orderItems.push({
    productId: product.id,
    name: product.name,
    price: product.price,
    quantity,
    size: item.size || null,
    color: item.color || null,
    image: item.image || "",
  });
}

const deliveryFee =
  subtotal >= DELIVERY_THRESHOLD
    ? 0
    : STANDARD_DELIVERY;

const total = subtotal + deliveryFee;

const reference =
  `NOVA-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

const order = await Order.create({
  user: user._id,
  items: orderItems,
  subtotal,
  deliveryFee,
  total,
  currency: "ZAR",
  paymentReference: reference,
  paymentStatus: "pending",
  orderStatus: "pending",
  customerEmail: user.email,
  customerName: user.name,
});

const paystackResponse = await axios.post(
  "https://api.paystack.co/transaction/initialize",
  {
    email: user.email,
    amount: Math.round(total * 100),
    currency: "ZAR",
    reference,
  callback_url: `${
  process.env.FRONTEND_URL || "http://localhost:5173"
}/payment/callback`,
    metadata: {
      orderId: order._id.toString(),
      customerId: user._id.toString(),
      paymentReference: reference,
    },
  },
  {
    headers: {
      Authorization:
        `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  }
);

const paymentData =
  paystackResponse?.data?.data;

if (
  !paymentData ||
  !paymentData.authorization_url
) {
  return res.status(502).json({
    success: false,
    message:
      "Paystack did not return a payment URL.",
  });
}

return res.status(201).json({
  success: true,
  message:
    "Checkout initialized successfully.",
  order: {
    id: order._id,
    reference,
    subtotal,
    deliveryFee,
    total,
    currency: "ZAR",
  },
  payment: {
    authorizationUrl:
      paymentData.authorization_url,
    accessCode:
      paymentData.access_code,
    reference:
      paymentData.reference || reference,
  },
});


} catch (error) {
console.error(
"Checkout error:",
error.response?.data ||
error.message
);


return res.status(500).json({
  success: false,
  message:
    error.response?.data?.message ||
    "Unable to initialize checkout.",
});


}
};

/* =========================================================
GET CUSTOMER ORDERS
========================================================= */

const getMyOrders = async (req, res) => {
try {
if (!req.user || !req.user.id) {
return res.status(401).json({
success: false,
message: "Authentication is required.",
});
}


const orders = await Order.find({
  user: req.user.id,
})
  .sort({ createdAt: -1 })
  .lean();

return res.status(200).json({
  success: true,
  count: orders.length,
  orders,
});


} catch (error) {
console.error(
"Get customer orders error:",
error.message
);


return res.status(500).json({
  success: false,
  message: "Unable to retrieve your orders.",
});


}
};

/* =========================================================
GET SINGLE CUSTOMER ORDER
========================================================= */

const getMyOrderById = async (req, res) => {
try {
if (!req.user || !req.user.id) {
return res.status(401).json({
success: false,
message: "Authentication is required.",
});
}


const { id } = req.params;

const order = await Order.findOne({
  _id: id,
  user: req.user.id,
}).lean();

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
"Get customer order error:",
error.message
);


return res.status(500).json({
  success: false,
  message: "Unable to retrieve the order.",
});


}
};

module.exports = {
createCheckout,
getMyOrders,
getMyOrderById,
};

