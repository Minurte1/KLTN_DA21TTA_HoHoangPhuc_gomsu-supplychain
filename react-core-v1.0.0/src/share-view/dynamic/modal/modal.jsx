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
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";

const DynamicModal = ({
  open,
  onClose,
  onSubmit,
  fields,
  initialData = {},
  title = "Form",
  renderActions,
  onChange,
  renderExtraFields,
}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setFormData({ ...initialData });
      setErrors({});
    }
  }, [open, initialData]);

  const handleChange =
    (
      key,
      field, // Add field parameter to access field.optionsLabel
      isAutocomplete = false,
      isAutocompleteMultiple = false,
      isDirectValue = false
    ) =>
    (eventOrValue, newValue) => {
      let value;

      if (isDirectValue) {
        value = newValue;
      } else if (isAutocompleteMultiple) {
        // For autocomplete-multiple: newValue is an array of objects
        value = newValue.map(
          (item) => item[key] || item[field.optionsLabel] || item
        );
      } else if (isAutocomplete) {
        // For autocomplete: newValue is a single object or null
        value = newValue
          ? newValue[key] || newValue[field.optionsLabel] || newValue
          : "";
      } else if (eventOrValue?.target) {
        value = eventOrValue.target.value;
      } else {
        value = eventOrValue;
      }

      const updatedFormData = { ...formData, [key]: value };

      setFormData(updatedFormData);

      if (onChange) {
        onChange(updatedFormData);
      }

      if (errors[key]) {
        setErrors({ ...errors, [key]: "" });
      }
    };

  const handleSubmit = () => {
    const newErrors = {};
    fields.forEach((field) => {
      if (
        field.required &&
        (formData[field.key] === undefined ||
          formData[field.key] === "" ||
          (Array.isArray(formData[field.key]) &&
            formData[field.key].length === 0))
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

  const renderInput = (field) => {
    switch (field.inputType) {
      case "select":
        return (
          <FormControl fullWidth margin="normal" error={!!errors[field.key]}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={formData[field.key] || ""}
              label={field.label}
              onChange={handleChange(field.key, field)}
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
            getOptionLabel={(option) =>
              typeof option === "string"
                ? option
                : option[field.optionsLabel] || ""
            }
            value={
              field.options.find(
                (opt) => String(opt[field.key]) === String(formData[field.key])
              ) || null
            }
            onChange={handleChange(field.key, field, true)}
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
      case "autocomplete-multiple":
        return (
          <Autocomplete
            multiple
            options={field.options}
            getOptionLabel={(option) =>
              typeof option === "string"
                ? option
                : option[field.optionsLabel] || ""
            }
            value={
              Array.isArray(formData[field.key])
                ? field.options.filter((opt) =>
                    formData[field.key].includes(opt[field.optionsLabel])
                  )
                : []
            }
            onChange={handleChange(field.key, field, false, true)}
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
      case "datetime":
        return (
          <DateTimePicker
            label={field.label}
            value={formData[field.key] ? dayjs(formData[field.key]) : null}
            onChange={(newValue) =>
              handleChange(
                field.key,
                field,
                false, // isAutocomplete = false
                false, // isAutocompleteMultiple = false, sửa từ true thành false
                true // isDirectValue = true, vì bạn truyền giá trị trực tiếp (string ISO)
              )(null, newValue ? newValue.toISOString() : "")
            }
            disabled={field.disabled}
            slotProps={{
              textField: {
                fullWidth: true,
                margin: "normal",
                error: !!errors[field.key],
                helperText: errors[field.key],
              },
            }}
          />
        );
      default:
        const isMultiline = !!field.rows || !!field.row;
        return (
          <TextField
            fullWidth
            margin="normal"
            label={field.label}
            value={
              formData[field.key] !== undefined
                ? String(formData[field.key])
                : ""
            }
            onChange={handleChange(field.key, field)}
            error={!!errors[field.key]}
            helperText={errors[field.key]}
            disabled={field.disabled}
            type={field.type || "text"}
            multiline={isMultiline}
            rows={field.rows || field.row}
          />
        );
    }
  };

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
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {fields.map((field) => (
              <div key={field.key}>{renderInput(field)}</div>
            ))}
            {renderExtraFields && renderExtraFields()}
          </Box>
        </DialogContent>
        <DialogActions>
          {renderActions
            ? renderActions({ handleSubmit, onClose })
            : defaultActions}
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default DynamicModal;
