const db = require("../config/database");

// Thống kê doanh thu theo công ty
const getTotalCostByCompany = async (id) => {
  let query = `
    SELECT 
      c.ID_COMPANY,
      c.NAME_COMPANY,
      SUM(mo.TOTAL_COST) AS TOTAL_REVENUE
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
module.exports = {
  getTotalCostByCompany,
  getTop10MaterialByCompany,
  getMonthlyRevenue,
  getDailyRevenue,
  getYearlyRevenue,
};
