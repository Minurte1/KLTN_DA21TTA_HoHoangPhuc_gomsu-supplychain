const express = require("express");
const router = express.Router();
const {
  getAllMaterialOrdersMaster,
  createMaterialOrderMaster,
  getMaterialOrderByIdMaster,
  updateMaterialOrderMaster,
  deleteMaterialOrderMaster,
  getOrdersByCompanyAndMaterial,
  createMaterialOrderFull,
  updateConfirmOrderMaster,
} = require("../controllers/materialOrderMaster.controller");

const {
  checkUserJWT,
  checkUserPermission,
} = require("../middleware/JWTaction");

// Lấy tất cả các đơn đặt hàng nguyên liệu
router.get(
  "/",
  // checkUserJWT,
  // checkUserPermission("material_order_master", "view"),
  getAllMaterialOrdersMaster
);

// Tạo đơn đặt hàng nguyên liệu
router.post(
  "/",
  // checkUserJWT,
  // checkUserPermission("material_order_master", "create"),
  createMaterialOrderMaster
);

// Lấy đơn đặt hàng nguyên liệu theo ID
router.get(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("material_order_master", "view"),
  getMaterialOrderByIdMaster
);

// Cập nhật đơn đặt hàng nguyên liệu
router.put(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("material_order_master", "update"),
  updateMaterialOrderMaster
);
router.post(
  "confirm-order",
  // checkUserJWT,
  // checkUserPermission("material_order_master", "update"),
  updateConfirmOrderMaster
);

// Xóa đơn đặt hàng nguyên liệu
router.delete(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("material_order_master", "delete"),
  deleteMaterialOrderMaster
);
router.get(
  "/orders/company/:idCompany/material/:idMaterial",
  getOrdersByCompanyAndMaterial
);
router.post("/material-orders/create", createMaterialOrderFull);

module.exports = router;
