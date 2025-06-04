import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  Box,
  CircularProgress,
  Stack,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

import materialOrderMasterServices from "../../../services/materialOrderMasterServices";
import ReduxExportUseAuthState from "../../../redux/redux-export/useAuthServices";
import companyServices from "../../../services/companies-service";
import companyTypeServices from "../../../services/company_types-service";

const MaterialsOrderViewModal = ({ open, onClose, material }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = ReduxExportUseAuthState();
  const [shippingCompanies, setShippingCompanies] = useState([]);
  const [selectedShipCompanies, setSelectedShipCompanies] = useState({});

  const fetchOrders = async () => {
    if (!material) return;

    setLoading(true);
    try {
      const companyId = userInfo?.companyInfo?.ID_COMPANY || null;
      const data =
        await materialOrderMasterServices.getOrdersByCompanyAndMaterial(
          companyId,
          material.ID_MATERIALS_
        );
      setOrders(data);
    } catch (error) {
      console.error("Lỗi khi tải đơn đặt hàng:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchShippingCompanies = async () => {
    try {
      const filter = [
        {
          key: "ROUTER_COMPANY",
          value: "transport_orders",
        },
      ];
      const companies = await companyTypeServices.getCompaniesByRouter(filter);
      setShippingCompanies(companies);
    } catch (error) {
      console.error("Lỗi khi tải danh sách công ty vận chuyển:", error);
    }
  };
  useEffect(() => {
    if (open) {
      fetchOrders();
      fetchShippingCompanies();
    }
  }, [open, material]);

  // Gọi API xác nhận đơn hàng
  const handleConfirmOrder = async (orderId) => {
    const selectedShipId = selectedShipCompanies[orderId];
    if (!selectedShipId) {
      alert("Vui lòng chọn công ty giao hàng trước khi xác nhận đơn hàng.");
      return;
    }

    // Tìm đơn hàng từ danh sách
    const orderToConfirm = orders.find(
      (o) => o.ID_MATERIAL_ORDER_MASTER === orderId
    );

    if (!orderToConfirm) return;

    // Cập nhật ID_COMPANY_SHIP vào đơn hàng
    const updatedOrder = {
      ...orderToConfirm,
      ID_COMPANY_SHIP: selectedShipId,
    };

    try {
      await materialOrderMasterServices.confirmOrder(updatedOrder); // 👈 Truyền full object
      fetchOrders(); // refresh lại danh sách
    } catch (error) {
      console.error("Xác nhận đơn hàng thất bại:", error);
    }
  };

  const handleSelectShippingCompany = (orderId, companyId) => {
    setSelectedShipCompanies((prev) => ({
      ...prev,
      [orderId]: companyId,
    }));
  };

  const handleAssignShippingCompany = async (orderId) => {
    const selectedId = selectedShipCompanies[orderId];
    if (!selectedId) return;

    try {
      await materialOrderMasterServices.assignShippingCompany(
        orderId,
        selectedId
      );
      fetchOrders(); // refresh dữ liệu
    } catch (error) {
      console.error("Lỗi khi gán công ty vận chuyển:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Đơn yêu cầu mua vật liệu: {material?.NAME_}</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <CircularProgress />
        ) : orders.length === 0 ? (
          <Typography>Không có đơn đặt hàng nào.</Typography>
        ) : (
          <List>
            {orders.map((order, index) => (
              <ListItem key={index} sx={{ display: "block", mb: 2 }}>
                <Box border={1} borderRadius={2} p={2} borderColor="grey.300">
                  <Typography variant="h6" gutterBottom>
                    Công ty đặt hàng: {order.BUYER_NAME}
                  </Typography>
                  <Typography>
                    Loại hình: {order.BUYER_COMPANY_TYPE || "Chưa rõ"}
                  </Typography>
                  <Typography>Địa chỉ: {order.BUYER_ADDRESS}</Typography>
                  <Typography>Email: {order.BUYER_EMAIL}</Typography>
                  <Typography>SĐT: {order.BUYER_PHONE}</Typography>
                  <Typography sx={{ mt: 1 }}>
                    Ngày đặt hàng:{" "}
                    {new Date(order.ORDER_DATE).toLocaleDateString()}
                  </Typography>
                  <Typography>Trạng thái: {order.ORDER_STATUS}</Typography>
                  <Typography>
                    Số lượng: {order.QUANTITY_ORDERED} {order.UNIT_}
                  </Typography>
                  <Typography>
                    Tổng chi phí: {order.ITEM_TOTAL_COST.toLocaleString()} VNĐ
                  </Typography>
                  {order.ID_COMPANY_SHIP === null &&
                    order.ITEM_STATUS === "PENDING" && (
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        sx={{ mt: 2 }}
                      >
                        <FormControl size="small" sx={{ minWidth: 300 }}>
                          <InputLabel>Công ty giao hàng</InputLabel>
                          <Select
                            value={
                              selectedShipCompanies[
                                order.ID_MATERIAL_ORDER_MASTER
                              ] || ""
                            }
                            label="Công ty giao hàng"
                            onChange={(e) =>
                              handleSelectShippingCompany(
                                order.ID_MATERIAL_ORDER_MASTER,
                                e.target.value
                              )
                            }
                          >
                            {shippingCompanies.map((company) => (
                              <MenuItem
                                key={company.ID_COMPANY}
                                value={company.ID_COMPANY}
                              >
                                {company.NAME_COMPANY}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <Button
                          variant="outlined"
                          onClick={() =>
                            handleAssignShippingCompany(
                              order.ID_MATERIAL_ORDER_MASTER
                            )
                          }
                        >
                          Gán công ty ship
                        </Button>
                      </Stack>
                    )}{" "}
                  {order.ITEM_STATUS === "PENDING" && (
                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() =>
                          handleConfirmOrder(order.ID_MATERIAL_ORDER_MASTER)
                        }
                      >
                        Xác nhận đơn hàng
                      </Button>
                    </Stack>
                  )}
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MaterialsOrderViewModal;
