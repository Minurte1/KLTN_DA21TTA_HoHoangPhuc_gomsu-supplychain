const express = require("express");
const router = express.Router();
const {
  getBaseListPermission,
} = require("../controllers/permission.controller");

// Không cần check JWT nếu muốn public – hoặc thêm bảo vệ nếu cần
router.get("/base-list", getBaseListPermission);

module.exports = router;
