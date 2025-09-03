const db = require("../config/database");
const moment = require("moment");
const URL_IMAGE_BASE = `http://localhost:` + process.env.PORT + ``; // hoặc lấy từ config/env
const nodemailer = require("nodemailer");

const create = async (orderData) => {
  const {
    ID_USERS,
    DATE_ORDER,
    FULLNAME_ORDER,
    PHONE_ORDER,
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

    // 🔹 Nhóm sản phẩm theo công ty
    const itemsByCompany = orderItems.reduce((acc, item) => {
      if (!acc[item.CART_ID_COMPANY]) {
        acc[item.CART_ID_COMPANY] = [];
      }
      acc[item.CART_ID_COMPANY].push(item);
      return acc;
    }, {});

    // 🔹 Tổng tiền toàn bộ đơn hàng
    const totalUserOrder = orderItems.reduce(
      (sum, item) => sum + item.PRICE_PRODUCTS * item.QUANTITY,
      0
    );

    // 🔹 Tạo user_orders (đơn hàng cha)
    const [userOrderResult] = await conn.query(
      `INSERT INTO user_orders (
        ID_USERS, DATE_CREATED, TOTAL_AMOUNT
      ) VALUES (?, ?, ?)`,
      [ID_USERS, formattedDate, totalUserOrder]
    );

    const newUserOrderId = userOrderResult.insertId;

    const createdOrderIds = [];

    // 🔹 Tạo orders (đơn hàng con, theo từng công ty)
    for (const [companyId, items] of Object.entries(itemsByCompany)) {
      const totalAmount = items.reduce(
        (sum, item) => sum + item.PRICE_PRODUCTS * item.QUANTITY,
        0
      );

      const [orderResult] = await conn.query(
        `INSERT INTO orders (
          ID_USER_ORDER, DATE_ORDER, TOTAL_AMOUNT_ORDER,
          PAYMENT_STATUS_ORDER, SHIPPING_STATUS_ORDER,
          SHIPPING_ADDRESS, SHIPPING_METHOD, SHIPPING_COST,
          ID_COMPANY, ID_TRANSPORT_ORDER, PAYMENT_METHOD, 
          FULLNAME_ORDER, PHONE_ORDER
        ) VALUES (?,  ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newUserOrderId, // 🔗 liên kết với user_orders

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
          FULLNAME_ORDER,
          PHONE_ORDER,
        ]
      );

      const newOrderId = orderResult.insertId;
      createdOrderIds.push(newOrderId);

      // 🔹 Tạo order_items
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

    // 🔹 Xóa sản phẩm khỏi giỏ
    const productInstanceIds = orderItems.map(
      (item) => item.ID_PRODUCT_INSTANCE
    );
    await clearCartItems(ID_USERS, productInstanceIds);

    await conn.commit();

    // 🔹 Gửi email xác nhận đơn hàng
    const userInfo = await getUserEmail(ID_USERS);

    const orderDetails = {
      userOrderId: newUserOrderId,
      orderIds: createdOrderIds.join(", "),
      tongTien: totalUserOrder,
      ngayTaoDonHang: formattedDate,
      items: orderItems.map((item) => ({
        tenSanPham: item.NAME_PRODUCTS,
        soLuong: item.QUANTITY,
        giaSanPhamChiTiet: item.PRICE_PRODUCTS,
        moTa: item.DESCRIPTION_PRODUCTS,
        hinhAnh: item.IMAGE_URL_PRODUCTS,
      })),
      user: {
        name: userInfo.HO_TEN,
        address: userInfo.FULL_ADDRESS || "Chưa cập nhật",
        phone: userInfo.SO_DIEN_THOAI,
      },
    };

    await sendOrderEmail({ email: userInfo.EMAIL, orderDetails });

    return { userOrderId: newUserOrderId, orderIds: createdOrderIds };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

const getUserEmail = async (userId) => {
  const conn = await db.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT EMAIL, HO_TEN, SO_DIEN_THOAI, 
              CONCAT_WS(', ', DIA_CHI_STREETNAME, DIA_CHI_Wards, DIA_CHI_Districts, DIA_CHI_Provinces) AS FULL_ADDRESS
       FROM users 
       WHERE ID_USERS = ? AND IS_DELETE_USERS = 0`,
      [userId]
    );

    if (rows.length === 0) {
      return;
    }

    return rows[0]; // { EMAIL, HO_TEN, SO_DIEN_THOAI, FULL_ADDRESS }
  } finally {
    conn.release();
  }
};

// Hàm gửi email
const sendOrderEmail = async ({ email, orderDetails }) => {
  if (!email || !orderDetails) {
    return { EM: "Email và chi tiết đơn hàng là bắt buộc", EC: -1 };
  }

  const formattedTongTien = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(orderDetails.tongTien);

  // Nội dung email
  const orderMessage = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <div style="text-align: center; padding: 10px 0;">
        <h1 style="color: #007BFF;">Cảm Ơn Bạn Đã Đặt Hàng!</h1>
        <p style="font-size: 16px; color: #555;">Đơn hàng gốm sứ của bạn đã được ghi nhận thành công.</p>
      </div>

      <div style="padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
        <h2 style="color: #007BFF;">Chi Tiết Đơn Hàng</h2>
        <p><strong>Mã Đơn Hàng:</strong> ${orderDetails.orderId}</p>
        <p><strong>Tổng Tiền:</strong> ${formattedTongTien}</p>
        <p><strong>Ngày Đặt:</strong> ${orderDetails.ngayTaoDonHang}</p>

        <h3>Sản Phẩm:</h3>
        <ul>
          ${orderDetails.items
            .map(
              (item) => `
              <li style="margin-bottom:10px;">
       
                <strong>${item.tenSanPham}</strong> <br/>
                SL: ${item.soLuong} x ${new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(item.giaSanPhamChiTiet)} <br/>
                <em>${item.moTa}</em>
              </li>
            `
            )
            .join("")}
        </ul>

        <h3>Thông Tin Người Dùng:</h3>
        <p><strong>Họ Tên:</strong> ${orderDetails.user.name}</p>
        <p><strong>Địa Chỉ:</strong> ${orderDetails.user.address}</p>
        <p><strong>Số Điện Thoại:</strong> ${orderDetails.user.phone}</p>
      </div>

      <div style="margin-top: 20px; text-align: center; color: #888; font-size: 12px;">
        <p>&copy; 2025 ${
          orderDetails?.NAME_COMPANY
        } - Gốm Sứ Nghệ Thuật Việt. All rights reserved.</p>
      </div>
    </div>
  `;

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
    subject: "Thông Tin Đơn Hàng Gốm Sứ Của Bạn",
    html: orderMessage,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { EM: "Gửi email đơn hàng thành công", EC: 1 };
  } catch (error) {
    console.error("Error sending order email:", error);
    return { EM: "Gửi email thất bại", EC: -1 };
  }
};

// 📌 Hàm xóa sản phẩm trong giỏ hàng theo danh sách ID_PRODUCT_INSTANCE
const clearCartItems = async (userId, productInstanceIds) => {
  if (!productInstanceIds || productInstanceIds.length === 0) return;

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query(
      `DELETE FROM cart 
       WHERE ID_USERS = ? 
       AND ID_PRODUCT_INSTANCE IN (?)`,
      [userId, productInstanceIds]
    );

    await conn.commit();
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};
const getAll = async ({ ID_COMPANY, ID_USERS }) => {
  let query = `
    SELECT 
      uo.ID_USER_ORDER,
      uo.ID_USERS,
      uo.DATE_CREATED,
      uo.TOTAL_AMOUNT,
      o.STATUS,
      o.ID_ORDERS_,
      o.ID_COMPANY,
      o.PAYMENT_METHOD,
      o.DATE_ORDER,
      o.TOTAL_AMOUNT_ORDER,
      o.PAYMENT_STATUS_ORDER,
      o.SHIPPING_STATUS_ORDER,
      o.SHIPPING_ADDRESS,
      o.SHIPPING_METHOD,
      o.SHIPPING_COST,
      o.FULLNAME_ORDER,
      o.PHONE_ORDER
    FROM user_orders uo
    LEFT JOIN orders o ON uo.ID_USER_ORDER = o.ID_USER_ORDER
  `;

  let params = [];

  if (ID_COMPANY) {
    query += " WHERE o.ID_COMPANY = ?";
    params.push(ID_COMPANY);
  } else if (ID_USERS) {
    query += " WHERE uo.ID_USERS = ?";
    params.push(ID_USERS);
  }

  // Sắp xếp theo ngày tạo mới nhất
  query += " ORDER BY uo.DATE_CREATED DESC, o.DATE_ORDER DESC";

  const [rows] = await db.query(query, params);
  return rows;
};

const getById = async (id) => {
  const [rows] = await db.query(
    `
    SELECT 
      o.ID_ORDERS_,
      o.ID_USER_ORDER,
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
      o.STATUS ,
      uo.ID_USER_ORDER,
      uo.ID_USERS,
      uo.DATE_CREATED,
      uo.TOTAL_AMOUNT AS TOTAL_AMOUNT_USER_ORDER,


      u.ID_USERS AS USER_ID,
      u.HO_TEN,
      u.EMAIL,

      oi.ID_ORDER_ITEMS,
      oi.QUANTITY_INVENTORY,
      oi.PRICE_ORDER_ITEMS,

      pi.ID_PRODUCT_INSTANCE,
      pi.SERIAL_CODE,
      pi.QUANTITY,
   pi.PRICE_PRODUCTS,
      p.ID_PRODUCT,
      p.NAME_PRODUCTS,
      p.DESCRIPTION_PRODUCTS,
   
      p.IMAGE_URL_PRODUCTS,

      c.ID_CATEGORIES_,
      c.NAME_CATEGORIES_
    FROM orders o
    JOIN user_orders uo ON o.ID_USER_ORDER = uo.ID_USER_ORDER
    JOIN users u ON uo.ID_USERS = u.ID_USERS
    JOIN order_items oi ON o.ID_ORDERS_ = oi.ID_ORDERS_
    JOIN product_instances pi ON oi.ID_PRODUCT_INSTANCE = pi.ID_PRODUCT_INSTANCE
    JOIN products p ON pi.ID_PRODUCT = p.ID_PRODUCT
    JOIN categories c ON p.ID_CATEGORIES_ = c.ID_CATEGORIES_
    WHERE o.ID_ORDERS_ = ?
  `,
    [id]
  );

  if (rows.length === 0) return null;

  const orderInfo = {
    ID_ORDERS_: rows[0].ID_ORDERS_,
    ID_USER_ORDER: rows[0].ID_USER_ORDER,
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
    STATUS: rows[0].STATUS,
    userOrder: {
      ID_USER_ORDER: rows[0].ID_USER_ORDER,
      DATE_CREATED: rows[0].DATE_CREATED,
      TOTAL_AMOUNT: rows[0].TOTAL_AMOUNT_USER_ORDER,
    },

    user: {
      ID_USERS: rows[0].USER_ID,
      HO_TEN: rows[0].HO_TEN,
      EMAIL: rows[0].EMAIL,
      AVATAR: rows[0].HO_TEN, // chỗ này bạn có thể đổi thành trường avatar thực
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
// Đơn hàng chưa group của user
// const getOrdersByUserId = async (id) => {
//   const [rows] = await db.query(
//     `
//     SELECT
//       o.ID_ORDERS_,
//       o.ID_USER_ORDER,
//       o.DATE_ORDER,
//       o.TOTAL_AMOUNT_ORDER,
//       o.PAYMENT_STATUS_ORDER,
//       o.SHIPPING_STATUS_ORDER,
//       o.SHIPPING_ADDRESS,
//       o.SHIPPING_METHOD,
//       o.SHIPPING_COST,
//       o.ID_COMPANY,
//       o.ID_TRANSPORT_ORDER,
//       o.FULLNAME_ORDER,
//       o.PHONE_ORDER,
//       o.PAYMENT_METHOD,
//       o.STATUS,

//       uo.ID_USER_ORDER,
//       uo.ID_USERS AS USER_ID,
//       uo.DATE_CREATED,
//       uo.TOTAL_AMOUNT AS TOTAL_AMOUNT_USER_ORDER,

//       u.HO_TEN,
//       u.EMAIL,

//       oi.ID_ORDER_ITEMS,
//       oi.QUANTITY_INVENTORY,
//       oi.PRICE_ORDER_ITEMS,

//       pi.ID_PRODUCT_INSTANCE,
//       pi.SERIAL_CODE,
//       pi.QUANTITY,
//       pi.PRICE_PRODUCTS,

//       p.ID_PRODUCT,
//       p.NAME_PRODUCTS,
//       p.DESCRIPTION_PRODUCTS,
//       p.IMAGE_URL_PRODUCTS,

//       c.ID_CATEGORIES_,
//       c.NAME_CATEGORIES_,

//       com.ID_COMPANY AS COMPANY_ID,
//       com.NAME_COMPANY,
//       com.TYPE_COMPANY,
//       com.ADDRESS,
//       com.DIA_CHI_Provinces,
//       com.DIA_CHI_Districts,
//       com.DIA_CHI_Wards,
//       com.DIA_CHI_STREETNAME,
//       com.PHONE AS COMPANY_PHONE,
//       com.EMAIL AS COMPANY_EMAIL,
//       com.AVATAR AS COMPANY_AVATAR,
//       com.SLUG AS COMPANY_SLUG,
//       com.STATUS AS COMPANY_STATUS,
//       com.ID_COMPANY_TYPE

//     FROM orders o
//     JOIN user_orders uo ON o.ID_USER_ORDER = uo.ID_USER_ORDER
//     JOIN users u ON uo.ID_USERS = u.ID_USERS
//     JOIN order_items oi ON o.ID_ORDERS_ = oi.ID_ORDERS_
//     JOIN product_instances pi ON oi.ID_PRODUCT_INSTANCE = pi.ID_PRODUCT_INSTANCE
//     JOIN products p ON pi.ID_PRODUCT = p.ID_PRODUCT
//     JOIN categories c ON p.ID_CATEGORIES_ = c.ID_CATEGORIES_
//     LEFT JOIN companies com ON o.ID_COMPANY = com.ID_COMPANY
//     WHERE uo.ID_USERS = ?
//     ORDER BY o.DATE_ORDER DESC
//   `,
//     [id]
//   );

//   if (rows.length === 0) return [];

//   const ordersMap = new Map();

//   for (const r of rows) {
//     if (!ordersMap.has(r.ID_ORDERS_)) {
//       ordersMap.set(r.ID_ORDERS_, {
//         ID_ORDERS_: r.ID_ORDERS_,
//         ID_USER_ORDER: r.ID_USER_ORDER,
//         DATE_ORDER: r.DATE_ORDER,
//         TOTAL_AMOUNT_ORDER: r.TOTAL_AMOUNT_ORDER,
//         PAYMENT_STATUS_ORDER: r.PAYMENT_STATUS_ORDER,
//         SHIPPING_STATUS_ORDER: r.SHIPPING_STATUS_ORDER,
//         SHIPPING_ADDRESS: r.SHIPPING_ADDRESS,
//         SHIPPING_METHOD: r.SHIPPING_METHOD,
//         SHIPPING_COST: r.SHIPPING_COST,
//         ID_COMPANY: r.ID_COMPANY,
//         PAYMENT_METHOD: r.PAYMENT_METHOD,
//         ID_TRANSPORT_ORDER: r.ID_TRANSPORT_ORDER,
//         FULLNAME_ORDER: r.FULLNAME_ORDER,
//         PHONE_ORDER: r.PHONE_ORDER,
//         STATUS: r.STATUS,
//         userOrder: {
//           ID_USER_ORDER: r.ID_USER_ORDER,
//           DATE_CREATED: r.DATE_CREATED,
//           TOTAL_AMOUNT: r.TOTAL_AMOUNT_USER_ORDER,
//         },
//         user: {
//           ID_USERS: r.USER_ID,
//           HO_TEN: r.HO_TEN,
//           EMAIL: r.EMAIL,
//           AVATAR: r.HO_TEN,
//         },
//         company: r.COMPANY_ID
//           ? {
//               ID_COMPANY: r.COMPANY_ID,
//               NAME_COMPANY: r.NAME_COMPANY,
//               TYPE_COMPANY: r.TYPE_COMPANY,
//               ADDRESS: r.ADDRESS,
//               DIA_CHI_Provinces: r.DIA_CHI_Provinces,
//               DIA_CHI_Districts: r.DIA_CHI_Districts,
//               DIA_CHI_Wards: r.DIA_CHI_Wards,
//               DIA_CHI_STREETNAME: r.DIA_CHI_STREETNAME,
//               PHONE: r.COMPANY_PHONE,
//               EMAIL: r.COMPANY_EMAIL,
//               AVATAR: r.COMPANY_AVATAR
//                 ? URL_IMAGE_BASE + r.COMPANY_AVATAR
//                 : null,
//               SLUG: r.COMPANY_SLUG,
//               STATUS: r.COMPANY_STATUS,
//               ID_COMPANY_TYPE: r.ID_COMPANY_TYPE,
//             }
//           : null,
//         products: [],
//       });
//     }

//     ordersMap.get(r.ID_ORDERS_).products.push({
//       ID_ORDER_ITEMS: r.ID_ORDER_ITEMS,
//       QUANTITY_INVENTORY: r.QUANTITY_INVENTORY,
//       PRICE_ORDER_ITEMS: r.PRICE_ORDER_ITEMS,
//       ID_PRODUCT_INSTANCE: r.ID_PRODUCT_INSTANCE,
//       SERIAL_CODE: r.SERIAL_CODE,
//       QUANTITY: r.QUANTITY,
//       ID_PRODUCT: r.ID_PRODUCT,
//       NAME_PRODUCTS: r.NAME_PRODUCTS,
//       DESCRIPTION_PRODUCTS: r.DESCRIPTION_PRODUCTS,
//       PRICE_PRODUCTS: r.PRICE_PRODUCTS,
//       IMAGE_URL_PRODUCTS: r.IMAGE_URL_PRODUCTS
//         ? URL_IMAGE_BASE + r.IMAGE_URL_PRODUCTS
//         : null,
//       category: {
//         ID_CATEGORIES_: r.ID_CATEGORIES_,
//         NAME_CATEGORIES_: r.NAME_CATEGORIES_,
//       },
//     });
//   }

//   return Array.from(ordersMap.values());
// };

// Đơn hàng đã group của user
const getOrdersByUserId = async (id) => {
  const [rows] = await db.query(
    `
    SELECT 
      uo.ID_USER_ORDER,
      uo.ID_USERS AS USER_ID,
      uo.DATE_CREATED,
      uo.TOTAL_AMOUNT AS TOTAL_AMOUNT_USER_ORDER,

      u.HO_TEN,
      u.EMAIL,

      o.ID_ORDERS_,
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
      o.STATUS,
o.PAYMENT_METHOD,
      oi.ID_ORDER_ITEMS,
      oi.QUANTITY_INVENTORY,
      oi.PRICE_ORDER_ITEMS,
      oi.ID_PRODUCT_INSTANCE,

      pi.SERIAL_CODE,
      pi.QUANTITY,
      pi.PRICE_PRODUCTS,
      pi.ID_PRODUCT_INSTANCE,

      p.ID_PRODUCT,
      p.NAME_PRODUCTS,
      p.DESCRIPTION_PRODUCTS,
      p.IMAGE_URL_PRODUCTS,

      c.ID_CATEGORIES_,
      c.NAME_CATEGORIES_,

      com.ID_COMPANY AS COMPANY_ID,
      com.NAME_COMPANY,
      com.TYPE_COMPANY,
      com.ADDRESS,
      com.DIA_CHI_Provinces,
      com.DIA_CHI_Districts,
      com.DIA_CHI_Wards,
      com.DIA_CHI_STREETNAME,
      com.PHONE AS COMPANY_PHONE,
      com.EMAIL AS COMPANY_EMAIL,
      com.AVATAR AS COMPANY_AVATAR,
      com.SLUG AS COMPANY_SLUG,
      com.STATUS AS COMPANY_STATUS,
      com.ID_COMPANY_TYPE

    FROM user_orders uo
    JOIN users u ON uo.ID_USERS = u.ID_USERS
    JOIN orders o ON uo.ID_USER_ORDER = o.ID_USER_ORDER
    JOIN order_items oi ON o.ID_ORDERS_ = oi.ID_ORDERS_
    JOIN product_instances pi ON oi.ID_PRODUCT_INSTANCE = pi.ID_PRODUCT_INSTANCE
    JOIN products p ON pi.ID_PRODUCT = p.ID_PRODUCT
    JOIN categories c ON p.ID_CATEGORIES_ = c.ID_CATEGORIES_
    LEFT JOIN companies com ON o.ID_COMPANY = com.ID_COMPANY
    WHERE uo.ID_USERS = ?
    ORDER BY uo.DATE_CREATED DESC, o.DATE_ORDER DESC
  `,
    [id]
  );

  if (rows.length === 0) return [];

  // Map user_orders
  const userOrdersMap = new Map();

  for (const r of rows) {
    // Nếu chưa có userOrder thì thêm
    if (!userOrdersMap.has(r.ID_USER_ORDER)) {
      userOrdersMap.set(r.ID_USER_ORDER, {
        ID_USER_ORDER: r.ID_USER_ORDER,
        DATE_CREATED: r.DATE_CREATED,
        TOTAL_AMOUNT: r.TOTAL_AMOUNT_USER_ORDER,
        HO_TEN: r.HO_TEN,
        EMAIL: r.EMAIL,
        QUANTITY_ORDER: 0, // Khởi tạo tổng số lượng
        user: {
          ID_USERS: r.USER_ID,
          HO_TEN: r.HO_TEN,
          EMAIL: r.EMAIL,
        },
        orders: [],
      });
    }

    const currentUserOrder = userOrdersMap.get(r.ID_USER_ORDER);

    // Kiểm tra xem order đã tồn tại chưa
    let currentOrder = currentUserOrder.orders.find(
      (o) => o.ID_ORDERS_ === r.ID_ORDERS_
    );

    if (!currentOrder) {
      currentOrder = {
        ID_ORDERS_: r.ID_ORDERS_,
        DATE_ORDER: r.DATE_ORDER,
        TOTAL_AMOUNT_ORDER: r.TOTAL_AMOUNT_ORDER,
        PAYMENT_STATUS_ORDER: r.PAYMENT_STATUS_ORDER,
        SHIPPING_STATUS_ORDER: r.SHIPPING_STATUS_ORDER,
        SHIPPING_ADDRESS: r.SHIPPING_ADDRESS,
        SHIPPING_METHOD: r.SHIPPING_METHOD,
        SHIPPING_COST: r.SHIPPING_COST,
        ID_TRANSPORT_ORDER: r.ID_TRANSPORT_ORDER,
        FULLNAME_ORDER: r.FULLNAME_ORDER,
        PHONE_ORDER: r.PHONE_ORDER,
        STATUS: r.STATUS,
        PAYMENT_METHOD: r.PAYMENT_METHOD,
        NAME_COMPANY: r.NAME_COMPANY,
        company: r.COMPANY_ID
          ? {
              ID_COMPANY: r.COMPANY_ID,
              NAME_COMPANY: r.NAME_COMPANY,
              TYPE_COMPANY: r.TYPE_COMPANY,
              ADDRESS: r.ADDRESS,
              DIA_CHI_Provinces: r.DIA_CHI_Provinces,
              DIA_CHI_Districts: r.DIA_CHI_Districts,
              DIA_CHI_Wards: r.DIA_CHI_Wards,
              DIA_CHI_STREETNAME: r.DIA_CHI_STREETNAME,
              PHONE: r.COMPANY_PHONE,
              EMAIL: r.COMPANY_EMAIL,
              AVATAR: r.COMPANY_AVATAR
                ? URL_IMAGE_BASE + r.COMPANY_AVATAR
                : null,
              SLUG: r.COMPANY_SLUG,
              STATUS: r.COMPANY_STATUS,
              ID_COMPANY_TYPE: r.ID_COMPANY_TYPE,
            }
          : null,
        products: [],
      };

      currentUserOrder.orders.push(currentOrder);
    }

    // Thêm product
    currentOrder.products.push({
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
      IMAGE_URL_PRODUCTS: r.IMAGE_URL_PRODUCTS
        ? URL_IMAGE_BASE + r.IMAGE_URL_PRODUCTS
        : null,
      category: {
        ID_CATEGORIES_: r.ID_CATEGORIES_,
        NAME_CATEGORIES_: r.NAME_CATEGORIES_,
      },
    });

    // Cộng dồn số lượng sản phẩm vào QUANTITY_ORDER
    currentUserOrder.QUANTITY_ORDER += r.QUANTITY_INVENTORY || 0;
  }

  return Array.from(userOrdersMap.values());
};

const updateStatus = async (id, status) => {
  let query = `
    UPDATE orders 
    SET STATUS = ?, SHIPPING_STATUS_ORDER = ?
  `;
  let params = [status, status];

  // ✅ Nếu đã giao hàng => tự động set thanh toán thành PAID
  if (status === "SUCCESS") {
    query += `, PAYMENT_STATUS_ORDER = ?`;
    params.push("PAID");
  }

  query += ` WHERE ID_ORDERS_ = ?`;
  params.push(id);

  const [result] = await db.query(query, params);
  return result.affectedRows > 0;
};

const updatePAYMENT_STATUS_ORDER = async (id, status) => {
  const query = `
    UPDATE orders 
    SET PAYMENT_STATUS_ORDER = ?
    WHERE ID_ORDERS_ = ?
  `;
  const params = [status, id];

  const [result] = await db.query(query, params);
  return result.affectedRows > 0;
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  delete: deleteRecord,
  getOrdersByUserId,
  updateStatus,
  updatePAYMENT_STATUS_ORDER,
};
