import * as React from "react";
import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

const DynamicModal = ({
  open,
  onClose,
  onSubmit,
  fields,
  initialData = {},
  title = "Form",
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  // Khởi tạo formData từ initialData khi modal mở
  useEffect(() => {
    if (open) {
      setFormData(initialData);
      setErrors({});
    }
  }, [open, initialData]);

  // Xử lý thay đổi input
  const handleChange = (key) => (event, newValue) => {
    let value;
    if (newValue !== undefined) {
      // Autocomplete cung cấp newValue
      value = newValue;
    } else {
      // TextField và Select sử dụng event.target.value
      value = event.target.value;
    }
    setFormData({ ...formData, [key]: value });
    if (errors[key]) {
      setErrors({ ...errors, [key]: "" });
    }
  };

  // Xử lý submit form
  const handleSubmit = () => {
    const newErrors = {};
    fields.forEach((field) => {
      if (
        field.required &&
        (formData[field.key] === undefined || formData[field.key] === "")
      ) {
        newErrors[field.key] = `${field.label} là bắt buộc`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
    onClose();
  };

  // Render input dựa trên inputType
  const renderInput = (field) => {
    switch (field.inputType) {
      case "select":
        return (
          <FormControl fullWidth margin="normal" error={!!errors[field.key]}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={formData[field.key] || ""}
              label={field.label}
              onChange={handleChange(field.key)}
              disabled={field.disabled}
            >
              {field.options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {errors[field.key] && (
              <Typography color="error" variant="caption">
                {errors[field.key]}
              </Typography>
            )}
          </FormControl>
        );
      case "autocomplete":
        return (
          <Autocomplete
            options={field.options}
            getOptionLabel={(option) => option.label || ""}
            value={
              field.options.find((opt) => opt.value === formData[field.key]) ||
              null
            }
            onChange={(event, newValue) =>
              handleChange(field.key)(event, newValue ? newValue.value : "")
            }
            disabled={field.disabled}
            renderInput={(params) => (
              <TextField
                {...params}
                label={field.label}
                margin="normal"
                fullWidth
                error={!!errors[field.key]}
                helperText={errors[field.key]}
              />
            )}
          />
        );
      default:
        return (
          <TextField
            fullWidth
            margin="normal"
            label={field.label}
            value={formData[field.key] || ""}
            onChange={handleChange(field.key)}
            error={!!errors[field.key]}
            helperText={errors[field.key]}
            disabled={field.disabled}
            type={field.type || "text"}
          />
        );
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {fields.map((field) => (
            <div key={field.key}>{renderInput(field)}</div>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Hủy
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DynamicModal;

// import React, { useState } from 'react';
// import DynamicModal from './DynamicModal';

// const ExampleUsage = () => {
//   const [open, setOpen] = useState(false);

//   const fields = [
//     { key: 'name', label: 'Tên', required: true },
//     { key: 'age', label: 'Tuổi', inputType: 'text', type: 'number' },
//     {
//       key: 'gender',
//       label: 'Giới tính',
//       inputType: 'select',
//       options: [
//         { value: 'male', label: 'Nam' },
//         { value: 'female', label: 'Nữ' }
//       ],
//     },
//     {
//       key: 'city',
//       label: 'Thành phố',
//       inputType: 'autocomplete',
//       options: [
//         { value: 'hn', label: 'Hà Nội' },
//         { value: 'hcm', label: 'TP HCM' },
//         { value: 'dn', label: 'Đà Nẵng' }
//       ],
//     },
//   ];

//   const handleSubmit = (data) => {
//     console.log('Dữ liệu submit:', data);
//   };

//   return (
//     <>
//       <button onClick={() => setOpen(true)}>Mở Modal</button>
//       <DynamicModal
//         open={open}
//         onClose={() => setOpen(false)}
//         onSubmit={handleSubmit}
//         fields={fields}
//         title="Thông tin người dùng"
//       />
//     </>
//   );
// };

// export default ExampleUsage;
