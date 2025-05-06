const pool = require("../config/database"); // Đảm bảo `pool` được import từ tệp kết nối cơ sở dữ liệu của bạn
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");

const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const otpStorage = new Map();

const getAllUser_Admin = async (req, res) => {
  try {
    // Check if the user already exists in the database

    const [rows] = await pool.query("SELECT * FROM users");
    const results = rows;
    return res.status(200).json({
      EM: "Lấy thông tin tất cả người dùng thành công",
      EC: 1,
      DT: results,
    });
  } catch (error) {
    console.error("Error in loginUserGoogle:", error);
    return res.status(500).json({
      EM: `Error: ${error.message}`,
      EC: -1,
      DT: [],
    });
  }
};
const getUser_ById = async (req, res) => {
  try {
    const { id } = req.params;
    // Check if the user already exists in the database

    const [rows] = await pool.query("SELECT * FROM users where ID_USERS =? ", [
      id,
    ]);
    const results = rows;
    return res.status(200).json({
      EM: "Lấy thông tin tất cả người dùng thành công",
      EC: 1,
      DT: results,
    });
  } catch (error) {
    console.error("Error in loginUserGoogle:", error);
    return res.status(500).json({
      EM: `Error: ${error.message}`,
      EC: -1,
      DT: [],
    });
  }
};

// ---------------------------------------------- updateUserById
const updateUserById_Admin = async (req, res) => {
  const {
    ID_NGUOI_DUNG,
    MAT_KHAU,
    EMAIL,
    VAI_TRO,
    HO_TEN,
    SO_DIEN_THOAI,
    DIA_CHI,
    TRANG_THAI_USER,
    NGAY_CAP_NHAT_USER,
    AVATAR,
  } = req.body;

  // Kiểm tra xem có đủ ID người dùng để cập nhật hay không
  if (!ID_NGUOI_DUNG) {
    return res.status(400).json({
      EM: "ID_NGUOI_DUNG is missing",
      EC: 0,
      DT: [],
    });
  }

  try {
    // Cập nhật thông tin người dùng trong database
    const [result] = await pool.query(
      `UPDATE NGUOI_DUNG 
         SET MAT_KHAU = ?, 
             EMAIL = ?, 
             VAI_TRO = ?, 
             HO_TEN = ?, 
             SO_DIEN_THOAI = ?, 
             DIA_CHI = ?, 
             TRANG_THAI_USER = ?, 
             NGAY_CAP_NHAT_USER = ?, 
             AVATAR = ? 
         WHERE ID_NGUOI_DUNG = ?`,
      [
        MAT_KHAU,
        EMAIL,
        VAI_TRO,
        HO_TEN,
        SO_DIEN_THOAI,
        DIA_CHI,
        TRANG_THAI_USER,
        NGAY_CAP_NHAT_USER,
        AVATAR,
        ID_NGUOI_DUNG,
      ]
    );

    // Kiểm tra kết quả cập nhật
    if (result.affectedRows === 0) {
      return res.status(404).json({
        EM: "User not found",
        EC: 0,
        DT: [],
      });
    }

    return res.status(200).json({
      EM: "Cập nhật thông tin người dùng thành công",
      EC: 1,
      DT: { ID_NGUOI_DUNG },
    });
  } catch (error) {
    console.error("Error in updateUserById:", error);
    return res.status(500).json({
      EM: `Error: ${error.message}`,
      EC: -1,
      DT: [],
    });
  }
};

const updateUserById_User = async (req, res) => {
  const {
    EMAIL,
    HO_TEN,
    SO_DIEN_THOAI,
    VAI_TRO,
    DIA_CHI_Provinces,
    DIA_CHI_Districts,
    DIA_CHI_Wards,
    DIA_CHI_STREETNAME,
    TRANG_THAI_USER,
  } = req.body;

  const { id } = req.params;

  // Kiểm tra xem ID người dùng có hợp lệ không
  if (!id) {
    return res.status(400).json({
      EM: "ID người dùng bị thiếu",
      EC: 0,
      DT: [],
    });
  }

  try {
    // Kiểm tra xem người dùng có tồn tại không
    const [existingUser] = await pool.execute(
      "SELECT * FROM users WHERE ID_USERS = ?",
      [id]
    );

    if (existingUser.length === 0) {
      return res.status(404).json({
        EM: "Không tìm thấy người dùng",
        EC: 0,
        DT: [],
      });
    }

    // Cập nhật các trường không phải null
    let updateFields = [];
    let updateValues = [];

    if (EMAIL !== undefined && EMAIL !== null && EMAIL !== "") {
      updateFields.push("EMAIL = ?");
      updateValues.push(EMAIL);
    }
    if (HO_TEN !== undefined && HO_TEN !== null && HO_TEN !== "") {
      updateFields.push("HO_TEN = ?");
      updateValues.push(HO_TEN);
    }
    if (
      SO_DIEN_THOAI !== undefined &&
      SO_DIEN_THOAI !== null &&
      SO_DIEN_THOAI !== ""
    ) {
      updateFields.push("SO_DIEN_THOAI = ?");
      updateValues.push(SO_DIEN_THOAI);
    }
    if (VAI_TRO !== undefined && VAI_TRO !== null && VAI_TRO !== "") {
      // Kiểm tra xem VAI_TRO có tồn tại trong bảng role
      const [roleCheck] = await pool.execute(
        "SELECT ID_ROLE FROM role WHERE ID_ROLE = ? AND IS_DELETE = 0",
        [VAI_TRO]
      );
      if (roleCheck.length === 0) {
        return res.status(400).json({
          EM: "Vai trò không hợp lệ",
          EC: 0,
          DT: [],
        });
      }
      updateFields.push("VAI_TRO = ?");
      updateValues.push(VAI_TRO);
    }
    if (
      DIA_CHI_Provinces !== undefined &&
      DIA_CHI_Provinces !== null &&
      DIA_CHI_Provinces !== ""
    ) {
      updateFields.push("DIA_CHI_Provinces = ?");
      updateValues.push(DIA_CHI_Provinces);
    }
    if (
      DIA_CHI_Districts !== undefined &&
      DIA_CHI_Districts !== null &&
      DIA_CHI_Districts !== ""
    ) {
      updateFields.push("DIA_CHI_Districts = ?");
      updateValues.push(DIA_CHI_Districts);
    }
    if (
      DIA_CHI_Wards !== undefined &&
      DIA_CHI_Wards !== null &&
      DIA_CHI_Wards !== ""
    ) {
      updateFields.push("DIA_CHI_Wards = ?");
      updateValues.push(DIA_CHI_Wards);
    }
    if (
      DIA_CHI_STREETNAME !== undefined &&
      DIA_CHI_STREETNAME !== null &&
      DIA_CHI_STREETNAME !== ""
    ) {
      updateFields.push("DIA_CHI_STREETNAME = ?");
      updateValues.push(DIA_CHI_STREETNAME);
    }
    if (
      TRANG_THAI_USER !== undefined &&
      TRANG_THAI_USER !== null &&
      TRANG_THAI_USER !== "" &&
      ["ACTIVE", "INACTIVE", "DELETED"].includes(TRANG_THAI_USER)
    ) {
      updateFields.push("TRANG_THAI_USER = ?");
      updateValues.push(TRANG_THAI_USER);
    }

    // Thêm trường ngày cập nhật
    const ngayCapNhat = new Date();
    updateFields.push("NGAY_CAP_NHAT_USER = ?");
    updateValues.push(ngayCapNhat);

    // Nếu không có gì cần cập nhật, trả về lỗi
    if (updateFields.length === 0) {
      return res.status(400).json({
        EM: "Không có thông tin cần cập nhật",
        EC: 0,
        DT: [],
      });
    }

    // Cập nhật thông tin người dùng
    const updateQuery = `
      UPDATE users 
      SET ${updateFields.join(", ")}
      WHERE ID_USERS = ?
    `;

    // Thêm ID người dùng vào cuối giá trị để xác định người dùng cần cập nhật
    updateValues.push(id);

    const [updateResult] = await pool.execute(updateQuery, updateValues);

    if (updateResult.affectedRows > 0) {
      // Lấy lại thông tin mới nhất của người dùng sau khi cập nhật, bao gồm thông tin vai trò
      const [updatedUser] = await pool.execute(
        `SELECT u.*, r.LIST_PERMISION, r.NAME_ROLE, r.CODE_NAME 
         FROM users u 
         LEFT JOIN role r ON u.VAI_TRO = r.ID_ROLE 
         WHERE u.ID_USERS = ? AND r.IS_DELETE = 0`,
        [id]
      );

      if (updatedUser.length === 0) {
        return res.status(404).json({
          EM: "Không tìm thấy người dùng sau khi cập nhật",
          EC: 0,
          DT: [],
        });
      }

      const user = updatedUser[0];
      console.log("updatedUser[0]", user);

      // Tạo JWT token
      const token = jwt.sign(
        {
          ID_USERS: user.ID_USERS,
          EMAIL: user.EMAIL,
          VAI_TRO: user.VAI_TRO,
          HO_TEN: user.HO_TEN,
          SO_DIEN_THOAI: user.SO_DIEN_THOAI,
          TRANG_THAI_USER: user.TRANG_THAI_USER,
          NGAY_TAO_USER: user.NGAY_TAO_USER,
          NGAY_CAP_NHAT_USER: user.NGAY_CAP_NHAT_USER,
          AVATAR: user.AVATAR,
          DIA_CHI_Provinces: user.DIA_CHI_Provinces,
          DIA_CHI_Districts: user.DIA_CHI_Districts,
          DIA_CHI_Wards: user.DIA_CHI_Wards,
          DIA_CHI_STREETNAME: user.DIA_CHI_STREETNAME,
          LIST_PERMISION: user.LIST_PERMISION,
          NAME_ROLE: user.NAME_ROLE,
          CODE_NAME: user.CODE_NAME,
        },
        JWT_SECRET,
        { expiresIn: "5h" }
      );

      return res.status(200).json({
        EM: "Cập nhật thông tin thành công",
        EC: 1,
        DT: {
          ID_USERS: user.ID_USERS,
          EMAIL: user.EMAIL,
          HO_TEN: user.HO_TEN,
          VAI_TRO: user.VAI_TRO,
          SO_DIEN_THOAI: user.SO_DIEN_THOAI,
          TRANG_THAI_USER: user.TRANG_THAI_USER,
          NGAY_TAO_USER: user.NGAY_TAO_USER,
          NGAY_CAP_NHAT_USER: user.NGAY_CAP_NHAT_USER,
          AVATAR: user.AVATAR,
          DIA_CHI_Provinces: user.DIA_CHI_Provinces,
          DIA_CHI_Districts: user.DIA_CHI_Districts,
          DIA_CHI_Wards: user.DIA_CHI_Wards,
          DIA_CHI_STREETNAME: user.DIA_CHI_STREETNAME,
          LIST_PERMISION: user.LIST_PERMISION,
          NAME_ROLE: user.NAME_ROLE,
          CODE_NAME: user.CODE_NAME,
        },
        accessToken: token,
      });
    } else {
      return res.status(400).json({
        EM: "Cập nhật không thành công",
        EC: 0,
        DT: [],
      });
    }
  } catch (error) {
    console.error("Lỗi trong updateUserById_User:", error);
    return res.status(500).json({
      EM: `Lỗi hệ thống: ${error.message}`,
      EC: -1,
      DT: [],
    });
  }
};

const loginUserGoogle = async (req, res) => {
  const { email, HO_TEN } = req.body;
  console.log("req.body loginUserGoogle", req.body);

  if (!email) {
    return res.status(401).json({
      EM: "Thiếu email",
      EC: 401,
      DT: [],
    });
  }

  try {
    // Kiểm tra xem người dùng đã tồn tại trong cơ sở dữ liệu chưa
    const [rows] = await pool.query(
      `SELECT u.*, r.LIST_PERMISION, r.NAME_ROLE, r.CODE_NAME 
       FROM users u 
       LEFT JOIN role r ON u.ID_ROLE = r.ID_ROLE 
       WHERE u.EMAIL = ? AND r.IS_DELETE = 0`,
      [email]
    );

    if (rows.length > 0) {
      const user = rows[0];
      console.log("user", user);

      // Kiểm tra trạng thái tài khoản
      if (user.TRANG_THAI_USER !== "ACTIVE") {
        return res.status(403).json({
          EM: "Tài khoản không hoạt động, không thể đăng nhập",
          EC: 0,
          DT: "Tài khoản không hoạt động",
        });
      }

      // Tạo JWT token
      const token = jwt.sign(
        {
          ID_USERS: user.ID_USERS,
          EMAIL: user.EMAIL,
          ID_ROLE: user.ID_ROLE, // Cập nhật thành ID_ROLE
          HO_TEN: user.HO_TEN,
          SO_DIEN_THOAI: user.SO_DIEN_THOAI,
          TRANG_THAI_USER: user.TRANG_THAI_USER,
          NGAY_TAO_USER: user.NGAY_TAO_USER,
          NGAY_CAP_NHAT_USER: user.NGAY_CAP_NHAT_USER,
          AVATAR: user.AVATAR,
          DIA_CHI_Provinces: user.DIA_CHI_Provinces,
          DIA_CHI_Districts: user.DIA_CHI_Districts,
          DIA_CHI_Wards: user.DIA_CHI_Wards,
          DIA_CHI_STREETNAME: user.DIA_CHI_STREETNAME,
          LIST_PERMISION: user.LIST_PERMISION,
          NAME_ROLE: user.NAME_ROLE,
          CODE_NAME: user.CODE_NAME,
        },
        JWT_SECRET,
        { expiresIn: "5h" }
      );

      return res.status(200).json({
        EM: "Đăng nhập thành công",
        EC: 200,
        DT: {
          accessToken: token,
          userInfo: {
            ID_USERS: user.ID_USERS,
            EMAIL: user.EMAIL,
            HO_TEN: user.HO_TEN,
            ID_ROLE: user.ID_ROLE, // Cập nhật thành ID_ROLE
            SO_DIEN_THOAI: user.SO_DIEN_THOAI,
            TRANG_THAI_USER: user.TRANG_THAI_USER,
            NGAY_TAO_USER: user.NGAY_TAO_USER,
            NGAY_CAP_NHAT_USER: user.NGAY_CAP_NHAT_USER,
            AVATAR: user.AVATAR,
            DIA_CHI_Provinces: user.DIA_CHI_Provinces,
            DIA_CHI_Districts: user.DIA_CHI_Districts,
            DIA_CHI_Wards: user.DIA_CHI_Wards,
            DIA_CHI_STREETNAME: user.DIA_CHI_STREETNAME,
            LIST_PERMISION: user.LIST_PERMISION,
            NAME_ROLE: user.NAME_ROLE,
            CODE_NAME: user.CODE_NAME,
          },
        },
      });
    } else {
      // Thêm người dùng mới với vai trò mặc định và trạng thái hoạt động
      const ID_ROLE = 4; // Giả sử 1 là ID_ROLE hợp lệ trong bảng role
      const TRANG_THAI_USER = "ACTIVE";
      await pool.query(
        `INSERT INTO users (EMAIL, ID_ROLE, HO_TEN, TRANG_THAI_USER, NGAY_TAO_USER, NGAY_CAP_NHAT_USER) 
         VALUES (?, ?, ?, ?, NOW(), NOW())`,
        [email, ID_ROLE, HO_TEN, TRANG_THAI_USER]
      );

      // Lấy thông tin người dùng mới tạo
      const [newRows] = await pool.query(
        `SELECT u.*, r.LIST_PERMISION, r.NAME_ROLE, r.CODE_NAME 
         FROM users u 
         LEFT JOIN role r ON u.ID_ROLE = r.ID_ROLE 
         WHERE u.EMAIL = ? AND r.IS_DELETE = 0`,
        [email]
      );

      const user = newRows[0];

      // Tạo JWT token cho người dùng mới
      const token = jwt.sign(
        {
          ID_USERS: user.ID_USERS,
          EMAIL: user.EMAIL,
          ID_ROLE: user.ID_ROLE, // Cập nhật thành ID_ROLE
          HO_TEN: user.HO_TEN,
          SO_DIEN_THOAI: user.SO_DIEN_THOAI,
          TRANG_THAI_USER: user.TRANG_THAI_USER,
          NGAY_TAO_USER: user.NGAY_TAO_USER,
          NGAY_CAP_NHAT_USER: user.NGAY_CAP_NHAT_USER,
          AVATAR: user.AVATAR,
          DIA_CHI_Provinces: user.DIA_CHI_Provinces,
          DIA_CHI_Districts: user.DIA_CHI_Districts,
          DIA_CHI_Wards: user.DIA_CHI_Wards,
          DIA_CHI_STREETNAME: user.DIA_CHI_STREETNAME,
          LIST_PERMISION: user.LIST_PERMISION,
          NAME_ROLE: user.NAME_ROLE,
          CODE_NAME: user.CODE_NAME,
        },
        JWT_SECRET,
        { expiresIn: "5h" }
      );

      return res.status(200).json({
        EM: "Tạo người dùng mới và đăng nhập thành công",
        EC: 200,
        DT: {
          accessToken: token,
          userInfo: {
            ID_USERS: user.ID_USERS,
            EMAIL: user.EMAIL,
            HO_TEN: user.HO_TEN,
            ID_ROLE: user.ID_ROLE, // Cập nhật thành ID_ROLE
            SO_DIEN_THOAI: user.SO_DIEN_THOAI,
            TRANG_THAI_USER: user.TRANG_THAI_USER,
            NGAY_TAO_USER: user.NGAY_TAO_USER,
            NGAY_CAP_NHAT_USER: user.NGAY_CAP_NHAT_USER,
            AVATAR: user.AVATAR,
            DIA_CHI_Provinces: user.DIA_CHI_Provinces,
            DIA_CHI_Districts: user.DIA_CHI_Districts,
            DIA_CHI_Wards: user.DIA_CHI_Wards,
            DIA_CHI_STREETNAME: user.DIA_CHI_STREETNAME,
            LIST_PERMISION: user.LIST_PERMISION,
            NAME_ROLE: user.NAME_ROLE,
            CODE_NAME: user.CODE_NAME,
          },
        },
      });
    }
  } catch (error) {
    console.error("Lỗi trong loginUserGoogle:", error);
    return res.status(500).json({
      EM: `Lỗi: ${error.message}`,
      EC: 500,
      DT: [],
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      EM: "Email và mật khẩu không được để trống",
      EC: 0,
      DT: [],
    });
  }

  try {
    // Kiểm tra người dùng và lấy thông tin vai trò
    const [rows] = await pool.query(
      `SELECT u.*, r.LIST_PERMISION, r.NAME_ROLE, r.CODE_NAME 
       FROM users u 
       LEFT JOIN role r ON u.VAI_TRO = r.ID_ROLE 
       WHERE u.EMAIL = ? AND r.IS_DELETE = 0`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        EM: "Người dùng không tồn tại hoặc vai trò không hợp lệ",
        EC: 0,
        DT: [],
      });
    }

    const user = rows[0];

    // Kiểm tra nếu tài khoản bị khóa hoặc bị xóa
    if (user.TRANG_THAI_USER !== "ACTIVE") {
      return res.status(403).json({
        EM: "Tài khoản không hoạt động, không thể đăng nhập",
        EC: 0,
        DT: "Account is not active",
      });
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(
      password,
      user._PASSWORD_HASH_USERS
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        EM: "Mật khẩu không đúng",
        EC: 0,
        DT: [],
      });
    }

    // Tạo JWT token
    const token = jwt.sign(
      {
        ID_USERS: user.ID_USERS,
        EMAIL: user.EMAIL,
        VAI_TRO: user.VAI_TRO,
        HO_TEN: user.HO_TEN,
        SO_DIEN_THOAI: user.SO_DIEN_THOAI,
        TRANG_THAI_USER: user.TRANG_THAI_USER,
        NGAY_TAO_USER: user.NGAY_TAO_USER,
        NGAY_CAP_NHAT_USER: user.NGAY_CAP_NHAT_USER,
        AVATAR: user.AVATAR,
        DIA_CHI_Provinces: user.DIA_CHI_Provinces,
        DIA_CHI_Districts: user.DIA_CHI_Districts,
        DIA_CHI_Wards: user.DIA_CHI_Wards,
        DIA_CHI_STREETNAME: user.DIA_CHI_STREETNAME,
        LIST_PERMISION: user.LIST_PERMISION,
        NAME_ROLE: user.NAME_ROLE,
        CODE_NAME: user.CODE_NAME,
      },
      JWT_SECRET,
      { expiresIn: "5h" }
    );

    // Trả về token và thông tin người dùng
    return res.status(200).json({
      EM: "Đăng nhập thành công",
      EC: 1,
      DT: {
        accessToken: token,
        userInfo: {
          ID_USERS: user.ID_USERS,
          EMAIL: user.EMAIL,
          HO_TEN: user.HO_TEN,
          VAI_TRO: user.VAI_TRO,
          SO_DIEN_THOAI: user.SO_DIEN_THOAI,
          TRANG_THAI_USER: user.TRANG_THAI_USER,
          NGAY_TAO_USER: user.NGAY_TAO_USER,
          NGAY_CAP_NHAT_USER: user.NGAY_CAP_NHAT_USER,
          AVATAR: user.AVATAR,
          DIA_CHI_Provinces: user.DIA_CHI_Provinces,
          DIA_CHI_Districts: user.DIA_CHI_Districts,
          DIA_CHI_Wards: user.DIA_CHI_Wards,
          DIA_CHI_STREETNAME: user.DIA_CHI_STREETNAME,
          LIST_PERMISION: user.LIST_PERMISION,
          NAME_ROLE: user.NAME_ROLE,
          CODE_NAME: user.CODE_NAME,
        },
      },
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    return res.status(500).json({
      EM: `Lỗi: ${error.message}`,
      EC: -1,
      DT: [],
    });
  }
};
const verifyAdmin = async (req, res) => {
  const { token } = req.body;
  console.log("token", token);

  if (!token) {
    return res.status(401).json({
      EM: "Token is missing",
      EC: 401,
      DT: { isAdmin: false },
    });
  }

  try {
    // Giải mã token
    const decoded = jwt.verify(token, JWT_SECRET);

    const ID_USERS = decoded.ID_USERS;
    console.log("id", decoded);

    // Truy vấn để lấy thông tin user và role từ database
    const [rows] = await pool.query(
      `SELECT u.*, r.LIST_PERMISION, r.NAME_ROLE, r.CODE_NAME 
       FROM users u 
       LEFT JOIN role r ON u.VAI_TRO = r.ID_ROLE 
       WHERE u.ID_USERS = ? AND u.TRANG_THAI_USER = 'ACTIVE' AND r.IS_DELETE = 0`,
      [ID_USERS]
    );

    if (rows.length > 0) {
      const user = rows[0];

      // Kiểm tra vai trò của người dùng (giả sử CODE_NAME = 'ADMIN' là admin)
      if (user.CODE_NAME === "ADMIN") {
        return res.status(200).json({
          EM: "User is admin",
          EC: 200,
          DT: {
            isAdmin: true,
            userInfo: {
              ID_USERS: user.ID_USERS,
              EMAIL: user.EMAIL,
              HO_TEN: user.HO_TEN,
              VAI_TRO: user.VAI_TRO,
              SO_DIEN_THOAI: user.SO_DIEN_THOAI,
              TRANG_THAI_USER: user.TRANG_THAI_USER,
              NGAY_TAO_USER: user.NGAY_TAO_USER,
              NGAY_CAP_NHAT_USER: user.NGAY_CAP_NHAT_USER,
              AVATAR: user.AVATAR,
              DIA_CHI_Provinces: user.DIA_CHI_Provinces,
              DIA_CHI_Districts: user.DIA_CHI_Districts,
              DIA_CHI_Wards: user.DIA_CHI_Wards,
              DIA_CHI_STREETNAME: user.DIA_CHI_STREETNAME,
              LIST_PERMISION: user.LIST_PERMISION,
              NAME_ROLE: user.NAME_ROLE,
              CODE_NAME: user.CODE_NAME,
            },
          },
        });
      } else {
        return res.status(403).json({
          EM: "User is not admin",
          EC: 403,
          DT: { isAdmin: false },
        });
      }
    } else {
      return res.status(404).json({
        EM: "User not found or inactive",
        EC: 404,
        DT: { isAdmin: false },
      });
    }
  } catch (error) {
    console.error("Error decoding token or querying database:", error);
    return res.status(401).json({
      EM: `Invalid token: ${error.message}`,
      EC: 401,
      DT: { isAdmin: false },
    });
  }
};
const registerUser = async (req, res) => {
  const {
    password,
    email,
    VAI_TRO = "0", // Giả sử mặc định là "user" nếu không có thông tin
    fullName,
    phone,
    DIA_CHI = null, // Nếu không có địa chỉ thì gán là null
    TRANG_THAI_USER = "1", // Mặc định người dùng ở trạng thái "active"
    AVATAR = null, // Mặc định không có avatar
    NGAY_SINH = null, // Ngày sinh mặc định là null nếu không có
    DIA_CHI_Provinces = null, // Nếu không có địa chỉ thì gán là null
    DIA_CHI_Districts = null,
    DIA_CHI_Wards = null,
    THEMES = "dark", // Mặc định không có theme
    LANGUAGE = "vi", // Giả sử mặc định ngôn ngữ là tiếng Việt
  } = req.body.formData;

  const EMAIL = email;
  const HO_TEN = fullName;
  const SO_DIEN_THOAI = phone;

  // Mã hóa mật khẩu trước khi lưu vào database
  const hashedPassword = await bcrypt.hash(password, 10);

  // Kiểm tra xem có thiếu thông tin cần thiết không
  if (!EMAIL || !hashedPassword || !HO_TEN || !SO_DIEN_THOAI) {
    return res.status(400).json({
      EM: "Missing required fields",
      EC: 0,
      DT: [],
    });
  }

  try {
    // Kiểm tra xem email đã tồn tại trong cơ sở dữ liệu chưa
    const [existingUser] = await pool.query(
      `SELECT * FROM NGUOI_DUNG WHERE EMAIL = ?`,
      [EMAIL]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        EM: "Tài khoản email này đã được đăng ký",
        EC: 0,
        DT: [],
      });
    }

    // Thực hiện đăng ký người dùng mới
    const [result] = await pool.query(
      `INSERT INTO NGUOI_DUNG (
        MAT_KHAU, EMAIL, VAI_TRO, HO_TEN, SO_DIEN_THOAI, DIA_CHI, TRANG_THAI_USER, 
        NGAY_TAO_USER, NGAY_CAP_NHAT_USER, AVATAR, NGAY_SINH, DIA_CHI_Provinces, 
        DIA_CHI_Districts, DIA_CHI_Wards, THEMES, LANGUAGE
      ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?, ?, ?, ?, ?, ?)`,
      [
        hashedPassword,
        EMAIL,
        VAI_TRO,
        HO_TEN,
        SO_DIEN_THOAI,
        DIA_CHI,
        TRANG_THAI_USER,
        AVATAR,
        NGAY_SINH,
        DIA_CHI_Provinces,
        DIA_CHI_Districts,
        DIA_CHI_Wards,
        THEMES,
        LANGUAGE,
      ]
    );

    return res.status(200).json({
      EM: "Đăng ký tài khoản thành công",
      EC: 1,
      DT: {
        ID_NGUOI_DUNG: result.insertId, // Trả về ID người dùng mới
        EMAIL,
        HO_TEN,
      },
    });
  } catch (error) {
    console.error("Error in register:", error);
    return res.status(500).json({
      EM: `Error: ${error.message}`,
      EC: -1,
      DT: [],
    });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("accessToken");
  return res.status(200).json({ message: "Đăng xuất thành công" });
};
// API thay đổi avatar
const updateAvatarController = async (req, res) => {
  try {
    const { id } = req.params;
    const { avatar } = req.body;
    const ngayCapNhat = new Date();
    const avatarFile = req.file ? path.basename(req.file.path) : avatar;
    const [results] = await pool.execute(
      "SELECT * FROM NGUOI_DUNG WHERE ID_NGUOI_DUNG = ?",
      [id]
    );
    console.log("id user =>", id);
    if (results.length > 0) {
      const [results] = await pool.execute(
        "UPDATE NGUOI_DUNG SET NGAY_CAP_NHAT_USER = ? , AVATAR = ? WHERE ID_NGUOI_DUNG = ?",
        [ngayCapNhat, avatarFile, id]
      );

      // Lấy lại thông tin mới nhất của người dùng sau khi cập nhật
      const [updatedUser] = await pool.execute(
        "SELECT * FROM NGUOI_DUNG WHERE ID_NGUOI_DUNG = ?",
        [id]
      );
      console.log("updatedUser[0]", updatedUser[0]);
      const user = updatedUser[0];
      const token = jwt.sign(
        {
          ID_NGUOI_DUNG: user.ID_NGUOI_DUNG,
          EMAIL: user.EMAIL,
          VAI_TRO: user.VAI_TRO,
          HO_TEN: user.HO_TEN,
          SO_DIEN_THOAI: user.SO_DIEN_THOAI,
          DIA_CHI: user.DIA_CHI,
          TRANG_THAI_USER: user.TRANG_THAI_USER,
          NGAY_TAO_USER: user.NGAY_TAO_USER,
          NGAY_CAP_NHAT_USER: user.NGAY_CAP_NHAT_USER,
          AVATAR: user.AVATAR,
          DIA_CHI_Provinces: user.DIA_CHI_Provinces,
          DIA_CHI_Districts: user.DIA_CHI_Districts,
          DIA_CHI_Wards: user.DIA_CHI_Wards,
          DIA_CHI_STREETNAME: user.DIA_CHI_STREETNAME,
        },
        JWT_SECRET,
        { expiresIn: "5h" }
      );
      return res.status(200).json({
        EM: "Cập nhật thông tin thành công",
        EC: 1,
        DT: updatedUser,
        accessToken: token,
      });
    } else {
      return res.status(404).json({
        EM: "Không tìm thấy người dùng",
        EC: 0,
        DT: [],
      });
    }
  } catch (error) {
    console.error("Error updating avatar:", error);
    return res.status(500).json({
      EM: "Có lỗi xảy ra khi cập nhật avatar",
      EC: 0,
      DT: [],
    });
  }
};

const sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  // Tạo OTP và thời gian hết hạn
  const otp = crypto.randomInt(100000, 999999);
  const expiresAt = Date.now() + 1 * 60 * 1000; // 1 phút

  // Lưu OTP
  otpStorage.set(email, { otp, expiresAt });
  console.log("to email: ", email);
  // Gửi email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_OTP,
      pass: process.env.PASSWORD_OTP,
    },
  });

  const mailOptions = {
    from: "hohoangphucjob@gmail.com",
    to: email,
    subject: "PhucShoe2 - Your OTP Code",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <div style="text-align: center; padding: 10px 0;">
          <h1 style="color: #007BFF; margin-bottom: 5px;">PhucShoe2</h1>
          <p style="font-size: 16px; color: #555;">Your Trusted Shoe Store</p>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
          <h2 style="color: #007BFF;">Your OTP Code</h2>
          <p style="font-size: 18px; margin: 10px 0; font-weight: bold; color: #000;">${otp}</p>
          <p style="font-size: 14px; color: #555;">This code will expire in <strong>1 minutes</strong>.</p>
        </div>
        <div style="margin-top: 20px; text-align: center; color: #888; font-size: 12px;">
          <p>If you did not request this code, please ignore this email.</p>
          <p style="margin-top: 10px;">&copy; 2024 PhucShoe2. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({
      EM: "Gửi OTP thành công",
      EC: 1,
      DT: [],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Gửi OTP thất bại",
      EC: -1,
      DT: [],
    });
  }
};
const checkOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  // Kiểm tra OTP có tồn tại trong bộ nhớ
  const storedOtp = otpStorage.get(email);

  if (!storedOtp) {
    return res.status(400).json({
      EM: "OTP không tồn tại hoặc đã hết hạn",
      EC: -1,
      DT: [],
    });
  }

  // Kiểm tra thời gian hết hạn của OTP
  const currentTime = Date.now();
  if (currentTime > storedOtp.expiresAt) {
    otpStorage.delete(email); // Xóa OTP đã hết hạn
    return res.status(400).json({
      EM: "OTP đã hết hạn",
      EC: -1,
      DT: [],
    });
  }

  // Kiểm tra OTP có đúng không
  if (parseInt(otp) === storedOtp.otp) {
    return res.status(200).json({
      EM: "OTP hợp lệ",
      EC: 1,
      DT: [],
    });
  } else {
    return res.status(400).json({
      EM: "OTP không đúng",
      EC: -1,
      DT: [],
    });
  }
};

const updatePasswordUser = async (req, res) => {
  const { email, newPassword } = req.body;
  console.log("re", req.body);
  if (!email || !newPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Mã hóa mật khẩu
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Cập nhật vào database
  const result = await pool.query(
    "UPDATE NGUOI_DUNG SET MAT_KHAU = ? WHERE EMAIL = ?",
    [hashedPassword, email]
  );

  if (result[0].affectedRows > 0) {
    return res.status(200).json({
      EM: "Cập nhật mật khẩu thành công",
      EC: 1,
      DT: [],
    });
  } else {
    return res.status(500).json({
      EM: "Cập nhật mật khẩu thất bại",
      EC: 0,
      DT: [],
    });
  }
};

const updatePrefences = async (req, res) => {
  const { ID_NGUOI_DUNG, THEMES } = req.body;

  try {
    // Cập nhật `THEMES` vào database
    const result = await pool.execute(
      "UPDATE NGUOI_DUNG SET THEMES = ? WHERE ID_NGUOI_DUNG = ?",
      [THEMES, ID_NGUOI_DUNG]
    );

    if (result[0].affectedRows > 0) {
      return res.status(200).json({
        EM: "Cập nhật themes thành công",
        EC: 1,
        DT: THEMES,
      });
    } else {
      return res.status(500).json({
        EM: "Cập nhật themes không thành công",
        EC: 0,
        DT: [],
      });
    }
  } catch (error) {
    console.error("Error updating theme:", error);
    return res.status(500).json({
      EM: "Cập nhật themes không thành công",
      EC: 0,
      DT: [],
    });
  }
};
const updateLanguage = async (req, res) => {
  const { ID_NGUOI_DUNG, LANGUAGE } = req.body;
  console.log("LANGUAGE", LANGUAGE);
  try {
    // Cập nhật `LANGUAGE` vào database
    const result = await pool.query(
      "UPDATE NGUOI_DUNG SET LANGUAGE = ? WHERE ID_NGUOI_DUNG = ?",
      [LANGUAGE, ID_NGUOI_DUNG]
    );

    if (result[0].affectedRows > 0) {
      return res.status(200).json({
        EM: "Cập nhật LANGUAGE thành công",
        EC: 1,
        DT: LANGUAGE,
      });
    } else {
      return res.status(500).json({
        EM: "Cập nhật LANGUAGE không thành công",
        EC: 0,
        DT: [],
      });
    }
  } catch (error) {
    console.error("Error updating theme:", error);
    return res.status(500).json({
      EM: "Cập nhật LANGUAGE không thành công",
      EC: -1,
      DT: [],
    });
  }
};
const sendBirthdayWish = async (req, res) => {
  const { email, name, xungHo } = req.body;

  if (!email || !name) {
    return res.status(400).json({ message: "Email and name are required" });
  }

  // Tạo nội dung chúc mừng sinh nhật
  const birthdayMessage = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <div style="text-align: center; padding: 10px 0;">
        <h1 style="color: #007BFF; margin-bottom: 5px;">Chúc Mừng Sinh Nhật ${xungHo}!</h1>
        <p style="font-size: 16px; color: #555;">Kính chúc ${xungHo} có một ngày sinh nhật thật vui vẻ và hạnh phúc!</p>
      </div>
      <div style="padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
        <h2 style="color: #007BFF;">Chúc mừng sinh nhật ${xungHo}, ${name}!</h2>
        <p style="font-size: 18px; margin: 10px 0; font-weight: bold; color: #000;">Chúc ${xungHo} luôn trẻ trung, vui vẻ và thành công trong mọi công việc!</p>
        <p style="font-size: 14px; color: #555;">Nhân ngày sinh nhật của ${xungHo}, em xin chúc ${xungHo} thật nhiều sức khỏe, hạnh phúc và luôn tràn đầy năng lượng để tiếp tục công tác giảng dạy. Cảm ơn ${xungHo} vì sự tận tâm và yêu thương mà ${xungHo} đã dành cho chúng em. ${xungHo} luôn là nguồn cảm hứng lớn lao, giúp chúng em vững bước trên con đường học vấn.

Chúc ${xungHo} có một năm mới thật tuyệt vời, luôn tươi cười và gặp nhiều may mắn trong mọi lĩnh vực!

</p>
      </div>
      <div style="margin-top: 20px; text-align: center; color: #888; font-size: 12px;">
        <p>&copy; 2024 PhucShoe2. All rights reserved.</p>
      </div>
    </div>
  `;

  // Tạo đối tượng transporter cho việc gửi email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_OTP,
      pass: process.env.PASSWORD_OTP,
    },
  });

  const mailOptions = {
    from: "hohoangphucjob@gmail.com",
    to: email,
    subject: `Chúc Mừng Sinh Nhật ${xungHo} ${name} !`,
    html: birthdayMessage,
  };

  try {
    // Gửi email
    await transporter.sendMail(mailOptions);
    return res.status(200).json({
      EM: `Chúc mừng sinh nhật ${xungHo} ${name} thành công!`,
      EC: 1,
      DT: [],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Gửi chúc mừng sinh nhật thất bại",
      EC: -1,
      DT: [],
    });
  }
};
const sendTeacherDayWish = async (req, res) => {
  const { email, name, xungHo } = req.body;

  if (!email || !name) {
    return res.status(400).json({ message: "Email and name are required" });
  }

  const teacherDayMessage = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <div style="text-align: center; padding: 10px 0;">
        <h1 style="color: #007BFF; margin-bottom: 5px;">Chúc Mừng Ngày Nhà Giáo Việt Nam 20/11!</h1>
        <p style="font-size: 16px; color: #555;">Kính chúc ${xungHo} ${name} có một ngày 20/11 thật vui vẻ và ý nghĩa!</p>
      </div>
      <div style="padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
       
        <p style="font-size: 18px; margin: 10px 0; font-weight: bold; color: #000;">Em chúc ${xungHo} ${name} luôn mạnh khỏe, hạnh phúc và tiếp tục truyền đạt tri thức cho thế hệ tương lai!</p>
        <p style="font-size: 14px; color: #555;">Nhân ngày Nhà giáo Việt Nam, em xin gửi đến ${xungHo} ${name} lời cảm ơn chân thành vì những cống hiến cho sự nghiệp trồng người, nhân dịp ngày Nhà giáo Việt Nam 20/11, em xin gửi đến ${xungHo} những lời chúc tốt đẹp nhất. Cảm ơn ${xungHo} vì tất cả những kiến thức, sự nhiệt huyết và tình cảm mà ${xungHo} đã dành cho chúng em. ${xungHo} không chỉ là người thầy tuyệt vời mà còn là người bạn, người hướng dẫn tận tình trên con đường học tập.

Chúc ${xungHo} luôn mạnh khỏe, hạnh phúc và tiếp tục truyền cảm hứng cho bao thế hệ học sinh như chúng em!

Em luôn trân trọng và biết ơn ${xungHo} rất nhiều! </p>
      </div>
      <div style="margin-top: 20px; text-align: center; color: #888; font-size: 12px;">
        <p>&copy; 2024 PhucShoe2. All rights reserved.</p>
      </div>
    </div>
  `;

  // Tạo đối tượng transporter cho việc gửi email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_OTP,
      pass: process.env.PASSWORD_OTP,
    },
  });

  const mailOptions = {
    from: "hohoangphucjob@gmail.com",
    to: email,
    subject: "Chúc Mừng Ngày Nhà Giáo Việt Nam 20/11!",
    html: teacherDayMessage,
  };

  try {
    // Gửi email
    await transporter.sendMail(mailOptions);
    return res.status(200).json({
      EM: `Chúc mừng ngày Nhà giáo Việt Nam ${xungHo} ${name} thành công!`,
      EC: 1,
      DT: [],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Gửi chúc mừng ngày Nhà giáo thất bại",
      EC: -1,
      DT: [],
    });
  }
};

module.exports = {
  loginUserGoogle,
  verifyAdmin,
  logoutUser,

  updateUserById_Admin,
  getAllUser_Admin,
  updateAvatarController,
  getUser_ById,
  updateUserById_User,
  updatePrefences,
  updatePasswordUser,
  sendOtp,
  updateLanguage,
  checkOtp,
  sendBirthdayWish,
  sendTeacherDayWish,
  registerUser,
  loginUser,
};
