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
import { getAllUsers } from "../../../../services/userAccountService";
import ViewUsersShipModal from "../../../modal/order-confirmed/ctyShip-add-user-order";
import OrderShipDetailView from "../../../modal/material-order.jsx/view-order-transport-modal";
import transportOrderServices from "../../../../services/transportOrderServices";
import OrderShipDetailViewDELIVERING from "../../../modal/transport_ordersShip/view-order-transport-DELIVERED-modal";

const Transport_ordersShipFAILED = () => {
  const [materials, setMaterials] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const { userInfo } = ReduxExportUseAuthState();
  const [orders, setOrders] = useState([]);

  const [selectAddOrderShip, setSelectAddOrderShip] = useState(null);
  const STATUS = "FAILED"; // hoặc null nếu muốn lấy tất cả
  useEffect(() => {
    fetchOrders();
  }, [userInfo]);

  const fetchOrders = async () => {
    try {
      const data = await transportOrderServices.getTransportOrders(STATUS);
      setOrders(data);
    } catch (error) {
      console.error("Lỗi khi tải đơn đặt hàng:", error);
      setOrders([]);
    }
  };

  const handleEdit = (item) => {
    setSelectAddOrderShip(item);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    await materialServices.deleteMaterial(id);
    fetchOrders();
  };

  const [openViewOrdersModal, setOpenViewOrdersModal] = useState(false);

  const handleViewOrders = (item) => {
    setSelectAddOrderShip(item);
    setOpenViewOrdersModal(true);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom mt={4}>
        Đơn hàng Cty VC vật liệu giao thất bại
      </Typography>

      <DynamicTable
        data={orders}
        columns={[
          { key: "ID_MATERIAL_ORDER_MASTER", label: "Mã Đơn Hàng" },

          { key: "ID_MATERIAL_ORDER", label: "Mã Đặt Hàng Vật Tư" },

          { key: "COMPANY_SHIP_NAME", label: "Công ty vận chuyển" },
          { key: "SERVICE_NAME", label: "Dịch vụ giao hàng" },

          { key: "QUANTITY_ORDERED", label: "Số lượng đặt" },
          { key: "UNIT", label: "Đơn vị" },

          {
            key: "MATERIAL_ORDER_DATE",
            label: "Ngày đặt hàng",
            render: (_, row) =>
              row.MATERIAL_ORDER_DATE
                ? new Date(row.MATERIAL_ORDER_DATE).toLocaleDateString("vi-VN")
                : "",
          },
          {
            key: "DELIVERY_DATE",
            label: "Ngày giao hàng",
            render: (_, row) =>
              row.DELIVERY_DATE
                ? new Date(row.DELIVERY_DATE).toLocaleDateString("vi-VN")
                : "Đang vận chuyển",
          },

          {
            key: "MATERIAL_TOTAL_COST",
            label: "Chi phí đơn vật tư",
            render: (_, row) =>
              row.MATERIAL_TOTAL_COST?.toLocaleString("vi-VN") + " ₫",
          },
          {
            key: "SHIPPING_COST",
            label: "Phí vận chuyển",
            render: (_, row) =>
              row.SHIPPING_COST?.toLocaleString("vi-VN") + " ₫",
          },
          {
            key: "MASTER_TOTAL_COST",
            label: "Tổng chi phí đơn hàng",
            render: (_, row) =>
              row.MASTER_TOTAL_COST?.toLocaleString("vi-VN") + " ₫",
          },

          { key: "STATUS", label: "Trạng thái" },

          {
            key: "actions",
            label: "Hành động",
            render: (_, row) => (
              <>
                <IconButton onClick={() => handleViewOrders(row)}>
                  <VisibilityIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleDelete(row.ID_TRANSPORT_ORDER)}
                >
                  <DeleteIcon />
                </IconButton>
              </>
            ),
          },
        ]}
      />

      {openViewOrdersModal && (
        <>
          {" "}
          <OrderShipDetailViewDELIVERING
            open={openViewOrdersModal}
            onClose={() => {
              setOpenViewOrdersModal(false);
              fetchOrders();
            }}
            data={selectAddOrderShip}
            STATUS={STATUS}
          />
        </>
      )}
    </Box>
  );
};

export default Transport_ordersShipFAILED;
