const db = require("../config/database");

// Tạo đơn vận chuyển
const create = async (data) => {
  const {
    ID_COMPANY_SHIP,
    ID_MATERIAL_ORDER,
    ID_ORDER,
    // DELIVERY_DATE,
    STATUS,
    SHIPPING_COST,
    NOTE,
    ID_FEE,
    ID_USERS_SHIP,
    ID_MATERIAL_ORDER_MASTER,
  } = data;
  console.log("data ", data);
  const DELIVERY_DATE = null;
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

  const [material_order_master] = await db.query(
    `UPDATE material_order_master SET STATUS = ?
    WHERE ID_MATERIAL_ORDER_MASTER = ?`,
    [STATUS, ID_MATERIAL_ORDER_MASTER]
  );

  const [transport_orders] = await db.query(
    `UPDATE material_orders SET STATUS = ?
    WHERE ID_MATERIAL_ORDER_MASTER = ?`,
    [STATUS, ID_MATERIAL_ORDER_MASTER]
  );

  return result.insertId;
};

// Lấy tất cả đơn
const getAll = async () => {
  const [rows] = await db.query(`
    SELECT 
      -- Thông tin đơn vận chuyển
      todr.ID_TRANSPORT_ORDER,
      todr.ID_COMPANY_SHIP,
      todr.DELIVERY_DATE,
      todr.STATUS,
      todr.SHIPPING_COST,
      todr.CREATED_AT,
      todr.UPDATED_AT,
      todr.NOTE,
      todr.ID_USERS_SHIP,

      -- Thông tin công ty vận chuyển
      ship.NAME_COMPANY AS COMPANY_SHIP_NAME,
      ship.TYPE_COMPANY AS SHIP_TYPE_COMPANY,
      ship.DIA_CHI_Provinces AS SHIP_PROVINCE,
      ship.DIA_CHI_Districts AS SHIP_DISTRICT,
      ship.DIA_CHI_Wards AS SHIP_WARD,
      ship.DIA_CHI_STREETNAME AS SHIP_STREET,
      ship.PHONE AS SHIP_PHONE,
      ship.EMAIL AS SHIP_EMAIL,
      
      -- Thông tin đơn hàng vật liệu
      mo.ID_MATERIAL_ORDER,
      mo.QUANTITY_ORDERED,
      mo.ORDER_DATE AS MATERIAL_ORDER_DATE,
      mo.DELIVERY_DATE AS MATERIAL_DELIVERY_DATE,
      mo.STATUS AS MATERIAL_ORDER_STATUS,
      mo.TOTAL_COST AS MATERIAL_TOTAL_COST,

      -- Thông tin vật liệu
      m.ID_MATERIALS_,
      m.NAME_ AS MATERIAL_NAME,
      
      m.UNIT_ AS MATERIAL_UNIT,
      m.QUANTITY AS MATERIAL_STOCK,
      m.COST_PER_UNIT_,
      m.ORIGIN,
      m.EXPIRY_DATE,

      -- Thông tin loại vật liệu
      mt.ID_MATERIAL_TYPES,
      mt.NAME_MATERIAL_TYPES,

      -- Thông tin đơn hàng tổng
      mom.ID_MATERIAL_ORDER_MASTER,
      mom.ID_COMPANY_BUYER,
      mom.ID_COMPANY_SELLER,
      mom.ID_COMPANY_SHIP AS MASTER_SHIP_COMPANY,
      mom.ORDER_DATE AS MASTER_ORDER_DATE,
      mom.DELIVERY_DATE AS MASTER_DELIVERY_DATE,
      mom.STATUS AS MASTER_STATUS,
      mom.TOTAL_COST AS MASTER_TOTAL_COST,
      mom.CREATED_AT AS MASTER_CREATED_AT,
      mom.UPDATED_AT AS MASTER_UPDATED_AT,
      mom.ID_FEE,

      -- Thông tin công ty mua
      buyer.ID_COMPANY AS BUYER_ID,
      buyer.NAME_COMPANY AS BUYER_NAME,
      buyer.TYPE_COMPANY AS BUYER_TYPE_COMPANY,
      buyer.DIA_CHI_Provinces AS BUYER_PROVINCE,
      buyer.DIA_CHI_Districts AS BUYER_DISTRICT,
      buyer.DIA_CHI_Wards AS BUYER_WARD,
      buyer.DIA_CHI_STREETNAME AS BUYER_STREET,
      buyer.PHONE AS BUYER_PHONE,
      buyer.EMAIL AS BUYER_EMAIL,

      -- Thông tin công ty bán
      seller.ID_COMPANY AS SELLER_ID,
      seller.NAME_COMPANY AS SELLER_NAME,
      seller.TYPE_COMPANY AS SELLER_TYPE_COMPANY,
      seller.DIA_CHI_Provinces AS SELLER_PROVINCE,
      seller.DIA_CHI_Districts AS SELLER_DISTRICT,
      seller.DIA_CHI_Wards AS SELLER_WARD,
      seller.DIA_CHI_STREETNAME AS SELLER_STREET,
      seller.PHONE AS SELLER_PHONE,
      seller.EMAIL AS SELLER_EMAIL,

      -- Phí vận chuyển
      tsf.ID_FEE AS SHIPPING_FEE_ID,
      tsf.SERVICE_NAME,
      tsf.UNIT,
      tsf.PRICE AS SHIPPING_PRICE ,

      -- Thông tin người giao hàng (shipper)
    users.HO_TEN AS SHIPPER_NAME,
    users.EMAIL AS SHIPPER_EMAIL,
    users.SO_DIEN_THOAI AS SHIPPER_PHONE,
    users.AVATAR AS SHIPPER_AVATAR,
    users.DIA_CHI_Provinces AS SHIPPER_PROVINCE,
    users.DIA_CHI_Districts AS SHIPPER_DISTRICT,
    users.DIA_CHI_Wards AS SHIPPER_WARD,
    users.DIA_CHI_STREETNAME AS SHIPPER_STREET,
    users.TRANG_THAI_USER AS SHIPPER_STATUS,
    users.ID_COMPANY AS SHIPPER_COMPANY_ID
    FROM transport_orders todr

    LEFT JOIN companies ship ON todr.ID_COMPANY_SHIP = ship.ID_COMPANY

    LEFT JOIN material_orders mo ON todr.ID_MATERIAL_ORDER = mo.ID_MATERIAL_ORDER
    LEFT JOIN materials m ON mo.ID_MATERIALS_ = m.ID_MATERIALS_
    LEFT JOIN material_types mt ON m.ID_MATERIAL_TYPES = mt.ID_MATERIAL_TYPES

    LEFT JOIN material_order_master mom ON mo.ID_MATERIAL_ORDER_MASTER = mom.ID_MATERIAL_ORDER_MASTER
    LEFT JOIN companies buyer ON mom.ID_COMPANY_BUYER = buyer.ID_COMPANY
    LEFT JOIN companies seller ON mom.ID_COMPANY_SELLER = seller.ID_COMPANY

    LEFT JOIN transport_service_fees tsf ON tsf.ID_COMPANY_SHIP = todr.ID_COMPANY_SHIP
    LEFT JOIN users ON todr.ID_USERS_SHIP = users.ID_USERS
  `);
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
    // DELIVERY_DATE,
    STATUS,
    SHIPPING_COST,
    NOTE,
    ID_FEE,
    ID_USERS_SHIP,
    ID_MATERIAL_ORDER_MASTER,
  } = data;

  const [result] = await db.query(
    `UPDATE transport_orders SET
      ID_COMPANY_SHIP = ?, ID_MATERIAL_ORDER = ?, ID_ORDER = ?,
      DELIVERY_DATE = NOW(), STATUS = ?, SHIPPING_COST = ?, NOTE = ?,
      ID_FEE = ?, ID_USERS_SHIP = ?, UPDATED_AT = NOW()
    WHERE ID_TRANSPORT_ORDER = ?`,
    [
      ID_COMPANY_SHIP,
      ID_MATERIAL_ORDER,
      ID_ORDER,
      // DELIVERY_DATE,
      STATUS,
      SHIPPING_COST,
      NOTE,
      ID_FEE,
      ID_USERS_SHIP,
      id,
    ]
  );

  const [material_order_master] = await db.query(
    `UPDATE material_order_master SET STATUS = ?
    WHERE ID_MATERIAL_ORDER_MASTER = ?`,
    [STATUS, ID_MATERIAL_ORDER_MASTER]
  );

  const [transport_orders] = await db.query(
    `UPDATE material_orders SET STATUS = ?
    WHERE ID_MATERIAL_ORDER_MASTER = ?`,
    [STATUS, ID_MATERIAL_ORDER_MASTER]
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

const transport_ordersShipDELIVERING = async () => {
  const [rows] = await db.query(`
      SELECT 
        todr.ID_TRANSPORT_ORDER,
        todr.ID_COMPANY_SHIP,
        c.NAME_COMPANY AS COMPANY_SHIP_NAME,
        c.TYPE_COMPANY,
        c.DIA_CHI_Provinces,
        c.DIA_CHI_Districts,
        c.DIA_CHI_Wards,
        c.DIA_CHI_STREETNAME,
        c.PHONE,
        c.EMAIL,

        todr.ID_MATERIAL_ORDER,
        mo.QUANTITY_ORDERED,
        mo.ORDER_DATE AS MATERIAL_ORDER_DATE,
        mo.DELIVERY_DATE AS MATERIAL_DELIVERY_DATE,
        mo.TOTAL_COST AS MATERIAL_TOTAL_COST,

        mom.ID_MATERIAL_ORDER_MASTER,
        mom.ID_COMPANY_BUYER,
        mom.ID_COMPANY_SELLER,
        mom.TOTAL_COST AS MASTER_TOTAL_COST,

        tsf.ID_FEE,
        tsf.SERVICE_NAME,
        tsf.UNIT,
        tsf.PRICE AS SHIPPING_PRICE,

        todr.DELIVERY_DATE,
        todr.STATUS,
        todr.SHIPPING_COST,
        todr.CREATED_AT,
        todr.UPDATED_AT,
        todr.NOTE,
        todr.ID_USERS_SHIP

      FROM transport_orders todr

      LEFT JOIN companies c ON todr.ID_COMPANY_SHIP = c.ID_COMPANY

      LEFT JOIN transport_service_fees tsf ON tsf.ID_COMPANY_SHIP = todr.ID_COMPANY_SHIP

      LEFT JOIN material_orders mo ON todr.ID_MATERIAL_ORDER = mo.ID_MATERIAL_ORDER

      LEFT JOIN material_order_master mom ON mo.ID_MATERIAL_ORDER_MASTER = mom.ID_MATERIAL_ORDER_MASTER
    `);
  return rows;
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  delete: deleteOrder,
  transport_ordersShipDELIVERING,
};
