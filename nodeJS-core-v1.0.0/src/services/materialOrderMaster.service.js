const db = require("../config/database");

// Tạo mới đơn hàng nguyên vật liệu
const create = async (data) => {
  const {
    ID_COMPANY_BUYER,
    ID_COMPANY_SELLER,
    ID_COMPANY_SHIP,
    ORDER_DATE,
    DELIVERY_DATE,
    STATUS,
    TOTAL_COST,
    CREATED_AT,
  } = data;

  const [result] = await db.query(
    `INSERT INTO material_order_master 
    (ID_COMPANY_BUYER, ID_COMPANY_SELLER, ID_COMPANY_SHIP, ORDER_DATE, DELIVERY_DATE, STATUS, TOTAL_COST, CREATED_AT) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      ID_COMPANY_BUYER,
      ID_COMPANY_SELLER,
      ID_COMPANY_SHIP,
      ORDER_DATE,
      DELIVERY_DATE,
      STATUS,
      TOTAL_COST,
      CREATED_AT,
    ]
  );

  return result.insertId;
};

// Lấy tất cả đơn hàng
const getAll = async () => {
  const [rows] = await db.query(`SELECT * FROM material_order_master`);
  return rows;
};

// Lấy đơn hàng theo ID
const getById = async (id) => {
  const [rows] = await db.query(
    `SELECT * FROM material_order_master WHERE ID_MATERIAL_ORDER_MASTER = ?`,
    [id]
  );
  return rows[0] || null;
};

// Cập nhật đơn hàng theo ID
const update = async (id, data) => {
  const {
    ID_COMPANY_BUYER,
    ID_COMPANY_SELLER,
    ID_COMPANY_SHIP,
    ORDER_DATE,
    DELIVERY_DATE,
    STATUS,
    TOTAL_COST,
    UPDATED_AT,
  } = data;

  const [result] = await db.query(
    `UPDATE material_order_master 
     SET ID_COMPANY_BUYER = ?, ID_COMPANY_SELLER = ?, ID_COMPANY_SHIP = ?, ORDER_DATE = ?, DELIVERY_DATE = ?, STATUS = ?, TOTAL_COST = ?, UPDATED_AT = ?
     WHERE ID_MATERIAL_ORDER_MASTER = ?`,
    [
      ID_COMPANY_BUYER,
      ID_COMPANY_SELLER,
      ID_COMPANY_SHIP,
      ORDER_DATE,
      DELIVERY_DATE,
      STATUS,
      TOTAL_COST,
      UPDATED_AT,
      id,
    ]
  );

  return result.affectedRows > 0;
};

// Xóa đơn hàng
const deleteMaterialOrder = async (id) => {
  const [result] = await db.query(
    `DELETE FROM material_order_master WHERE ID_MATERIAL_ORDER_MASTER = ?`,
    [id]
  );
  return result.affectedRows > 0;
};
const getOrdersByCompanyAndMaterial = async (idCompany, idMaterial) => {
  const [rows] = await db.execute(
    `
    SELECT *
    FROM material_orders
    WHERE ID_COMPANY = ? AND ID_MATERIALS_ = ?
    `,
    [idCompany, idMaterial]
  );

  return rows;
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  delete: deleteMaterialOrder,
  getOrdersByCompanyAndMaterial,
};
