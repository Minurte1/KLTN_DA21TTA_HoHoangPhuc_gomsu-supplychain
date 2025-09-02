import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Divider,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ReduxExportUseAuthState from "../../redux/redux-export/useAuthServices";
import { getUserById, updateUserById } from "../../services/userAccountService";
import VisibilityIcon from "@mui/icons-material/Visibility";
import moment from "moment";
import { enqueueSnackbar } from "notistack";
import orderServices from "../../services/orderServices";
import OrderDetailModal from "../modal/orderDetailsModal";
import DynamicTable from "../../share-view/dynamic/table/table";
import OrdersUsersModal from "../modal/ordersUser-modal";

const Input = styled("input")({
  display: "none",
});

const OrdersUsers = () => {
  const { userInfo } = ReduxExportUseAuthState();
  const [infoUser, setInfoUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [orders, setOrders] = useState([]);

  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (userInfo) {
      getInfoUsers(userInfo.ID_USERS);
      getUserOrders(userInfo.ID_USERS);
    }
  }, [userInfo]);

  const getInfoUsers = async (ID_USERS) => {
    const response = await getUserById(ID_USERS);
    setInfoUser(response);
    setFormData(response);
    if (response?.AVATAR) {
      setAvatarPreview(response.AVATAR);
    }
  };

  const getUserOrders = async (ID_USERS) => {
    try {
      const response = await orderServices.getOrderByUsers(ID_USERS); // New service call to get orders
      setOrders(response || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      enqueueSnackbar("Không thể tải danh sách đơn hàng", { variant: "error" });
    }
  };

  const onUpdateStatus = async (ID_ORDERS_, STATUS) => {
    try {
      await orderServices.onUpdateStatus(ID_ORDERS_, STATUS);
      setOpen(false);
    } catch (error) {
      console.log("error", error);
    }
  };
  if (!infoUser) return null;

  return (
    <>
      <Box mt={4}>
        {" "}
        <DynamicTable
          data={orders}
          keyStatus={"order"}
          columns={[
            { key: "HO_TEN", label: "Người nhận" },
            { key: "EMAIL", label: "Email" },
            { key: "QUANTITY_ORDER", label: "Số lượng đơn hàng mua" },
            {
              key: "DATE_CREATED",
              label: "Ngày đặt",
              render: (value) => moment(value).format("DD/MM/YYYY HH:mm"),
            },

            { key: "TOTAL_AMOUNT", label: "Tổng tiền đơn hàng" },
            {
              key: "actions",
              label: "Hành động",
              render: (_, row) => (
                <>
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setSelectedOrder(row); // lưu đơn hàng được chọn
                      setOpen(true); // mở modal
                    }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </>
              ),
            },
          ]}
        />
      </Box>

      <OrdersUsersModal
        open={open}
        onClose={() => setOpen(false)}
        order={selectedOrder}
        getUserOrders={getUserOrders}
      />
    </>
  );
};

export default OrdersUsers;
