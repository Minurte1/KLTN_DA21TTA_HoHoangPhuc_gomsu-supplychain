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
} from "@mui/material";

const DynamicTable = ({ data, columns, rowsPerPageOptions = [5, 10, 20] }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

  // Lọc dữ liệu theo từ khóa tìm kiếm
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

  // Xử lý phân trang
  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  // Khi thay đổi page
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Khi thay đổi số dòng mỗi trang
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper>
      {/* Ô tìm kiếm */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Tìm kiếm..."
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ m: 2 }}
      />

      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="dynamic table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.key}>{column.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={column.key}>
                    {column.render ? (
                      column.render(row[column.key], row)
                    ) : column.type === "image" ? (
                      <img
                        src={row[column.key]}
                        alt={column.label}
                        style={{
                          width: 60,
                          height: 60,
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />
                    ) : (
                      row[column.key]
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Phân trang */}
      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default DynamicTable;
{
  /* <DynamicTable
  data={roles}
  columns={[
    { key: "NAME_ROLE", label: "Tên quyền" },
    { key: "CODE_NAME", label: "Mã quyền" },
    {
      key: "LIST_PERMISSION",
      label: "Danh sách quyền",
      render: (value) => value.join(", "),
    },
    {
      key: "actions",
      label: "Hành động",
      render: (_, row) => (
        <>
          <IconButton onClick={() => handleEdit(row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(row.ID_ROLE)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ]}
/>; */
}
