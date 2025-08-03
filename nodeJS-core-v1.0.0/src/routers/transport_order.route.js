const express = require("express");
const router = express.Router();
const {
  getTransportOrders,
  createTransportOrder,
  getTransportOrderById,
  updateTransportOrder,
  deleteTransportOrder,
  // transportOrdersShipDELIVERING,
} = require("../controllers/transport_order.controller");

const {
  checkUserJWT,
  checkUserPermission,
} = require("../middleware/JWTaction");

// router.get(
//   "/",
//   // checkUserJWT,
//   // checkUserPermission("transport_order", "view"),
//   transportOrdersShipDELIVERING
// );

// Lấy tất cả đơn vận chuyển
router.get(
  "/",
  // checkUserJWT,
  // checkUserPermission("transport_order", "view"),
  getTransportOrders
);

// Tạo đơn vận chuyển
router.post(
  "/",
  // checkUserJWT,
  // checkUserPermission("transport_order", "create"),
  createTransportOrder
);

// Lấy đơn theo ID
router.get(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("transport_order", "view"),
  getTransportOrderById
);

// Cập nhật đơn vận chuyển
router.put(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("transport_order", "update"),
  updateTransportOrder
);

// Xóa đơn vận chuyển
router.delete(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("transport_order", "delete"),
  deleteTransportOrder
);

module.exports = router;
