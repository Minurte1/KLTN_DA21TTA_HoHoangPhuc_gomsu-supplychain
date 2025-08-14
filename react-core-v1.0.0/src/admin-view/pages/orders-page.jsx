import React, { useEffect, useState } from "react";
import { Button, IconButton, Typography, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import DynamicTable from "../../share-view/dynamic/table/table";

import OrdersFormModal from "../modal/orders-modal";
import ReduxExportUseAuthState from "../../redux/redux-export/useAuthServices";
import moment from "moment";
import orderServices from "../../services/orderServices";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { userInfo } = ReduxExportUseAuthState();

  const fetchOrders = async () => {
    const companyId = userInfo?.companyInfo?.ID_COMPANY || null;
    const data = await orderServices.getOrders({ ID_COMPANY: companyId });
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, [userInfo]);

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    await orderServices.deleteOrder(id);
    fetchOrders();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom mt={4}>
        Đơn Hàng Gốm Sứ
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
        data={orders}
        columns={[
          { key: "FULLNAME_ORDER", label: "Người nhận" },
          { key: "PHONE_ORDER", label: "SĐT" },
          { key: "SHIPPING_ADDRESS", label: "Địa chỉ giao hàng" },
          {
            key: "DATE_ORDER",
            label: "Ngày đặt",
            render: (value) => moment(value).format("DD/MM/YYYY HH:mm"),
          },
          { key: "TOTAL_AMOUNT_ORDER", label: "Tổng tiền" },
          { key: "PAYMENT_STATUS_ORDER", label: "Thanh toán" },
          { key: "SHIPPING_STATUS_ORDER", label: "Vận chuyển" },
          { key: "PAYMENT_METHOD", label: "PT Thanh toán" },
          {
            key: "actions",
            label: "Hành động",
            render: (_, row) => (
              <>
                <IconButton onClick={() => handleEdit(row)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(row.ID_ORDERS_)}>
                  <DeleteIcon />
                </IconButton>
              </>
            ),
          },
        ]}
      />

      <OrdersFormModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        order={selectedOrder}
        onSuccess={fetchOrders}
      />
    </Box>
  );
};

export default Orders;
