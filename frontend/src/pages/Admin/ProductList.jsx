import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Alert,
  CircularProgress,
  Avatar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  Chip,
  ListSubheader,
  ImageList,
  ImageListItem,
  IconButton as ImageIconButton
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon, Upload as UploadIcon, Close as CloseIcon } from '@mui/icons-material';
import Navigation from '../Auth/Navigation';
import productsApi from '../../service/api/productsApi';
import categoryApi from '../../service/api/categoryApi';

const DIALOG_STYLES = {
  dialogContent: {
    height: '80vh',
    overflowY: 'auto',
    p: 0, // Remove default padding
    '&::-webkit-scrollbar': {
      width: '8px'
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1'
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#888',
      borderRadius: '4px'
    }
  },
  formWrapper: {
    display: 'flex',
    gap: 2,
    p: 3,
  },
  leftColumn: {
    flex: '0 0 65%',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  rightColumn: {
    flex: '0 0 35%',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  section: {
    bgcolor: 'white',
    borderRadius: 1,
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
    overflow: 'hidden'
  },
  sectionHeader: {
    bgcolor: '#f5f5f5',
    p: 2,
    borderBottom: '1px solid #e0e0e0'
  },
  sectionContent: {
    p: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: 2
  },
  imagePreview: {
    width: '100%',
    height: 200,
    objectFit: 'cover',
    borderRadius: 1,
    border: '1px solid #e0e0e0'
  }
};

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [productData, setProductData] = useState({
    name: '',
    brand: '',
    price: '',
    originalPrice: '',
    discount: '',
    description: '',
    countInStock: '',
    category: [],
    features: '',
    image: '',
    listImage: ''
  });
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [categories, setCategories] = useState([]);
  const [imageLoading, setImageLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      const data = await productsApi.allProducts();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch products');
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryApi.getMainCategoryWithSubs();
      setCategories(response.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleDelete = async (productId) => {
    try {
      await productsApi.deleteProduct(productId);
      setProducts(products.filter(product => product._id !== productId));
      setDeleteDialogOpen(false);
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  // Modify calculatePrice function to handle decimal discount
  const calculatePrice = (originalPrice, discount) => {
    if (!originalPrice) return 0;
    const discountAmount = discount ? (originalPrice * discount) : 0;
    return Math.round(originalPrice - discountAmount);
  };

  // Modify handleEditChange to use decimal discount
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    
    setProductData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };

      if (name === 'originalPrice' || name === 'discount') {
        newData.price = calculatePrice(
          name === 'originalPrice' ? value : prev.originalPrice,
          name === 'discount' ? value/100 : prev.discount
        );
      }

      return newData;
    });
  };

  // Sửa lại hàm handleSubmit để đảm bảo giá trị price được gửi đi
  const handleSubmit = async () => {
    try {
      // Tính toán lại price một lần nữa để đảm bảo
      const finalPrice = calculatePrice(
        Number(productData.originalPrice), 
        Number(productData.discount) / 100
      );

      const productToSubmit = {
        ...productData,
        price: finalPrice, // Đảm bảo gửi price
        discount: productData.discount / 100,
        quantity: productData.countInStock
      };

      if (isNewProduct) {
        const newProduct = await productsApi.createProduct(productToSubmit);
        setProducts([...products, newProduct]);
      } else {
        const updatedProduct = await productsApi.updateProduct(productData._id, productToSubmit);
        setProducts(products.map(product => 
          product._id === updatedProduct._id ? updatedProduct : product
        ));
      }
      setEditDialogOpen(false);
      setError('');
    } catch (err) {
      setError(isNewProduct ? 'Failed to create product' : 'Failed to update product');
    }
  };

  const categoryNamesMap = useMemo(() => {
    const map = new Map();
    categories.forEach(mainCat => {
      mainCat.subCategories.forEach(subCat => {
        map.set(subCat._id, `${mainCat.name} - ${subCat.name}`);
      });
    });
    return map;
  }, [categories]);

  const findCategoryName = (categoryId) => {
    return categoryNamesMap.get(categoryId) || 'Unknown';
  };

  // Modify openEditDialog to convert discount to percentage when displaying
  const openEditDialog = (product) => {
    console.log('Opening edit dialog with product:', product);
    // Ensure category IDs are properly extracted
    const categoryIds = Array.isArray(product.category) 
      ? product.category.map(cat => cat._id || cat)
      : product.category?._id 
        ? [product.category._id]
        : [];

    setProductData({
      ...product,
      discount: product.discount * 100, // Convert to percentage for display
      category: categoryIds
    });
    setIsNewProduct(false);
    setEditDialogOpen(true);
  };

  const openNewProductDialog = () => {
    setProductData({
      name: '',
      brand: '',
      price: '',
      originalPrice: '',
      discount: '',
      description: '',
      countInStock: '',
      category: [],
      features: '',
      image: '',
      listImage: ''
    });
    setIsNewProduct(true);
    setEditDialogOpen(true);
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageLoading(true);
      const formData = new FormData();
      formData.append('image', file);
      
      try {
        const result = await productsApi.uploadProductImage(formData);
        setProductData(prev => ({
          ...prev,
          [field]: result.url
        }));
      } catch (err) {
        setError('Failed to upload image');
      } finally {
        setImageLoading(false);
      }
    }
  };

  const handleMultipleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    setImageLoading(true);
    
    try {
      const uploadPromises = files.map(file => {
        const formData = new FormData();
        formData.append('image', file);
        return productsApi.uploadProductImage(formData);
      });

      const results = await Promise.all(uploadPromises);
      const urls = results.map(result => result.url);
      
      setProductData(prev => ({
        ...prev,
        listImage: [...(prev.listImage || []), ...urls]
      }));
    } catch (err) {
      setError('Failed to upload images');
    } finally {
      setImageLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Navigation />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ color: '#1a237e', fontWeight: 600 }}>
            Product Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openNewProductDialog}
          >
            Add New Product
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell align="center" sx={{ width: '50px' }}>#</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Brand</TableCell>
                <TableCell align="right">Price (VND)</TableCell>
                <TableCell align="right">Original Price</TableCell>
                <TableCell align="right">Discount (%)</TableCell>
                <TableCell align="right">Stock</TableCell>
                <TableCell align="center">Rating</TableCell>
                <TableCell align="center">Reviews</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product, index) => (
                  <TableRow key={product._id}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell>
                      <Avatar
                        src={product.image}
                        alt={product.name}
                        variant="square"
                        sx={{ width: 50, height: 50 }}
                      />
                    </TableCell>
                    <TableCell sx={{ maxWidth: 200 }}>
                      <Typography noWrap title={product.name}>
                        {product.name}
                      </Typography>
                    </TableCell>
                    <TableCell>{product.brand}</TableCell>
                    <TableCell align="right">
                      {product.price?.toLocaleString('vi-VN')}
                    </TableCell>
                    <TableCell align="right">
                      {product.originalPrice?.toLocaleString('vi-VN')}
                    </TableCell>
                    <TableCell align="right">{(product.discount * 100).toFixed(0)}</TableCell>
                    <TableCell align="right">{product.countInStock}</TableCell>
                    <TableCell align="center">{product.rating}</TableCell>
                    <TableCell align="center">{product.numReviews}</TableCell>
                    <TableCell align="center">
                      <IconButton 
                        onClick={() => openEditDialog(product)}
                        title="Edit"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        onClick={() => {
                          setSelectedProduct(product);
                          setDeleteDialogOpen(true);
                        }}
                        color="error"
                        title="Delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete {selectedProduct?.name}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => handleDelete(selectedProduct?._id)} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog 
          open={editDialogOpen} 
          onClose={() => setEditDialogOpen(false)} 
          maxWidth="lg" 
          fullWidth
          PaperProps={{
            sx: {
              maxHeight: '90vh',
              borderRadius: 2
            }
          }}
        >
          <DialogTitle sx={{ 
            bgcolor: '#1a237e', 
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="h6">
              {isNewProduct ? 'Add New Product' : 'Edit Product'}
            </Typography>
            <IconButton onClick={() => setEditDialogOpen(false)} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={DIALOG_STYLES.dialogContent}>
            <Box sx={DIALOG_STYLES.formWrapper}>
              {/* Left Column */}
              <Box sx={DIALOG_STYLES.leftColumn}>
                {/* Basic Info Section */}
                <Box sx={DIALOG_STYLES.section}>
                  <Box sx={DIALOG_STYLES.sectionHeader}>
                    <Typography variant="subtitle1" fontWeight="medium">Basic Information</Typography>
                  </Box>
                  <Box sx={DIALOG_STYLES.sectionContent}>
                    <TextField
                      label="Product Name"
                      name="name"
                      value={productData.name}
                      onChange={handleEditChange}
                      required
                      fullWidth
                    />
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                      <TextField
                        label="Brand"
                        name="brand"
                        value={productData.brand}
                        onChange={handleEditChange}
                        required
                      />
                      <TextField
                        label="Stock"
                        name="countInStock"
                        type="number"
                        value={productData.countInStock}
                        onChange={handleEditChange}
                        required
                      />
                    </Box>
                  </Box>
                </Box>

                {/* Description Section */}
                <Box sx={DIALOG_STYLES.section}>
                  <Box sx={DIALOG_STYLES.sectionHeader}>
                    <Typography variant="subtitle1" fontWeight="medium">Description & Features</Typography>
                  </Box>
                  <Box sx={DIALOG_STYLES.sectionContent}>
                    <TextField
                      label="Description"
                      name="description"
                      multiline
                      rows={4}
                      value={productData.description}
                      onChange={handleEditChange}
                      required
                    />
                    <TextField
                      label="Features"
                      name="features"
                      multiline
                      rows={2}
                      value={productData.features}
                      onChange={handleEditChange}
                      helperText="Enter features separated by commas"
                    />
                  </Box>
                </Box>

                {/* Additional Images */}
                <Box sx={DIALOG_STYLES.section}>
                  <Box sx={DIALOG_STYLES.sectionHeader}>
                    <Typography variant="subtitle1" fontWeight="medium">Additional Images</Typography>
                  </Box>
                  <Box sx={DIALOG_STYLES.sectionContent}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        component="label"
                        variant="contained"
                        startIcon={<UploadIcon />}
                        disabled={imageLoading}
                        sx={{ flex: '0 0 auto' }}
                      >
                        Upload Images
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          multiple
                          onChange={handleMultipleImageUpload}
                        />
                      </Button>
                    </Box>
                    {Array.isArray(productData.listImage) && productData.listImage.length > 0 && (
                      <ImageList sx={{ width: '100%', height: 'auto', maxHeight: 300 }} cols={3} rowHeight={100}>
                        {productData.listImage.map((url, index) => (
                          <ImageListItem key={index} sx={{ position: 'relative' }}>
                            <img
                              src={url}
                              alt={`Product ${index + 1}`}
                              loading="lazy"
                              style={{ height: '100px', objectFit: 'cover' }}
                            />
                            <IconButton
                              sx={{
                                position: 'absolute',
                                top: 5,
                                right: 5,
                                bgcolor: 'rgba(0,0,0,0.5)',
                                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                              }}
                              size="small"
                              onClick={() => {
                                const newListImage = productData.listImage.filter((_, i) => i !== index);
                                setProductData(prev => ({
                                  ...prev,
                                  listImage: newListImage
                                }));
                              }}
                            >
                              <CloseIcon sx={{ color: 'white' }} fontSize="small" />
                            </IconButton>
                          </ImageListItem>
                        ))}
                      </ImageList>
                    )}
                  </Box>
                </Box>
              </Box>

              {/* Right Column */}
              <Box sx={DIALOG_STYLES.rightColumn}>
                {/* Main Image Section */}
                <Box sx={DIALOG_STYLES.section}>
                  <Box sx={DIALOG_STYLES.sectionHeader}>
                    <Typography variant="subtitle1" fontWeight="medium">Main Image</Typography>
                  </Box>
                  <Box sx={DIALOG_STYLES.sectionContent}>
                    {productData.image ? (
                      <img
                        src={productData.image}
                        alt="Main product"
                        style={DIALOG_STYLES.imagePreview}
                      />
                    ) : (
                      <Box
                        sx={{
                          ...DIALOG_STYLES.imagePreview,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: '#f5f5f5'
                        }}
                      >
                        <Typography color="text.secondary">No image selected</Typography>
                      </Box>
                    )}
                    <Button
                      component="label"
                      variant="contained"
                      startIcon={<UploadIcon />}
                      disabled={imageLoading}
                      fullWidth
                    >
                      Upload Main Image
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'image')}
                      />
                    </Button>
                  </Box>
                </Box>

                {/* Pricing Section */}
                <Box sx={DIALOG_STYLES.section}>
                  <Box sx={DIALOG_STYLES.sectionHeader}>
                    <Typography variant="subtitle1" fontWeight="medium">Pricing</Typography>
                  </Box>
                  <Box sx={DIALOG_STYLES.sectionContent}>
                    <TextField
                      label="Original Price (VND)"
                      name="originalPrice"
                      type="number"
                      value={productData.originalPrice}
                      onChange={handleEditChange}
                      required
                      InputProps={{
                        startAdornment: <Typography sx={{ mr: 1 }}>₫</Typography>
                      }}
                      fullWidth
                    />
                    <TextField
                      label="Discount (%)"
                      name="discount"
                      type="number"
                      value={productData.discount}
                      onChange={handleEditChange}
                      InputProps={{
                        endAdornment: <Typography sx={{ ml: 1 }}>%</Typography>
                      }}
                      fullWidth
                    />
                    <TextField
                      label="Final Price (VND)"
                      value={productData.price?.toLocaleString('vi-VN')}
                      InputProps={{
                        startAdornment: <Typography sx={{ mr: 1 }}>₫</Typography>,
                        readOnly: true,
                      }}
                      disabled
                      fullWidth
                      helperText="Automatically calculated based on Original Price and Discount"
                    />
                  </Box>
                </Box>

                {/* Categories Section */}
                <Box sx={DIALOG_STYLES.section}>
                  <Box sx={DIALOG_STYLES.sectionHeader}>
                    <Typography variant="subtitle1" fontWeight="medium">Categories</Typography>
                  </Box>
                  <Box sx={DIALOG_STYLES.sectionContent}>
                    <FormControl fullWidth>
                      <InputLabel>Select Categories</InputLabel>
                      <Select
                        multiple
                        value={Array.isArray(productData.category) ? productData.category : []}
                        onChange={(e) => {
                          setProductData({
                            ...productData,
                            category: e.target.value
                          });
                        }}
                        input={<OutlinedInput label="Select Categories" />}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                              <Chip 
                                key={value} 
                                label={categoryNamesMap.get(value) || 'Unknown'}
                                size="small"
                              />
                            ))}
                          </Box>
                        )}
                      >
                        {categories.map((mainCat) => [
                          <ListSubheader key={mainCat._id}>
                            {mainCat.name}
                          </ListSubheader>,
                          ...mainCat.subCategories.map((subCat) => (
                            <MenuItem key={subCat._id} value={subCat._id}>
                              {subCat.name}
                            </MenuItem>
                          ))
                        ])}
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
              </Box>
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 2, bgcolor: '#f8f9fa', borderTop: '1px solid #e0e0e0' }}>
            <Button onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained"
              disabled={imageLoading}
              startIcon={isNewProduct ? <AddIcon /> : <EditIcon />}
            >
              {isNewProduct ? 'Create Product' : 'Save Changes'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ProductList;
