const express = require("express");
const router = express.Router();
const { getThongKeByCompanyId } = require("../controllers/thongKe.controller");
// Lấy loại vật liệu theo ID
router.get("/:id", getThongKeByCompanyId);

module.exports = router;
