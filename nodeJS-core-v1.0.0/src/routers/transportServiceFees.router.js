const express = require("express");
const router = express.Router();
const TransportServiceFeesController = require("../controllers/transportServiceFees.controller");

// Lấy toàn bộ danh sách phí dịch vụ vận chuyển
router.get("/", TransportServiceFeesController.getAllFees);

// Tạo mới một phí dịch vụ vận chuyển
router.post("/", TransportServiceFeesController.createFee);

// Lấy một phí dịch vụ vận chuyển theo ID
router.get("/:id", TransportServiceFeesController.getFeeById);

// Cập nhật một phí dịch vụ vận chuyển theo ID
router.put("/:id", TransportServiceFeesController.updateFee);

// Xóa một phí dịch vụ vận chuyển theo ID
router.delete("/:id", TransportServiceFeesController.deleteFee);

module.exports = router;
