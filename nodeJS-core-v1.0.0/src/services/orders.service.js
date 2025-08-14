const db = require("../config/database");
const moment = require("moment");
const URL_IMAGE_BASE = `http://localhost:` + process.env.PORT + ``; // hoặc lấy từ config/env

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

const getAll = async ({ ID_COMPANY, ID_USERS }) => {
  let query = "SELECT * FROM orders";
  let params = [];

  if (ID_COMPANY) {
    query += " WHERE ID_COMPANY = ?";
    params.push(ID_COMPANY);
  } else if (ID_USERS) {
    query += " WHERE ID_USERS = ?";
    params.push(ID_USERS);
  }

  const [rows] = await db.query(query, params);
  return rows;
};

const getById = async (id) => {
  const [rows] = await db.query(
    `
    SELECT 
      o.ID_ORDERS_,
      o.ID_USERS,
      o.DATE_ORDER,
      o.TOTAL_AMOUNT_ORDER,
      o.PAYMENT_STATUS_ORDER,
      o.SHIPPING_STATUS_ORDER,
      o.SHIPPING_ADDRESS,
      o.SHIPPING_METHOD,
      o.SHIPPING_COST,
      o.ID_COMPANY,
      o.ID_TRANSPORT_ORDER,
      o.FULLNAME_ORDER,
      o.PHONE_ORDER,
      o.PAYMENT_METHOD,
      u.ID_USERS AS USER_ID,
      u.HO_TEN,
      u.EMAIL,


      oi.ID_ORDER_ITEMS,
      oi.QUANTITY_INVENTORY,
      oi.PRICE_ORDER_ITEMS,

      pi.ID_PRODUCT_INSTANCE,
      pi.SERIAL_CODE,
      pi.QUANTITY,

      p.ID_PRODUCT,
      p.NAME_PRODUCTS,
      p.DESCRIPTION_PRODUCTS,
      p.PRICE_PRODUCTS,
      p.STOCK_PRODUCTS,
      p.IMAGE_URL_PRODUCTS,

      c.ID_CATEGORIES_,
      c.NAME_CATEGORIES_

    FROM orders o
    JOIN users u ON o.ID_USERS = u.ID_USERS
    JOIN order_items oi ON o.ID_ORDERS_ = oi.ID_ORDERS_
    JOIN product_instances pi ON oi.ID_PRODUCT_INSTANCE = pi.ID_PRODUCT_INSTANCE
    JOIN products p ON pi.ID_PRODUCT = p.ID_PRODUCT
    JOIN categories c ON p.ID_CATEGORIES_ = c.ID_CATEGORIES_
    WHERE o.ID_ORDERS_ = ?
  `,
    [id]
  );

  if (rows.length === 0) return null;

  // Gom nhóm dữ liệu: đơn hàng + sản phẩm
  const orderInfo = {
    ID_ORDERS_: rows[0].ID_ORDERS_,
    ID_USERS: rows[0].ID_USERS,
    DATE_ORDER: rows[0].DATE_ORDER,
    TOTAL_AMOUNT_ORDER: rows[0].TOTAL_AMOUNT_ORDER,
    PAYMENT_STATUS_ORDER: rows[0].PAYMENT_STATUS_ORDER,
    SHIPPING_STATUS_ORDER: rows[0].SHIPPING_STATUS_ORDER,
    SHIPPING_ADDRESS: rows[0].SHIPPING_ADDRESS,
    SHIPPING_METHOD: rows[0].SHIPPING_METHOD,
    SHIPPING_COST: rows[0].SHIPPING_COST,
    ID_COMPANY: rows[0].ID_COMPANY,
    PAYMENT_METHOD: rows[0].PAYMENT_METHOD,
    ID_TRANSPORT_ORDER: rows[0].ID_TRANSPORT_ORDER,
    FULLNAME_ORDER: rows[0].FULLNAME_ORDER,
    PHONE_ORDER: rows[0].PHONE_ORDER,
    user: {
      ID_USERS: rows[0].USER_ID,
      HO_TEN: rows[0].HO_TEN,
      EMAIL: rows[0].EMAIL,
      AVATAR: rows[0].HO_TEN,
    },
    products: rows.map((r) => ({
      ID_ORDER_ITEMS: r.ID_ORDER_ITEMS,
      QUANTITY_INVENTORY: r.QUANTITY_INVENTORY,
      PRICE_ORDER_ITEMS: r.PRICE_ORDER_ITEMS,
      ID_PRODUCT_INSTANCE: r.ID_PRODUCT_INSTANCE,
      SERIAL_CODE: r.SERIAL_CODE,
      QUANTITY: r.QUANTITY,
      ID_PRODUCT: r.ID_PRODUCT,
      NAME_PRODUCTS: r.NAME_PRODUCTS,
      DESCRIPTION_PRODUCTS: r.DESCRIPTION_PRODUCTS,
      PRICE_PRODUCTS: r.PRICE_PRODUCTS,
      STOCK_PRODUCTS: r.STOCK_PRODUCTS,
      IMAGE_URL_PRODUCTS: r.IMAGE_URL_PRODUCTS
        ? URL_IMAGE_BASE + r.IMAGE_URL_PRODUCTS
        : null,
      category: {
        ID_CATEGORIES_: r.ID_CATEGORIES_,
        NAME_CATEGORIES_: r.NAME_CATEGORIES_,
      },
    })),
  };

  return orderInfo;
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
