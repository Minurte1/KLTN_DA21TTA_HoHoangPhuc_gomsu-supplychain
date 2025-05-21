import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import DynamicModal from "../../share-view/dynamic/modal/modal";

import roleServices from "../../services/role-service";
import {
  createUser,
  deleteUserById,
  updateUserById,
} from "../../services/userAccountService";
import companyServices from "../../services/companies-service";
import AddressSelector from "../../components/addressUser";

const UsersFormModal = ({ open, onClose, user, onSuccess }) => {
  const [formData, setFormData] = useState({
    ID_ROLE: "",
    HO_TEN: "",
    EMAIL: "",
    _PASSWORD_HASH_USERS: "",
    SO_DIEN_THOAI: "",
    IS_DELETE_USERS: true,
    NGAY_TAO_USER: "",
    NGAY_CAP_NHAT_USER: "",
    AVATAR: "",
    DIA_CHI_Provinces: "",
    DIA_CHI_Districts: "",
    DIA_CHI_Wards: "",
    DIA_CHI_STREETNAME: "",
    TRANG_THAI_USER: "ACTIVE",
    ID_COMPANY: 0,
  });

  const [roleOptions, setRoleOptions] = useState([]);
  const [companiesOptions, setCompaniesOptions] = useState([]);

  const fetchCompanies = async () => {
    try {
      const data = await companyServices.getCompanies();
      setCompaniesOptions(data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const fetchRoles = async () => {
    try {
      const data = await roleServices.getRoles();
      setRoleOptions(data);
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
          NGAY_TAO_USER: user.NGAY_TAO_USER || "",
          NGAY_CAP_NHAT_USER: user.NGAY_CAP_NHAT_USER || "",
          IS_DELETE_USERS: user.IS_DELETE_USERS ?? false,
          AVATAR: user.AVATAR || "",
          DIA_CHI_Provinces:
            user.DIA_CHI_Provinces?.full_name || user.DIA_CHI_Provinces || "",
          DIA_CHI_Districts:
            user.DIA_CHI_Districts?.full_name || user.DIA_CHI_Districts || "",
          DIA_CHI_Wards:
            user.DIA_CHI_Wards?.full_name || user.DIA_CHI_Wards || "",
          DIA_CHI_STREETNAME: user.DIA_CHI_STREETNAME || "",
          TRANG_THAI_USER: user.TRANG_THAI_USER || "ACTIVE",
          ID_COMPANY: user.ID_COMPANY || 0,
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
      // --- Lấy và xử lý địa chỉ ---
      const province = submittedFormData?.DIA_CHI_Provinces?.full_name || "";
      const district = submittedFormData?.DIA_CHI_Districts?.full_name || "";
      const ward = submittedFormData?.DIA_CHI_Wards?.full_name || "";
      const street = submittedFormData?.DIA_CHI_STREETNAME || "";

      const fullAddress =
        street && ward && district && province
          ? `${street}, ${ward}, ${district}, ${province}`
          : "";

      // --- Gộp data ---
      const dataToSubmit = {
        ...formData,
        ...submittedFormData,
        DIA_CHI_Provinces: province,
        DIA_CHI_Districts: district,
        DIA_CHI_Wards: ward,
        DIA_CHI: fullAddress,
      };

      // --- VALIDATE ---
      const errors = [];

      // Bắt buộc
      if (!dataToSubmit.HO_TEN?.trim())
        errors.push("Họ tên không được để trống.");
      if (!dataToSubmit.EMAIL?.trim()) {
        errors.push("Email không được để trống.");
      } else {
        // Regex kiểm tra định dạng email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(dataToSubmit.EMAIL)) {
          errors.push("Email không đúng định dạng.");
        }
      }

      if (!user && !dataToSubmit._PASSWORD_HASH_USERS?.trim()) {
        errors.push("Mật khẩu không được để trống.");
      }

      if (!dataToSubmit.ID_COMPANY) errors.push("Vui lòng chọn công ty.");
      if (!dataToSubmit.ID_ROLE) errors.push("Vui lòng chọn vai trò.");

      // Kiểm tra số điện thoại (nếu có)
      if (dataToSubmit.SO_DIEN_THOAI) {
        const phoneRegex = /^(0|\+84)[0-9]{9}$/;
        if (!phoneRegex.test(dataToSubmit.SO_DIEN_THOAI)) {
          errors.push("Số điện thoại không hợp lệ.");
        }
      }

      // Nếu có lỗi thì không gửi lên server
      if (errors.length > 0) {
        alert(errors.join("\n"));
        return;
      }

      // --- Gọi API ---
      if (user) {
        await updateUserById(user.ID_USERS, dataToSubmit);
      } else {
        await createUser(dataToSubmit);
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const fields = [
    {
      key: "ID_COMPANY",
      label: "Thuộc Công Ty",
      inputType: "autocomplete",
      options: companiesOptions,
      optionsLabel: "NAME_COMPANY",
      required: true,
    },
    {
      key: "ID_ROLE",
      label: "Vai trò",
      inputType: "autocomplete",
      options: roleOptions,
      optionsLabel: "NAME_ROLE",
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
      key: "AVATAR",
      label: "Ảnh đại diện",
      inputType: "text",
    },
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
      renderExtraFields={() => (
        <AddressSelector
          selectedProvince={formData.DIA_CHI_Provinces}
          selectedDistrict={formData.DIA_CHI_Districts}
          selectedWards={formData.DIA_CHI_Wards}
          setSelectedProvince={(value) =>
            handleFormChange({ DIA_CHI_Provinces: value || "" })
          }
          setSelectedDistrict={(value) =>
            handleFormChange({ DIA_CHI_Districts: value || "" })
          }
          setSelectedWards={(value) =>
            handleFormChange({ DIA_CHI_Wards: value || "" })
          }
        />
      )}
    />
  );
};

export default UsersFormModal;
