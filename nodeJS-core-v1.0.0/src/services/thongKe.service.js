const db = require("../config/database");
const URL_IMAGE_BASE = `http://localhost:` + process.env.PORT + ``; // hoặc lấy từ config/env

// Thống kê doanh thu và số lượng sản phẩm theo công ty
const getTotalCostByCompany = async (id) => {
  let query = `
    SELECT 
      c.ID_COMPANY,
      c.NAME_COMPANY,
      SUM(mo.TOTAL_COST) AS TOTAL_REVENUE,
      SUM(mo.QUANTITY_ORDERED) AS TOTAL_QUANTITY
    FROM material_orders mo
    JOIN material_order_master mom 
      ON mo.ID_MATERIAL_ORDER_MASTER = mom.ID_MATERIAL_ORDER_MASTER
    JOIN companies c 
      ON mom.ID_COMPANY_SELLER = c.ID_COMPANY
  `;

  const params = [];

  if (id) {
    query += ` WHERE c.ID_COMPANY = ? `;
    params.push(id);
  }

  query += ` GROUP BY c.ID_COMPANY, c.NAME_COMPANY`;

  const [rows] = await db.query(query, params);

  return rows.length > 0 ? (id ? rows[0] : rows) : null;
};

// Thống kê top 10 vật liệu bán chạy
const getTop10MaterialByCompany = async (id) => {
  let query = `
    SELECT 
      c.ID_COMPANY,
      c.NAME_COMPANY,
      m.ID_MATERIALS_,
      m.NAME_ AS MATERIAL_NAME,
      SUM(mo.QUANTITY_ORDERED) AS TOTAL_QUANTITY,
      SUM(mo.TOTAL_COST) AS TOTAL_REVENUE
    FROM material_orders mo
    JOIN materials m 
      ON mo.ID_MATERIALS_ = m.ID_MATERIALS_
    JOIN material_order_master mom 
      ON mo.ID_MATERIAL_ORDER_MASTER = mom.ID_MATERIAL_ORDER_MASTER
    JOIN companies c 
      ON mom.ID_COMPANY_SELLER = c.ID_COMPANY
  `;

  const params = [];

  if (id) {
    query += ` WHERE c.ID_COMPANY = ? `;
    params.push(id);
  }

  query += `
    GROUP BY c.ID_COMPANY, c.NAME_COMPANY, m.ID_MATERIALS_, m.NAME_
    ORDER BY TOTAL_QUANTITY DESC
    LIMIT 10
  `;

  const [rows] = await db.query(query, params);

  return rows.length > 0 ? rows : null;
};
// Thống kê doanh thu theo ngày
const getDailyRevenue = async (id) => {
  let query = `
    SELECT 
      DATE(mom.ORDER_DATE) AS DATE,
      SUM(mo.TOTAL_COST) AS TOTAL_REVENUE
    FROM material_orders mo
    JOIN material_order_master mom 
      ON mo.ID_MATERIAL_ORDER_MASTER = mom.ID_MATERIAL_ORDER_MASTER
  `;
  const params = [];

  if (id) {
    query += ` WHERE mom.ID_COMPANY_SELLER = ? `;
    params.push(id);
  }

  query += `
    GROUP BY DATE(mom.ORDER_DATE)
    ORDER BY DATE(mom.ORDER_DATE) DESC
  `;

  const [rows] = await db.query(query, params);
  return rows;
};

// Thống kê doanh thu theo tháng
const getMonthlyRevenue = async (id) => {
  let query = `
    SELECT 
      YEAR(mom.ORDER_DATE) AS YEAR,
      MONTH(mom.ORDER_DATE) AS MONTH,
      SUM(mo.TOTAL_COST) AS TOTAL_REVENUE
    FROM material_orders mo
    JOIN material_order_master mom 
      ON mo.ID_MATERIAL_ORDER_MASTER = mom.ID_MATERIAL_ORDER_MASTER
  `;
  const params = [];

  if (id) {
    query += ` WHERE mom.ID_COMPANY_SELLER = ? `;
    params.push(id);
  }

  query += `
    GROUP BY YEAR(mom.ORDER_DATE), MONTH(mom.ORDER_DATE)
    ORDER BY YEAR DESC, MONTH DESC
  `;

  const [rows] = await db.query(query, params);
  return rows;
};

// Thống kê doanh thu theo năm
const getYearlyRevenue = async (id) => {
  let query = `
    SELECT 
      YEAR(mom.ORDER_DATE) AS YEAR,
      SUM(mo.TOTAL_COST) AS TOTAL_REVENUE
    FROM material_orders mo
    JOIN material_order_master mom 
      ON mo.ID_MATERIAL_ORDER_MASTER = mom.ID_MATERIAL_ORDER_MASTER
  `;
  const params = [];

  if (id) {
    query += ` WHERE mom.ID_COMPANY_SELLER = ? `;
    params.push(id);
  }

  query += `
    GROUP BY YEAR(mom.ORDER_DATE)
    ORDER BY YEAR DESC
  `;

  const [rows] = await db.query(query, params);
  return rows;
};

// ====================CTY SẢN XUẤT=======================================

// Thống kê doanh thu bán ra
const getRevenueByManufacturer = async (id) => {
  console.log("id", id);
  try {
    let query = `
      SELECT 
        c.ID_COMPANY,
        c.NAME_COMPANY,
        SUM(oi.QUANTITY_INVENTORY * oi.PRICE_ORDER_ITEMS) AS TOTAL_REVENUE,
        SUM(oi.QUANTITY_INVENTORY) AS TOTAL_QUANTITY
      FROM order_items oi
      JOIN orders o 
        ON oi.ID_ORDERS_ = o.ID_ORDERS_
      LEFT JOIN companies c 
        ON oi.ID_COMPANY = c.ID_COMPANY
    `;

    const params = [];

    // Nếu có id, lọc theo công ty đó
    if (id) {
      query += ` WHERE c.ID_COMPANY = ? `;
      params.push(id);
    }

    query += `
      GROUP BY c.ID_COMPANY, c.NAME_COMPANY
      ORDER BY TOTAL_REVENUE DESC
    `;

    const [rows] = await db.query(query, params);

    // Nếu không có dữ liệu, trả về mảng rỗng
    return rows || [];
  } catch (error) {
    console.error("Error in getRevenueByManufacturer:", error);
    throw error;
  }
};
// Thống kê top 10 sản phẩm bán chạy (lấy đầy đủ thông tin sản phẩm)
const getTop10Products = async (id) => {
  let query = `
    SELECT 
      p.ID_PRODUCT,
      p.ID_CATEGORIES_,
      p.NAME_PRODUCTS,
      p.DESCRIPTION_PRODUCTS,
      pi.PRICE_PRODUCTS,
      p.IMAGE_URL_PRODUCTS,
      p.CREATED_AT_PRODUCTS,
      p.UPDATED_AT_PRODUCTS,
      p.ID_COMPANY,
      SUM(oi.QUANTITY_INVENTORY) AS TOTAL_QUANTITY,
      SUM(oi.QUANTITY_INVENTORY * oi.PRICE_ORDER_ITEMS) AS TOTAL_REVENUE
    FROM order_items oi
    JOIN orders o 
      ON oi.ID_ORDERS_ = o.ID_ORDERS_
    JOIN companies c 
      ON oi.ID_COMPANY = c.ID_COMPANY
    JOIN product_instances pi 
      ON oi.ID_PRODUCT_INSTANCE = pi.ID_PRODUCT_INSTANCE
    JOIN products p 
      ON pi.ID_PRODUCT = p.ID_PRODUCT
  `;

  const params = [];

  if (id) {
    query += ` WHERE c.ID_COMPANY = ? `;
    params.push(id);
  }

  query += `
    GROUP BY 
      p.ID_PRODUCT,
      p.ID_CATEGORIES_,
      p.NAME_PRODUCTS,
      p.DESCRIPTION_PRODUCTS,
      pi.PRICE_PRODUCTS,
      p.IMAGE_URL_PRODUCTS,
      p.CREATED_AT_PRODUCTS,
      p.UPDATED_AT_PRODUCTS,
      p.ID_COMPANY
    ORDER BY TOTAL_QUANTITY DESC
    LIMIT 10
  `;

  const [rows] = await db.query(query, params);

  if (!rows || rows.length === 0) return [];

  // Map lại IMAGE_URL_PRODUCTS
  const mappedRows = rows.map((item) => ({
    ...item,
    IMAGE_URL_PRODUCTS: item.IMAGE_URL_PRODUCTS
      ? URL_IMAGE_BASE + item.IMAGE_URL_PRODUCTS
      : null,
  }));

  return mappedRows;
};
const getRevenueStatsAll = async (companyId) => {
  const params = [];
  const paramsMonth = [];
  const paramsDay = [];

  let whereClause = "";
  if (companyId) {
    whereClause = "WHERE o.ID_COMPANY = ?";
    params.push(companyId);
    paramsMonth.push(companyId);
    paramsDay.push(companyId);
  }

  // Doanh thu theo năm
  const queryYear = `
    SELECT 
      YEAR(o.DATE_ORDER) AS YEAR,
      SUM(oi.QUANTITY_INVENTORY * oi.PRICE_ORDER_ITEMS) AS TOTAL_REVENUE
    FROM orders o
    JOIN order_items oi ON o.ID_ORDERS_ = oi.ID_ORDERS_
    ${whereClause}
    GROUP BY YEAR(o.DATE_ORDER)
    ORDER BY YEAR(o.DATE_ORDER) DESC
  `;

  // Doanh thu theo tháng
  const queryMonth = `
    SELECT 
      YEAR(o.DATE_ORDER) AS YEAR,
      MONTH(o.DATE_ORDER) AS MONTH,
      SUM(oi.QUANTITY_INVENTORY * oi.PRICE_ORDER_ITEMS) AS TOTAL_REVENUE
    FROM orders o
    JOIN order_items oi ON o.ID_ORDERS_ = oi.ID_ORDERS_
    ${whereClause}
    GROUP BY YEAR(o.DATE_ORDER), MONTH(o.DATE_ORDER)
    ORDER BY YEAR(o.DATE_ORDER) DESC, MONTH(o.DATE_ORDER) DESC
  `;

  // Doanh thu theo ngày
  const queryDay = `
    SELECT 
      DATE(o.DATE_ORDER) AS DAY,
      SUM(oi.QUANTITY_INVENTORY * oi.PRICE_ORDER_ITEMS) AS TOTAL_REVENUE
    FROM orders o
    JOIN order_items oi ON o.ID_ORDERS_ = oi.ID_ORDERS_
    ${whereClause}
    GROUP BY DATE(o.DATE_ORDER)
    ORDER BY DAY DESC
  `;

  const [yearRows] = await db.query(queryYear, params);
  const [monthRows] = await db.query(queryMonth, paramsMonth);
  const [dayRows] = await db.query(queryDay, paramsDay);

  return {
    yearlyRevenue: yearRows,
    monthlyRevenue: monthRows,
    dailyRevenue: dayRows,
  };
};

// Số lượng gốm sứ được tạo ra theo ngày, tháng, năm
const getProductStatsAll = async (companyId) => {
  const params = [];
  const paramsMonth = [];
  const paramsDay = [];

  let whereClause = "";
  if (companyId) {
    whereClause = "WHERE pi.ID_COMPANY = ?";
    params.push(companyId);
    paramsMonth.push(companyId);
    paramsDay.push(companyId);
  }

  // Số lượng sản phẩm theo năm
  const queryYear = `
    SELECT 
      YEAR(pi.DATE_CREATED) AS YEAR,
      SUM(pi.QUANTITY) AS TOTAL_QUANTITY
    FROM product_instances pi
    ${whereClause}
    GROUP BY YEAR(pi.DATE_CREATED)
    ORDER BY YEAR(pi.DATE_CREATED) DESC
  `;

  // Số lượng sản phẩm theo tháng
  const queryMonth = `
    SELECT 
      YEAR(pi.DATE_CREATED) AS YEAR,
      MONTH(pi.DATE_CREATED) AS MONTH,
      SUM(pi.QUANTITY) AS TOTAL_QUANTITY
    FROM product_instances pi
    ${whereClause}
    GROUP BY YEAR(pi.DATE_CREATED), MONTH(pi.DATE_CREATED)
    ORDER BY YEAR(pi.DATE_CREATED) DESC, MONTH(pi.DATE_CREATED) DESC
  `;

  // Số lượng sản phẩm theo ngày
  const queryDay = `
    SELECT 
      DATE(pi.DATE_CREATED) AS DAY,
      SUM(pi.QUANTITY) AS TOTAL_QUANTITY
    FROM product_instances pi
    ${whereClause}
    GROUP BY DATE(pi.DATE_CREATED)
    ORDER BY DAY DESC
  `;

  const [yearRows] = await db.query(queryYear, params);
  const [monthRows] = await db.query(queryMonth, paramsMonth);
  const [dayRows] = await db.query(queryDay, paramsDay);

  return {
    yearlyQuantity: yearRows,
    monthlyQuantity: monthRows,
    dailyQuantity: dayRows,
  };
};

// =======================CTY VẬN CHUYỂN ==================================

// Tổng doanh thu + tổng số đơn hàng thành công + thất bại
const getTotalTransportRevenue = async (idCompany) => {
  let query = `
    SELECT 
      c.ID_COMPANY,
      c.NAME_COMPANY,
      SUM(CASE WHEN t.STATUS = 'SUCCESS' THEN t.SHIPPING_COST ELSE 0 END) AS TOTAL_REVENUE,
      COUNT(CASE WHEN t.STATUS = 'SUCCESS' THEN 1 END) AS TOTAL_SUCCESS_ORDERS,
      COUNT(CASE WHEN t.STATUS = 'FAILED' THEN 1 END) AS TOTAL_FAILED_ORDERS
    FROM transport_orders t
    JOIN companies c ON t.ID_COMPANY_SHIP = c.ID_COMPANY
    WHERE 1=1
  `;
  const params = [];

  if (idCompany) {
    query += ` AND c.ID_COMPANY = ?`;
    params.push(idCompany);
  }

  query += ` GROUP BY c.ID_COMPANY, c.NAME_COMPANY`;

  const [rows] = await db.query(query, params);
  return idCompany ? rows || null : rows;
};

// Số lần sử dụng dịch vụ vận chuyển
const getTotalTransportUsage = async (idCompany) => {
  let query = `
    SELECT 
      c.ID_COMPANY,
      c.NAME_COMPANY,
      COUNT(t.ID_TRANSPORT_ORDER) AS TOTAL_TRANSPORT_ORDERS
    FROM transport_orders t
    JOIN companies c ON t.ID_COMPANY_SHIP = c.ID_COMPANY
    
  `;
  const params = [];

  if (idCompany) {
    query += ` AND c.ID_COMPANY = ?`;
    params.push(idCompany);
  }

  query += ` GROUP BY c.ID_COMPANY, c.NAME_COMPANY`;

  const [rows] = await db.query(query, params);
  return idCompany ? rows[0] || null : rows;
};

// Doanh thu theo ngày
const getRevenueByDay = async (idCompany) => {
  let query = `
    SELECT 
      DATE(t.DELIVERY_DATE) AS DAY,
      SUM(t.SHIPPING_COST) AS TOTAL_REVENUE
    FROM transport_orders t
    JOIN companies c ON t.ID_COMPANY_SHIP = c.ID_COMPANY
    WHERE t.STATUS = 'SUCCESS'
  `;
  const params = [];

  if (idCompany) {
    query += ` AND c.ID_COMPANY = ?`;
    params.push(idCompany);
  }

  query += ` GROUP BY DATE(t.DELIVERY_DATE)
             ORDER BY DAY ASC`;

  const [rows] = await db.query(query, params);
  return rows;
};

// Doanh thu theo tháng
const getRevenueByMonth = async (idCompany) => {
  let query = `
    SELECT 
      YEAR(t.DELIVERY_DATE) AS YEAR,
      MONTH(t.DELIVERY_DATE) AS MONTH,
      SUM(t.SHIPPING_COST) AS TOTAL_REVENUE
    FROM transport_orders t
    JOIN companies c ON t.ID_COMPANY_SHIP = c.ID_COMPANY
    WHERE t.STATUS = 'SUCCESS'
  `;
  const params = [];

  if (idCompany) {
    query += ` AND c.ID_COMPANY = ?`;
    params.push(idCompany);
  }

  query += ` GROUP BY YEAR(t.DELIVERY_DATE), MONTH(t.DELIVERY_DATE)
             ORDER BY YEAR ASC, MONTH ASC`;

  const [rows] = await db.query(query, params);
  return rows;
};

// Doanh thu theo năm
const getRevenueByYear = async (idCompany) => {
  let query = `
    SELECT 
      YEAR(t.DELIVERY_DATE) AS YEAR,
      SUM(t.SHIPPING_COST) AS TOTAL_REVENUE
    FROM transport_orders t
    JOIN companies c ON t.ID_COMPANY_SHIP = c.ID_COMPANY
    WHERE t.STATUS = 'SUCCESS'
  `;
  const params = [];

  if (idCompany) {
    query += ` AND c.ID_COMPANY = ?`;
    params.push(idCompany);
  }

  query += ` GROUP BY YEAR(t.DELIVERY_DATE)
             ORDER BY YEAR ASC`;

  const [rows] = await db.query(query, params);
  return rows;
};

// Top 5 công ty thuê dịch vụ vận chuyển (dựa theo ID_COMPANY_SELLER)
const getTop5TransportCompanies = async () => {
  const query = `
    SELECT 
      c.ID_COMPANY,
      c.NAME_COMPANY,
      COUNT(t.ID_TRANSPORT_ORDER) AS TOTAL_ORDERS,
      SUM(t.SHIPPING_COST) AS TOTAL_REVENUE
    FROM transport_orders t
    JOIN material_order_master m ON t.ID_MATERIAL_ORDER = m.ID_MATERIAL_ORDER_MASTER
    JOIN companies c ON m.ID_COMPANY_SELLER = c.ID_COMPANY
    WHERE t.STATUS = 'SUCCESS'
    GROUP BY c.ID_COMPANY, c.NAME_COMPANY
    ORDER BY TOTAL_ORDERS DESC
    LIMIT 5
  `;

  const [rows] = await db.query(query);
  return rows;
};

const getRevenueStats = async (idCompany) => {
  const params = [];
  let condition = "";

  if (idCompany) {
    condition = ` AND c.ID_COMPANY = ?`;
    params.push(idCompany);
  }

  // Doanh thu theo ngày
  const queryDay = `
    SELECT 
      DATE(t.CREATED_AT) AS TIME_UNIT,
      SUM(t.SHIPPING_COST) AS TOTAL_REVENUE,
      COUNT(t.ID_ORDER) AS TOTAL_SUCCESS_ORDERS
    FROM transport_orders t
    JOIN companies c ON t.ID_COMPANY_SHIP = c.ID_COMPANY
    WHERE t.STATUS = 'SUCCESS' ${condition}
    GROUP BY DATE(t.CREATED_AT)
    ORDER BY DATE(t.CREATED_AT)
  `;

  // Doanh thu theo tháng
  const queryMonth = `
    SELECT 
      YEAR(t.CREATED_AT) AS YEAR,
      MONTH(t.CREATED_AT) AS MONTH,
      SUM(t.SHIPPING_COST) AS TOTAL_REVENUE,
      COUNT(t.ID_ORDER) AS TOTAL_SUCCESS_ORDERS
    FROM transport_orders t
    JOIN companies c ON t.ID_COMPANY_SHIP = c.ID_COMPANY
    WHERE t.STATUS = 'SUCCESS' ${condition}
    GROUP BY YEAR(t.CREATED_AT), MONTH(t.CREATED_AT)
    ORDER BY YEAR(t.CREATED_AT), MONTH(t.CREATED_AT)
  `;

  // Doanh thu theo năm
  const queryYear = `
    SELECT 
      YEAR(t.CREATED_AT) AS YEAR,
      SUM(t.SHIPPING_COST) AS TOTAL_REVENUE,
      COUNT(t.ID_ORDER) AS TOTAL_SUCCESS_ORDERS
    FROM transport_orders t
    JOIN companies c ON t.ID_COMPANY_SHIP = c.ID_COMPANY
    WHERE t.STATUS = 'SUCCESS' ${condition}
    GROUP BY YEAR(t.CREATED_AT)
    ORDER BY YEAR(t.CREATED_AT)
  `;

  const [rowsDay] = await db.query(queryDay, params);
  const [rowsMonth] = await db.query(queryMonth, params);
  const [rowsYear] = await db.query(queryYear, params);

  return {
    byDay: rowsDay,
    byMonth: rowsMonth,
    byYear: rowsYear,
  };
};

module.exports = {
  getTotalCostByCompany,
  getTop10MaterialByCompany,
  getMonthlyRevenue,
  getDailyRevenue,
  getYearlyRevenue,
  // ====================CTY SẢN XUẤT=======================================
  getRevenueByManufacturer,
  getTop10Products,
  getRevenueStatsAll,
  getProductStatsAll,

  //==================== CTY VẬN CHUYỂN ================================
  getTop5TransportCompanies,
  getRevenueByYear,
  getRevenueByMonth,
  getRevenueByDay,
  getTotalTransportUsage,
  getTotalTransportRevenue,
  getRevenueStats,
};
