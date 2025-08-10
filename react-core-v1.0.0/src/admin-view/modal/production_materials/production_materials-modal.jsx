import React, { useEffect, useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { TextField, Autocomplete, Button } from "@mui/material";
import materialServices from "../../../services/materialServices";

const Step2Materials = ({
  companyId,
  onChange,
  productionPlan,

  //
  rows,
  setRows,
  //
  materialsOptions,
  setMaterialsOptions,
}) => {
  useEffect(() => {
    if (companyId) {
      fetchMaterials();
    }
  }, [companyId]);

  useEffect(() => {
    if (productionPlan?.production_material && materialsOptions.length) {
      const mappedRows = productionPlan.production_material.map(
        (item, index) => ({
          id: index + 1,
          ID_PRODUCT_MATERIALS: item.ID_PRODUCT_MATERIALS || "",
          ID_PRODUCTION_PLANS: item.ID_PRODUCTION_PLANS || "",
          ID_MATERIALS: item.ID_MATERIALS_ || "",
          QUANTITY_PER_UNIT_PRODUCT_MATERIALS:
            item.QUANTITY_PER_UNIT_PRODUCT_MATERIALS || "",
          UNIT_PRODUCT_MATERIALS: item.UNIT_PRODUCT_MATERIALS || "",
          ID_COMPANY: item.ID_COMPANY || companyId,
        })
      );
      setRows(mappedRows);
    } else if (materialsOptions.length) {
      const defaultRows = materialsOptions.map((m, index) => ({
        id: index + 1,
        ID_PRODUCT_MATERIALS: "",
        ID_PRODUCTION_PLANS: "",
        ID_MATERIALS: m.value,
        QUANTITY_PER_UNIT_PRODUCT_MATERIALS: "",
        UNIT_PRODUCT_MATERIALS: "",
        ID_COMPANY: companyId,
      }));
      setRows(defaultRows);
    }
  }, [productionPlan, materialsOptions, companyId]);

  const fetchMaterials = async () => {
    try {
      const data = await materialServices.getMaterials({
        ID_COMPANY: companyId,
      });

      console.log("data", data);
      console.log("productionPlan", productionPlan);

      const options = data.map((m) => ({
        label: m.NAME_,
        value: m.ID_MATERIALS_,
      }));

      const rows = data.map((m, index) => ({
        id: index + 1,
        ID_PRODUCT_MATERIALS: "",
        ID_PRODUCTION_PLANS: "",
        ID_MATERIALS: m.ID_MATERIALS_,
        QUANTITY_PER_UNIT_PRODUCT_MATERIALS: "",
        UNIT_PRODUCT_MATERIALS: "",
        ID_COMPANY: companyId,
      }));

      setMaterialsOptions(options);
      setRows(rows);
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };
  const handleDeleteRow = (id) => {
    setRows((prevRows) => {
      const updatedRows = prevRows.filter((row) => row.id !== id);
      onChange(updatedRows);
      return updatedRows;
    });
  };

  const columns = useMemo(
    () => [
      {
        field: "ID_MATERIALS",
        headerName: "Nguyên Liệu",
        flex: 1,
        editable: true,
        renderCell: (params) => {
          const material = materialsOptions.find(
            (opt) => opt.value === params.value
          );
          return material ? material.label : "";
        },
        renderEditCell: (params) => (
          <Autocomplete
            fullWidth
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
      {
        field: "actions",
        headerName: "Hành động",
        flex: 0.5,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          return (
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => handleDeleteRow(params.id)}
            >
              Xóa
            </Button>
          );
        },
      },
    ],
    [materialsOptions]
  );

  return (
    <div style={{ minHeight: 400, width: "100%", marginTop: "40px" }}>
      {" "}
      <DataGrid
        rows={rows}
        columns={columns}
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
        processRowUpdate={(newRow) => {
          setRows((prevRows) => {
            const isChanged = prevRows.some(
              (row) =>
                row.id === newRow.id &&
                JSON.stringify(row) !== JSON.stringify(newRow)
            );
            if (!isChanged) return prevRows; // Không thay đổi gì → không re-render
            const updated = prevRows.map((row) =>
              row.id === newRow.id ? newRow : row
            );
            onChange(updated);
            return updated;
          });
          return newRow;
        }}
      />{" "}
      <Button
        variant="outlined"
        sx={{ mt: 4 }}
        onClick={() => {
          setRows((prevRows) => {
            const newId = prevRows.length
              ? prevRows[prevRows.length - 1].id + 1
              : 1;
            const newRow = {
              id: newId,
              ID_PRODUCT_MATERIALS: "",
              ID_PRODUCTION_PLANS: "",
              ID_MATERIALS: "", // hoặc giá trị mặc định
              QUANTITY_PER_UNIT_PRODUCT_MATERIALS: "",
              UNIT_PRODUCT_MATERIALS: "",
              ID_COMPANY: companyId,
            };
            const updatedRows = [...prevRows, newRow];
            onChange(updatedRows); // gọi callback để báo lên parent
            return updatedRows;
          });
        }}
      >
        + Thêm hàng
      </Button>
    </div>
  );
};

export default Step2Materials;
