import React from "react";
import {
  Modal,
  Box,
  Typography,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  Chip,
} from "@mui/material";

const OrderDetailModal = ({ open, onClose, order, onUpdateStatus }) => {
  if (!order) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          p: 3,
          borderRadius: 2,
          width: "90%",
          maxWidth: 800,
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: 24,
        }}
      >
        <Typography variant="h5" gutterBottom color="primary">
          Thông Tin Đơn Hàng #{order.ID_ORDERS_}
        </Typography>
        {/* Thông tin người đặt */}
        <Typography variant="h6" mt={2}>
          Người Đặt Hàng
        </Typography>
        <Divider />
        <Box display="flex" alignItems="center" gap={2} mt={1}>
          <Avatar src={order.user?.AVATAR} alt={order.user?.HO_TEN} />
          <Box>
            <Typography>
              <strong>Họ Tên:</strong> {order.FULLNAME_ORDER}
            </Typography>
            <Typography>
              <strong>Email:</strong> {order.user?.EMAIL}
            </Typography>
            <Typography>
              <strong>SĐT:</strong> {order.PHONE_ORDER}
            </Typography>
          </Box>
        </Box>{" "}
        {/* Thông tin đơn hàng */}
        <Typography variant="h6" mt={3}>
          Chi Tiết Đơn Hàng
        </Typography>{" "}
        <Box display="flex" alignItems="center" gap={2} mt={1}>
          <Avatar
            src={order.company?.AVATAR}
            alt={order.company?.NAME_COMPANY}
          />
          <Box>
            {" "}
            <Typography>
              <strong>Tên công ty gốm sứ:</strong> {order.company.NAME_COMPANY}
            </Typography>
            <Typography>
              <strong>Địa chỉ công ty:</strong> {order.company.ADDRESS}
            </Typography>
            <Typography>
              <strong>Số điện thoại công ty hỗ trợ:</strong>{" "}
              {order.company?.PHONE}
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Box mt={1}>
          <Typography>
            <strong>Ngày đặt:</strong>{" "}
            {new Date(order.DATE_ORDER).toLocaleString("vi-VN")}
          </Typography>
          <Typography>
            <strong>Địa chỉ giao hàng:</strong> {order.SHIPPING_ADDRESS}
          </Typography>
          <Typography>
            <strong>Phương thức thanh toán:</strong> {order.PAYMENT_METHOD}
          </Typography>
          <Typography>
            <strong>Trạng thái thanh toán:</strong>
            <Chip
              label={order.PAYMENT_STATUS_ORDER}
              color={
                order.PAYMENT_STATUS_ORDER === "PAID" ? "success" : "warning"
              }
              size="small"
              sx={{ ml: 1 }}
            />
          </Typography>
          <Typography>
            <strong>Trạng thái giao hàng:</strong>
            <Chip
              label={order.SHIPPING_STATUS_ORDER}
              color={
                order.SHIPPING_STATUS_ORDER === "DELIVERED"
                  ? "success"
                  : "warning"
              }
              size="small"
              sx={{ ml: 1 }}
            />
          </Typography>
          <Typography>
            <strong>Tổng tiền:</strong>{" "}
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(order.TOTAL_AMOUNT_ORDER)}
          </Typography>
        </Box>
        {/* Bảng sản phẩm */}
        <Typography variant="h6" mt={3}>
          Sản Phẩm
        </Typography>
        <Divider />
        <Table sx={{ mt: 1 }}>
          <TableHead>
            <TableRow>
              <TableCell>Hình Ảnh</TableCell>
              <TableCell>Tên Sản Phẩm</TableCell>
              <TableCell>Mô Tả</TableCell>
              <TableCell>Danh Mục</TableCell>
              <TableCell>Số Lượng</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Thành Tiền</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order.products.map((prod) => (
              <TableRow key={prod.ID_ORDER_ITEMS}>
                <TableCell>
                  <img
                    src={prod.IMAGE_URL_PRODUCTS}
                    alt={prod.NAME_PRODUCTS}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 8,
                      objectFit: "cover",
                    }}
                  />
                </TableCell>
                <TableCell>{prod.NAME_PRODUCTS}</TableCell>
                <TableCell>{prod.DESCRIPTION_PRODUCTS}</TableCell>
                <TableCell>{prod.category?.NAME_CATEGORIES_}</TableCell>
                <TableCell>{prod.QUANTITY_INVENTORY}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(prod.PRICE_PRODUCTS)}
                </TableCell>
                <TableCell>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(prod.PRICE_PRODUCTS * prod.QUANTITY_INVENTORY)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>{" "}
        {order.STATUS === "DELIVERING" ? (
          <>
            {" "}
            <Box
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
              }}
            >
              <button
                className="custom-outline-btn"
                onClick={() => onUpdateStatus(order.ID_ORDERS_, "DELIVERED")}
              >
                <i className="fa-solid fa-floppy-disk mr-5"></i> Đã nhận hàng
              </button>{" "}
              <button
                className="custom-outline-btn-danger"
                onClick={() => onUpdateStatus(order.ID_ORDERS_, "FAILED")}
              >
                <i className="fa-solid fa-ban mr-5"></i> Không muốn nhận hàng
              </button>
            </Box>
          </>
        ) : (
          <>
            {/* {" "}
            <button className="custom-outline-btn-cancel">
              Đơn hàng ở trạng thái {order?.STATUS} nên không thể thực hiện thao
              tác
            </button>{" "} */}
          </>
        )}
      </Box>
    </Modal>
  );
};

export default OrderDetailModal;
