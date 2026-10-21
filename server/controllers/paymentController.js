const axios = require("axios");

const Order = require("../models/Order");

 /*

# INITIALIZE PAYMENT

*/

const initializePayment = async (req, res) => {
try {
const {
email,
amount,
reference,
} = req.body;


if (!email) {
  return res.status(400).json({
    success: false,
    message: "Customer email is required.",
  });
}

if (!amount || amount <= 0) {
  return res.status(400).json({
    success: false,
    message:
      "A valid payment amount is required.",
  });
}

const response = await axios.post(
  "https://api.paystack.co/transaction/initialize",
  {
    email,
    amount: Math.round(amount * 100),
    currency: "ZAR",
    reference,
    callback_url: `${
  process.env.FRONTEND_URL || "http://localhost:5173"
}/payment/callback`,
  },
  {
    headers: {
      Authorization:
        `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type":
        "application/json",
    },
  }
);

return res.status(200).json({
  success: true,
  message:
    "Payment initialized successfully.",
  data: response.data.data,
});


} catch (error) {
console.error(
"Paystack initialization error:",
error.response?.data ||
error.message
);


return res.status(500).json({
  success: false,
  message:
    error.response?.data?.message ||
    "Unable to initialize payment.",
});


}
};

/*

# VERIFY PAYMENT

*/

const verifyPayment = async (req, res) => {
try {
const { reference } = req.params;


if (!reference) {
  return res.status(400).json({
    success: false,
    message:
      "Payment reference is required.",
  });
}

/*
----------------------------------------------
Find the NOVA order
----------------------------------------------
*/

const order = await Order.findOne({
  paymentReference: reference,
});

if (!order) {
  return res.status(404).json({
    success: false,
    message:
      "Order associated with this payment was not found.",
  });
}

/*
----------------------------------------------
Make sure the authenticated user owns
the order.
----------------------------------------------
*/

if (
  !req.user ||
  order.user.toString() !==
    req.user.id.toString()
) {
  return res.status(403).json({
    success: false,
    message:
      "You are not authorized to verify this payment.",
  });
}

/*
----------------------------------------------
If already paid, don't verify again.
----------------------------------------------
*/

if (
  order.paymentStatus === "paid"
) {
  return res.status(200).json({
    success: true,
    message:
      "Payment has already been verified.",
    data: {
      orderId:
        order._id.toString(),

      reference:
        order.paymentReference,

      status: "success",

      paymentStatus:
        order.paymentStatus,

      orderStatus:
        order.orderStatus,

      amount:
        Math.round(order.total * 100),

      currency:
        order.currency,

      customerName:
        order.customerName,

      customerEmail:
        order.customerEmail,

      items:
        order.items,

      subtotal:
        order.subtotal,

      deliveryFee:
        order.deliveryFee,

      total:
        order.total,
    },
  });
}

/*
----------------------------------------------
Ask Paystack to verify the transaction
----------------------------------------------
*/

const response = await axios.get(
  `https://api.paystack.co/transaction/verify/${encodeURIComponent(
    reference
  )}`,
  {
    headers: {
      Authorization:
        `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    },
  }
);

const payment =
  response.data?.data;

if (!payment) {
  return res.status(502).json({
    success: false,
    message:
      "Paystack returned an invalid verification response.",
  });
}

/*
----------------------------------------------
Verify payment reference
----------------------------------------------
*/

if (
  payment.reference !==
  order.paymentReference
) {
  return res.status(400).json({
    success: false,
    message:
      "Payment reference does not match the order.",
  });
}

/*
----------------------------------------------
Verify payment amount
----------------------------------------------
*/

const expectedAmount =
  Math.round(order.total * 100);

if (
  Number(payment.amount) !==
  expectedAmount
) {
  return res.status(400).json({
    success: false,
    message:
      "Payment amount does not match the order total.",
  });
}

/*
----------------------------------------------
Verify currency
----------------------------------------------
*/

if (
  String(payment.currency)
    .toUpperCase() !==
  String(order.currency)
    .toUpperCase()
) {
  return res.status(400).json({
    success: false,
    message:
      "Payment currency does not match the order.",
  });
}

/*
----------------------------------------------
Successful payment
----------------------------------------------
*/

if (
  payment.status === "success"
) {
  order.paymentStatus = "paid";
  order.orderStatus = "processing";

  await order.save();

  return res.status(200).json({
    success: true,
    message:
      "Payment verified successfully.",

    data: {
      orderId:
        order._id.toString(),

      reference:
        order.paymentReference,

      status:
        payment.status,

      paymentStatus:
        order.paymentStatus,

      orderStatus:
        order.orderStatus,

      amount:
        payment.amount,

      currency:
        payment.currency,

      paidAt:
        payment.paid_at || null,

      channel:
        payment.channel || null,

      customerName:
        order.customerName,

      customerEmail:
        order.customerEmail,

      items:
        order.items,

      subtotal:
        order.subtotal,

      deliveryFee:
        order.deliveryFee,

      total:
        order.total,
    },
  });
}

/*
----------------------------------------------
Failed payment
----------------------------------------------
*/

if (
  payment.status === "failed"
) {
  order.paymentStatus = "failed";

  await order.save();
}

return res.status(400).json({
  success: false,
  message:
    `Payment was not successful. Paystack status: ${payment.status}.`,
  data: {
    reference:
      payment.reference,

    status:
      payment.status,

    paymentStatus:
      order.paymentStatus,

    orderStatus:
      order.orderStatus,
  },
});


} catch (error) {
console.error(
"Paystack verification error:",
error.response?.data ||
error.message
);


return res.status(500).json({
  success: false,
  message:
    error.response?.data?.message ||
    error.message ||
    "Unable to verify payment.",
});


}
};

module.exports = {
initializePayment,
verifyPayment,
};
