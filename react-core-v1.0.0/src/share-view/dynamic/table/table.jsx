import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  TablePagination,
  Typography,
  Box,
  InputAdornment,
  alpha,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import spService from "../../../share-service/spService";

const DynamicTable = ({
  data,
  columns,
  rowsPerPageOptions = [30, 20, 10, 5],
  subStatus = true,
  keyStatus,
  statusColumns,
  filters = [],
}) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [filterValues, setFilterValues] = useState({});

  // ✅ khi thay đổi filter
  const handleFilterChange = (key, value) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
    setPage(0);
  };

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      // ✅ search text
      const matchSearch = columns.some((column) => {
        const value = row[column.key];
        return (
          value &&
          typeof value === "string" &&
          value.toLowerCase().includes(search.toLowerCase())
        );
      });

      // ✅ áp dụng filter
      const matchFilters = Object.entries(filterValues).every(([key, val]) => {
        if (!val) return true; // bỏ qua nếu filter chưa chọn
        return String(row[key]) === String(val);
      });

      return matchSearch && matchFilters;
    });
  }, [data, search, columns, filterValues]);

  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        borderRadius: 2,
        backgroundColor: "#ffffff",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
      }}
    >
      {/* Search and Title */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          gap: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 500, color: "#1a1a1a" }}>
          Danh sách
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          {/* ✅ Filters động */}
          {filters.map((filter) => (
            <TextField
              key={filter.key}
              select
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
              label={filter.label}
              value={filterValues[filter.key] || ""}
              onChange={(e) => handleFilterChange(filter.key, e.target.value)}
              SelectProps={{ native: true }}
            >
              <option value="">Tất cả</option>
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </TextField>
          ))}

          {/* ✅ Search */}
          <TextField
            variant="outlined"
            placeholder="Tìm kiếm..."
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#999", fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>

      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: alpha("#f5f5f5", 0.4),
                "& th": {
                  borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
                },
              }}
            >
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    color: "#333",
                    py: 1.5,
                    textTransform: "uppercase",
                    letterSpacing: "0.02em",
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                hover
                sx={{
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: alpha("#e3f2fd", 0.5),
                    transform: "translateY(-1px)",
                  },
                  "& td": {
                    borderBottom: "1px solid rgba(0, 0, 0, 0.03)",
                  },
                }}
              >
                {columns.map((column) => {
                  const isStatusColumn = statusColumns?.includes(column.key); // ✅ chỉ những key trong list mới styled

                  return (
                    <TableCell
                      key={column.key}
                      sx={{ py: 1.2, fontSize: "0.875rem", color: "#444" }}
                    >
                      {column.render ? (
                        column.render(row[column.key], row)
                      ) : column.type === "image" ? (
                        <Box
                          component="img"
                          src={row[column.key]}
                          alt={column.label}
                          sx={{
                            width: 40,
                            height: 40,
                            objectFit: "cover",
                            borderRadius: 1,
                            display: "block",
                            margin: "0 auto",
                            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                      ) : isStatusColumn ? ( // ✅ chỉ áp dụng badge cho status
                        <Typography
                          component="span"
                          sx={{
                            display: "inline-block",
                            px: 1.5,
                            py: 0.5,
                            fontSize: "0.75rem",
                            borderRadius: "12px",
                            fontWeight: 500,
                            color: spService.mapStatusToVietnamese(
                              row[column.key],
                              keyStatus
                            ).color,
                            backgroundColor: spService.mapStatusToVietnamese(
                              row[column.key],
                              keyStatus
                            ).bgColor,
                            border: `1px solid ${
                              spService.mapStatusToVietnamese(
                                row[column.key],
                                keyStatus
                              ).borderColor
                            }`,
                          }}
                        >
                          {
                            spService.mapStatusToVietnamese(
                              row[column.key],
                              keyStatus
                            ).label
                          }
                        </Typography>
                      ) : (
                        <Typography component="span">
                          {row[column.key]}
                        </Typography> // ✅ cột khác hiển thị bình thường
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          mt: 1,
          "& .MuiTablePagination-toolbar": {
            fontSize: "0.875rem",
            color: "#555",
          },
          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
            {
              fontSize: "0.85rem",
            },
          "& .MuiTablePagination-actions button": {
            borderRadius: 1,
            "&:hover": {
              backgroundColor: alpha("#1976d2", 0.1),
            },
          },
        }}
      />
    </Paper>
  );
};

export default DynamicTable;
