const express = require("express");

const {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/adminOrderController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

/*
=========================================================
GET ALL ORDERS
GET /api/admin/orders
=========================================================
*/

router.get(
  "/",
  protect,
  adminOnly,
  getAllOrders
);

/*
=========================================================
GET SINGLE ORDER
GET /api/admin/orders/:id
=========================================================
*/

router.get(
  "/:id",
  protect,
  adminOnly,
  getOrderById
);

/*
=========================================================
UPDATE ORDER STATUS
PATCH /api/admin/orders/:id/status
=========================================================
*/

router.patch(
  "/:id/status",
  protect,
  adminOnly,
  updateOrderStatus
);

module.exports = router;
