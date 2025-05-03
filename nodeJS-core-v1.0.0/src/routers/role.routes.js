const express = require("express");
const router = express.Router();
const { getRoles, createRole } = require("../controllers/role.controller");
const {
  checkUserJWT,
  checkUserPermission,
} = require("../middleware/JWTaction");

router.get("/", checkUserJWT, checkUserPermission("role", "view"), getRoles);
router.post(
  "/",
  checkUserJWT,
  checkUserPermission("role", "create"),
  createRole
);

module.exports = router;
