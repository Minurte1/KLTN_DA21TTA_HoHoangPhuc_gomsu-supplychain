import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import DynamicModal from "../../share-view/dynamic/modal/modal";

import ReduxExportUseAuthState from "../../redux/redux-export/useAuthServices";
import equipmentServices from "../../services/equipmentServices";

const EquipmentFormModal = ({ open, onClose, equipment, onSuccess }) => {
  const [formData, setFormData] = useState({
    NAME_EQUIPMENT: "",
    TYPE_EQUIPMENT: "",
    STATUS: "",
    LAST_MAINTENANCE: "",
  });

  const { userInfo } = ReduxExportUseAuthState();

  useEffect(() => {
    if (open) {
      setFormData(
        equipment
          ? {
              NAME_EQUIPMENT: equipment.NAME_EQUIPMENT || "",
              TYPE_EQUIPMENT: equipment.TYPE_EQUIPMENT || "",
              STATUS: equipment.STATUS || "",
              LAST_MAINTENANCE: equipment.LAST_MAINTENANCE
                ? equipment.LAST_MAINTENANCE.split("T")[0]
                : "",
            }
          : {
              NAME_EQUIPMENT: "",
              TYPE_EQUIPMENT: "",
              STATUS: "ACTIVE", // mặc định trạng thái
              LAST_MAINTENANCE: "",
            }
      );
    }
  }, [open, equipment]);

  const optionStatus = [
    { value: "ACTIVE", label: "Đang sử dụng" },
    { value: "INACTIVE", label: "Không sử dụng" },
    { value: "MAINTENANCE", label: "Đang bảo trì" },
  ];

  const fields = [
    {
      key: "NAME_EQUIPMENT",
      label: "Tên thiết bị",
      inputType: "text",
      required: true,
    },
    {
      key: "TYPE_EQUIPMENT",
      label: "Loại thiết bị",
      inputType: "text",
      required: true,
    },
    {
      key: "STATUS",
      label: "Trạng thái",
      inputType: "autocomplete",
      options: optionStatus,
      optionsLabel: "label",
      required: true,
    },
    {
      key: "LAST_MAINTENANCE",
      label: "Ngày bảo trì lần cuối",
      inputType: "date",
    },
  ];

  const handleFormChange = (updatedFormData) => {
    setFormData((prev) => ({
      ...prev,
      ...updatedFormData,
    }));
  };

  const handleSubmit = async (submittedFormData) => {
    const dataToSubmit = {
      NAME_EQUIPMENT:
        submittedFormData.NAME_EQUIPMENT || formData.NAME_EQUIPMENT,
      TYPE_EQUIPMENT:
        submittedFormData.TYPE_EQUIPMENT || formData.TYPE_EQUIPMENT,
      STATUS: submittedFormData.STATUS || formData.STATUS,
      LAST_MAINTENANCE:
        submittedFormData.LAST_MAINTENANCE || formData.LAST_MAINTENANCE,
    };

    try {
      if (equipment) {
        await equipmentServices.updateEquipment(
          equipment.ID_EQUIPMENT,
          dataToSubmit
        );
      } else {
        await equipmentServices.createEquipment(dataToSubmit);
      }
      onSuccess();
    } catch (error) {
      console.error("Lỗi khi lưu thiết bị:", error);
      throw new Error("Có lỗi xảy ra khi lưu thiết bị. Vui lòng thử lại.");
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
      title={equipment ? "Sửa thiết bị" : "Thêm thiết bị"}
      renderActions={customActions}
      onChange={handleFormChange}
    />
  );
};

export default EquipmentFormModal;
