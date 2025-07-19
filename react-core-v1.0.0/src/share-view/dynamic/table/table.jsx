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

const DynamicTable = ({ data, columns, rowsPerPageOptions = [5, 10, 20] }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

  const filteredData = useMemo(() => {
    return data.filter((row) =>
      columns.some((column) => {
        const value = row[column.key];
        return (
          value &&
          typeof value === "string" &&
          value.toLowerCase().includes(search.toLowerCase())
        );
      })
    );
  }, [data, search, columns]);

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
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 500,
            color: "#1a1a1a",
            fontSize: "1.125rem",
          }}
        >
          Danh sách
        </Typography>
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
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: alpha("#f5f5f5", 0.5),
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
              "&.Mui-focused": {
                backgroundColor: "#ffffff",
                boxShadow: `0 0 0 2px ${alpha("#1976d2", 0.2)}`,
              },
            },
            "& .MuiInputBase-input": {
              fontSize: "0.875rem",
              py: 1,
            },
          }}
        />
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
                {columns.map((column) => (
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
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: 250,
                          fontSize: "0.875rem",
                        }}
                      >
                        {column.key === "STATUS"
                          ? spService.mapStatusToVietnamese(row[column.key])
                          : row[column.key]}
                      </Typography>
                    )}
                  </TableCell>
                ))}
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
