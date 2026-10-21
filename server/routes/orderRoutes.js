const express = require("express");

const {
  createCheckout,
  getMyOrders,
  getMyOrderById,
} = require("../controllers/orderController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

/* =========================================================
   CREATE CHECKOUT
   POST /api/orders/checkout
========================================================= */

router.post(
  "/checkout",
  protect,
  createCheckout
);

/* =========================================================
   GET CUSTOMER ORDER HISTORY
   GET /api/orders
========================================================= */

router.get(
  "/",
  protect,
  getMyOrders
);

/* =========================================================
   GET SINGLE CUSTOMER ORDER
   GET /api/orders/:id
========================================================= */

router.get(
  "/:id",
  protect,
  getMyOrderById
);

module.exports = router;

