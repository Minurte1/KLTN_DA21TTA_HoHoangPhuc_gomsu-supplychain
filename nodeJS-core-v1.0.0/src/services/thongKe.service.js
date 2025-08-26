const db = require("../config/database");
//Thống kê doanh thu theo công ty
const getTotalCostByCompany = async (id) => {
  const [rows] = await db.query(
    `SELECT 
    c.ID_COMPANY,
    c.NAME_COMPANY,
    SUM(mo.TOTAL_COST) AS TOTAL_REVENUE
FROM material_orders mo
JOIN material_order_master mom 
    ON mo.ID_MATERIAL_ORDER_MASTER = mom.ID_MATERIAL_ORDER_MASTER
JOIN companies c 
    ON mom.ID_COMPANY_SELLER = c.ID_COMPANY
WHERE c.ID_COMPANY = ?   -- truyền ID_COMPANY ở đây
GROUP BY c.ID_COMPANY, c.NAME_COMPANY;
`,
    [id]
  );

  // Nếu không có dữ liệu thì trả về null
  return rows.length > 0 ? rows[0] : null;
};

// Thống kê số lượng vật liệu được mua nhiều nhất theo công ty
const getTop10MaterialByCompany = async (id) => {
  const [rows] = await db.query(
    `SELECT 
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
WHERE c.ID_COMPANY = ?   -- truyền ID_COMPANY vào đây
GROUP BY c.ID_COMPANY, c.NAME_COMPANY, m.ID_MATERIALS_, m.NAME_
ORDER BY TOTAL_QUANTITY DESC
LIMIT 10;

`,
    [id]
  );

  // Nếu không có dữ liệu thì trả về null
  return rows.length > 0 ? rows : null;
};

module.exports = {
  getTotalCostByCompany,
  getTop10MaterialByCompany,
};
