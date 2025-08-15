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
const { checkUserPermission } = require("../middleware/JWTaction");
const URL_IMAGE_BASE = `http://localhost:` + process.env.PORT + ``; // hoặc lấy từ config/env

const saltRounds = 10;

const getAllUser_Admin = async (req, res) => {
  try {
    const { ID_COMPANY } = req.query;

    let query = "SELECT * FROM users";
    let values = [];

    // Nếu có ID_COMPANY thì thêm điều kiện WHERE
    if (ID_COMPANY) {
      query += " WHERE ID_COMPANY = ?";
      values.push(ID_COMPANY);
    }

    const [rows] = await pool.query(query, values);

    return res.status(200).json({
      EM: "Lấy thông tin người dùng thành công",
      EC: 1,
      DT: rows,
    });
  } catch (error) {
    console.error("Error in getAllUser_Admin:", error);
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

    const [rows] = await pool.query(
      `SELECT 
        u.*,
        r.NAME_ROLE,
        r.LIST_PERMISION,
        r.CODE_NAME,
        c.ID_COMPANY,
        c.NAME_COMPANY,
        c.TYPE_COMPANY,
        c.ADDRESS,
        c.DIA_CHI_Provinces,
        c.DIA_CHI_Districts,
        c.DIA_CHI_Wards,
        c.DIA_CHI_STREETNAME,
        c.PHONE,
        c.EMAIL AS COMPANY_EMAIL,
        c.AVATAR AS COMPANY_AVATAR,
        c.SLUG,
        c.CREATED_AT,
        c.UPDATED_AT,
        c.STATUS AS COMPANY_STATUS,
        ct.NAME_COMPANY_TYPE,
        ct.ROUTER_COMPANY
      FROM users u
      LEFT JOIN role r ON u.ID_ROLE = r.ID_ROLE
      LEFT JOIN companies c ON u.ID_COMPANY = c.ID_COMPANY
      LEFT JOIN company_types ct ON c.ID_COMPANY_TYPE = ct.ID_COMPANY_TYPE
      WHERE u.ID_USERS = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        EM: "Không tìm thấy người dùng",
        EC: 0,
        DT: {},
      });
    }

    const row = rows[0];

    const userInfo = {
      ID_USERS: row.ID_USERS,
      HO_TEN: row.HO_TEN,
      EMAIL: row.EMAIL,
      ID_ROLE: row.ID_ROLE,
      SO_DIEN_THOAI: row.SO_DIEN_THOAI,
      TRANG_THAI_USER: row.TRANG_THAI_USER,
      NGAY_TAO_USER: row.NGAY_TAO_USER,
      NGAY_CAP_NHAT_USER: row.NGAY_CAP_NHAT_USER,
      AVATAR: row.AVATAR ? URL_IMAGE_BASE + row.AVATAR : null,
      ID_COMPANY: row.ID_COMPANY,
      DIA_CHI_Provinces: row.DIA_CHI_Provinces,
      DIA_CHI_Districts: row.DIA_CHI_Districts,
      DIA_CHI_Wards: row.DIA_CHI_Wards,
      DIA_CHI_STREETNAME: row.DIA_CHI_STREETNAME,
      NAME_ROLE: row.NAME_ROLE,
      LIST_PERMISION: row.LIST_PERMISION,
      CODE_NAME: row.CODE_NAME,
    };

    const companyInfo = {
      ID_COMPANY: row.ID_COMPANY,
      NAME_COMPANY: row.NAME_COMPANY,
      TYPE_COMPANY: row.TYPE_COMPANY,
      ADDRESS: row.ADDRESS,
      DIA_CHI_Provinces: row.DIA_CHI_Provinces,
      DIA_CHI_Districts: row.DIA_CHI_Districts,
      DIA_CHI_Wards: row.DIA_CHI_Wards,
      DIA_CHI_STREETNAME: row.DIA_CHI_STREETNAME,
      PHONE: row.PHONE,
      EMAIL: row.COMPANY_EMAIL,
      AVATAR: row.COMPANY_AVATAR,
      SLUG: row.SLUG,
      CREATED_AT: row.CREATED_AT,
      UPDATED_AT: row.UPDATED_AT,
      STATUS: row.COMPANY_STATUS,
      NAME_COMPANY_TYPE: row.NAME_COMPANY_TYPE,
      ROUTER_COMPANY: row.ROUTER_COMPANY,
    };
    console.log("companyInfo", companyInfo);
    return res.status(200).json({
      EM: "Lấy thông tin người dùng kèm quyền và công ty thành công",
      EC: 1,
      DT: {
        ...userInfo,
        companyInfo,
      },
    });
  } catch (error) {
    console.error("Error in getUser_ById:", error);
    return res.status(500).json({
      EM: `Error: ${error.message}`,
      EC: -1,
      DT: {},
    });
  }
};

// ---------------------------------------------- updateUserById
const updateUserById_Admin = async (req, res) => {
  const {
    ID_ROLE,
    HO_TEN,
    EMAIL,
    _PASSWORD_HASH_USERS,
    SO_DIEN_THOAI,
    IS_DELETE_USERS,
    AVATAR,
    DIA_CHI_Provinces,
    DIA_CHI_Districts,
    DIA_CHI_Wards,
    DIA_CHI_STREETNAME,
    TRANG_THAI_USER,
    ID_COMPANY,
    DIA_CHI,
  } = req.body;

  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      EM: "Thiếu ID người dùng",
      EC: 0,
      DT: [],
    });
  }

  try {
    let hashedPassword = null;
    if (_PASSWORD_HASH_USERS) {
      const saltRounds = 10;
      hashedPassword = await bcrypt.hash(_PASSWORD_HASH_USERS, saltRounds);
    }

    const [result] = await pool.query(
      `UPDATE users 
       SET 
         ID_ROLE = ?, 
         HO_TEN = ?, 
         EMAIL = ?, 
         _PASSWORD_HASH_USERS = ?, 
         SO_DIEN_THOAI = ?, 
         NGAY_TAO_USER = NOW(), 
         NGAY_CAP_NHAT_USER = NOW(), 
         IS_DELETE_USERS = ?, 
         AVATAR = ?, 
         DIA_CHI_Provinces = ?, 
         DIA_CHI_Districts = ?, 
         DIA_CHI_Wards = ?, 
         DIA_CHI_STREETNAME = ?, 
         TRANG_THAI_USER = ?, 
         ID_COMPANY = ? 
       WHERE ID_USERS = ?`,
      [
        ID_ROLE,
        HO_TEN,
        EMAIL,
        hashedPassword, // sử dụng mật khẩu đã hash
        SO_DIEN_THOAI,
        IS_DELETE_USERS,
        AVATAR,
        DIA_CHI_Provinces,
        DIA_CHI_Districts,
        DIA_CHI_Wards,
        DIA_CHI_STREETNAME,
        TRANG_THAI_USER,
        ID_COMPANY,
        id,
      ]
    );

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
      DT: { id },
    });
  } catch (error) {
    console.error("Error in updateUserById_Admin:", error);
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
    ID_ROLE,
    DIA_CHI_Provinces,
    DIA_CHI_Districts,
    DIA_CHI_Wards,
    DIA_CHI_STREETNAME,
    TRANG_THAI_USER,
    ID_COMPANY,
    IS_DELETE_USERS,
    _PASSWORD_HASH_USERS,
  } = req.body;

  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      EM: "Thiếu ID người dùng",
      EC: 0,
      DT: [],
    });
  }

  try {
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

    const updateFields = [];
    const updateValues = [];

    const addField = (field, value) => {
      if (value !== undefined && value !== null && value !== "") {
        updateFields.push(`${field} = ?`);
        updateValues.push(value);
      }
    };

    addField("EMAIL", EMAIL);
    addField("HO_TEN", HO_TEN);
    addField("SO_DIEN_THOAI", SO_DIEN_THOAI);
    addField("DIA_CHI_Provinces", DIA_CHI_Provinces);
    addField("DIA_CHI_Districts", DIA_CHI_Districts);
    addField("DIA_CHI_Wards", DIA_CHI_Wards);
    addField("DIA_CHI_STREETNAME", DIA_CHI_STREETNAME);
    addField("_PASSWORD_HASH_USERS", _PASSWORD_HASH_USERS);
    addField("ID_COMPANY", ID_COMPANY);
    addField("IS_DELETE_USERS", IS_DELETE_USERS);

    // Nếu có file ảnh mới upload
    if (req.file) {
      const avatarPath = `/images/${req.file.filename}`;
      addField("AVATAR", avatarPath);
    }

    if (
      TRANG_THAI_USER !== undefined &&
      ["ACTIVE", "INACTIVE", "DELETED"].includes(TRANG_THAI_USER)
    ) {
      addField("TRANG_THAI_USER", TRANG_THAI_USER);
    }

    if (ID_ROLE !== undefined && ID_ROLE !== null && ID_ROLE !== "") {
      const [roleCheck] = await pool.execute(
        "SELECT ID_ROLE FROM role WHERE ID_ROLE = ? AND IS_DELETE = 0",
        [ID_ROLE]
      );
      if (roleCheck.length === 0) {
        return res.status(400).json({
          EM: "Vai trò không hợp lệ",
          EC: 0,
          DT: [],
        });
      }
      updateFields.push("ID_ROLE = ?");
      updateValues.push(ID_ROLE);
    }

    // Cập nhật thời gian
    const now = new Date();
    updateFields.push("NGAY_CAP_NHAT_USER = ?");
    updateValues.push(now);

    if (updateFields.length === 0) {
      return res.status(400).json({
        EM: "Không có thông tin nào để cập nhật",
        EC: 0,
        DT: [],
      });
    }

    const updateQuery = `
      UPDATE users 
      SET ${updateFields.join(", ")}
      WHERE ID_USERS = ?
    `;
    updateValues.push(id);

    const [updateResult] = await pool.execute(updateQuery, updateValues);

    if (updateResult.affectedRows > 0) {
      const [updatedUser] = await pool.execute(
        `SELECT u.*, r.LIST_PERMISION, r.NAME_ROLE, r.CODE_NAME 
         FROM users u 
         LEFT JOIN role r ON u.ID_ROLE = r.ID_ROLE 
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

      const token = jwt.sign(
        {
          ID_USERS: user.ID_USERS,
          EMAIL: user.EMAIL,
          ID_ROLE: user.ID_ROLE,
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
          ID_COMPANY: user.ID_COMPANY,
        },
        JWT_SECRET,
        { expiresIn: "5h" }
      );

      return res.status(200).json({
        EM: "Cập nhật thành công",
        EC: 1,
        DT: { ...user },
        accessToken: token,
      });
    } else {
      return res.status(400).json({
        EM: "Không thể cập nhật người dùng",
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

const createUser = async (req, res) => {
  const {
    ID_ROLE,
    HO_TEN,
    EMAIL,
    _PASSWORD_HASH_USERS, // mật khẩu người dùng nhập
    SO_DIEN_THOAI,
    AVATAR,
    DIA_CHI_Provinces,
    DIA_CHI_Districts,
    DIA_CHI_Wards,
    DIA_CHI_STREETNAME,
    TRANG_THAI_USER = "ACTIVE",
    ID_COMPANY,
  } = req.body;

  // Kiểm tra đầu vào
  if (!EMAIL || !_PASSWORD_HASH_USERS || !HO_TEN) {
    return res.status(400).json({
      EM: "Vui lòng nhập đầy đủ: Họ tên, Email và Mật khẩu",
      EC: 0,
      DT: [],
    });
  }

  try {
    // Kiểm tra Email đã tồn tại chưa
    const [emailCheck] = await pool.query(
      "SELECT ID_USERS FROM users WHERE EMAIL = ? AND IS_DELETE_USERS = 0",
      [EMAIL]
    );

    if (emailCheck.length > 0) {
      return res.status(409).json({
        EM: "Email đã tồn tại trong hệ thống",
        EC: 0,
        DT: [],
      });
    }

    // Hash mật khẩu
    const hashPassword = await bcrypt.hash(_PASSWORD_HASH_USERS, saltRounds);

    // Tạo địa chỉ đầy đủ
    const DIA_CHI = `${DIA_CHI_STREETNAME || ""}, ${DIA_CHI_Wards || ""}, ${
      DIA_CHI_Districts || ""
    }, ${DIA_CHI_Provinces || ""}`;

    // Thêm user vào database
    const [result] = await pool.query(
      `INSERT INTO users (
        ID_ROLE, HO_TEN, EMAIL, _PASSWORD_HASH_USERS, SO_DIEN_THOAI,
        NGAY_TAO_USER, IS_DELETE_USERS, AVATAR,
        DIA_CHI_Provinces, DIA_CHI_Districts, DIA_CHI_Wards,
        DIA_CHI_STREETNAME, TRANG_THAI_USER, ID_COMPANY
      ) VALUES (?, ?, ?, ?, ?, NOW(), 0, ?, ?, ?, ?, ?, ?, ?)`,
      [
        ID_ROLE,
        HO_TEN,
        EMAIL,
        hashPassword,
        SO_DIEN_THOAI,
        AVATAR,
        DIA_CHI_Provinces,
        DIA_CHI_Districts,
        DIA_CHI_Wards,
        DIA_CHI_STREETNAME,
        TRANG_THAI_USER,
        ID_COMPANY,
      ]
    );

    return res.status(201).json({
      EM: "Tạo người dùng thành công",
      EC: 1,
      DT: {
        ID_USERS: result.insertId,
        EMAIL,
        HO_TEN,
      },
    });
  } catch (error) {
    console.error("Lỗi khi tạo người dùng:", error);
    return res.status(500).json({
      EM: `Lỗi hệ thống: ${error.message}`,
      EC: -1,
      DT: [],
    });
  }
};

// SSS
const loginUserGoogle = async (req, res) => {
  const { email, HO_TEN } = req.body;
  //  console.log("req.body loginUserGoogle", req.body);

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
    //    console.log("rows", rows);
    if (rows.length > 0) {
      const user = rows[0];
      //  console.log("user", user);

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
      // Kiểm tra xem role 'customer' đã tồn tại chưa
      let [roleRows] = await pool.query(
        `SELECT ID_ROLE FROM role WHERE CODE_NAME = 'CUSTOMER' AND IS_DELETE = 0`
      );

      let ID_ROLE;
      if (roleRows.length > 0) {
        // Nếu role đã tồn tại
        ID_ROLE = roleRows[0].ID_ROLE;
      } else {
        // Nếu chưa có, tạo mới role
        const NAME_ROLE = "Khách hàng";
        const CODE_NAME = "CUSTOMER";
        const LIST_PERMISION = JSON.stringify([]); // Gán danh sách quyền trống hoặc mặc định
        await pool.query(
          `INSERT INTO role (NAME_ROLE, CODE_NAME, LIST_PERMISION, IS_DELETE) VALUES (?, ?, ?, ?)`,
          [NAME_ROLE, CODE_NAME, LIST_PERMISION, 0]
        );

        // Lấy ID_ROLE vừa tạo
        [roleRows] = await pool.query(
          `SELECT ID_ROLE FROM role WHERE CODE_NAME = 'CUSTOMER' AND IS_DELETE = 0`
        );
        ID_ROLE = roleRows[0].ID_ROLE;
      }

      const TRANG_THAI_USER = "ACTIVE";
      await pool.query(
        `INSERT INTO users (EMAIL, ID_ROLE, HO_TEN, TRANG_THAI_USER, NGAY_TAO_USER, NGAY_CAP_NHAT_USER, IS_DELETE_USERS) 
         VALUES (?, ?, ?, ?, NOW(), NOW(), ?)`,
        [email, ID_ROLE, HO_TEN, TRANG_THAI_USER, 0]
      );

      // Lấy thông tin người dùng mới tạo
      const [newRows] = await pool.query(
        `SELECT u.*, r.LIST_PERMISION, r.NAME_ROLE, r.CODE_NAME 
         FROM users u 
         LEFT JOIN role r ON u.ID_ROLE = r.ID_ROLE AND r.IS_DELETE = 0
         WHERE u.EMAIL = ?`,
        [email]
      );

      //     console.log("newRows", newRows);
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
  console.log(req.body);
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
      `SELECT 
  u.*, 
  r.LIST_PERMISION, r.NAME_ROLE, r.CODE_NAME,
  c.NAME_COMPANY, c.TYPE_COMPANY, c.ADDRESS AS COMPANY_ADDRESS,
  c.DIA_CHI_Provinces AS COMPANY_PROVINCES, 
  c.DIA_CHI_Districts AS COMPANY_DISTRICTS, 
  c.DIA_CHI_Wards AS COMPANY_WARDS,
  c.DIA_CHI_STREETNAME AS COMPANY_STREETNAME,
  c.PHONE AS COMPANY_PHONE, 
  c.EMAIL AS COMPANY_EMAIL,
  c.AVATAR AS COMPANY_AVATAR,
  c.SLUG AS COMPANY_SLUG,
  c.CREATED_AT AS COMPANY_CREATED_AT,
  c.UPDATED_AT AS COMPANY_UPDATED_AT,
  c.STATUS AS COMPANY_STATUS,
  ct.NAME_COMPANY_TYPE
FROM users u
LEFT JOIN role r ON u.ID_ROLE = r.ID_ROLE
LEFT JOIN companies c ON u.ID_COMPANY = c.ID_COMPANY
LEFT JOIN company_types ct ON c.ID_COMPANY_TYPE = ct.ID_COMPANY_TYPE
WHERE u.EMAIL = ? AND r.IS_DELETE = 0
`,
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
        HO_TEN: user.HO_TEN,
        ID_ROLE: user.ID_ROLE,
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
        companyInfo: {
          NAME_COMPANY: user.NAME_COMPANY,
          TYPE_COMPANY: user.TYPE_COMPANY,
          ADDRESS: user.COMPANY_ADDRESS,
          DIA_CHI_Provinces: user.COMPANY_PROVINCES,
          DIA_CHI_Districts: user.COMPANY_DISTRICTS,
          DIA_CHI_Wards: user.COMPANY_WARDS,
          DIA_CHI_STREETNAME: user.COMPANY_STREETNAME,
          PHONE: user.COMPANY_PHONE,
          EMAIL: user.COMPANY_EMAIL,
          AVATAR: user.COMPANY_AVATAR,
          SLUG: user.COMPANY_SLUG,
          CREATED_AT: user.COMPANY_CREATED_AT,
          UPDATED_AT: user.COMPANY_UPDATED_AT,
          STATUS: user.COMPANY_STATUS,
          NAME_COMPANY_TYPE: user.NAME_COMPANY_TYPE,
        },
      },
      JWT_SECRET,
      { expiresIn: "5h" }
    );

    // Trả về token và thông tin người dùng
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
          ID_ROLE: user.ID_ROLE,
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
          companyInfo: {
            ID_COMPANY: user.ID_COMPANY,
            NAME_COMPANY: user.NAME_COMPANY,
            TYPE_COMPANY: user.TYPE_COMPANY,
            ADDRESS: user.COMPANY_ADDRESS,
            DIA_CHI_Provinces: user.COMPANY_PROVINCES,
            DIA_CHI_Districts: user.COMPANY_DISTRICTS,
            DIA_CHI_Wards: user.COMPANY_WARDS,
            DIA_CHI_STREETNAME: user.COMPANY_STREETNAME,
            PHONE: user.COMPANY_PHONE,
            EMAIL: user.COMPANY_EMAIL,
            AVATAR: user.COMPANY_AVATAR,
            SLUG: user.COMPANY_SLUG,
            CREATED_AT: user.COMPANY_CREATED_AT,
            UPDATED_AT: user.COMPANY_UPDATED_AT,
            STATUS: user.COMPANY_STATUS,
            NAME_COMPANY_TYPE: user.NAME_COMPANY_TYPE,
          },
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

  if (!token) {
    return res.status(401).json({
      EM: "Token is missing",
      EC: 401,
      DT: { isAdmin: false },
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const ID_USERS = decoded.ID_USERS;

    const [rows] = await pool.query(
      `SELECT 
        u.ID_USERS, u.HO_TEN, u.EMAIL, u.ID_ROLE, u.SO_DIEN_THOAI,
        u.TRANG_THAI_USER, u.NGAY_TAO_USER, u.NGAY_CAP_NHAT_USER, u.AVATAR,
        u.DIA_CHI_Provinces, u.DIA_CHI_Districts, u.DIA_CHI_Wards, u.DIA_CHI_STREETNAME,
        u.ID_COMPANY,
        r.LIST_PERMISION, r.NAME_ROLE, r.CODE_NAME,
        c.NAME_COMPANY, c.TYPE_COMPANY, c.ADDRESS, c.DIA_CHI_Provinces AS COMPANY_Provinces,
        c.DIA_CHI_Districts AS COMPANY_Districts, c.DIA_CHI_Wards AS COMPANY_Wards,
        c.DIA_CHI_STREETNAME AS COMPANY_StreetName, c.PHONE AS COMPANY_PHONE,
        c.EMAIL AS COMPANY_EMAIL, c.AVATAR AS COMPANY_AVATAR, c.SLUG,
        c.CREATED_AT AS COMPANY_CREATED_AT, c.UPDATED_AT AS COMPANY_UPDATED_AT,
        c.STATUS AS COMPANY_STATUS,
        ct.NAME_COMPANY_TYPE
      FROM users u
      LEFT JOIN role r ON u.ID_ROLE = r.ID_ROLE
      LEFT JOIN companies c ON u.ID_COMPANY = c.ID_COMPANY
      LEFT JOIN company_types ct ON c.ID_COMPANY_TYPE = ct.ID_COMPANY_TYPE
      WHERE u.ID_USERS = ? AND u.TRANG_THAI_USER = 'ACTIVE' AND u.IS_DELETE_USERS = 0 AND r.IS_DELETE = 0`,
      [ID_USERS]
    );

    if (rows.length > 0) {
      const user = rows[0];

      return res.status(200).json({
        EM: "User is admin",
        EC: 200,
        DT: {
          isAdmin: true,
          userInfo: {
            ID_USERS: user.ID_USERS,
            EMAIL: user.EMAIL,
            HO_TEN: user.HO_TEN,
            ID_ROLE: user.ID_ROLE,
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
            companyInfo: {
              ID_COMPANY: user.ID_COMPANY,
              NAME_COMPANY: user.NAME_COMPANY,
              TYPE_COMPANY: user.TYPE_COMPANY,
              ADDRESS: user.ADDRESS,
              DIA_CHI_Provinces: user.COMPANY_Provinces,
              DIA_CHI_Districts: user.COMPANY_Districts,
              DIA_CHI_Wards: user.COMPANY_Wards,
              DIA_CHI_STREETNAME: user.COMPANY_StreetName,
              PHONE: user.COMPANY_PHONE,
              EMAIL: user.COMPANY_EMAIL,
              AVATAR: user.COMPANY_AVATAR,
              SLUG: user.SLUG,
              CREATED_AT: user.COMPANY_CREATED_AT,
              UPDATED_AT: user.COMPANY_UPDATED_AT,
              STATUS: user.COMPANY_STATUS,
              NAME_COMPANY_TYPE: user.NAME_COMPANY_TYPE,
            },
          },
        },
      });
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
const deleteUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    // Thử xóa thật (hard delete)
    const [result] = await pool.execute(
      "DELETE FROM users WHERE ID_USERS = ?",
      [userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }

    // Nếu xóa thành công
    return res.json({ message: "Xóa người dùng thành công (hard delete)." });
  } catch (err) {
    // Nếu lỗi do khóa ngoại (foreign key constraint), chuyển sang xóa mềm
    if (err.code === "ER_ROW_IS_REFERENCED_" || err.errno === 1451) {
      try {
        const [softDeleteResult] = await pool.execute(
          "UPDATE users SET IS_DELETE_USERS = 1 WHERE ID_USERS = ?",
          [userId]
        );

        if (softDeleteResult.affectedRows === 0) {
          return res
            .status(404)
            .json({ message: "Không tìm thấy người dùng." });
        }

        return res.json({
          message:
            "Xóa người dùng thành công (soft delete do ràng buộc khóa ngoại).",
        });
      } catch (softDeleteErr) {
        console.error("Lỗi khi thực hiện xóa mềm:", softDeleteErr);
        return res.status(500).json({ message: "Lỗi server khi xóa mềm." });
      }
    }

    // Các lỗi khác trả về lỗi server
    console.error("Lỗi xóa người dùng:", err);
    return res.status(500).json({ message: "Lỗi server." });
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
  createUser,
  deleteUserById,
};
