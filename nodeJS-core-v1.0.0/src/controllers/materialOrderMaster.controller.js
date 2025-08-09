const MaterialOrderOrdersService = require("../services/materialOrderMaster.service");
const db = require("../config/database");
const moment = require("moment");
/// Lấy thông tin tất cả đơn hàng giao dịch ( VẬT LIỆU )
const getAllMaterialOrdersMaster = async (req, res) => {
  try {
    const {
      idBuyer, // mom.ID_COMPANY_BUYER
      idSeller, // mom.ID_COMPANY_SELLER
      idShip, // mom.ID_COMPANY_SHIP
      status, // mom.STATUS
      keyTable,
    } = req.query;

    const filters = {
      idBuyer: idBuyer || null,
      idSeller: idSeller || null,
      idShip: idShip || null,
      status: status || null,
      keyTable: keyTable || null,
    };

    const materialOrders = await MaterialOrderOrdersService.getAll(filters);
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
      STATUS: ORDER_STATUS, // <- đổi tên cho khớp
      TOTAL_COST,
      ID_FEE,
    } = req.body;

    const formattedOrderDate = ORDER_DATE
      ? moment(ORDER_DATE).format("YYYY-MM-DD HH:mm:ss")
      : null;
    const formattedDeliveryDate = DELIVERY_DATE
      ? moment(DELIVERY_DATE).format("YYYY-MM-DD HH:mm:ss")
      : null;

    const updated = await MaterialOrderOrdersService.update(id, {
      ID_COMPANY_BUYER,
      ID_COMPANY_SELLER,
      ID_COMPANY_SHIP,
      ORDER_DATE: formattedOrderDate,
      DELIVERY_DATE: formattedDeliveryDate,
      STATUS: ORDER_STATUS, // <- đổi tên cho khớp
      TOTAL_COST,
      UPDATED_AT: moment().format("YYYY-MM-DD HH:mm:ss"),
      ID_FEE,
    });

    if (!updated) {
      return res.status(404).json({ message: "Material Order not found" });
    }

    res.json({ message: "Material Order updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const u = async (req, res) => {
  const updatedOrder = req.body;
  const { id } = req.params;
  console.log("updatedOrder", updatedOrder);
  try {
    await db.query(
      `UPDATE material_order_master
       SET ID_COMPANY_SHIP = ?, ORDER_STATUS = ?, UPDATED_AT = NOW()
       WHERE ID_MATERIAL_ORDER_MASTER = ?`,
      [updatedOrder.ID_COMPANY_SHIP, "CONFIRMED", id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Lỗi xác nhận đơn hàng:", err);
    res.status(500).json({ error: "Lỗi xác nhận đơn hàng." });
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
    const { idCompany, idMaterial } = req.query;

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

const getOrdersByCompanyAndMaterial_idCompanyBuyer = async (req, res) => {
  try {
    let { idCompany, idMaterial, STATUS } = req.query;

    // Nếu idMaterial rỗng chuỗi thì gán null để SQL xử lý đúng
    if (!idMaterial || idMaterial.trim() === "") {
      idMaterial = null;
    }
    if (!idCompany || idCompany.trim() === "") {
      idCompany = null;
    }
    if (!STATUS || STATUS.trim() === "") {
      STATUS = null;
    }

    const orders =
      await MaterialOrderOrdersService.getOrdersByCompanyAndMaterial_idCompanyBuyer(
        idCompany,
        idMaterial,
        STATUS
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

  // ✅ Chuyển '' => null nếu DELIVERY_DATE rỗng
  const deliveryDate = DELIVERY_DATE === "" ? null : DELIVERY_DATE;

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
        deliveryDate, // dùng biến đã xử lý
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
        deliveryDate, // dùng biến đã xử lý
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

const updateConfirmOrderMaster = () => {};
const updateStatusMaterialOrderMaster = async (req, res) => {
  const { id } = req.params; // ID_MATERIAL_ORDER_MASTER
  const { status, isTransportOrders, data } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Thiếu status để cập nhật" });
  }

  try {
    // Cập nhật bảng material_order_master
    const updateMaster = `
      UPDATE material_order_master 
      SET STATUS = ?, UPDATED_AT = ? 
      WHERE ID_MATERIAL_ORDER_MASTER = ?
    `;
    await db.execute(updateMaster, [
      status,
      moment().format("YYYY-MM-DD HH:mm:ss"),
      id,
    ]);

    // Cập nhật bảng material_orders
    const updateOrders = `
      UPDATE material_orders 
      SET STATUS = ? 
      WHERE ID_MATERIAL_ORDER_MASTER = ?
    `;
    if (isTransportOrders) {
      await db.execute(
        `UPDATE transport_orders 
         SET STATUS = ? 
         WHERE ID_MATERIAL_ORDER = ?`,
        [status, data?.ID_MATERIAL_ORDER]
      );
    }

    await db.execute(updateOrders, [status, id]);

    // Nếu trạng thái là SUCCESS thì truy vấn lại dữ liệu chi tiết đơn hàng
    if (status === "SUCCESS") {
      // 1. Lấy dữ liệu chi tiết đơn hàng
      const [rows] = await db.execute(
        `SELECT * FROM materials
         WHERE ID_MATERIALS_ = ?`,
        [data?.ID_MATERIALS_]
      );
      const STATUS = "READY";
      if (rows.length > 0) {
        const detail = rows[0];

        // 2. Tạo bản ghi mới trong materials
        const insertMaterials = `
          INSERT INTO materials 
          (ID_MATERIAL_TYPES, NAME_, UNIT_, QUANTITY, COST_PER_UNIT_, CREATED_AT_PRODUCTS, UPDATED_AT_PRODUCTS, ORIGIN, EXPIRY_DATE, ID_COMPANY, STATUS)
          VALUES (?,  ?, ?, ?, ?, NOW(), NOW(), ?, ?, ?,?)
        `;

        await db.execute(insertMaterials, [
          detail.ID_MATERIAL_TYPES, // nếu ID_MATERIAL_TYPES có cột khác bạn sửa lại

          detail.NAME_,
          detail.UNIT_,
          data.QUANTITY_ORDERED, // hoặc detail.QUANTITY tuỳ dữ liệu đúng
          detail.COST_PER_UNIT_,

          detail.ORIGIN,
          detail.EXPIRY_DATE,
          data.ID_COMPANY_BUYER,
          STATUS,
        ]);
      }
    }

    res.status(200).json({ message: "Cập nhật trạng thái thành công" });
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

module.exports = {
  getAllMaterialOrdersMaster,
  createMaterialOrderMaster,
  getMaterialOrderByIdMaster,
  updateMaterialOrderMaster,
  updateConfirmOrderMaster,
  deleteMaterialOrderMaster,
  getOrdersByCompanyAndMaterial,
  createMaterialOrderFull,
  getOrdersByCompanyAndMaterial_idCompanyBuyer,
  updateStatusMaterialOrderMaster,
};
