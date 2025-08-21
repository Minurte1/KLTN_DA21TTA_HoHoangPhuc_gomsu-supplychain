const db = require("../config/database");

const getTotalCostByCompany = async (id) => {
  const [rows] = await db.query(
    `SELECT 
        mo.ID_COMPANY,
        c.NAME_COMPANY,
        SUM(mo.TOTAL_COST) AS total_cost
     FROM material_orders mo
     LEFT JOIN companies c ON mo.ID_COMPANY = c.ID_COMPANY
     WHERE mo.ID_COMPANY = ?
     GROUP BY mo.ID_COMPANY, c.NAME_COMPANY`,
    [id]
  );

  // Nếu không có dữ liệu thì trả về null
  return rows.length > 0 ? rows[0] : null;
};

module.exports = {
  getTotalCostByCompany,
};
