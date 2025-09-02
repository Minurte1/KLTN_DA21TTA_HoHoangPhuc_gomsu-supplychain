const db = require("../config/database");
const moment = require("moment");
const URL_IMAGE_BASE = `http://localhost:` + process.env.PORT + ``; // hoặc lấy từ config/env

const create = async (data) => {
  try {
    const {
      UID,
      ID_PRODUCT,
      SERIAL_CODE,
      ID_USERS,
      ID_PRODUCTION_PLANS,
      DATE_CREATED,
      STATUS = "IN_STOCK",
      ID_COMPANY,
    } = data;

    // Format ngày nếu có, nếu không lấy giá trị mặc định CURRENT_TIMESTAMP
    const dateCreatedFormatted = DATE_CREATED
      ? moment(DATE_CREATED).format("YYYY-MM-DD HH:mm:ss")
      : moment().format("YYYY-MM-DD HH:mm:ss");

    const idProduct = parseInt(ID_PRODUCT, 10);
    const idProductionPlans = ID_PRODUCTION_PLANS
      ? parseInt(ID_PRODUCTION_PLANS, 10)
      : null;
    const idCompany = ID_COMPANY ? parseInt(ID_COMPANY, 10) : null;

    if (isNaN(idProduct)) {
      throw new Error("ID_PRODUCT phải là số hợp lệ.");
    }
    if (ID_PRODUCTION_PLANS && isNaN(idProductionPlans)) {
      throw new Error("ID_PRODUCTION_PLANS phải là số hợp lệ hoặc null.");
    }
    if (ID_COMPANY && isNaN(idCompany)) {
      throw new Error("ID_COMPANY phải là số hợp lệ hoặc null.");
    }

    const [result] = await db.query(
      `INSERT INTO product_instances 
        (UID, ID_PRODUCT, SERIAL_CODE, ID_USERS, ID_PRODUCTION_PLANS, DATE_CREATED, STATUS, ID_COMPANY) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        UID,
        idProduct,
        SERIAL_CODE,
        ID_USERS,
        idProductionPlans,
        dateCreatedFormatted,
        STATUS,
        idCompany,
      ]
    );

    return result.insertId;
  } catch (error) {
    console.error("Error in create product_instance:", error);
    throw error;
  }
};

const getAll = async (ID_COMPANY, STATUS) => {
  try {
    let query = `
      SELECT 
        pi.*, 
        p.ID_PRODUCT, p.ID_CATEGORIES_, p.NAME_PRODUCTS, p.DESCRIPTION_PRODUCTS,   p.IMAGE_URL_PRODUCTS, p.CREATED_AT_PRODUCTS, p.UPDATED_AT_PRODUCTS, p.ID_COMPANY AS PRODUCT_ID_COMPANY,
        c.ID_CATEGORIES_, c.NAME_CATEGORIES_, c.ID_COMPANY AS CATEGORY_ID_COMPANY,
        pm.ID_PRODUCT_MATERIALS, pm.ID_PRODUCTION_PLANS, pm.ID_MATERIALS_, pm.QUANTITY_PER_UNIT_PRODUCT_MATERIALS, pm.UNIT_PRODUCT_MATERIALS, pm.ID_COMPANY AS PROD_MATERIALS_COMPANY,
        mt.ID_MATERIAL_TYPES, mt.NAME_MATERIAL_TYPES, mt.ID_COMPANY AS MATERIAL_TYPES_COMPANY,
        m.ID_MATERIALS_, m.ID_MATERIAL_TYPES AS MATERIAL_MATERIAL_TYPE, m.QUANTITY, m.NAME_ AS MATERIAL_NAME_, m.UNIT_, m.QUANTITY AS MATERIAL_QUANTITY, m.COST_PER_UNIT_, m.CREATED_AT_PRODUCTS AS MATERIAL_CREATED_AT, m.UPDATED_AT_PRODUCTS AS MATERIAL_UPDATED_AT, m.ORIGIN, m.EXPIRY_DATE, m.ID_COMPANY AS MATERIAL_COMPANY,
        pp.NAME_PRODUCTION_PLAN  -- Thêm tên kế hoạch sản xuất
      FROM product_instances pi
      JOIN products p ON pi.ID_PRODUCT = p.ID_PRODUCT AND pi.ID_COMPANY = p.ID_COMPANY
      JOIN categories c ON p.ID_CATEGORIES_ = c.ID_CATEGORIES_ AND p.ID_COMPANY = c.ID_COMPANY
      LEFT JOIN production_materials pm ON pm.ID_PRODUCTION_PLANS = pi.ID_PRODUCTION_PLANS AND pm.ID_COMPANY = pi.ID_COMPANY
      LEFT JOIN materials m ON pm.ID_MATERIALS_ = m.ID_MATERIALS_ AND m.ID_COMPANY = pi.ID_COMPANY
      LEFT JOIN material_types mt ON m.ID_MATERIAL_TYPES = mt.ID_MATERIAL_TYPES AND mt.ID_COMPANY = pi.ID_COMPANY
      LEFT JOIN production_plans pp ON pi.ID_PRODUCTION_PLANS = pp.ID_PRODUCTION_PLANS AND pi.ID_COMPANY = pp.ID_COMPANY
    `;

    const params = [];
    const conditions = [];

    if (ID_COMPANY) {
      conditions.push(`pi.ID_COMPANY = ?`);
      params.push(ID_COMPANY);
    }

    if (STATUS) {
      conditions.push(`pi.STATUS = ?`);
      params.push(STATUS);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY pi.ID_PRODUCT_INSTANCE DESC";

    const [rows] = await db.query(query, params);

    const results = rows.map((item) => ({
      ...item,
      IMAGE_URL_PRODUCTS: item.IMAGE_URL_PRODUCTS
        ? URL_IMAGE_BASE + item.IMAGE_URL_PRODUCTS
        : null,
    }));

    return results;
  } catch (error) {
    console.error("Error in getAll product_instances:", error);
    throw error;
  }
};

const getById = async (id) => {
  try {
    const query = `
      SELECT 
        pi.*, 
        p.ID_PRODUCT, p.ID_CATEGORIES_, p.NAME_PRODUCTS, p.DESCRIPTION_PRODUCTS,  p.IMAGE_URL_PRODUCTS, p.CREATED_AT_PRODUCTS, p.UPDATED_AT_PRODUCTS, p.ID_COMPANY AS PRODUCT_ID_COMPANY,
        c.ID_CATEGORIES_, c.NAME_CATEGORIES_, c.ID_COMPANY AS CATEGORY_ID_COMPANY,
        pm.ID_PRODUCT_MATERIALS, pm.ID_PRODUCTION_PLANS, pm.ID_MATERIALS_, pm.QUANTITY_PER_UNIT_PRODUCT_MATERIALS, pm.UNIT_PRODUCT_MATERIALS, pm.ID_COMPANY AS PROD_MATERIALS_COMPANY,
        mt.ID_MATERIAL_TYPES, mt.NAME_MATERIAL_TYPES, mt.ID_COMPANY AS MATERIAL_TYPES_COMPANY,
        m.ID_MATERIALS_, m.ID_MATERIAL_TYPES AS MATERIAL_MATERIAL_TYPE, m.QUANTITY, m.NAME_ AS MATERIAL_NAME_, m.UNIT_, m.QUANTITY AS MATERIAL_QUANTITY, m.COST_PER_UNIT_, m.CREATED_AT_PRODUCTS AS MATERIAL_CREATED_AT, m.UPDATED_AT_PRODUCTS AS MATERIAL_UPDATED_AT, m.ORIGIN, m.EXPIRY_DATE, m.ID_COMPANY AS MATERIAL_COMPANY
      FROM product_instances pi
      JOIN products p ON pi.ID_PRODUCT = p.ID_PRODUCT AND pi.ID_COMPANY = p.ID_COMPANY
      JOIN categories c ON p.ID_CATEGORIES_ = c.ID_CATEGORIES_ AND p.ID_COMPANY = c.ID_COMPANY
      LEFT JOIN production_materials pm ON pm.ID_PRODUCTION_PLANS = pi.ID_PRODUCTION_PLANS AND pm.ID_COMPANY = pi.ID_COMPANY
      LEFT JOIN materials m ON pm.ID_MATERIALS_ = m.ID_MATERIALS_ AND m.ID_COMPANY = pi.ID_COMPANY
      LEFT JOIN material_types mt ON m.ID_MATERIAL_TYPES = mt.ID_MATERIAL_TYPES AND mt.ID_COMPANY = pi.ID_COMPANY
      WHERE pi.ID_PRODUCT_INSTANCE = ?
    `;

    const [rows] = await db.query(query, [id]); // Map lại IMAGE_URL_PRODUCTS thành đường dẫn đầy đủ
    const results = rows.map((item) => ({
      ...item,
      IMAGE_URL_PRODUCTS: item.IMAGE_URL_PRODUCTS
        ? URL_IMAGE_BASE + item.IMAGE_URL_PRODUCTS
        : null,
    }));
    return results;
  } catch (error) {
    console.error("Error in getById product_instance:", error);
    throw error;
  }
};

const update = async (id, data) => {
  try {
    const {
      UID,
      ID_PRODUCT,
      SERIAL_CODE,
      ID_USERS,
      ID_PRODUCTION_PLANS,
      DATE_CREATED,
      STATUS,
      ID_COMPANY,
    } = data;

    const dateCreatedFormatted = DATE_CREATED
      ? moment(DATE_CREATED).format("YYYY-MM-DD HH:mm:ss")
      : null;

    const idProduct = parseInt(ID_PRODUCT, 10);
    const idProductionPlans = ID_PRODUCTION_PLANS
      ? parseInt(ID_PRODUCTION_PLANS, 10)
      : null;
    const idCompany = ID_COMPANY ? parseInt(ID_COMPANY, 10) : null;

    const [result] = await db.query(
      `UPDATE product_instances
       SET UID = ?, ID_PRODUCT = ?, SERIAL_CODE = ?, ID_USERS = ?, ID_PRODUCTION_PLANS = ?, DATE_CREATED = ?, STATUS = ?, ID_COMPANY = ?
       WHERE ID_PRODUCT_INSTANCE = ?`,
      [
        UID,
        idProduct,
        SERIAL_CODE,
        ID_USERS,
        idProductionPlans,
        dateCreatedFormatted,
        STATUS,
        idCompany,
        id,
      ]
    );

    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error in update product_instance:", error);
    throw error;
  }
};

const deleteProductInstance = async (id) => {
  try {
    const [result] = await db.query(
      `DELETE FROM product_instances WHERE ID_PRODUCT_INSTANCE = ?`,
      [id]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error in delete product_instance:", error);
    throw error;
  }
};

// ======================WEB USER=================================
const getAllProductInstancesPublic = async (
  STATUS = "AVAILABLE",
  LIMIT = 12,
  SERIAL_CODE,
  ID_CATEGORIES_
) => {
  try {
    let safeLimit = Number(LIMIT);
    if (isNaN(safeLimit) || safeLimit <= 0) {
      safeLimit = 1;
    }

    const serialCodeCondition = SERIAL_CODE
      ? `AND pi.SERIAL_CODE = '${SERIAL_CODE.replace(/'/g, "''")}'`
      : "";

    const statusCondition = STATUS
      ? `AND pi.STATUS = '${STATUS.replace(/'/g, "''")}'`
      : "";

    const categoryCondition = ID_CATEGORIES_
      ? `AND p.ID_CATEGORIES_ = '${ID_CATEGORIES_.replace(/'/g, "''")}'`
      : "";

    const query = `
      SELECT 
        pi.*,
        p.ID_PRODUCT, p.ID_CATEGORIES_, p.NAME_PRODUCTS, p.DESCRIPTION_PRODUCTS, 
       p.IMAGE_URL_PRODUCTS, 
        p.CREATED_AT_PRODUCTS, p.UPDATED_AT_PRODUCTS, p.ID_COMPANY AS PRODUCT_ID_COMPANY,
        c.ID_CATEGORIES_, c.NAME_CATEGORIES_, c.ID_COMPANY AS CATEGORY_ID_COMPANY,
        comp.ID_COMPANY, comp.NAME_COMPANY, comp.TYPE_COMPANY, comp.ADDRESS, 
        comp.DIA_CHI_Provinces, comp.DIA_CHI_Districts, comp.DIA_CHI_Wards, comp.DIA_CHI_STREETNAME,
        comp.PHONE, comp.EMAIL, comp.AVATAR, comp.SLUG, comp.CREATED_AT, comp.UPDATED_AT, comp.STATUS, comp.ID_COMPANY_TYPE,
        pm.ID_PRODUCT_MATERIALS, pm.ID_PRODUCTION_PLANS, pm.ID_MATERIALS_, 
        pm.QUANTITY_PER_UNIT_PRODUCT_MATERIALS, pm.UNIT_PRODUCT_MATERIALS,
        mt.ID_MATERIAL_TYPES, mt.NAME_MATERIAL_TYPES,
        m.ID_MATERIALS_, m.ID_MATERIAL_TYPES AS MATERIAL_MATERIAL_TYPE, 
        m.QUANTITY, m.NAME_ AS MATERIAL_NAME_, m.UNIT_, m.COST_PER_UNIT_, m.ORIGIN, m.EXPIRY_DATE,
        pp.NAME_PRODUCTION_PLAN
      FROM product_instances pi
      JOIN products p ON pi.ID_PRODUCT = p.ID_PRODUCT AND pi.ID_COMPANY = p.ID_COMPANY
      JOIN categories c ON p.ID_CATEGORIES_ = c.ID_CATEGORIES_ AND p.ID_COMPANY = c.ID_COMPANY
      LEFT JOIN companies comp ON pi.ID_COMPANY = comp.ID_COMPANY
      LEFT JOIN production_materials pm ON pm.ID_PRODUCTION_PLANS = pi.ID_PRODUCTION_PLANS AND pm.ID_COMPANY = pi.ID_COMPANY
      LEFT JOIN materials m ON pm.ID_MATERIALS_ = m.ID_MATERIALS_ AND m.ID_COMPANY = pi.ID_COMPANY
      LEFT JOIN material_types mt ON m.ID_MATERIAL_TYPES = mt.ID_MATERIAL_TYPES AND mt.ID_COMPANY = pi.ID_COMPANY
      LEFT JOIN production_plans pp ON pi.ID_PRODUCTION_PLANS = pp.ID_PRODUCTION_PLANS AND pi.ID_COMPANY = pp.ID_COMPANY
      WHERE 1=1
        ${statusCondition}
        ${serialCodeCondition}
        ${categoryCondition}
      ORDER BY pi.ID_PRODUCT_INSTANCE DESC
      LIMIT ${safeLimit}
    `;

    const [rows] = await db.query(query);

    return rows.map((item) => ({
      ...item,
      IMAGE_URL_PRODUCTS: item.IMAGE_URL_PRODUCTS
        ? URL_IMAGE_BASE + item.IMAGE_URL_PRODUCTS
        : null,
      AVATAR: item.AVATAR ? URL_IMAGE_BASE + item.AVATAR : null,
    }));
  } catch (error) {
    console.error("Error in getAllProductInstancesPublic:", error);
    throw error;
  }
};

const globalSearch = async (keyword) => {
  const likeKeyword = `%${keyword}%`;

  // Search company
  const companyQuery = `
    SELECT 
      c.ID_COMPANY AS id,
      c.NAME_COMPANY AS name,
      c.TYPE_COMPANY,
      c.ADDRESS,
      c.EMAIL,
      c.PHONE,
    c.AVATAR AS IMAGE_URL_PRODUCTS, -- thêm cột này để đồng bộ với product
      'company' AS type
    FROM companies c
    WHERE c.NAME_COMPANY LIKE ?
    LIMIT 5
  `;
  const [companies] = await db.query(companyQuery, [likeKeyword]);

  // Search product
  const productQuery = `
  SELECT 
    p.ID_PRODUCT AS id,
    CONCAT(p.NAME_PRODUCTS, ' - ', pi.SERIAL_CODE) AS name, -- ghép name + serial code
    p.DESCRIPTION_PRODUCTS,
    pi.PRICE_PRODUCTS,
    p.IMAGE_URL_PRODUCTS,
    pi.SERIAL_CODE, -- lấy serial code instance
    c.NAME_COMPANY,
    'product' AS type
  FROM products p
  JOIN companies c ON p.ID_COMPANY = c.ID_COMPANY
  JOIN product_instances pi ON pi.ID_PRODUCT = p.ID_PRODUCT
  WHERE p.NAME_PRODUCTS LIKE ?
  LIMIT 5
`;

  const [products] = await db.query(productQuery, [likeKeyword]);

  // Merge results và chỉ lấy 5 kết quả đầu tiên
  const merged = [...companies, ...products].slice(0, 5);

  // Map IMAGE_URL_PRODUCTS
  const results = merged.map((item) => ({
    ...item,
    IMAGE_URL_PRODUCTS: item.IMAGE_URL_PRODUCTS
      ? URL_IMAGE_BASE + item.IMAGE_URL_PRODUCTS
      : null,
  }));

  return results;
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  delete: deleteProductInstance,
  getAllProductInstancesPublic,
  globalSearch,
};
