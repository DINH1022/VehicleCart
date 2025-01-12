import React, { useState, useEffect } from 'react';
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
  ListSubheader
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon, Upload as UploadIcon } from '@mui/icons-material';
import Navigation from '../Auth/Navigation';
import productsApi from '../../service/api/productsApi';
import categoryApi from '../../service/api/categoryApi';

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

  const handleEditChange = (e) => {
    setProductData({
      ...productData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      const productToSubmit = {
        ...productData,
        quantity: productData.countInStock // Gán quantity = countInStock
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

  const findCategoryName = (categoryId) => {
    console.log('Finding category for:', categoryId);
    console.log('Available categories:', categories);
    
    for (const mainCat of categories) {
      const subCat = mainCat.subCategories.find(sub => sub._id === categoryId);
      if (subCat) {
        return `${mainCat.name} - ${subCat.name}`;
      }
    }
    return 'Unknown';
  };

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
                    <TableCell align="right">{product.discount}</TableCell>
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

        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>{isNewProduct ? 'Add New Product' : 'Edit Product'}</DialogTitle>
          <DialogContent>
            <Box component="form" sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={productData.name}
                onChange={handleEditChange}
                required
              />
              <TextField
                fullWidth
                label="Brand"
                name="brand"
                value={productData.brand}
                onChange={handleEditChange}
                required
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Price (VND)"
                  name="price"
                  type="number"
                  value={productData.price}
                  onChange={handleEditChange}
                  required
                />
                <TextField
                  fullWidth
                  label="Original Price (VND)"
                  name="originalPrice"
                  type="number"
                  value={productData.originalPrice}
                  onChange={handleEditChange}
                />
                <TextField
                  fullWidth
                  label="Discount (%)"
                  name="discount"
                  type="number"
                  value={productData.discount}
                  onChange={handleEditChange}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Stock"
                  name="countInStock"
                  type="number"
                  value={productData.countInStock}
                  onChange={handleEditChange}
                  required
                />
                <FormControl fullWidth>
                  <InputLabel>Categories</InputLabel>
                  <Select
                    multiple
                    value={Array.isArray(productData.category) ? productData.category : []}
                    onChange={(e) => {
                      console.log('Selected categories:', e.target.value);
                      setProductData({
                        ...productData,
                        category: e.target.value
                      });
                    }}
                    input={<OutlinedInput label="Categories" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip 
                            key={value} 
                            label={findCategoryName(value)}
                            sx={{ m: 0.5 }}
                          />
                        ))}
                      </Box>
                    )}
                  >
                    {categories.map((mainCat) => [
                      <ListSubheader key={mainCat._id} sx={{ fontWeight: 'bold', bgcolor: 'background.paper' }}>
                        {mainCat.name}
                      </ListSubheader>,
                      ...mainCat.subCategories.map((subCat) => (
                        <MenuItem 
                          key={subCat._id} 
                          value={subCat._id}
                          sx={{ pl: 4 }}
                        >
                          {subCat.name}
                        </MenuItem>
                      ))
                    ])}
                  </Select>
                </FormControl>
              </Box>
              <TextField
                fullWidth
                label="Features"
                name="features"
                value={productData.features}
                onChange={handleEditChange}
                multiline
                rows={2}
                helperText="Enter features separated by commas"
              />
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  fullWidth
                  label="Image URL"
                  name="image"
                  value={productData.image}
                  onChange={handleEditChange}
                  required
                />
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<UploadIcon />}
                  disabled={imageLoading}
                >
                  Upload
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'image')}
                  />
                </Button>
                {productData.image && (
                  <Avatar
                    src={productData.image}
                    alt="Product"
                    variant="rounded"
                    sx={{ width: 56, height: 56 }}
                  />
                )}
              </Box>

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <TextField
                  fullWidth
                  label="Additional Images"
                  name="listImage"
                  value={Array.isArray(productData.listImage) ? productData.listImage.join(', ') : productData.listImage}
                  onChange={handleEditChange}
                  helperText="Image URLs separated by commas"
                  multiline
                  rows={2}
                />
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<UploadIcon />}
                  disabled={imageLoading}
                >
                  Upload Multiple
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
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {productData.listImage.map((url, index) => (
                    <Avatar
                      key={index}
                      src={url}
                      alt={`Product ${index + 1}`}
                      variant="rounded"
                      sx={{ width: 56, height: 56 }}
                    />
                  ))}
                </Box>
              )}
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={4}
                value={productData.description}
                onChange={handleEditChange}
                required
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              {isNewProduct ? 'Create' : 'Save Changes'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ProductList;
