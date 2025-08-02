import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Grid,
  Divider,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import ViewUsersShipModal from "../order-confirmed/ctyShip-add-user-order";
import ReduxExportUseAuthState from "../../../redux/redux-export/useAuthServices";
import { getAllUsers } from "../../../services/userAccountService";
import DeleteIcon from "@mui/icons-material/Delete";
import transportOrderServices from "../../../services/transportOrderServices";
import { enqueueSnackbar } from "notistack";

const formatDateTime = (dateStr) => {
  if (!dateStr) return "Chưa cập nhật";
  const date = new Date(dateStr);
  return date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getTrangThaiStyle = (status) => {
  switch (status) {
    case "ACTIVE":
      return { backgroundColor: "#e6f4ea", color: "#2e7d32" };
    case "INACTIVE":
      return { backgroundColor: "#fbe9e7", color: "#d84315" };
    case "DELETED":
      return { backgroundColor: "#f3e5f5", color: "#6a1b9a" };
    case "WORKING":
    case "CONFIRMED":
      return { backgroundColor: "#e3f2fd", color: "#1565c0" };
    default:
      return { backgroundColor: "#eeeeee", color: "#424242" };
  }
};

const OrderShipDetailView = ({ open, onClose, data }) => {
  const [selectOrderShip, setSeletOrderShip] = useState(null);
  const [openUserShipModal, setOpenUserShipModal] = useState(false);
  const { userInfo } = ReduxExportUseAuthState();
  const [usersShip, setUsersShip] = useState([]);
  const [selectUserShip, setSelectUserShip] = useState(null);
  useEffect(() => {
    if (open && data) {
      setSeletOrderShip(data);
      fetchUserCtyShip();
    }
  }, [open, userInfo]);

  const fetchUserCtyShip = async () => {
    const companyId = userInfo?.companyInfo?.ID_COMPANY || null;
    const data = await getAllUsers(companyId);

    // Lọc trạng thái
    const filteredUsers = data.filter(
      (user) =>
        user.TRANG_THAI_USER === "ACTIVE" || user.TRANG_THAI_USER === "WORKING"
    );

    setUsersShip(filteredUsers);
  };

  const handleAddUserShip = (user) => {
    setSeletOrderShip((prev) => ({
      ...prev,
      ID_USERS_SHIP: user.ID_USERS,
    }));
    console.log("user được chọn:", user);
    setOpenUserShipModal(false);
    setSelectUserShip(user);
  };
  const onConfirmShip = async () => {
    if (!selectUserShip) {
      enqueueSnackbar("Vui lòng chọn người vận chuyển");
    }
    const input = {
      ID_COMPANY_SHIP: selectOrderShip?.ID_COMPANY_SHIP || "",
      ID_MATERIAL_ORDER: selectOrderShip?.ID_MATERIAL_ORDER || "",
      ID_ORDER: selectOrderShip?.ID_MATERIAL_ORDER_MASTER || "",
      DELIVERY_DATE: selectOrderShip?.DELIVERY_DATE || "",
      STATUS: "DELIVERING" || "",
      SHIPPING_COST: selectOrderShip?.SHIPPING_COST || "",
      NOTE: selectOrderShip?.ID_COMPANY_SHIP || "",
      ID_FEE: selectOrderShip?.ID_FEE || "",
      ID_USERS_SHIP: selectOrderShip?.ID_COMPANY_SHIP || "",
    };
    const data = await transportOrderServices.createTransportOrder(input);
  };
  console.log("data", data);
  if (!data) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <>
        {" "}
        <DialogTitle>Chi tiết đơn hàng vận chuyển</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {/* Bên mua */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" fontWeight="bold">
                Bên mua:
              </Typography>
              <Typography>{data.NAME_COMPANY_BUYER}</Typography>
              <Typography>SĐT: {data.PHONE_BUYER}</Typography>
              <Typography>Email: {data.EMAIL_BUYER}</Typography>
            </Grid>
            {/* Bên bán */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" fontWeight="bold">
                Bên bán:
              </Typography>
              <Typography>{data.NAME_COMPANY_SELLER}</Typography>
              <Typography>SĐT: {data.PHONE_SELLER}</Typography>
              <Typography>Email: {data.EMAIL_SELLER}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            {/* Bên vận chuyển */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" fontWeight="bold">
                Công ty vận chuyển:
              </Typography>
              <Typography>{data.NAME_COMPANY_SHIP}</Typography>
              <Typography>SĐT: {data.PHONE_SHIP}</Typography>
              <Typography>Email: {data.EMAIL_SHIP}</Typography>
            </Grid>
            {/* Trạng thái + Ngày */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" fontWeight="bold">
                Ngày đặt hàng:
              </Typography>
              <Typography>{formatDateTime(data.ORDER_DATE)}</Typography>

              <Box mt={2}>
                <Typography variant="subtitle2" fontWeight="bold">
                  Trạng thái:
                </Typography>
                <Typography
                  sx={{
                    ...getTrangThaiStyle(data.STATUS),
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    display: "inline-block",
                    fontWeight: "bold",
                  }}
                >
                  {data.STATUS}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            {/* Thông tin vật liệu */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" fontWeight="bold">
                Tên vật liệu:
              </Typography>
              <Typography>{data.MATERIAL_NAME}</Typography>
              <Typography>
                Số lượng: {data.QUANTITY_ORDERED} {data.UNIT_}
              </Typography>
              <Typography>
                Đơn giá: {data.COST_PER_UNIT_?.toLocaleString()} đ
              </Typography>
              <Typography>
                Tổng tiền: {data.TOTAL_COST_DETAIL?.toLocaleString()} đ
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" fontWeight="bold">
                Xuất xứ:
              </Typography>
              <Typography>{data.ORIGIN}</Typography>
              <Typography>
                Hạn sử dụng: {formatDateTime(data.EXPIRY_DATE)}
              </Typography>
            </Grid>{" "}
            <Grid item xs={12} sm={6} sx={{ display: "flex" }}>
              {data.STATUS === "CONFIRMED" && selectUserShip && (
                <>
                  <Typography variant="body2"> Người vận chuyển : </Typography>
                  <Typography color="success" variant="body2">
                    {""} {selectUserShip?.HO_TEN} -{" "}
                    {selectUserShip?.SO_DIEN_THOAI}
                  </Typography>
                </>
              )}{" "}
            </Grid>{" "}
            <Grid
              item
              xs={12}
              sm={6}
              sx={{
                display: "flex",
                alignItems: "center", // Căn giữa theo chiều dọc
                gap: 1, // Khoảng cách giữa email và nút xóa
              }}
            >
              {data.STATUS === "CONFIRMED" && selectUserShip && (
                <>
                  <Typography color="success.main" variant="body2">
                    {selectUserShip?.EMAIL}
                  </Typography>
                  <IconButton
                    onClick={() => setSelectUserShip(null)}
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </>
              )}
            </Grid>
          </Grid>{" "}
        </DialogContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={2}
          flexWrap="wrap"
          gap={2}
        >
          <Button onClick={onClose} variant="outlined" color="secondary">
            Đóng
          </Button>
          <Box display="flex" gap={2}>
            <Button
              onClick={() => setOpenUserShipModal(true)}
              variant="outlined"
              color="info"
            >
              Thêm người vận chuyển
            </Button>

            <Button
              onClick={onConfirmShip}
              variant="contained"
              color="primary"
              disabled={data.STATUS !== "CONFIRMED" || usersShip.length === 0}
            >
              Xác nhận vận chuyển
            </Button>
          </Box>{" "}
          {/* {data.STATUS === "CONFIRMED" && !selectUserShip && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              Vui lòng thêm người vận chuyển trước khi xác nhận!
            </Typography>
          )} */}
        </Box>
        <ViewUsersShipModal
          users={usersShip}
          onAdd={handleAddUserShip}
          open={openUserShipModal}
          onClose={() => setOpenUserShipModal(false)}
        />
      </>
    </Dialog>
  );
};

export default OrderShipDetailView;
