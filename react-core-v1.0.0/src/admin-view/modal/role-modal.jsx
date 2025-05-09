import React, { useEffect, useState } from "react";
import roleServices from "../../services/role-service";
import DynamicModal from "../../share-view/dynamic/modal/modal";
import PermissionManagerModal from "../section-modal/role/roleListPer-section-modal";
import { Button } from "@mui/material";

const RoleFormModal = ({ open, onClose, role, onSuccess }) => {
  // State to manage form data
  const [formData, setFormData] = useState({
    NAME_ROLE: "",
    CODE_NAME: "",
    LIST_PERMISSION: [],
  });
  console.log("role", role);
  // Initialize form data when role prop changes or modal opens
  useEffect(() => {
    if (open) {
      setFormData(
        role
          ? {
              NAME_ROLE: role.NAME_ROLE || "",
              CODE_NAME: role.CODE_NAME || "",
              LIST_PERMISSION: role.LIST_PERMISION
                ? JSON.parse(role.LIST_PERMISION)
                : [] || [],
            }
          : {
              NAME_ROLE: "",
              CODE_NAME: "",
              LIST_PERMISSION: [],
            }
      );
    }
  }, [open, role]);

  // Form fields for DynamicModal
  const fields = [
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
  ];

  // Handle form input changes from DynamicModal
  const handleFormChange = (updatedFormData) => {
    setFormData((prev) => ({
      ...prev,
      NAME_ROLE: updatedFormData.NAME_ROLE || prev.NAME_ROLE,
      CODE_NAME: updatedFormData.CODE_NAME || prev.CODE_NAME,
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
        initialPermissions={formData.LIST_PERMISSION || []}
        handleSetListPermissionsForm={handleSetListPermissionsForm}
      />
    </>
  );
};

export default RoleFormModal;
