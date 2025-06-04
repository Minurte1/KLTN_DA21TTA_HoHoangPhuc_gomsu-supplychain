const MaterialOrderOrdersService = require("../services/materialOrderMaster.service");
const db = require("../config/database");
const getAllMaterialOrdersMaster = async (req, res) => {
  try {
    const materialOrders = await MaterialOrderOrdersService.getAll();
    res.json(materialOrders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createMaterialOrderMaster = async (req, res) => {
  try {
    const {
      ID_COMPANY_BUYER,
      ID_COMPANY_SELLER,
      ID_COMPANY_SHIP,
      ORDER_DATE,
      DELIVERY_DATE,
      STATUS,
      TOTAL_COST,
    } = req.body;

    const id = await MaterialOrderOrdersService.create({
      ID_COMPANY_BUYER,
      ID_COMPANY_SELLER,
      ID_COMPANY_SHIP,
      ORDER_DATE,
      DELIVERY_DATE,
      STATUS,
      TOTAL_COST,
      CREATED_AT: new Date(), // tự sinh CREATED_AT
    });

    res.status(201).json({ message: "Material Order created", id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMaterialOrderByIdMaster = async (req, res) => {
  try {
    const { id } = req.params;
    const materialOrder = await MaterialOrderOrdersService.getById(id);
    if (!materialOrder) {
      return res.status(404).json({ message: "Material Order not found" });
    }
    res.json(materialOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateMaterialOrderMaster = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      ID_COMPANY_BUYER,
      ID_COMPANY_SELLER,
      ID_COMPANY_SHIP,
      ORDER_DATE,
      DELIVERY_DATE,
      STATUS,
      TOTAL_COST,
    } = req.body;

    const updated = await MaterialOrderOrdersService.update(id, {
      ID_COMPANY_BUYER,
      ID_COMPANY_SELLER,
      ID_COMPANY_SHIP,
      ORDER_DATE,
      DELIVERY_DATE,
      STATUS,
      TOTAL_COST,
      UPDATED_AT: new Date(), // cập nhật thời gian chỉnh sửa
    });

    if (!updated) {
      return res.status(404).json({ message: "Material Order not found" });
    }

    res.json({ message: "Material Order updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteMaterialOrderMaster = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await MaterialOrderOrdersService.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Material Order not found" });
    }
    res.json({ message: "Material Order deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getOrdersByCompanyAndMaterial = async (req, res) => {
  try {
    const { idCompany, idMaterial } = req.params;

    const orders =
      await MaterialOrderOrdersService.getOrdersByCompanyAndMaterial(
        idCompany,
        idMaterial
      );

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const createMaterialOrderFull = async (req, res) => {
  const {
    ID_COMPANY_BUYER,
    ID_COMPANY_SELLER,
    ID_COMPANY_SHIP,
    ID_MATERIALS_,
    QUANTITY_ORDERED,
    DELIVERY_DATE,
  } = req.body;

  const ORDER_DATE = new Date();
  const STATUS = "PENDING";

  try {
    // 1. Lấy giá của vật liệu
    const [materialRows] = await db.execute(
      `SELECT COST_PER_UNIT_ FROM materials WHERE ID_MATERIALS_ = ?`,
      [ID_MATERIALS_]
    );

    if (materialRows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy vật liệu." });
    }

    const COST_PER_UNIT = materialRows[0].COST_PER_UNIT_;
    const TOTAL_COST = COST_PER_UNIT * QUANTITY_ORDERED;

    // 2. Tạo bản ghi trong bảng material_order_master
    const [masterResult] = await db.execute(
      `INSERT INTO material_order_master (
        ID_COMPANY_BUYER,
        ID_COMPANY_SELLER,
        ID_COMPANY_SHIP,
        ORDER_DATE,
        DELIVERY_DATE,
        STATUS,
        TOTAL_COST,
        CREATED_AT,
        UPDATED_AT
      ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        ID_COMPANY_BUYER,
        ID_COMPANY_SELLER,
        ID_COMPANY_SHIP,
        ORDER_DATE,
        DELIVERY_DATE,
        STATUS,
        TOTAL_COST,
      ]
    );

    const ID_MATERIAL_ORDER_MASTER = masterResult.insertId;

    // 3. Tạo bản ghi trong bảng material_orders
    await db.execute(
      `INSERT INTO material_orders (
        ID_MATERIALS_,
        QUANTITY_ORDERED,
        ORDER_DATE,
        DELIVERY_DATE,
        STATUS,
        TOTAL_COST,
        ID_COMPANY,
        ID_TRANSPORT_ORDER,
        ID_MATERIAL_ORDER_MASTER
      ) VALUES (?, ?, ?, ?, ?, ?, ?, NULL, ?)`,
      [
        ID_MATERIALS_,
        QUANTITY_ORDERED,
        ORDER_DATE,
        DELIVERY_DATE,
        STATUS,
        TOTAL_COST,
        ID_COMPANY_BUYER,
        ID_MATERIAL_ORDER_MASTER,
      ]
    );

    res.status(201).json({
      message: "Đặt đơn hàng thành công!",
      ID_MATERIAL_ORDER_MASTER,
      TOTAL_COST,
    });
  } catch (error) {
    console.error("Lỗi đặt đơn hàng:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
module.exports = {
  getAllMaterialOrdersMaster,
  createMaterialOrderMaster,
  getMaterialOrderByIdMaster,
  updateMaterialOrderMaster,
  deleteMaterialOrderMaster,
  getOrdersByCompanyAndMaterial,
  createMaterialOrderFull,
};
