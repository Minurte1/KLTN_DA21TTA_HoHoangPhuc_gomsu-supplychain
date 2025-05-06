import React, { useEffect, useState } from "react";
import { Button, IconButton, Typography, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import DynamicTable from "../../share-view/dynamic/table/table";
import categoryServices from "../../services/category-service";
import CategoryFormModal from "../modal/category-modal";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchCategories = async () => {
    const data = await categoryServices.getCategories();
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    await categoryServices.deleteCategory(id);
    fetchCategories();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom mt={4}>
        Quản lý Danh Mục
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{ mb: 2 }}
        onClick={() => {
          setSelectedCategory(null);
          setOpenModal(true);
        }}
      >
        Thêm Danh Mục
      </Button>

      <DynamicTable
        data={categories}
        columns={[
          { key: "NAME_CATEGORIES_", label: "Tên danh mục" },
          {
            key: "actions",
            label: "Hành động",
            render: (_, row) => (
              <>
                <IconButton onClick={() => handleEdit(row)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(row.ID_CATEGORIES_)}>
                  <DeleteIcon />
                </IconButton>
              </>
            ),
          },
        ]}
      />

      <CategoryFormModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        category={selectedCategory}
        onSuccess={fetchCategories}
      />
    </Box>
  );
};

export default Category;
