import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import DynamicModal from "../../../share-view/dynamic/modal/modal";

import companyServices from "../../../services/companies-service";

import ReduxExportUseAuthState from "../../../redux/redux-export/useAuthServices";
import orderServices from "../../../services/orderServices";
import OrderDetailsViewModal from "./orders-details-modal";

const OrdersFormModal = ({ open, onClose, order, onSuccess }) => {
  const [formData, setFormData] = useState({
    ID_USERS: "",
    DATE_ORDER: "",
    TOTAL_AMOUNT_ORDER: "",
    PAYMENT_STATUS_ORDER: "",
    SHIPPING_STATUS_ORDER: "",
    SHIPPING_ADDRESS: "",
    SHIPPING_METHOD: "",
    SHIPPING_COST: "",
    ID_COMPANY: "",
    ID_TRANSPORT_ORDER: "",
    PAYMENT_METHOD: "",
    FULLNAME_ORDER: "",
    PHONE_ORDER: "",
  });

  const [companiesOptions, setCompaniesOptions] = useState([]);
  const { userInfo } = ReduxExportUseAuthState();
  const [selectedOrder, setSelectedOrder] = useState(null);
  useEffect(() => {
    if (open) {
      setFormData(
        order
          ? {
              ID_USERS: order.ID_USERS || "",
              DATE_ORDER: order.DATE_ORDER
                ? order.DATE_ORDER.split("T")[0]
                : "",
              TOTAL_AMOUNT_ORDER: order.TOTAL_AMOUNT_ORDER || "",
              PAYMENT_STATUS_ORDER: order.PAYMENT_STATUS_ORDER || "",
              SHIPPING_STATUS_ORDER: order.SHIPPING_STATUS_ORDER || "",
              SHIPPING_ADDRESS: order.SHIPPING_ADDRESS || "",
              SHIPPING_METHOD: order.SHIPPING_METHOD || "",
              SHIPPING_COST: order.SHIPPING_COST || "",
              ID_COMPANY: order.ID_COMPANY || "",
              ID_TRANSPORT_ORDER: order.ID_TRANSPORT_ORDER || "",
              PAYMENT_METHOD: order.PAYMENT_METHOD || "",
              FULLNAME_ORDER: order.FULLNAME_ORDER || "",
              PHONE_ORDER: order.PHONE_ORDER || "",
            }
          : {
              ID_USERS: "",
              DATE_ORDER: "",
              TOTAL_AMOUNT_ORDER: "",
              PAYMENT_STATUS_ORDER: "PENDING",
              SHIPPING_STATUS_ORDER: "PENDING",
              SHIPPING_ADDRESS: "",
              SHIPPING_METHOD: "",
              SHIPPING_COST: "0",
              ID_COMPANY: userInfo?.companyInfo?.ID_COMPANY || "",
              ID_TRANSPORT_ORDER: "",
              PAYMENT_METHOD: "COD",
              FULLNAME_ORDER: "",
              PHONE_ORDER: "",
            }
      );
    }
    fetchOrderId(order?.ID_ORDERS_);
    fetchCompanies();
  }, [open, order]);

  const fetchOrderId = async (ID_ORDERS_) => {
    if (!ID_ORDERS_) return;
    try {
      const data = await orderServices.getOrderById(ID_ORDERS_);
      console.log("data", data);
      setSelectedOrder(data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const data = await companyServices.getCompanies();
      setCompaniesOptions(data.DT);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const optionPaymentStatus = [
    { value: "PENDING", label: "Chưa thanh toán" },
    { value: "PAID", label: "Đã thanh toán" },
    { value: "FAILED", label: "Thanh toán thất bại" },
  ];

  const optionShippingStatus = [
    { value: "PENDING", label: "Chưa giao hàng" },
    { value: "SHIPPED", label: "Đang giao" },
    { value: "DELIVERED", label: "Đã giao" },
    { value: "CANCELLED", label: "Đã hủy" },
  ];

  const optionPaymentMethod = [
    { value: "COD", label: "Thanh toán khi nhận hàng" },
    { value: "BANK", label: "Chuyển khoản ngân hàng" },
    { value: "ONLINE", label: "Thanh toán online" },
  ];

  const fields = [
    {
      key: "ID_USERS",
      label: "ID Người dùng",
      inputType: "number",
      required: true,
    },
    {
      key: "DATE_ORDER",
      label: "Ngày đặt hàng",
      inputType: "datetime",
      required: true,
    },
    {
      key: "TOTAL_AMOUNT_ORDER",
      label: "Tổng số tiền",
      inputType: "number",
      required: true,
    },
    {
      key: "PAYMENT_STATUS_ORDER",
      label: "Trạng thái thanh toán",
      inputType: "autocomplete",
      options: optionPaymentStatus,
      optionsLabel: "label",
      required: true,
    },
    {
      key: "SHIPPING_STATUS_ORDER",
      label: "Trạng thái giao hàng",
      inputType: "autocomplete",
      options: optionShippingStatus,
      optionsLabel: "label",
      required: true,
    },
    {
      key: "SHIPPING_ADDRESS",
      label: "Địa chỉ giao hàng",
      inputType: "text",
      required: true,
    },
    {
      key: "SHIPPING_METHOD",
      label: "Phương thức vận chuyển",
      inputType: "text",
    },
    {
      key: "SHIPPING_COST",
      label: "Chi phí vận chuyển",
      inputType: "number",
    },
    {
      key: "ID_COMPANY",
      label: "Công ty",
      inputType: "autocomplete",
      options: companiesOptions,
      optionsLabel: "NAME_COMPANY",
      required: true,
      disabled: !!userInfo?.companyInfo?.ID_COMPANY,
    },
    {
      key: "ID_TRANSPORT_ORDER",
      label: "ID Vận chuyển",
      inputType: "number",
    },
    {
      key: "PAYMENT_METHOD",
      label: "Phương thức thanh toán",
      inputType: "autocomplete",
      options: optionPaymentMethod,
      optionsLabel: "label",
      required: true,
    },
    {
      key: "FULLNAME_ORDER",
      label: "Họ tên người nhận",
      inputType: "text",
      required: true,
    },
    {
      key: "PHONE_ORDER",
      label: "Số điện thoại",
      inputType: "text",
      required: true,
    },
  ];

  const handleFormChange = (updatedFormData) => {
    setFormData((prev) => ({
      ...prev,
      ...updatedFormData,
    }));
  };

  const handleSubmit = async (submittedFormData) => {
    try {
      const dataToSubmit = {
        ...formData,
        ...submittedFormData,
      };

      if (order) {
        await orderServices.updateOrder(order.ID_ORDERS_, dataToSubmit);
      } else {
        await orderServices.createOrder(dataToSubmit);
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving order:", error);
      throw new Error("Có lỗi xảy ra khi lưu đơn hàng. Vui lòng thử lại.");
    }
  };

  const customActions = ({ handleSubmit, onClose }) => (
    <>
      <Button onClick={onClose} color="secondary">
        Hủy
      </Button>
      <Button onClick={handleSubmit} variant="contained" color="primary">
        Lưu
      </Button>
    </>
  );

  const onUpdateStatus = () => {};
  return (
    <>
      {/* <DynamicModal
        open={open}
        onClose={onClose}
        onSubmit={handleSubmit}
        fields={fields}
        initialData={formData}
        title={order ? "Sửa đơn hàng" : "Thêm đơn hàng"}
        renderActions={customActions}
        onChange={handleFormChange}
      /> */}
      <OrderDetailsViewModal
        order={selectedOrder}
        open={open}
        onClose={onClose}
        onUpdateStatus={onUpdateStatus}
      />
    </>
  );
};

export default OrdersFormModal;
