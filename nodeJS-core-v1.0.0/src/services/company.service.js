const db = require("../config/database");
const URL_IMAGE_BASE = `http://localhost:` + process.env.PORT + ``; // hoặc lấy từ config/env

const getAllCompanies = async (ID_COMPANY, STATUS, ID_COMPANY_TYPE, TABLE) => {
  try {
    let query = "SELECT * FROM companies";
    let params = [];

    if (ID_COMPANY || STATUS || ID_COMPANY_TYPE) {
      query += " WHERE 1=1";
      if (ID_COMPANY) {
        query += " AND ID_COMPANY = ?";
        params.push(ID_COMPANY);
      }
      if (STATUS) {
        query += " AND STATUS = ?";
        params.push(STATUS);
      }
      if (ID_COMPANY_TYPE) {
        query += " AND ID_COMPANY_TYPE = ?";
        params.push(ID_COMPANY_TYPE);
      }
    }

    const [rows] = await db.query(query, params);

    const mappedRows = await Promise.all(
      rows.map(async (company) => {
        try {
          let childRows = [];

          if (TABLE) {
            const [result] = await db.query(
              `SELECT * FROM ${TABLE} WHERE ID_COMPANY = ?`,
              [company.ID_COMPANY]
            );
            childRows = result;
          }

          return {
            ...company,
            AVATAR: company.AVATAR
              ? `${URL_IMAGE_BASE}/${company.AVATAR}`
              : null,
            BACKGROUND: company.BACKGROUND
              ? `${URL_IMAGE_BASE}/${company.BACKGROUND}`
              : null,
            [TABLE || "CHILD"]: childRows, // fallback tên field
          };
        } catch (err) {
          console.error(
            `Lỗi khi query bảng ${TABLE} cho công ty ${company.ID_COMPANY}:`,
            err
          );
          return {
            ...company,
            AVATAR: company.AVATAR
              ? `${URL_IMAGE_BASE}/${company.AVATAR}`
              : null,
            BACKGROUND: company.BACKGROUND
              ? `${URL_IMAGE_BASE}/${company.BACKGROUND}`
              : null,
            [TABLE || "CHILD"]: [],
          };
        }
      })
    );

    return mappedRows;
  } catch (error) {
    console.error("Lỗi trong getAllCompanies:", error);
    return []; // fallback rỗng nếu lỗi toàn bộ
  }
};

const getCompanyById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM companies WHERE ID_COMPANY = ?",
    [id]
  );
  const mappedRows = rows.map((company) => ({
    ...company,
    AVATAR: company.AVATAR ? `${URL_IMAGE_BASE}/${company.AVATAR}` : null,
    BACKGROUND: company.BACKGROUND
      ? `${URL_IMAGE_BASE}/${company.BACKGROUND}`
      : null,
  }));
  return mappedRows;
};
const createCompany = async (data) => {
  const {
    NAME_COMPANY,
    TYPE_COMPANY,
    ADDRESS,
    DIA_CHI_Provinces,
    DIA_CHI_Districts,
    DIA_CHI_Wards,
    DIA_CHI_STREETNAME,
    PHONE,
    EMAIL,
    AVATAR,
    BACKGROUND,
    SLUG,
    STATUS = "ACTIVE",
    ID_COMPANY_TYPE,
  } = data;

  const [result] = await db.query(
    `INSERT INTO companies 
   (NAME_COMPANY, TYPE_COMPANY, ADDRESS, DIA_CHI_Provinces, DIA_CHI_Districts,
    DIA_CHI_Wards, DIA_CHI_STREETNAME, PHONE, EMAIL, AVATAR, BACKGROUND, SLUG, STATUS, ID_COMPANY_TYPE)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, // <-- 14 dấu hỏi
    [
      NAME_COMPANY || null,
      TYPE_COMPANY || null,
      ADDRESS || null,
      DIA_CHI_Provinces || null,
      DIA_CHI_Districts || null,
      DIA_CHI_Wards || null,
      DIA_CHI_STREETNAME || null,
      PHONE || null,
      EMAIL || null,
      AVATAR || null,
      BACKGROUND || null,
      SLUG || null,
      STATUS || "ACTIVE",
      ID_COMPANY_TYPE || null,
    ]
  );

  return result.insertId;
};

const updateCompany = async (id, data) => {
  // Tạo mảng dynamic để chỉ update field có giá trị
  const fields = [];
  const values = [];

  // Map các cột cho phép update
  const allowedFields = [
    "NAME_COMPANY",
    "TYPE_COMPANY",
    "ADDRESS",
    "DIA_CHI_Provinces",
    "DIA_CHI_Districts",
    "DIA_CHI_Wards",
    "DIA_CHI_STREETNAME",
    "PHONE",
    "EMAIL",
    "AVATAR",
    "BACKGROUND",
    "SLUG",
    "STATUS",
    "ID_COMPANY_TYPE",
  ];

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      // Chỉ push nếu có dữ liệu
      fields.push(`${field} = ?`);
      values.push(data[field]);
    }
  });

  if (fields.length === 0) return false; // Không có gì để update

  const sql = `UPDATE companies SET ${fields.join(", ")} WHERE ID_COMPANY = ?`;
  values.push(id);

  const [result] = await db.query(sql, values);
  return result.affectedRows > 0;
};

const deleteCompany = async (id) => {
  const [result] = await db.query(
    "DELETE FROM companies WHERE ID_COMPANY = ?",
    [id]
  );
  return result.affectedRows > 0;
};

module.exports = {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
};
