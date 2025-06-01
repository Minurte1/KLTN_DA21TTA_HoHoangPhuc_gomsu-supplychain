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
  onChange, // New prop to notify parent of input changes
  renderExtraFields,
}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  // Initialize formData from initialData when modal opens
  useEffect(() => {
    if (open) {
      setFormData({ ...initialData }); // clone
      setErrors({});
    }
  }, [open, initialData]);

  // Handle input change
  const handleChange =
    (key, isAutocomplete = false) =>
    (eventOrValue, newValue) => {
      let value;

      if (isAutocomplete) {
        value = newValue; // newValue là option.value hoặc null
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
            onChange={(event, newValue) =>
              handleChange(field.key, true)(
                event,
                newValue ? newValue[field.key] : ""
              )
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
      case "datetime":
        return (
          <DateTimePicker
            label={field.label}
            value={formData[field.key] ? dayjs(formData[field.key]) : null}
            onChange={(newValue) =>
              handleChange(field.key)(
                null,
                newValue ? newValue.toISOString() : ""
              )
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
            onChange={handleChange(field.key)}
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
