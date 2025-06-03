import React, { useEffect, useState } from "react";
import roleServices from "../../services/role-service";
import DynamicModal from "../../share-view/dynamic/modal/modal";
import PermissionManagerModal from "../section-modal/role/roleListPer-section-modal";
import { Button } from "@mui/material";
import spService from "../../share-service/spService";
import companyServices from "../../services/companies-service";
import ReduxExportUseAuthState from "../../redux/redux-export/useAuthServices";

const RoleFormModal = ({ open, onClose, role, onSuccess }) => {
  // State to manage form data
  const [formData, setFormData] = useState({
    NAME_ROLE: "",
    CODE_NAME: "",
    LIST_PERMISSION: [],
    ID_COMPANY: 0,
    DESCRIPTION: "",
  });
  const { userInfo } = ReduxExportUseAuthState();

  const [companiesOptions, setCompaniesOptions] = useState([]);
  useEffect(() => {
    if (open) {
      setFormData(
        role
          ? {
              NAME_ROLE: role.NAME_ROLE || "",
              CODE_NAME: role.CODE_NAME || "",
              DESCRIPTION: role.DESCRIPTION,
              ID_COMPANY: role.ID_COMPANY || 0,

              LIST_PERMISSION: spService.parseJsonIfValid(role.LIST_PERMISION),
            }
          : {
              NAME_ROLE: "",
              CODE_NAME: "",
              LIST_PERMISSION: [],
              ID_COMPANY: userInfo?.companyInfo?.ID_COMPANY || 0,
              DESCRIPTION: "",
            }
      );
    }
    fetchCompanies();
  }, [open, role]);

  const fetchCompanies = async () => {
    try {
      const companyId = userInfo?.companyInfo?.ID_COMPANY || null;
      const data = await companyServices.getCompanies(companyId);

      setCompaniesOptions(data?.DT || []);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  // Handle form input changes from DynamicModal
  const handleFormChange = (updatedFormData) => {
    setFormData((prev) => ({
      ...prev,
      NAME_ROLE:
        updatedFormData.NAME_ROLE !== undefined
          ? updatedFormData.NAME_ROLE
          : prev.NAME_ROLE,
      CODE_NAME:
        updatedFormData.CODE_NAME !== undefined
          ? updatedFormData.CODE_NAME
          : prev.CODE_NAME,
      ID_COMPANY:
        updatedFormData.ID_COMPANY !== undefined
          ? updatedFormData.ID_COMPANY
          : prev.ID_COMPANY,

      DESCRIPTION:
        updatedFormData.DESCRIPTION !== undefined
          ? updatedFormData.DESCRIPTION
          : prev.DESCRIPTION,
    }));
  };

  // Handle form submission
  const handleSubmit = async (submittedFormData) => {
    try {
      const dataToSubmit = {
        ...formData,
        NAME_ROLE: submittedFormData.NAME_ROLE || formData.NAME_ROLE,
        CODE_NAME: submittedFormData.CODE_NAME || formData.CODE_NAME,
        LIST_PERMISSION: JSON.stringify(formData.LIST_PERMISSION), // Use LIST_PERMISSION from state
        ID_COMPANY: submittedFormData.ID_COMPANY || formData.ID_COMPANY,
        DESCRIPTION: submittedFormData.DESCRIPTION || formData.DESCRIPTION,
      };

      if (role) {
        await roleServices.updateRole(role.ID_ROLE, dataToSubmit);
      } else {
        await roleServices.createRole(dataToSubmit);
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving role:", error);
      throw new Error("Có lỗi xảy ra khi lưu. Vui lòng thử lại.");
    }
  };

  // State for PermissionManagerModal
  const [isOpenAddListPermission, setIsOpenAddListPermission] = useState(false);

  // Handle permissions update from PermissionManagerModal
  const handleSetListPermissionsForm = (finalPermissions) => {
    setFormData((prev) => ({
      ...prev,
      LIST_PERMISSION: finalPermissions || [],
    }));
    setIsOpenAddListPermission(false);
  };
  const fields = [
    {
      key: "ID_COMPANY",
      label: "Thuộc Công Ty",
      inputType: "autocomplete", // Sử dụng Autocomplete cho trường này
      options: companiesOptions, // Dữ liệu lựa chọn từ API
      optionsLabel: "NAME_COMPANY",
      disabled: userInfo.companyInfo.ID_COMPANY ? true : false,
    },
    {
      key: "NAME_ROLE",
      label: "Tên quyền",
      required: true,
      inputType: "text",
    },
    {
      key: "CODE_NAME",
      label: "Mã quyền",
      required: true,
      inputType: "text",
    },
    {
      key: "DESCRIPTION",
      label: "Mô tả",
      required: true,
      inputType: "text",
      rows: 3,
    },
  ];
  // Custom renderActions function
  const customActions = ({ handleSubmit, onClose }) => (
    <>
      <Button
        onClick={() => setIsOpenAddListPermission(true)}
        color="primary"
        variant="outlined"
      >
        Quản lý quyền
      </Button>
      <Button onClick={onClose} color="secondary">
        Hủy
      </Button>
      <Button onClick={handleSubmit} variant="contained" color="primary">
        Lưu
      </Button>
    </>
  );

  return (
    <>
      <DynamicModal
        open={open}
        onClose={onClose}
        onSubmit={handleSubmit}
        fields={fields}
        initialData={formData}
        title={role ? "Sửa Role" : "Thêm Role"}
        renderActions={customActions}
        onChange={handleFormChange} // Pass onChange handler
      />
      <PermissionManagerModal
        open={isOpenAddListPermission}
        onClose={() => setIsOpenAddListPermission(false)}
        initialPermissions={formData?.LIST_PERMISSION || []}
        handleSetListPermissionsForm={handleSetListPermissionsForm}
      />
    </>
  );
};

export default RoleFormModal;
