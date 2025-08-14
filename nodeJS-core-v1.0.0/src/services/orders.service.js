const db = require("../config/database");
const moment = require("moment");
const create = async (orderData) => {
  const {
    ID_USERS,
    DATE_ORDER,
    FULLNAME_ORDER, // 📌 Họ tên người mua
    PHONE_ORDER, // 📌 Số điện thoại
    PAYMENT_STATUS_ORDER = "PENDING",
    SHIPPING_STATUS_ORDER = "PENDING",
    SHIPPING_ADDRESS,
    SHIPPING_METHOD,
    SHIPPING_COST = 0,
    ID_TRANSPORT_ORDER,
    PAYMENT_METHOD = "COD",
  } = orderData;

  const orderItems = orderData?.orderItems;
  if (!orderItems || orderItems.length === 0) {
    throw new Error("Danh sách sản phẩm trong đơn hàng không được rỗng");
  }

  const formattedDate = DATE_ORDER
    ? moment(DATE_ORDER).format("YYYY-MM-DD HH:mm:ss")
    : moment().format("YYYY-MM-DD HH:mm:ss");

  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    // 1️⃣ Nhóm sản phẩm theo ID_COMPANY
    const itemsByCompany = orderItems.reduce((acc, item) => {
      if (!acc[item.CART_ID_COMPANY]) {
        acc[item.CART_ID_COMPANY] = [];
      }
      acc[item.CART_ID_COMPANY].push(item);
      return acc;
    }, {});

    const createdOrderIds = [];

    // 2️⃣ Tạo 1 orders cho mỗi công ty
    for (const [companyId, items] of Object.entries(itemsByCompany)) {
      // Tính tổng tiền cho công ty này
      const totalAmount = items.reduce(
        (sum, item) => sum + item.PRICE_PRODUCTS * item.QUANTITY,
        0
      );

      // Insert vào bảng orders
      const [orderResult] = await conn.query(
        `INSERT INTO orders (
          ID_USERS, DATE_ORDER, TOTAL_AMOUNT_ORDER,
          PAYMENT_STATUS_ORDER, SHIPPING_STATUS_ORDER,
          SHIPPING_ADDRESS, SHIPPING_METHOD, SHIPPING_COST,
          ID_COMPANY, ID_TRANSPORT_ORDER, PAYMENT_METHOD, 
          FULLNAME_ORDER, PHONE_ORDER
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          ID_USERS,
          formattedDate,
          totalAmount,
          PAYMENT_STATUS_ORDER,
          SHIPPING_STATUS_ORDER,
          SHIPPING_ADDRESS,
          SHIPPING_METHOD,
          SHIPPING_COST,
          companyId,
          ID_TRANSPORT_ORDER,
          PAYMENT_METHOD,
          FULLNAME_ORDER, // 📌 Họ tên người mua
          PHONE_ORDER, // 📌 Số điện thoại
        ]
      );

      const newOrderId = orderResult.insertId;
      createdOrderIds.push(newOrderId);

      // 3️⃣ Thêm các sản phẩm của công ty này vào order_items
      for (const item of items) {
        await conn.query(
          `INSERT INTO order_items (
            ID_ORDERS_, QUANTITY_INVENTORY, PRICE_ORDER_ITEMS,
            ID_PRODUCT_INSTANCE, ID_COMPANY
          ) VALUES (?, ?, ?, ?, ?)`,
          [
            newOrderId,
            item.QUANTITY,
            item.PRICE_PRODUCTS,
            item.ID_PRODUCT_INSTANCE,
            item.CART_ID_COMPANY,
          ]
        );
      }
    }

    await conn.commit();
    return createdOrderIds;
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
