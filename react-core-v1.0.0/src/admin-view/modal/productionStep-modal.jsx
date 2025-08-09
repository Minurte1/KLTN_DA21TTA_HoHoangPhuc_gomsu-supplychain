import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import DynamicModal from "../../share-view/dynamic/modal/modal";

import equipmentServices from "../../services/equipmentServices";
import companyServices from "../../services/companies-service";
import ReduxExportUseAuthState from "../../redux/redux-export/useAuthServices";
import productionPlanServices from "../../services/productionPlanServices";
import productionStepServices from "../../services/productionStepServices";
import { getAllUsers } from "../../services/userAccountService";

const ProductionStepsFormModal = ({
  open,
  onClose,
  productionStep,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    ID_PRODUCTION_PLANS: "",
    ID_USERS: "",
    ID_EQUIPMENT: "",
    STEP_NAME_PRODUCTION_STEPS: "",
    START_TIME_PRODUCTION_STEPS: "",
    END_TIME_PRODUCTION_STEPS: "",
    STATUS_PRODUCTION_STEPS: "",
    ID_COMPANY: "",
  });

  const [productionPlansOptions, setProductionPlansOptions] = useState([]);
  const [usersOptions, setUsersOptions] = useState([]);
  const [equipmentOptions, setEquipmentOptions] = useState([]);
  const [companiesOptions, setCompaniesOptions] = useState([]);

  const { userInfo } = ReduxExportUseAuthState();

  useEffect(() => {
    if (open) {
      setFormData(
        productionStep
          ? {
              ID_PRODUCTION_PLANS: productionStep.ID_PRODUCTION_PLANS || "",
              ID_USERS: productionStep.ID_USERS || "",
              ID_EQUIPMENT: productionStep.ID_EQUIPMENT || "",
              STEP_NAME_PRODUCTION_STEPS:
                productionStep.STEP_NAME_PRODUCTION_STEPS || "",
              START_TIME_PRODUCTION_STEPS:
                productionStep.START_TIME_PRODUCTION_STEPS
                  ? productionStep.START_TIME_PRODUCTION_STEPS.split("T")[0]
                  : "",
              END_TIME_PRODUCTION_STEPS:
                productionStep.END_TIME_PRODUCTION_STEPS
                  ? productionStep.END_TIME_PRODUCTION_STEPS.split("T")[0]
                  : "",
              STATUS_PRODUCTION_STEPS:
                productionStep.STATUS_PRODUCTION_STEPS || "",
              ID_COMPANY:
                productionStep.ID_COMPANY ||
                userInfo?.companyInfo?.ID_COMPANY ||
                "",
            }
          : {
              ID_PRODUCTION_PLANS: "",
              ID_USERS: "",
              ID_EQUIPMENT: "",
              STEP_NAME_PRODUCTION_STEPS: "",
              START_TIME_PRODUCTION_STEPS: "",
              END_TIME_PRODUCTION_STEPS: "",
              STATUS_PRODUCTION_STEPS: "",
              ID_COMPANY: userInfo?.companyInfo?.ID_COMPANY || "",
            }
      );
    }

    fetchProductionPlans();
    fetchUsers();
    fetchEquipment();
    fetchCompanies();
  }, [open, productionStep]);

  const fetchProductionPlans = async () => {
    try {
      const companyId = userInfo?.companyInfo?.ID_COMPANY || null;
      const data = await productionPlanServices.getAll(companyId);
      setProductionPlansOptions(data);
    } catch (error) {
      console.error("Error fetching production plans:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const companyId = userInfo?.companyInfo?.ID_COMPANY || null;
      const data = await getAllUsers(companyId);
      setUsersOptions(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchEquipment = async () => {
    try {
      const companyId = userInfo?.companyInfo?.ID_COMPANY || null;
      const data = await equipmentServices.getAll(companyId);
      setEquipmentOptions(data);
    } catch (error) {
      console.error("Error fetching equipment:", error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const data = await companyServices.getCompanies();
      setCompaniesOptions(data.DT || []);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const optionStatus = [
    { value: "PENDING", label: "Chờ xử lý" },
    { value: "IN_PROGRESS", label: "Đang tiến hành" },
    { value: "COMPLETED", label: "Hoàn thành" },
    { value: "CANCELLED", label: "Đã hủy" },
  ];

  const fields = [
    {
      key: "ID_PRODUCTION_PLANS",
      label: "Kế hoạch sản xuất",
      inputType: "autocomplete",
      options: productionPlansOptions,
      optionsLabel: "PLAN_NAME", // chỉnh theo tên trường đúng bên API
      required: true,
    },
    {
      key: "ID_USERS",
      label: "Người phụ trách",
      inputType: "autocomplete",
      options: usersOptions,
      optionsLabel: "USER_NAME", // chỉnh theo tên trường đúng bên API
      required: true,
    },
    {
      key: "ID_EQUIPMENT",
      label: "Thiết bị",
      inputType: "autocomplete",
      options: equipmentOptions,
      optionsLabel: "EQUIPMENT_NAME", // chỉnh theo tên trường đúng bên API
      required: true,
    },
    {
      key: "STEP_NAME_PRODUCTION_STEPS",
      label: "Tên bước sản xuất",
      inputType: "text",
      required: true,
    },
    {
      key: "START_TIME_PRODUCTION_STEPS",
      label: "Thời gian bắt đầu",
      inputType: "datetime",
      required: true,
    },
    {
      key: "END_TIME_PRODUCTION_STEPS",
      label: "Thời gian kết thúc",
      inputType: "datetime",
      required: true,
    },
    {
      key: "STATUS_PRODUCTION_STEPS",
      label: "Trạng thái",
      inputType: "autocomplete",
      options: optionStatus,
      optionsLabel: "label",
      required: true,
    },
    {
      key: "ID_COMPANY",
      label: "Thuộc Công Ty",
      inputType: "autocomplete",
      options: companiesOptions,
      optionsLabel: "NAME_COMPANY",
      required: true,
      disabled: userInfo?.companyInfo?.ID_COMPANY ? true : false,
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
        ID_PRODUCTION_PLANS:
          submittedFormData.ID_PRODUCTION_PLANS || formData.ID_PRODUCTION_PLANS,
        ID_USERS: submittedFormData.ID_USERS || formData.ID_USERS,
        ID_EQUIPMENT: submittedFormData.ID_EQUIPMENT || formData.ID_EQUIPMENT,
        STEP_NAME_PRODUCTION_STEPS:
          submittedFormData.STEP_NAME_PRODUCTION_STEPS ||
          formData.STEP_NAME_PRODUCTION_STEPS,
        START_TIME_PRODUCTION_STEPS:
          submittedFormData.START_TIME_PRODUCTION_STEPS ||
          formData.START_TIME_PRODUCTION_STEPS,
        END_TIME_PRODUCTION_STEPS:
          submittedFormData.END_TIME_PRODUCTION_STEPS ||
          formData.END_TIME_PRODUCTION_STEPS,
        STATUS_PRODUCTION_STEPS:
          submittedFormData.STATUS_PRODUCTION_STEPS ||
          formData.STATUS_PRODUCTION_STEPS,
        ID_COMPANY: submittedFormData.ID_COMPANY || formData.ID_COMPANY,
      };

      if (productionStep) {
        await productionStepServices.updateProductionStep(
          productionStep.ID_PRODUCTION_STEPS_,
          dataToSubmit
        );
      } else {
        await productionStepServices.createProductionStep(dataToSubmit);
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving production step:", error);
      throw new Error("Có lỗi xảy ra khi lưu. Vui lòng thử lại.");
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
      title={productionStep ? "Sửa bước sản xuất" : "Thêm bước sản xuất"}
      renderActions={customActions}
      onChange={handleFormChange}
    />
  );
};

export default ProductionStepsFormModal;
