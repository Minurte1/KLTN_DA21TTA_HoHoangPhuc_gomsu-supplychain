require("dotenv").config();
var jwt = require("jsonwebtoken");

const nonSercurePaths = ["/", "/register", "/login", "/logout"];
const createJWT = (payload) => {
  let key = "phucfixne";
  let token;
  try {
    token = jwt.sign(payload, key, { expiresIn: 300000 });
  } catch (e) {
    console.log(e);
  }

  return token;
};
//--
const verifyToken = (token) => {
  let key = process.env.JWT_SECRET;
  let decoded = null;
  try {
    decoded = jwt.verify(token, key);
    console.log("decoded", decoded);
  } catch (e) {
    console.log(e);
  }
  return decoded;
};

//-- Giải nén cookie
const extractToken = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
};

const checkUserJWT = (req, res, next) => {
  if (nonSercurePaths.includes(req.path)) return next();
  let cookie = req.cookies;
  let tokenFromHeader = extractToken(req);

  if ((cookie && cookie.jwt) || tokenFromHeader) {
    let token = cookie && cookie.jwt ? cookie.jwt : tokenFromHeader;
    let decoded = verifyToken(token);
    if (decoded) {
      req.user = decoded;
      req.token = token;
      next();
    } else {
      return res.status(401).json({
        EC: -1,
        DT: "",
        EM: "Đăng nhập thất bại!",
      });
    }
  } else {
    return res.status(401).json({
      EC: -1,
      DT: "",
      EM: "Không thể xác thực được người dùng này",
    });
  }
};
const checkUserPermission = (routerName, actionName) => {
  return (req, res, next) => {
    const user = req.user;

    // Parse LIST_PERMISION nếu đang là chuỗi
    let listPermission = user.LIST_PERMISION;
    try {
      if (typeof listPermission === "string") {
        listPermission = JSON.parse(listPermission); // parse 1
        if (typeof listPermission === "string") {
          listPermission = JSON.parse(listPermission); // parse 2 nếu còn là chuỗi
        }
      }
    } catch (error) {
      return res.status(400).json({ message: "Lỗi xử lý LIST_PERMISION." });
    }

    // Kiểm tra quyền
    if (!Array.isArray(listPermission)) {
      return res.status(402).json({ message: "User không có quyền." });
    }

    const matched = listPermission.find((p) => p.router === routerName);
    if (!matched || !matched.actions.includes(actionName)) {
      return res.status(403).json({
        message: `Bạn không có quyền '${actionName}' trong '${routerName}'.`,
      });
    }

    next();
  };
};

module.exports = {
  createJWT,
  verifyToken,
  checkUserJWT,
  checkUserPermission,
};
