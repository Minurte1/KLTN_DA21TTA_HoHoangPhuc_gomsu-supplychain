import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";

const DynamicFileUpload = () => {
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);

  // Xử lý khi kéo file vào khu vực thả
  const handleDragOver = (event) => {
    event.preventDefault();
    setDragOver(true);
  };

  // Xử lý khi rời khu vực thả
  const handleDragLeave = () => {
    setDragOver(false);
  };

  // Xử lý khi thả file
  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    const droppedFiles = Array.from(event.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );
    const newFiles = droppedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  // Xử lý khi chọn file qua input
  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files).filter((file) =>
      file.type.startsWith("image/")
    );
    const newFiles = selectedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  // Xóa file khỏi danh sách
  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      URL.revokeObjectURL(updatedFiles[index].preview); // Giải phóng URL preview
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          border: dragOver ? "2px dashed #1976d2" : "2px dashed #ccc",
          bgcolor: dragOver ? "#e3f2fd" : "background.paper",
          textAlign: "center",
          mb: 4,
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Typography variant="h6" gutterBottom>
          Kéo và thả hình ảnh vào đây
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          hoặc
        </Typography>
        <Button variant="contained" component="label">
          Chọn hình ảnh
          <input
            type="file"
            hidden
            multiple
            accept="image/*"
            onChange={handleFileSelect}
          />
        </Button>
      </Paper>

      {files.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Danh sách hình ảnh đã upload
          </Typography>
          <Grid container spacing={2}>
            {files.map((file, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper elevation={2} sx={{ p: 2, position: "relative" }}>
                  <img
                    src={file.preview}
                    alt={file.file.name}
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "4px",
                    }}
                  />
                  <Typography
                    variant="caption"
                    noWrap
                    sx={{ mt: 1, display: "block" }}
                  >
                    {file.file.name}
                  </Typography>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<DeleteIcon />}
                    sx={{ mt: 1 }}
                    onClick={() => handleRemoveFile(index)}
                  >
                    Xóa
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default DynamicFileUpload;
