import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  Stepper,
  Step,
  StepLabel,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DynamicModal from "../../share-view/dynamic/modal/modal";
import productionPlanServices from "../../services/productionPlanServices";
import productServices from "../../services/productServices";
import companyServices from "../../services/companies-service";
import ReduxExportUseAuthState from "../../redux/redux-export/useAuthServices";
import { getAllUsers } from "../../services/userAccountService";
import Step2Materials from "./production_materials/production_materials-modal";

const steps = ["Thông tin kế hoạch", "Nguyên vật liệu"];

const ProductionPlansFormModal = ({
  open,
  onClose,
  productionPlan,
  onSuccess,
}) => {
  const { userInfo } = ReduxExportUseAuthState();

  const [currentStep, setCurrentStep] = useState(0);
  const [rows, setRows] = useState([]);
  const [materialsOptions, setMaterialsOptions] = useState([]);

  const [formData, setFormData] = useState({
    ID_PRODUCT: "",
    ID_USERS: "",
    PLANNED_START_PRODUCTION_PLANS: "",
    PLANNED_END_PRODUCTION_PLANS: "",
    ACTUAL_START_PRODUCTION_PLANS: "",
    ACTUAL_END_PRODUCTION_PLANS: "",
    STATUS_PRODUCTION_PLANS: "",
    NOTE_PRODUCTION_PLANS: "",
    ID_COMPANY: userInfo?.companyInfo?.ID_COMPANY || "",
    NAME_PRODUCTION_PLAN: "",
    QUANTITY_PRODUCT: 0,
    PRICE_PRODUCTS: 0,
  });

  const [materialsData, setMaterialsData] = useState({
    ID_PRODUCT_MATERIALS: "",
    ID_PRODUCTION_PLANS: "",
    ID_MATERIALS: "",
    QUANTITY_PER_UNIT_PRODUCT_MATERIALS: "",
    UNIT_PRODUCT_MATERIALS: "",
    ID_COMPANY: userInfo?.companyInfo?.ID_COMPANY || "",
  });

  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);

  const optionStatus = [
    { value: "PLANNED", label: "Đã Lập Kế Hoạch" },
    { value: "IN_PROGRESS", label: "Đang Tiến Hành" },
    { value: "COMPLETED", label: "Đã Hoàn Thành" },
    { value: "CANCELED", label: "Đã Hủy" },
  ];

  useEffect(() => {
    if (open && userInfo) {
      fetchProducts();
      fetchUsers();
      fetchCompanies();
    }
  }, [open, userInfo]);

  const fetchProducts = async () => {
    try {
      const companyId = userInfo?.companyInfo?.ID_COMPANY || null;
      const data = await productServices.getProducts({ ID_COMPANY: companyId });
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const companyId = userInfo?.companyInfo?.ID_COMPANY || null;
      const data = await getAllUsers(companyId);
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const companyId = userInfo?.companyInfo?.ID_COMPANY || null;
      const data = await companyServices.getCompanies(companyId);
      setCompanies(data.DT || []);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };
  useEffect(() => {
    if (open) {
      setMaterialsData(
        Array.isArray(productionPlan?.production_material)
          ? productionPlan.production_material
          : []
      );
      setFormData(
        productionPlan
          ? {
              ID_PRODUCT: productionPlan.ID_PRODUCT || "",
              ID_USERS: productionPlan.ID_USERS || "",
              PLANNED_START_PRODUCTION_PLANS:
                productionPlan.PLANNED_START_PRODUCTION_PLANS?.split("T")[0] ||
                "",
              PLANNED_END_PRODUCTION_PLANS:
                productionPlan.PLANNED_END_PRODUCTION_PLANS?.split("T")[0] ||
                "",
              ACTUAL_START_PRODUCTION_PLANS:
                productionPlan.ACTUAL_START_PRODUCTION_PLANS?.split("T")[0] ||
                "",
              ACTUAL_END_PRODUCTION_PLANS:
                productionPlan.ACTUAL_END_PRODUCTION_PLANS?.split("T")[0] || "",
              STATUS_PRODUCTION_PLANS:
                productionPlan.STATUS_PRODUCTION_PLANS || "",
              NOTE_PRODUCTION_PLANS: productionPlan.NOTE_PRODUCTION_PLANS || "",
              ID_COMPANY:
                productionPlan.ID_COMPANY ||
                userInfo?.companyInfo?.ID_COMPANY ||
                "",
              NAME_PRODUCTION_PLAN: productionPlan.NAME_PRODUCTION_PLAN || "",
              QUANTITY_PRODUCT: productionPlan.QUANTITY_PRODUCT || 0,
              PRICE_PRODUCTS: productionPlan.PRICE_PRODUCTS || 0,
            }
          : {
              ID_PRODUCT: "",
              ID_USERS: "",
              PLANNED_START_PRODUCTION_PLANS: "",
              PLANNED_END_PRODUCTION_PLANS: "",
              ACTUAL_START_PRODUCTION_PLANS: "",
              ACTUAL_END_PRODUCTION_PLANS: "",
              STATUS_PRODUCTION_PLANS: "",
              NOTE_PRODUCTION_PLANS: "",
              ID_COMPANY: userInfo?.companyInfo?.ID_COMPANY || "",
              NAME_PRODUCTION_PLAN: "",
              PRICE_PRODUCTS: 0,
            }
      );
    }
  }, [open, productionPlan, userInfo]);

  const step1Fields = useMemo(
    () => [
      {
        key: "NAME_PRODUCTION_PLAN",
        label: "Tên Kế Hoạch",
        inputType: "text",
        required: true,
      },
      {
        key: "ID_PRODUCT",
        label: "Sản Phẩm Mong Muốn",
        inputType: "autocomplete",
        required: true,
        options: products,
        optionsLabel: "NAME_PRODUCTS",
        optionsImage: "IMAGE_URL_PRODUCTS", // thêm key để lấy ảnh
      },
      {
        key: "ID_USERS",
        label: "Người Lên Kế Hoạch",
        inputType: "autocomplete",
        required: true,
        options: users,
        optionsLabel: "HO_TEN",
        optionsImage: "AVATAR",
      },
      {
        key: "QUANTITY_PRODUCT",
        label: "Số lượng sản xuất",
        inputType: "text",
        required: true,
      },
      {
        key: "PRICE_PRODUCTS",
        label: "Giá tiền trên mỗi sản phẩm",
        inputType: "text",
        required: true,
      },
      {
        key: "PLANNED_START_PRODUCTION_PLANS",
        label: "Ngày Bắt Đầu Dự Kiến",
        inputType: "datetime",
        required: true,
      },
      {
        key: "PLANNED_END_PRODUCTION_PLANS",
        label: "Ngày Kết Thúc Dự Kiến",
        inputType: "datetime",
        required: true,
      },
      {
        key: "ACTUAL_START_PRODUCTION_PLANS",
        label: "Ngày Bắt Đầu Thực Tế",
        inputType: "datetime",
      },
      {
        key: "ACTUAL_END_PRODUCTION_PLANS",
        label: "Ngày Kết Thúc Thực Tế",
        inputType: "datetime",
      },
      {
        key: "STATUS_PRODUCTION_PLANS",
        label: "Trạng Thái",
        inputType: "select",
        options: optionStatus,
        required: true,
      },
      { key: "NOTE_PRODUCTION_PLANS", label: "Ghi Chú", inputType: "text" },
      {
        key: "ID_COMPANY",
        label: "Công Ty",
        inputType: "autocomplete",
        options: companies,
        optionsLabel: "NAME_COMPANY",
        disabled: userInfo.companyInfo.ID_COMPANY ? true : false,
      },
    ],
    [
      products,
      users,
      companies,
      optionStatus,
      userInfo?.companyInfo?.ID_COMPANY,
    ]
  );

  const handleFormChange = (updated) => {
    if (currentStep === 0) {
      setFormData((prev) => ({ ...prev, ...updated }));
    } else {
      setMaterialsData((prev) => ({ ...prev, ...updated }));
    }
  };

  const handleNext = () => {
    if (currentStep === 0) {
      // Có thể validate Step 1 trước khi sang bước 2
      setCurrentStep(1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const dataInput = {
        ...formData,
        production_material: materialsData,
      };
      if (productionPlan) {
        await productionPlanServices.updateProductionPlan(
          productionPlan.ID_PRODUCTION_PLANS,
          dataInput
        );
      } else {
        const newPlan = await productionPlanServices.createProductionPlan(
          dataInput
        );
        setMaterialsData((prev) => ({
          ...prev,
          ID_PRODUCTION_PLANS: newPlan?.ID_PRODUCTION_PLANS,
        }));
      }
      // TODO: gọi API lưu materialsData
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving production plan:", error);
    }
  };
  const renderStepper = () => (
    <Box sx={{ marginBottom: "-10px" }}>
      <Stepper activeStep={currentStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
  const handleMaterialsChange = useCallback((materials) => {
    setMaterialsData(materials);
  }, []);

  const handleClose = () => {
    setCurrentStep(0);
    setRows([]); // reset dữ liệu vật liệu
    setMaterialsOptions([]); // reset options nếu cần
    onClose(); // hoặc setOpen(false)
  };

  return (
    <>
      {currentStep === 0 ? (
        <DynamicModal
          open={open}
          onClose={handleClose}
          fields={step1Fields}
          initialData={formData}
          title={steps[currentStep]}
          onChange={handleFormChange}
          renderActions={() => (
            <>
              <Button variant="contained" onClick={handleNext}>
                Tiếp tục
              </Button>
            </>
          )}
          beforeContent={renderStepper}
        />
      ) : (
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth={false} // bỏ giới hạn chiều rộng mặc định
          fullWidth
          PaperProps={{
            sx: {
              width: "90%", // chiếm 90% chiều ngang màn hình
              maxWidth: "1200px", // giới hạn tối đa nếu muốn
            },
          }}
        >
          {/* Tiêu đề */}
          <DialogTitle>{steps[currentStep]}</DialogTitle>

          {/* Nội dung */}
          <DialogContent>
            <Box sx={{ marginBottom: "-10px" }}>
              <Stepper activeStep={currentStep}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>

            <Step2Materials
              companyId={userInfo?.companyInfo?.ID_COMPANY}
              onChange={handleMaterialsChange}
              productionPlan={productionPlan}
              //
              materialsOptions={materialsOptions}
              setMaterialsOptions={setMaterialsOptions}
              //
              rows={rows}
              setRows={setRows}
            />
          </DialogContent>

          {/* Footer */}
          <DialogActions>
            <Button onClick={handleBack}>Quay lại</Button>
            <Button variant="contained" onClick={handleSubmit}>
              Hoàn tất
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default ProductionPlansFormModal;
