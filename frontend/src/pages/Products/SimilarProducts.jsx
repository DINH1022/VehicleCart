import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Rating,
  Typography,
} from "@mui/material";

const SimilarProducts = ({ similarProducts }) => {
  return (
    <Card 
      variant="outlined" 
      sx={{ 
        mt: 2, 
        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
    >
      <CardHeader 
        title="Sản phẩm tương tự" 
        sx={{ 
          backgroundColor: '#f7f7f7', 
          borderBottom: '1px solid #e0e0e0' 
        }} 
      />
      <CardContent>
        <Box
          display="flex"
          flexWrap="wrap"
          gap={3}
          justifyContent="space-between"
        >
          {similarProducts.map((product) => (
            <Box
              key={product.id}
              sx={{
                width: {
                  xs: "100%", 
                  sm: "48%", 
                  md: "31%", 
                  lg: "19%",
                },
                maxWidth: "260px",
                flexGrow: 1,
              }}
            >
              <Card 
                sx={{ 
                  height: "100%", 
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                  }
                }}
                elevation={2}
              >
                <Box 
                  sx={{ 
                    overflow: 'hidden', 
                    borderTopLeftRadius: 8, 
                    borderTopRightRadius: 8 
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: '100%', 
                      height: '250px', 
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease'
                    }}
                    className="hover:scale-110"
                  />
                </Box>
                <CardContent>
                  <Typography 
                    variant="h6" 
                    noWrap 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#333',
                      mb: 1 
                    }}
                  >
                    {product.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      fontWeight: 500, 
                      color: '#2196f3',
                      mb: 1 
                    }}
                  >
                    {product.price.toLocaleString()} VNĐ
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating
                      value={product.rating}
                      precision={0.1}
                      readOnly
                      size="small"
                    />
                    <Typography variant="caption" color="text.secondary">
                      ({product.rating})
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default SimilarProducts;