const db = require("../config/database");

const create = async (orderData, orderItems) => {
  const {
    ID_USERS,
    DATE_ORDER,
    TOTAL_AMOUNT_ORDER,
    PAYMENT_STATUS_ORDER = "PENDING",
    SHIPPING_STATUS_ORDER = "PENDING",
    SHIPPING_ADDRESS,
    SHIPPING_METHOD,
    SHIPPING_COST = 0,
    ID_COMPANY,
    ID_TRANSPORT_ORDER,
    PAYMENT_METHOD = "COD", // COD, MOMO, VNPAY, ZALO
    IS_ONLINE_PAYMENT = 0, // 1 = online, 0 = COD
  } = orderData;

  if (!orderItems || orderItems.length === 0) {
    throw new Error("Danh sách sản phẩm trong đơn hàng không được rỗng");
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // 1️⃣ Tạo đơn hàng
    const [orderResult] = await conn.query(
      `INSERT INTO orders (
        ID_USERS, DATE_ORDER, TOTAL_AMOUNT_ORDER,
        PAYMENT_STATUS_ORDER, SHIPPING_STATUS_ORDER,
        SHIPPING_ADDRESS, SHIPPING_METHOD, SHIPPING_COST,
        ID_COMPANY, ID_TRANSPORT_ORDER, PAYMENT_METHOD, IS_ONLINE_PAYMENT
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        ID_USERS,
        DATE_ORDER,
        TOTAL_AMOUNT_ORDER,
        PAYMENT_STATUS_ORDER,
        SHIPPING_STATUS_ORDER,
        SHIPPING_ADDRESS,
        SHIPPING_METHOD,
        SHIPPING_COST,
        ID_COMPANY,
        ID_TRANSPORT_ORDER,
        PAYMENT_METHOD,
        IS_ONLINE_PAYMENT,
      ]
    );

    const newOrderId = orderResult.insertId;

    // 2️⃣ Thêm sản phẩm vào order_items
    for (const item of orderItems) {
      await conn.query(
        `INSERT INTO order_items (
          ID_ORDERS_, QUANTITY_INVENTORY, PRICE_ORDER_ITEMS,
          ID_PRODUCT_INSTANCE, ID_COMPANY
        ) VALUES (?, ?, ?, ?, ?)`,
        [
          newOrderId,
          item.QUANTITY_INVENTORY,
          item.PRICE_ORDER_ITEMS,
          item.ID_PRODUCT_INSTANCE,
          item.ID_COMPANY,
        ]
      );
    }

    await conn.commit();
    return newOrderId;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

const getAll = async () => {
  const [rows] = await db.query("SELECT * FROM orders");
  return rows;
};

const getById = async (id) => {
  const [rows] = await db.query("SELECT * FROM orders WHERE ID_ORDERS_ = ?", [
    id,
  ]);
  return rows[0] || null;
};

const update = async (id, data) => {
  const {
    ID_USERS,
    DATE_ORDER,
    TOTAL_AMOUNT_ORDER,
    PAYMENT_STATUS_ORDER,
    SHIPPING_STATUS_ORDER,
    SHIPPING_ADDRESS,
    SHIPPING_METHOD,
    SHIPPING_COST,
  } = data;

  const [result] = await db.query(
    `UPDATE orders SET
      ID_USERS = ?, DATE_ORDER = ?, TOTAL_AMOUNT_ORDER = ?,
      PAYMENT_STATUS_ORDER = ?, SHIPPING_STATUS_ORDER = ?,
      SHIPPING_ADDRESS = ?, SHIPPING_METHOD = ?, SHIPPING_COST = ?
    WHERE ID_ORDERS_ = ?`,
    [
      ID_USERS,
      DATE_ORDER,
      TOTAL_AMOUNT_ORDER,
      PAYMENT_STATUS_ORDER,
      SHIPPING_STATUS_ORDER,
      SHIPPING_ADDRESS,
      SHIPPING_METHOD,
      SHIPPING_COST,
      id,
    ]
  );
  return result.affectedRows > 0;
};

const deleteRecord = async (id) => {
  const [result] = await db.query("DELETE FROM orders WHERE ID_ORDERS_ = ?", [
    id,
  ]);
  return result.affectedRows > 0;
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  delete: deleteRecord,
};
