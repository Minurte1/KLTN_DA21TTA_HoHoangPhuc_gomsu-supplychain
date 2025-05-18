import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import DynamicModal from "../../share-view/dynamic/modal/modal";

import roleServices from "../../services/role-service";
import {
  deleteUserById,
  updateUserById,
} from "../../services/userAccountService";
import companyServices from "../../services/companies-service";

const UsersFormModal = ({ open, onClose, user, onSuccess }) => {
  const [formData, setFormData] = useState({
    ID_ROLE: "",
    HO_TEN: "",
    EMAIL: "",
    _PASSWORD_HASH_USERS: "",
    SO_DIEN_THOAI: "",
    IS_ACTIVE_USERS: true,
    NGAY_TAO_USER: "",
    NGAY_CAP_NHAT_USER: "",
    IS_DELETE_USERS: false,
    AVATAR: "",
    DIA_CHI_Provinces: "",
    DIA_CHI_Districts: "",
    DIA_CHI_Wards: "",
    DIA_CHI_STREETNAME: "",
    TRANG_THAI_USER: "ACTIVE",
  });

  const [roleOptions, setRoleOptions] = useState([]);
  const [companiesOptions, setCompaniesOptions] = useState([]);
  const fetchRoles = async () => {
    try {
      const data = await roleServices.getRoles();
      console.log("data", data);
      setRoleOptions(data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };
  const fetchCompanies = async () => {
    try {
      const data = await companyServices.getCompanies();
      console.log("data", data);
      setCompaniesOptions(data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchRoles();
      fetchCompanies();
      if (user) {
        setFormData({
          ID_ROLE: user.ID_ROLE || "",
          HO_TEN: user.HO_TEN || "",
          EMAIL: user.EMAIL || "",
          _PASSWORD_HASH_USERS: "", // Không load mật khẩu cũ
          SO_DIEN_THOAI: user.SO_DIEN_THOAI || "",
          IS_ACTIVE_USERS: user.IS_ACTIVE_USERS ?? true,
          NGAY_TAO_USER: user.NGAY_TAO_USER || "",
          NGAY_CAP_NHAT_USER: user.NGAY_CAP_NHAT_USER || "",
          IS_DELETE_USERS: user.IS_DELETE_USERS ?? false,
          AVATAR: user.AVATAR || "",
          DIA_CHI_Provinces: user.DIA_CHI_Provinces || "",
          DIA_CHI_Districts: user.DIA_CHI_Districts || "",
          DIA_CHI_Wards: user.DIA_CHI_Wards || "",
          DIA_CHI_STREETNAME: user.DIA_CHI_STREETNAME || "",
          TRANG_THAI_USER: user.TRANG_THAI_USER || "ACTIVE",
        });
      }
    }
  }, [open, user]);

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

      if (user) {
        await updateUserById(user.ID_USERS, dataToSubmit);
      } else {
        await deleteUserById(dataToSubmit);
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving user:", error);
      throw new Error("Có lỗi xảy ra khi lưu. Vui lòng thử lại.");
    }
  };

  const fields = [
    {
      key: "ID_COMPANY",
      label: "Thuộc Công Ty",
      inputType: "autocomplete", // Sử dụng Autocomplete cho trường này
      options: companiesOptions, // Dữ liệu lựa chọn từ API
      optionsLabel: "NAME_COMPANY",
    },
    {
      key: "ID_ROLE",
      label: "Vai trò",
      inputType: "autocomplete",
      options: roleOptions,
      optionsLabel: "NAME_ROLE", // hoặc label phù hợp
      required: true,
    },
    { key: "HO_TEN", label: "Họ tên", inputType: "text", required: true },
    { key: "EMAIL", label: "Email", inputType: "email", required: true },
    {
      key: "_PASSWORD_HASH_USERS",
      label: "Mật khẩu",
      inputType: "password",
      required: !user,
    },
    {
      key: "SO_DIEN_THOAI",
      label: "Số điện thoại",
      inputType: "text",
    },
    {
      key: "IS_ACTIVE_USERS",
      label: "Đang hoạt động?",
      inputType: "switch",
    },
    {
      key: "AVATAR",
      label: "Ảnh đại diện",
      inputType: "text",
    },
    { key: "DIA_CHI_Provinces", label: "Tỉnh/Thành phố", inputType: "text" },
    { key: "DIA_CHI_Districts", label: "Quận/Huyện", inputType: "text" },
    { key: "DIA_CHI_Wards", label: "Phường/Xã", inputType: "text" },
    { key: "DIA_CHI_STREETNAME", label: "Tên đường", inputType: "text" },
    {
      key: "TRANG_THAI_USER",
      label: "Trạng thái",
      inputType: "select",
      options: [
        { value: "ACTIVE", label: "Hoạt động" },
        { value: "INACTIVE", label: "Không hoạt động" },
      ],
    },
  ];

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
      title={user ? "Sửa người dùng" : "Thêm người dùng"}
      renderActions={customActions}
      onChange={handleFormChange}
    />
  );
};

export default UsersFormModal;
