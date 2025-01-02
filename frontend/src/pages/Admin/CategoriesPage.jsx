import React, { useState, useEffect } from "react";
import {
  Add,
  Edit,
  Delete,
  KeyboardArrowDown,
  KeyboardArrowRight,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Typography,
} from "@mui/material";
import Navigation from "../Auth/Navigation";
import categoryApi from "../../service/api/categoryApi";
import showToast from "../../components/ShowToast";
const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSubCategory, setEditingSubCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSubCategoryName, setNewSubCategoryName] = useState("");
  const [editName, setEditName] = useState("");

  useEffect(() => {
    const fetchMainCategoryWithSubs = async () => {
      const response = await categoryApi.getMainCategoryWithSubs();
      console.log(response.data);
      setCategories(response.data);
    };
    fetchMainCategoryWithSubs();
  }, []);

  const toggleExpand = (categoryId) => {
    setCategories(
      categories.map((cat) =>
        cat._id === categoryId ? { ...cat, isExpanded: !cat.isExpanded } : cat
      )
    );
  };

  const startEditing = (id, initialName, isMainCategory = true) => {
    if (isMainCategory) {
      setEditingCategory(id);
    } else {
      setEditingSubCategory(id);
    }
    setEditName(initialName);
  };

  const cancelEditing = () => {
    setEditingCategory(null);
    setEditingSubCategory(null);
    setEditName("");
  };

  const addMainCategory = async () => {
    if (!newCategoryName) return;
    const res = await categoryApi.createMainCategory(newCategoryName);
    if (res.error) {
      showToast(res.error, "error");
      return;
    }
    const newCategory = {
      _id: res._id,
      name: res.name,
      subCategories: [],
      isExpanded: false,
    };
    showToast("Thêm danh mục thành công", "success");
    setCategories([...categories, newCategory]);
    setNewCategoryName("");
  };

  const addSubCategory = async (categoryId) => {
    if (!newSubCategoryName) return;
    const res = await categoryApi.createSubCategory(
      newSubCategoryName,
      categoryId
    );
    if (res.error) {
      showToast(res.error, "error");
      return;
    }
    setCategories(
      categories.map((cat) => {
        if (cat._id === categoryId) {
          return {
            ...cat,
            subCategories: [
              ...cat.subCategories,
              {
                _id: res._id,
                name: res.name,
              },
            ],
          };
        }
        return cat;
      })
    );
    showToast("Thêm danh mục thành công", "success");
    setNewSubCategoryName("");
  };

  const deleteCategory = async (categoryId) => {
    await categoryApi.deleteMainCategory(categoryId);
    showToast("Xóa danh mục thành công", "success");

    setCategories(categories.filter((cat) => cat._id !== categoryId));
  };

  const deleteSubCategory = async (categoryId, subCategoryId) => {
    await categoryApi.deleteSubCategory(subCategoryId);
    showToast("Xóa danh mục thành công", "success");
    setCategories(
      categories.map((cat) => {
        if (cat._id === categoryId) {
          return {
            ...cat,
            subCategories: cat.subCategories.filter(
              (sub) => sub._id !== subCategoryId
            ),
          };
        }
        return cat;
      })
    );
  };

  const updateCategory = async (categoryId) => {
    const res = await categoryApi.updateMainCategory(categoryId, editName);
    if (res.error) {
      showToast(res.error, "error");
      return;
    }
    showToast("Chỉnh sửa danh mục thành công", "success");

    setCategories(
      categories.map((cat) =>
        cat._id === categoryId ? { ...cat, name: editName } : cat
      )
    );
    setEditingCategory(null);
    setEditName("");
  };

  const updateSubCategory = async (categoryId, subCategoryId) => {
    const res = await categoryApi.updateSubCategory(subCategoryId, editName);
    if (res.error) {
      showToast(res.error, "error");
      return;
    }
    showToast("Chỉnh sửa danh mục thành công", "success");

    setCategories(
      categories.map((cat) => {
        if (cat._id === categoryId) {
          return {
            ...cat,
            subCategories: cat.subCategories.map((sub) =>
              sub._id === subCategoryId ? { ...sub, name: editName } : sub
            ),
          };
        }
        return cat;
      })
    );
    setEditingSubCategory(null);
    setEditName("");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Navigation />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography
          variant="h4"
          sx={{ mb: 4, color: "#1a237e", fontWeight: 600 }}
        >
          Category Management
        </Typography>
        <Box
          sx={{
            p: 3,
            backgroundColor: "background.paper",
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
            <TextField
              size="small"
              placeholder="Tên danh mục mới"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              sx={{ maxWidth: 300 }}
            />
            <Button
              variant="contained"
              onClick={addMainCategory}
              startIcon={<Add />}
              sx={{ textTransform: "none" }}
            >
              Thêm danh mục
            </Button>
          </Box>

          <Table
            sx={{
              border: 1,
              borderColor: "divider",
              borderRadius: 1,
              "& th": { bgcolor: "grey.50" },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>Tên danh mục</TableCell>
                <TableCell align="center" sx={{ width: 200 }}>
                  Thao tác
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category) => (
                <React.Fragment key={category._id}>
                  <TableRow sx={{ "&:hover": { bgcolor: "grey.50" } }}>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <IconButton
                          size="small"
                          onClick={() => toggleExpand(category._id)}
                        >
                          {category.isExpanded ? (
                            <KeyboardArrowDown />
                          ) : (
                            <KeyboardArrowRight />
                          )}
                        </IconButton>
                        {editingCategory === category._id ? (
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              alignItems: "center",
                            }}
                          >
                            <TextField
                              size="small"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              autoFocus
                            />
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() => updateCategory(category._id)}
                              sx={{ textTransform: "none" }}
                            >
                              Update
                            </Button>
                            <Button
                              size="small"
                              onClick={cancelEditing}
                              sx={{ textTransform: "none" }}
                            >
                              Cancel
                            </Button>
                          </Box>
                        ) : (
                          <span>{category.name}</span>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          justifyContent: "center",
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() =>
                            startEditing(category._id, category.name)
                          }
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => deleteCategory(category._id)}
                          sx={{ color: "error.main" }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>

                  {category.isExpanded && (
                    <>
                      {category.subCategories.map((sub) => (
                        <TableRow
                          key={sub._id}
                          sx={{
                            bgcolor: "grey.50",
                            "&:hover": { bgcolor: "grey.100" },
                          }}
                        >
                          <TableCell sx={{ pl: 7 }}>
                            {editingSubCategory === sub._id ? (
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: 1,
                                  alignItems: "center",
                                }}
                              >
                                <TextField
                                  size="small"
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                  autoFocus
                                />
                                <Button
                                  size="small"
                                  variant="contained"
                                  onClick={() =>
                                    updateSubCategory(category._id, sub._id)
                                  }
                                  sx={{ textTransform: "none" }}
                                >
                                  Update
                                </Button>
                                <Button
                                  size="small"
                                  onClick={cancelEditing}
                                  sx={{ textTransform: "none" }}
                                >
                                  Cancel
                                </Button>
                              </Box>
                            ) : (
                              <span>{sub.name}</span>
                            )}
                          </TableCell>
                          <TableCell align="center">
                            <Box
                              sx={{
                                display: "flex",
                                gap: 1,
                                justifyContent: "center",
                              }}
                            >
                              <IconButton
                                size="small"
                                onClick={() =>
                                  startEditing(sub._id, sub.name, false)
                                }
                              >
                                <Edit />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() =>
                                  deleteSubCategory(category._id, sub._id)
                                }
                                sx={{ color: "error.main" }}
                              >
                                <Delete />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow sx={{ bgcolor: "grey.50" }}>
                        <TableCell sx={{ pl: 7 }} colSpan={2}>
                          <Box sx={{ display: "flex", gap: 2 }}>
                            <TextField
                              size="small"
                              placeholder="Tên danh mục con mới"
                              value={newSubCategoryName}
                              onChange={(e) =>
                                setNewSubCategoryName(e.target.value)
                              }
                            />
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => addSubCategory(category._id)}
                              startIcon={<Add />}
                              sx={{ textTransform: "none" }}
                            >
                              Thêm
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    </>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
};

export default CategoryManagement;
