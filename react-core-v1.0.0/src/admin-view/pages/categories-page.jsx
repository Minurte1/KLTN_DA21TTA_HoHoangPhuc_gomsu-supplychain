import React, { useEffect, useState } from "react";
import { Button, IconButton, Typography, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import DynamicTable from "../../share-view/dynamic/table/table";

import categoryServices from "../../services/categoryServices";
import CategoriesFormModal from "../modal/category/category-modal";
import ReduxExportUseAuthState from "../../redux/redux-export/useAuthServices";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { userInfo } = ReduxExportUseAuthState();

  const fetchCategories = async () => {
    const companyId = userInfo?.companyInfo?.ID_COMPANY || null;
    const data = await categoryServices.getCategories({
      ID_COMPANY: companyId,
    });
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

  console.log("categories", categories);
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
          { key: "NAME_COMPANY", label: "Tên công ty" },
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

      <CategoriesFormModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        category={selectedCategory}
        onSuccess={fetchCategories}
      />
    </Box>
  );
};

export default Category;
