import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import DynamicModal from "../../share-view/dynamic/modal/modal";

import companyServices from "../../services/companies-service";
import transportServiceFeesService from "../../services/transportServiceFees.service";
import ReduxExportUseAuthState from "../../redux/redux-export/useAuthServices";
import companyTypeServices from "../../services/company_types-service";

const TransportServiceFeesModal = ({ open, onClose, fee, onSuccess }) => {
  const [formData, setFormData] = useState({
    ID_COMPANY_SHIP: "",
    SERVICE_NAME: "",
    UNIT: "",
    PRICE: "",
    NOTE: "",
    STATUS: "",
  });

  const { userInfo } = ReduxExportUseAuthState();
  const [shippingCompanies, setShippingCompanies] = useState([]);
  useEffect(() => {
    if (open) {
      setFormData(
        fee
          ? {
              ID_COMPANY_SHIP: fee.ID_COMPANY_SHIP || "",
              SERVICE_NAME: fee.SERVICE_NAME || "",
              UNIT: fee.UNIT || "",
              PRICE: fee.PRICE || "",
              NOTE: fee.NOTE || "",
              STATUS: fee.STATUS || "",
            }
          : {
              ID_COMPANY_SHIP: userInfo?.companyInfo?.ID_COMPANY || "",
              SERVICE_NAME: "",
              UNIT: "",
              PRICE: "",
              NOTE: "",
              STATUS: "",
            }
      );

      fetchShippingCompanies();
    }
  }, [open, fee]);

  const fetchShippingCompanies = async () => {
    try {
      const filter = [
        {
          key: "ROUTER_COMPANY",
          value: "transport_orders",
        },
      ];
      const data = await companyTypeServices.getCompaniesByRouter(filter);

      const companies = data?.map((company) => ({
        ...company,
        ID_COMPANY_SHIP: company.ID_COMPANY, // Thêm trường mới
        ID_COMPANY: company.ID_COMPANY, // (Tùy chọn) Xóa trường cũ nếu không cần
      }));
      setShippingCompanies(companies || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách công ty vận chuyển:", error);
    }
  };

  const optionStatus = [
    { value: "ACTIVE", label: "Đang áp dụng", STATUS: "ACTIVE" },
    { value: "INACTIVE", label: "Không áp dụng", STATUS: "INACTIVE" },
    { value: "PENDING", label: "Chờ duyệt", STATUS: "PENDING" },
  ];

  const fields = [
    {
      key: "ID_COMPANY_SHIP",
      label: "Thuộc công ty vận chuyển",
      inputType: "autocomplete",
      options: shippingCompanies,
      optionsLabel: "NAME_COMPANY",
      required: true,
      disabled: !!userInfo?.companyInfo?.ID_COMPANY,
    },
    {
      key: "SERVICE_NAME",
      label: "Tên dịch vụ",
      inputType: "text",
      required: true,
    },
    {
      key: "UNIT",
      label: "Đơn vị",
      inputType: "text",
      required: true,
    },
    {
      key: "PRICE",
      label: "Giá",
      inputType: "number",
      required: true,
    },
    {
      key: "NOTE",
      label: "Ghi chú",
      inputType: "textarea",
    },
    {
      key: "STATUS",
      label: "Trạng thái",
      inputType: "autocomplete",
      options: optionStatus,
      optionsLabel: "label",
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
        ID_COMPANY_SHIP:
          submittedFormData.ID_COMPANY_SHIP || formData.ID_COMPANY_SHIP,
        SERVICE_NAME: submittedFormData.SERVICE_NAME || formData.SERVICE_NAME,
        UNIT: submittedFormData.UNIT || formData.UNIT,
        PRICE: submittedFormData.PRICE || formData.PRICE,
        NOTE: submittedFormData.NOTE || formData.NOTE,
        STATUS: submittedFormData.STATUS || formData.STATUS,
      };

      if (fee) {
        await transportServiceFeesService.updateFee(fee.ID_FEE, dataToSubmit);
      } else {
        await transportServiceFeesService.createFee(dataToSubmit);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving fee:", error);
      throw new Error("Đã xảy ra lỗi khi lưu dữ liệu. Vui lòng thử lại.");
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

  return (
    <DynamicModal
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
      fields={fields}
      initialData={formData}
      title={fee ? "Sửa phí dịch vụ" : "Thêm phí dịch vụ"}
      renderActions={customActions}
      onChange={handleFormChange}
    />
  );
};

export default TransportServiceFeesModal;
