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
import Typography from "@mui/material/Typography";

const DynamicModal = ({
  open,
  onClose,
  onSubmit,
  fields,
  initialData = {},
  title = "Form",
  renderActions,
  onChange, // New prop to notify parent of input changes
}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  // Initialize formData from initialData when modal opens
  useEffect(() => {
    if (open) {
      setFormData(initialData);
      setErrors({});
    }
  }, [open, initialData]);

  // Handle input change
  const handleChange = (key) => (event, newValue) => {
    let value = newValue !== undefined ? newValue : event.target.value;
    const updatedFormData = { ...formData, [key]: value };
    setFormData(updatedFormData);
    if (onChange) {
      onChange(updatedFormData); // Notify parent of changes
    }
    if (errors[key]) {
      setErrors({ ...errors, [key]: "" });
    }
  };

  // Handle form submission
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

    onSubmit(formData); // Pass updated formData to parent
    onClose();
  };

  // Render input based on inputType
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

  // Default actions if renderActions is not provided
  const defaultActions = (
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
        {renderActions
          ? renderActions({ handleSubmit, onClose })
          : defaultActions}
      </DialogActions>
    </Dialog>
  );
};

export default DynamicModal;
