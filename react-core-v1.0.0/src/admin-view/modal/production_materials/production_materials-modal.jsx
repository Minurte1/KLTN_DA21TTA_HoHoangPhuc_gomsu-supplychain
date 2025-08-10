import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { TextField, Autocomplete } from "@mui/material";
import materialServices from "../../../services/materialServices";

const Step2Materials = ({ companyId, onChange }) => {
  const [rows, setRows] = useState([]);
  const [materialsOptions, setMaterialsOptions] = useState([]);

  useEffect(() => {
    if (companyId) {
      fetchMaterials();
    }
  }, [companyId]);

  const fetchMaterials = async () => {
    try {
      const data = await materialServices.getMaterials({
        ID_COMPANY: companyId,
      });

      // options cho autocomplete
      setMaterialsOptions(
        data.map((m) => ({
          label: m.TEN_MATERIALS, // tên hiển thị
          value: m.ID_MATERIALS, // giá trị lưu
        }))
      );

      // map dữ liệu ban đầu
      setRows(
        data.map((m, index) => ({
          id: index + 1,
          ID_PRODUCT_MATERIALS: "",
          ID_PRODUCTION_PLANS: "",
          ID_MATERIALS: m.ID_MATERIALS,
          QUANTITY_PER_UNIT_PRODUCT_MATERIALS: "",
          UNIT_PRODUCT_MATERIALS: "",
          ID_COMPANY: companyId,
        }))
      );
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  const columns = [
    {
      field: "ID_PRODUCT_MATERIALS",
      headerName: "Mã Nguyên Liệu",
      flex: 1,
      editable: true,
    },
    {
      field: "ID_PRODUCTION_PLANS",
      headerName: "Mã Kế Hoạch SX",
      flex: 1,
      editable: true,
    },
    {
      field: "ID_MATERIALS",
      headerName: "Nguyên Liệu",
      flex: 1,
      editable: true,
      renderEditCell: (params) => (
        <Autocomplete
          options={materialsOptions}
          value={
            materialsOptions.find((opt) => opt.value === params.value) || null
          }
          onChange={(_, newValue) => {
            params.api.setEditCellValue({
              id: params.id,
              field: "ID_MATERIALS",
              value: newValue ? newValue.value : "",
            });
          }}
          renderInput={(paramsInput) => (
            <TextField {...paramsInput} variant="standard" />
          )}
        />
      ),
    },
    {
      field: "QUANTITY_PER_UNIT_PRODUCT_MATERIALS",
      headerName: "Số Lượng/Đơn Vị",
      flex: 1,
      editable: true,
    },
    {
      field: "UNIT_PRODUCT_MATERIALS",
      headerName: "Đơn Vị",
      flex: 1,
      editable: true,
    },
    { field: "ID_COMPANY", headerName: "Công Ty", flex: 1 },
  ];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
        processRowUpdate={(newRow) => {
          const updatedRows = rows.map((row) =>
            row.id === newRow.id ? newRow : row
          );
          setRows(updatedRows);
          onChange(updatedRows);
          return newRow;
        }}
      />
    </div>
  );
};

export default Step2Materials;
