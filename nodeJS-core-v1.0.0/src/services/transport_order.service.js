const db = require("../config/database");

// Tạo đơn vận chuyển
const create = async (data) => {
  const {
    ID_COMPANY_SHIP,
    ID_MATERIAL_ORDER,
    ID_ORDER,
    DELIVERY_DATE,
    STATUS,
    SHIPPING_COST,
    NOTE,
    ID_FEE,
    ID_USERS_SHIP,
  } = data;
  console.log("data ", data);
  const [result] = await db.query(
    `INSERT INTO transport_orders (
      ID_COMPANY_SHIP, ID_MATERIAL_ORDER, ID_ORDER,
      DELIVERY_DATE, STATUS, SHIPPING_COST, NOTE,
      ID_FEE, ID_USERS_SHIP, CREATED_AT, UPDATED_AT
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [
      ID_COMPANY_SHIP,
      ID_MATERIAL_ORDER,
      ID_ORDER,
      DELIVERY_DATE,
      STATUS,
      SHIPPING_COST,
      NOTE,
      ID_FEE,
      ID_USERS_SHIP,
    ]
  );

  return result.insertId;
};

// Lấy tất cả đơn
const getAll = async () => {
  const [rows] = await db.query("SELECT * FROM transport_orders");
  return rows;
};

// Lấy theo ID
const getById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM transport_orders WHERE ID_TRANSPORT_ORDER = ?",
    [id]
  );
  return rows[0] || null;
};

// Cập nhật đơn
const update = async (id, data) => {
  const {
    ID_COMPANY_SHIP,
    ID_MATERIAL_ORDER,
    ID_ORDER,
    DELIVERY_DATE,
    STATUS,
    SHIPPING_COST,
    NOTE,
    ID_FEE,
    ID_USERS_SHIP,
  } = data;

  const [result] = await db.query(
    `UPDATE transport_orders SET
      ID_COMPANY_SHIP = ?, ID_MATERIAL_ORDER = ?, ID_ORDER = ?,
      DELIVERY_DATE = ?, STATUS = ?, SHIPPING_COST = ?, NOTE = ?,
      ID_FEE = ?, ID_USERS_SHIP = ?, UPDATED_AT = NOW()
    WHERE ID_TRANSPORT_ORDER = ?`,
    [
      ID_COMPANY_SHIP,
      ID_MATERIAL_ORDER,
      ID_ORDER,
      DELIVERY_DATE,
      STATUS,
      SHIPPING_COST,
      NOTE,
      ID_FEE,
      ID_USERS_SHIP,
      id,
    ]
  );

  return result.affectedRows > 0;
};

// Xóa đơn
const deleteOrder = async (id) => {
  const [result] = await db.query(
    "DELETE FROM transport_orders WHERE ID_TRANSPORT_ORDER = ?",
    [id]
  );
  return result.affectedRows > 0;
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  delete: deleteOrder,
};
