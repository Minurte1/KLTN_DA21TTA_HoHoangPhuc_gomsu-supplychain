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

const getAll = async () => {
  const [rows] = await db.query(`
    SELECT 
      mom.ID_MATERIAL_ORDER_MASTER,
      mom.ID_COMPANY_BUYER,
      mom.ID_COMPANY_SELLER,
      mom.ID_COMPANY_SHIP,
      mom.ORDER_DATE,
      mom.DELIVERY_DATE,
      mom.STATUS,
      mom.TOTAL_COST,
      mom.CREATED_AT,
      mom.UPDATED_AT,

      mo.ID_MATERIAL_ORDER,
      mo.ID_MATERIALS_,
      mo.QUANTITY_ORDERED,
      mo.ORDER_DATE AS ORDER_DATE_DETAIL,
      mo.DELIVERY_DATE AS DELIVERY_DATE_DETAIL,
      mo.STATUS AS STATUS_DETAIL,
      mo.TOTAL_COST AS TOTAL_COST_DETAIL,
      mo.ID_COMPANY AS ID_COMPANY_DETAIL

    FROM material_order_master mom
    LEFT JOIN material_orders mo ON mom.ID_MATERIAL_ORDER_MASTER = mo.ID_MATERIAL_ORDER
  `);
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
const getOrdersByCompanyAndMaterial = async (idCompanySeller, idMaterial) => {
  const [rows] = await db.execute(
    `
    SELECT 
      mom.ID_MATERIAL_ORDER_MASTER,
      mom.ID_COMPANY_BUYER,
      mom.ID_COMPANY_SELLER,
      mom.ID_COMPANY_SHIP,
      mom.ORDER_DATE,
      mom.DELIVERY_DATE,
      mom.STATUS AS ORDER_STATUS,
      mom.TOTAL_COST,
      mom.CREATED_AT,
      mom.UPDATED_AT,

      mo.ID_MATERIALS_,
      mo.QUANTITY_ORDERED,
      mo.STATUS AS ITEM_STATUS,
      mo.TOTAL_COST AS ITEM_TOTAL_COST,

      m.NAME_ AS MATERIAL_NAME,
      m.UNIT_,
      m.COST_PER_UNIT_,
      m.ORIGIN,
      m.EXPIRY_DATE,

      c.NAME_COMPANY AS BUYER_NAME,
      c.TYPE_COMPANY AS BUYER_TYPE,
      c.ADDRESS AS BUYER_ADDRESS,
      c.DIA_CHI_Provinces,
      c.DIA_CHI_Districts,
      c.DIA_CHI_Wards,
      c.DIA_CHI_STREETNAME,
      c.PHONE AS BUYER_PHONE,
      c.EMAIL AS BUYER_EMAIL,
      c.AVATAR AS BUYER_AVATAR,
      c.STATUS AS BUYER_STATUS,
      ct.NAME_COMPANY_TYPE AS BUYER_COMPANY_TYPE

    FROM material_order_master AS mom
    JOIN material_orders AS mo ON mom.ID_MATERIAL_ORDER_MASTER = mo.ID_MATERIAL_ORDER_MASTER
    JOIN materials AS m ON mo.ID_MATERIALS_ = m.ID_MATERIALS_
    JOIN companies AS c ON mom.ID_COMPANY_BUYER = c.ID_COMPANY
    LEFT JOIN company_types AS ct ON c.ID_COMPANY_TYPE = ct.ID_COMPANY_TYPE

    WHERE mom.ID_COMPANY_SELLER = ?
      AND (? IS NULL OR m.ID_MATERIALS_ = ?)
    `,
    [idCompanySeller, idMaterial, idMaterial]
  );

  return rows;
};

const getOrdersByCompanyAndMaterial_idCompanyBuyer = async (
  idCompanyBuyer,
  idMaterial
) => {
  const [rows] = await db.execute(
    `
    SELECT 
      mom.ID_MATERIAL_ORDER_MASTER,
      mom.ID_COMPANY_BUYER,
      mom.ID_COMPANY_SELLER,
      mom.ID_COMPANY_SHIP,
      mom.ORDER_DATE,
      mom.DELIVERY_DATE,
      mom.STATUS AS ORDER_STATUS,
      mom.TOTAL_COST,
      mom.CREATED_AT,
      mom.UPDATED_AT,

      mo.ID_MATERIALS_,
      mo.QUANTITY_ORDERED,
      mo.STATUS AS ITEM_STATUS,
      mo.TOTAL_COST AS ITEM_TOTAL_COST,

      m.NAME_ AS MATERIAL_NAME,
      m.UNIT_,
      m.COST_PER_UNIT_,
      m.ORIGIN,
      m.EXPIRY_DATE,

      c.NAME_COMPANY AS BUYER_NAME,
      c.TYPE_COMPANY AS BUYER_TYPE,
      c.ADDRESS AS BUYER_ADDRESS,
      c.DIA_CHI_Provinces,
      c.DIA_CHI_Districts,
      c.DIA_CHI_Wards,
      c.DIA_CHI_STREETNAME,
      c.PHONE AS BUYER_PHONE,
      c.EMAIL AS BUYER_EMAIL,
      c.AVATAR AS BUYER_AVATAR,
      c.STATUS AS BUYER_STATUS,
      ct.NAME_COMPANY_TYPE AS BUYER_COMPANY_TYPE

    FROM material_order_master AS mom
    JOIN material_orders AS mo ON mom.ID_MATERIAL_ORDER_MASTER = mo.ID_MATERIAL_ORDER_MASTER
    JOIN materials AS m ON mo.ID_MATERIALS_ = m.ID_MATERIALS_
    JOIN companies AS c ON mom.ID_COMPANY_BUYER = c.ID_COMPANY
    LEFT JOIN company_types AS ct ON c.ID_COMPANY_TYPE = ct.ID_COMPANY_TYPE

    WHERE mom.ID_COMPANY_BUYER = ?
      AND (? IS NULL OR m.ID_MATERIALS_ = ?)
    `,
    [idCompanyBuyer, idMaterial, idMaterial]
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
  getOrdersByCompanyAndMaterial_idCompanyBuyer,
};
