const db = require("../config/database");

const create = async (data) => {
  const { ID_PRODUCT, ID_USERS, CREATED_AT_CART, ID_COMPANY } = data;

  const [result] = await db.query(
    `INSERT INTO cart (ID_PRODUCT, ID_USERS, CREATED_AT_CART, ID_COMPANY) VALUES (?, ?, ?, ?)`,
    [ID_PRODUCT, ID_USERS, CREATED_AT_CART, ID_COMPANY]
  );

  return result.insertId;
};
const createOrUpdate = async (data) => {
  const {
    ID_PRODUCT_INSTANCE,
    ID_USERS,
    CREATED_AT_CART,
    ID_COMPANY,
    QUANTITY,
  } = data;

  if (QUANTITY <= 0) {
    throw new Error("Số lượng phải lớn hơn 0");
  }

  // Format lại ngày giờ cho MySQL
  const formatDatetimeToMySQL = (datetime) => {
    const d = new Date(datetime);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    const ss = String(d.getSeconds()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
  };

  const createdAtMySQL = formatDatetimeToMySQL(CREATED_AT_CART);

  const [rows] = await db.query(
    `SELECT ID_CART, QUANTITY FROM cart WHERE ID_PRODUCT_INSTANCE = ? AND ID_USERS = ?`,
    [ID_PRODUCT_INSTANCE, ID_USERS]
  );

  if (rows.length > 0) {
    const currentQuantity = rows[0].QUANTITY || 0;
    const newQuantity = currentQuantity + QUANTITY;

    if (newQuantity <= 0) {
      await db.query(`DELETE FROM cart WHERE ID_CART = ?`, [rows[0].ID_CART]);
      return null;
    }

    await db.query(
      `UPDATE cart SET QUANTITY = ?, CREATED_AT_CART = ?, ID_COMPANY = ? WHERE ID_CART = ?`,
      [newQuantity, createdAtMySQL, ID_COMPANY, rows[0].ID_CART]
    );

    return rows[0].ID_CART;
  } else {
    const [result] = await db.query(
      `INSERT INTO cart (ID_PRODUCT_INSTANCE, ID_USERS, CREATED_AT_CART, ID_COMPANY, QUANTITY) VALUES (?, ?, ?, ?, ?)`,
      [ID_PRODUCT_INSTANCE, ID_USERS, createdAtMySQL, ID_COMPANY, QUANTITY]
    );
    return result.insertId;
  }
};

const getAll = async () => {
  const [rows] = await db.query(`SELECT * FROM cart`);
  return rows;
};

const getById = async (id) => {
  const [rows] = await db.query(`SELECT * FROM cart WHERE ID_CART = ?`, [id]);
  return rows[0] || null;
};

const update = async (id, data) => {
  const { ID_PRODUCT, ID_USERS } = data;
  const [result] = await db.query(
    `UPDATE cart SET ID_PRODUCT = ?, ID_USERS = ? WHERE ID_CART = ?`,
    [ID_PRODUCT, ID_USERS, id]
  );
  return result.affectedRows > 0;
};

const deleteCart = async (id) => {
  const [result] = await db.query(`DELETE FROM cart WHERE ID_CART = ?`, [id]);
  return result.affectedRows > 0;
};
const getByUser = async (ID_USERS) => {
  const query = `
    SELECT
      c.ID_CART,
      c.ID_PRODUCT_INSTANCE,
      c.ID_USERS,
      c.CREATED_AT_CART,
      c.ID_COMPANY AS CART_ID_COMPANY,
      c.QUANTITY,
      p.ID_PRODUCT,
      p.ID_CATEGORIES_,
      p.NAME_PRODUCTS,
      p.DESCRIPTION_PRODUCTS,
      p.PRICE_PRODUCTS,
      p.STOCK_PRODUCTS,
      p.IMAGE_URL_PRODUCTS,
      p.CREATED_AT_PRODUCTS,
      p.UPDATED_AT_PRODUCTS,
      p.ID_COMPANY AS PRODUCT_ID_COMPANY,
      cat.NAME_CATEGORIES_,
      comp.NAME_COMPANY,
      comp.TYPE_COMPANY,
      comp.ADDRESS,
      comp.DIA_CHI_Provinces,
      comp.DIA_CHI_Districts,
      comp.DIA_CHI_Wards,
      comp.DIA_CHI_STREETNAME,
      comp.PHONE,
      comp.EMAIL,
      comp.AVATAR,
      comp.SLUG,
      comp.STATUS,
      comp.ID_COMPANY_TYPE
    FROM cart c
    INNER JOIN products p ON c.ID_PRODUCT_INSTANCE = p.ID_PRODUCT
    LEFT JOIN categories cat ON p.ID_CATEGORIES_ = cat.ID_CATEGORIES_
    LEFT JOIN companies comp ON p.ID_COMPANY = comp.ID_COMPANY
    WHERE c.ID_USERS = ?
  `;

  const [rows] = await db.query(query, [ID_USERS]);
  return rows;
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  delete: deleteCart,
  createOrUpdate,
  getByUser,
};
