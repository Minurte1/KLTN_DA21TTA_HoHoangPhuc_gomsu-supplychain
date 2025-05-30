const db = require("../config/database");

const create = async (data) => {
  const { NAME_MATERIAL_TYPES, ID_COMPANY } = data;
  const [result] = await db.query(
    `INSERT INTO material_types (NAME_MATERIAL_TYPES ,ID_COMPANY) VALUES (?,?)`,
    [NAME_MATERIAL_TYPES, ID_COMPANY]
  );
  return result.insertId;
};

const getAll = async (id_company) => {
  try {
    console.log("Received id_company:", id_company);

    let query = `
      SELECT mt.*, c.*, ct.*
      FROM material_types mt
      LEFT JOIN companies c ON mt.ID_COMPANY = c.ID_COMPANY
      LEFT JOIN company_types ct ON c.ID_COMPANY_TYPE = ct.ID_COMPANY_TYPE
    `;

    const params = [];

    if (id_company !== undefined && id_company !== null && id_company !== "") {
      query += ` WHERE mt.ID_COMPANY = ?`;
      params.push(id_company);
    }

    console.log("SQL Query:", query);
    console.log("Params:", params);

    const [rows] = await db.query(query, params);

    console.log("Query result rows:", rows.length);
    return rows;
  } catch (error) {
    console.error("Error in getAll:", error);
    throw error;
  }
};

const getById = async (id) => {
  const [rows] = await db.query(
    `SELECT * FROM material_types WHERE ID_MATERIAL_TYPES = ?`,
    [id]
  );
  return rows[0] || null;
};

const update = async (id, data) => {
  const { NAME_MATERIAL_TYPES, ID_COMPANY } = data;
  const [result] = await db.query(
    `UPDATE material_types SET NAME_MATERIAL_TYPES = ?, ID_COMPANY = ? WHERE ID_MATERIAL_TYPES = ?`,
    [NAME_MATERIAL_TYPES, ID_COMPANY, id]
  );
  return result.affectedRows > 0;
};

const deleteMaterialType = async (id) => {
  const [result] = await db.query(
    `DELETE FROM material_types WHERE ID_MATERIAL_TYPES = ?`,
    [id]
  );
  return result.affectedRows > 0;
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  delete: deleteMaterialType,
};
