import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Stack,
} from "@mui/material";
import axios from "axios";

const AddressSelector = ({
  selectedProvince,
  selectedDistrict,
  selectedWards,

  setSelectedProvince,
  setSelectedDistrict,
  setSelectedWards,
}) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  //   const [selectedProvince, setSelectedProvince] = useState(null);
  //   const [selectedDistrict, setSelectedDistrict] = useState(null);
  //   const [selectedWards, setSelectedWards] = useState(null);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  // Fetch provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      setLoadingProvinces(true);
      try {
        const response = await axios.get(
          "https://vn-public-apis.fpo.vn/provinces/getAll?limit=-1"
        );

        setProvinces(response.data.data.data || []);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      } finally {
        setLoadingProvinces(false);
      }
    };
    fetchProvinces();
  }, []);

  // Fetch districts when a province is selected
  useEffect(() => {
    if (selectedProvince) {
      const fetchDistricts = async () => {
        setLoadingDistricts(true);
        try {
          const response = await axios.get(
            `https://vn-public-apis.fpo.vn/districts/getByProvince?provinceCode=${selectedProvince.code}&limit=-1`
          );
          setDistricts(response.data.data.data || []);
        } catch (error) {
          console.error("Error fetching districts:", error);
        } finally {
          setLoadingDistricts(false);
        }
      };
      fetchDistricts();
    } else {
      setDistricts([]);
    }
  }, [selectedProvince]);

  // Fetch wards when a district is selected
  useEffect(() => {
    if (selectedDistrict) {
      const fetchWards = async () => {
        setLoadingWards(true);
        try {
          const response = await axios.get(
            `https://vn-public-apis.fpo.vn/wards/getByDistrict?districtCode=${selectedDistrict.code}&limit=-1`
          );
          setWards(response.data.data.data || []);
        } catch (error) {
          console.error("Error fetching wards:", error);
        } finally {
          setLoadingWards(false);
        }
      };
      fetchWards();
    } else {
      setWards([]);
    }
  }, [selectedDistrict]);

  return (
    <Stack spacing={3}>
      {/* Province Selector */}
      <Autocomplete
        options={provinces}
        getOptionLabel={(option) => option.name_with_type || option.name || ""}
        value={selectedProvince}
        onChange={(event, newValue) => {
          setSelectedProvince(newValue);
          setSelectedDistrict(null);
          setWards([]);
        }}
        loading={loadingProvinces}
        renderInput={(params) => (
          <TextField
            {...params}
            label={
              selectedProvince
                ? selectedProvince.name_with_type || selectedProvince
                : "Chọn tỉnh"
            }
            sx={{
              backgroundColor: "#1f1f1f", // Màu nền của input
              "& .MuiInputLabel-root": { color: "#f0ffff" }, // Màu chữ của label
              "& .MuiInputBase-input": { color: "#f0ffff" }, // Màu chữ của input
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#3d444d" }, // Màu viền
              },
              "& .MuiInputBase-root": {
                borderRadius: "4px", // Làm tròn góc nếu muốn
              },
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loadingProvinces ? <CircularProgress size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />

      {/* District Selector */}
      <Autocomplete
        options={districts}
        getOptionLabel={(option) => option.name_with_type || option.name || ""}
        value={selectedDistrict}
        onChange={(event, newValue) => setSelectedDistrict(newValue)}
        loading={loadingDistricts}
        renderInput={(params) => (
          <TextField
            {...params}
            label={
              selectedDistrict
                ? selectedDistrict.name_with_type || selectedDistrict
                : "Chọn huyện"
            }
            sx={{
              backgroundColor: "#1f1f1f", // Màu nền của input
              "& .MuiInputLabel-root": { color: "#f0ffff" },
              "& .MuiInputBase-input": { color: "#f0ffff" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#3d444d" },
              },
              "& .MuiInputBase-root": {
                borderRadius: "4px", // Làm tròn góc nếu muốn
              },
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loadingDistricts ? <CircularProgress size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        disabled={!selectedProvince}
      />

      {/* Ward Selector */}
      <Autocomplete
        options={wards}
        getOptionLabel={(option) => option.name_with_type || option.name || ""}
        loading={loadingWards}
        value={selectedWards}
        onChange={(event, newValue) => setSelectedWards(newValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            label={
              selectedWards
                ? selectedWards.name_with_type || selectedWards
                : "Chọn phường xã"
            }
            sx={{
              backgroundColor: "#1f1f1f", // Màu nền của input
              "& .MuiInputLabel-root": { color: "#f0ffff" },
              "& .MuiInputBase-input": { color: "#f0ffff" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#3d444d" },
              },
              "& .MuiInputBase-root": {
                borderRadius: "4px", // Làm tròn góc nếu muốn
              },
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loadingWards ? <CircularProgress size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        disabled={!selectedDistrict}
      />
    </Stack>
  );
};

export default AddressSelector;
