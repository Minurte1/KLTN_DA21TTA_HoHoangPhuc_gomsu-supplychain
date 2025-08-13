const db = require("../config/database");
const URL_IMAGE_BASE = `http://localhost:` + process.env.PORT + ``; // hoặc lấy từ config/env

const getAllCompanies = async (ID_COMPANY, STATUS) => {
  let query = "SELECT * FROM companies";
  let params = [];

  if (ID_COMPANY || STATUS) {
    query += " WHERE 1=1";
    if (ID_COMPANY) {
      query += " AND ID_COMPANY = ?";
      params.push(ID_COMPANY);
    }
    if (STATUS) {
      query += " AND STATUS = ?";
      params.push(STATUS);
    }
  }

  const [rows] = await db.query(query, params);

  const mappedRows = rows.map((company) => ({
    ...company,
    AVATAR: company.AVATAR ? `${URL_IMAGE_BASE}/${company.AVATAR}` : null,
    BACKGROUND: company.BACKGROUND
      ? `${URL_IMAGE_BASE}/${company.BACKGROUND}`
      : null,
  }));

  return mappedRows;
};

const getCompanyById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM companies WHERE ID_COMPANY = ?",
    [id]
  );
  return rows[0] || null;
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
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
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
      STATUS,
      ID_COMPANY_TYPE,
    ]
  );

  return result.insertId;
};

const updateCompany = async (id, data) => {
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
    STATUS,
    ID_COMPANY_TYPE,
  } = data;

  const [result] = await db.query(
    `UPDATE companies SET 
      NAME_COMPANY = ?, TYPE_COMPANY = ?, ADDRESS = ?, DIA_CHI_Provinces = ?,
      DIA_CHI_Districts = ?, DIA_CHI_Wards = ?, DIA_CHI_STREETNAME = ?, PHONE = ?,
      EMAIL = ?, AVATAR = ?, BACKGROUND = ?, SLUG = ?, STATUS = ?, ID_COMPANY_TYPE = ?
     WHERE ID_COMPANY = ?`,
    [
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
      STATUS,
      ID_COMPANY_TYPE,
      id,
    ]
  );

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
