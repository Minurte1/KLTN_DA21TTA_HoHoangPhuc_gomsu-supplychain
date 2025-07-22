import React, { useEffect, useState } from "react";
import { Button, IconButton, Typography, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import DynamicTable from "../../../../share-view/dynamic/table/table";
import materialServices from "../../../../services/materialServices";
import MaterialsFormModal from "../../../modal/materials-modal";
import ReduxExportUseAuthState from "../../../../redux/redux-export/useAuthServices";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MaterialsOrdersModal from "../../../modal/material-order.jsx/MaterialsOrdersModal";
import MaterialsOrderViewModal from "../../../modal/material-order.jsx/MaterialsOrderViewModal";
import materialOrderMasterServices from "../../../../services/materialOrderMasterServices";
import MaterialOrderViewModal from "../../../modal/material-order.jsx/view-orderAll-modal-order";

const MaterialOrderMaster_SellerPending = () => {
  const [materials, setMaterials] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const { userInfo } = ReduxExportUseAuthState();
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const companyId = userInfo?.companyInfo?.ID_COMPANY || null;

      const data = await materialOrderMasterServices.getMaterialOrdersMaster({
        idSeller: companyId, // nếu đang lọc theo công ty mua

        status: "PENDING", // hoặc trạng thái nếu cần
      });

      setOrders(data);
    } catch (error) {
      console.error("Lỗi khi tải đơn đặt hàng:", error);
      setOrders([]);
    } finally {
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);

  const handleEdit = (material) => {
    setSelectedMaterial(material);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    await materialServices.deleteMaterial(id);
    fetchOrders();
  };
  const [openOrderModal, setOpenOrderModal] = useState(false);
  const [openViewOrdersModal, setOpenViewOrdersModal] = useState(false);

  const handleViewOrders = (material) => {
    setSelectedMaterial(material);
    setOpenViewOrdersModal(true);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom mt={4}>
        Đơn hàng Cty CC bán vật liệu đang xử lý
      </Typography>

      <DynamicTable
        data={orders}
        columns={[
          { key: "ID_MATERIAL_ORDER_MASTER", label: "Mã Đơn Hàng" },
          { key: "NAME_COMPANY_SELLER", label: "Công ty bán" },
          { key: "MATERIAL_NAME", label: "Tên vật liệu" },
          { key: "NAME_COMPANY_BUYER", label: "Công ty mua" },
          { key: "QUANTITY_ORDERED", label: "Số lượng đặt" },

          { key: "NAME_COMPANY_SHIP", label: "Công ty vận chuyển" },
          {
            key: "ORDER_DATE",
            label: "Ngày đặt hàng",
            render: (_, row) =>
              row.ORDER_DATE
                ? new Date(row.ORDER_DATE).toLocaleDateString("vi-VN")
                : "",
          },
          {
            key: "DELIVERY_DATE",
            label: "Ngày giao hàng",
            render: (_, row) =>
              row.DELIVERY_DATE
                ? new Date(row.DELIVERY_DATE).toLocaleDateString("vi-VN")
                : "",
          },
          { key: "STATUS", label: "Trạng thái" },
          {
            key: "TOTAL_COST",
            label: "Tổng chi phí",
            render: (_, row) => row.TOTAL_COST?.toLocaleString("vi-VN") + " ₫",
          },

          {
            key: "actions",
            label: "Hành động",
            render: (_, row) => {
              const isSameCompany =
                userInfo?.companyInfo?.ID_COMPANY === row.ID_COMPANY;

              return (
                <>
                  <>
                    <IconButton onClick={() => handleViewOrders(row)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(row.ID_MATERIALS_)}>
                      <DeleteIcon />
                    </IconButton>
                  </>
                </>
              );
            },
          },
        ]}
      />
      <MaterialOrderViewModal
        open={openViewOrdersModal}
        onClose={() => setOpenViewOrdersModal(false)}
        order={selectedMaterial}
      />
    </Box>
  );
};

export default MaterialOrderMaster_SellerPending;
