import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const DynamicTable = ({ data, columns }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="dynamic table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.key} align="left">
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={column.key} align="left">
                  {column.type === "image" ? (
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
  );
};

export default DynamicTable;

// const columns = [
//   { key: "name", label: "Tên" },
//   { key: "image", label: "Ảnh", type: "image" }, // type image để render ảnh
// ];

// const data = [
//   { name: "Sản phẩm A", image: "https://via.placeholder.com/100" },
//   { name: "Sản phẩm B", image: "https://via.placeholder.com/100" },
// ];
