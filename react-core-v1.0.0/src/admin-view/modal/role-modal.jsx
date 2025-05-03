import React, { useEffect } from "react";

import roleServices from "../../services/role-service";
import DynamicModal from "../../share-view/dynamic/modal/modal";

const RoleFormModal = ({ open, onClose, role, onSuccess }) => {
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
    {
      key: "LIST_PERMISSION",
      label: "Danh sách quyền",
      inputType: "text",
      disabled: true, // Disabled as a placeholder (can be enhanced with autocomplete/select)
    },
  ];

  const handleSubmit = async (formData) => {
    try {
      if (role) {
        await roleServices.updateRole(role.ID_ROLE, formData);
      } else {
        await roleServices.createRole(formData);
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving role:", error);
      throw new Error("Có lỗi xảy ra khi lưu. Vui lòng thử lại.");
    }
  };

  // Prepare initial data for the form
  const initialData = role
    ? {
        NAME_ROLE: role.NAME_ROLE || "",
        CODE_NAME: role.CODE_NAME || "",
        LIST_PERMISSION: role.LIST_PERMISSION?.join(", ") || "",
      }
    : {
        NAME_ROLE: "",
        CODE_NAME: "",
        LIST_PERMISSION: "",
      };

  return (
    <DynamicModal
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
      fields={fields}
      initialData={initialData}
      title={role ? "Sửa Role" : "Thêm Role"}
    />
  );
};

export default RoleFormModal;
