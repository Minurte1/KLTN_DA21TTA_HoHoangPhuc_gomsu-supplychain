import React, { useEffect, useState } from "react";
import { Button, IconButton, Typography, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import materialOrderMasterServices from "../../../services/materialOrderMasterServices";
import ReduxExportUseAuthState from "../../../redux/redux-export/useAuthServices";
import DynamicTable from "../../../share-view/dynamic/table/table";

const MaterialOrderAll = () => {
  const [materialOrders, setMaterialOrders] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { userInfo } = ReduxExportUseAuthState();

  const fetchMaterialOrders = async () => {
    const companyId = userInfo?.companyInfo?.ID_COMPANY || null;
    const data = await materialOrderMasterServices.getMaterialOrdersMaster({
      ID_COMPANY: companyId,
    });
    setMaterialOrders(data);
  };

  useEffect(() => {
    fetchMaterialOrders();
  }, []);

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    await materialOrderMasterServices.deleteMaterialOrderMaster(id);
    fetchMaterialOrders();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom mt={4}>
        Quản lý Đơn Hàng Vật Liệu
      </Typography>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{ mb: 2 }}
        onClick={() => {
          setSelectedOrder(null);
          setOpenModal(true);
        }}
      >
        Thêm Đơn Hàng
      </Button>

      <DynamicTable
        data={materialOrders}
        columns={[
          { key: "ID_MATERIAL_ORDER_MASTER", label: "Mã Đơn Hàng" },
          { key: "NAME_COMPANY_SELLER", label: "Công ty bán" },
          { key: "NAME_COMPANY_BUYER", label: "Công ty mua" },

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
          { key: "ID_MATERIALS_", label: "Mã vật liệu" },
          { key: "QUANTITY_ORDERED", label: "Số lượng đặt" },
          {
            key: "actions",
            label: "Hành động",
            render: (_, row) => (
              <>
                <IconButton onClick={() => handleEdit(row)}>
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleDelete(row.ID_MATERIAL_ORDER_MASTER)}
                >
                  <DeleteIcon />
                </IconButton>
              </>
            ),
          },
        ]}
      />

      {/* <MaterialOrderFormModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        materialOrder={selectedOrder}
        onSuccess={fetchMaterialOrders}
      /> */}
    </Box>
  );
};

export default MaterialOrderAll;
