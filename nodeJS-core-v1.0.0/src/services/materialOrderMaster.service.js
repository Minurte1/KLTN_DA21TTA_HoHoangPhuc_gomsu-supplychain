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

const getAll = async (filters) => {
  const { idBuyer, idSeller, idShip, status, keyTable } = filters;
  console.log("Filters:", filters);

  let query = `
    SELECT 
      mom.ID_MATERIAL_ORDER_MASTER,
      mom.ID_COMPANY_BUYER,
      buyer.NAME_COMPANY AS NAME_COMPANY_BUYER,
      buyer.TYPE_COMPANY AS TYPE_BUYER,
      buyer.PHONE AS PHONE_BUYER,
      buyer.EMAIL AS EMAIL_BUYER,
      type_buyer.NAME_COMPANY_TYPE AS NAME_TYPE_BUYER,

      mom.ID_COMPANY_SELLER,
      seller.NAME_COMPANY AS NAME_COMPANY_SELLER,
      seller.TYPE_COMPANY AS TYPE_SELLER,
      seller.PHONE AS PHONE_SELLER,
      seller.EMAIL AS EMAIL_SELLER,
      type_seller.NAME_COMPANY_TYPE AS NAME_TYPE_SELLER,

      mom.ID_COMPANY_SHIP,
      ship.NAME_COMPANY AS NAME_COMPANY_SHIP,
      ship.TYPE_COMPANY AS TYPE_SHIP,
      ship.PHONE AS PHONE_SHIP,
      ship.EMAIL AS EMAIL_SHIP,
      type_ship.NAME_COMPANY_TYPE AS NAME_TYPE_SHIP,

      mom.ORDER_DATE,
      mom.DELIVERY_DATE,
      mom.STATUS,
      mom.TOTAL_COST,
      mom.CREATED_AT,
      mom.UPDATED_AT,
      mom.ID_FEE,

      mo.ID_MATERIAL_ORDER,
      mo.ID_MATERIALS_,
      mo.QUANTITY_ORDERED,
      mo.ORDER_DATE AS ORDER_DATE_DETAIL,
      mo.DELIVERY_DATE AS DELIVERY_DATE_DETAIL,
      mo.STATUS AS STATUS_DETAIL,
      mo.TOTAL_COST AS TOTAL_COST_DETAIL,
      mo.ID_COMPANY AS ID_COMPANY_DETAIL,

      m.NAME_ AS MATERIAL_NAME,
      m.QUANTITY,
      m.UNIT_ ,
      m.COST_PER_UNIT_,
      m.ORIGIN,
      m.EXPIRY_DATE
  `;

  // ✅ Nếu yêu cầu lấy từ transport_service_fees thì thêm các trường
  if (keyTable === "transport_service_fees") {
    query += `,
      tsf.SERVICE_NAME,
      tsf.UNIT AS FEE_UNIT,
      tsf.PRICE AS FEE_PRICE,
      tsf.NOTE AS FEE_NOTE,
      tsf.STATUS AS FEE_STATUS,
      tsf.CREATED_AT AS FEE_CREATED_AT,
      tsf.UPDATED_AT AS FEE_UPDATED_AT
    `;
  }

  query += `
    FROM material_order_master mom
    LEFT JOIN material_orders mo 
      ON mom.ID_MATERIAL_ORDER_MASTER = mo.ID_MATERIAL_ORDER_MASTER
    LEFT JOIN materials m 
      ON mo.ID_MATERIALS_ = m.ID_MATERIALS_
    LEFT JOIN companies buyer 
      ON mom.ID_COMPANY_BUYER = buyer.ID_COMPANY
    LEFT JOIN company_types type_buyer 
      ON buyer.ID_COMPANY_TYPE = type_buyer.ID_COMPANY_TYPE
    LEFT JOIN companies seller 
      ON mom.ID_COMPANY_SELLER = seller.ID_COMPANY
    LEFT JOIN company_types type_seller 
      ON seller.ID_COMPANY_TYPE = type_seller.ID_COMPANY_TYPE
    LEFT JOIN companies ship 
      ON mom.ID_COMPANY_SHIP = ship.ID_COMPANY
    LEFT JOIN company_types type_ship 
      ON ship.ID_COMPANY_TYPE = type_ship.ID_COMPANY_TYPE
  `;

  // ✅ Nếu yêu cầu dữ liệu từ bảng transport_service_fees thì JOIN thêm
  if (keyTable === "transport_service_fees") {
    query += `
      LEFT JOIN transport_service_fees tsf
        ON mom.ID_FEE = tsf.ID_FEE
    `;
  }

  const conditions = [];
  const params = [];

  if (idBuyer) {
    conditions.push("mom.ID_COMPANY_BUYER = ?");
    params.push(idBuyer);
  }
  if (idSeller) {
    conditions.push("mom.ID_COMPANY_SELLER = ?");
    params.push(idSeller);
  }
  if (idShip) {
    conditions.push("mom.ID_COMPANY_SHIP = ?");
    params.push(idShip);
  }
  if (status) {
    conditions.push("mom.STATUS = ?");
    params.push(status);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  const [rows] = await db.query(query, params);
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

const update = async (id, data) => {
  const {
    ID_COMPANY_BUYER,
    ID_COMPANY_SELLER,
    ID_COMPANY_SHIP,
    ORDER_DATE,
    DELIVERY_DATE,

    TOTAL_COST,
    UPDATED_AT,
  } = data;
  const STATUS = "CONFIRMED";
  const conn = await db.getConnection(); // dùng pool để lấy connection riêng
  try {
    await conn.beginTransaction();

    const [result] = await conn.query(
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

    if (result.affectedRows === 0) {
      await conn.rollback();
      return false;
    }

    // Truy vấn thứ 2
    try {
      const [material_order_master] = await conn.query(
        `UPDATE material_orders  
         SET STATUS = ? 
         WHERE ID_MATERIAL_ORDER_MASTER = ?`,
        [STATUS, id]
      );
    } catch (err) {
      await conn.rollback();
      console.error("Lỗi khi cập nhật material_orders:", err.message);
      throw new Error("Cập nhật bảng material_orders thất bại");
    }

    await conn.commit();
    return true;
  } catch (error) {
    await conn.rollback();
    console.error("Lỗi trong transaction:", error.message);
    throw error;
  } finally {
    conn.release(); // trả connection về pool
  }
};

// Xóa đơn hàng
const deleteMaterialOrder = async (id) => {
  const conn = await db.getConnection(); // nếu bạn dùng pool

  try {
    await conn.beginTransaction();

    // Xóa dữ liệu ở bảng con trước
    await conn.query(
      `DELETE FROM material_orders WHERE ID_MATERIAL_ORDER_MASTER = ?`,
      [id]
    );

    // Sau đó mới xóa ở bảng cha
    const [result] = await conn.query(
      `DELETE FROM material_order_master WHERE ID_MATERIAL_ORDER_MASTER = ?`,
      [id]
    );

    await conn.commit();
    return result.affectedRows > 0;
  } catch (error) {
    await conn.rollback();
    console.error("Lỗi khi xóa đơn hàng:", error);
    return false;
  } finally {
    conn.release();
  }
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
  idMaterial,
  STATUS
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
