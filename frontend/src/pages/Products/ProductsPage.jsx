import React, { useEffect, useState } from "react";
import {
  Box,
  Drawer,
  Typography,
  IconButton,
  useMediaQuery,
  Container,
  Badge,
  TextField,
  Pagination,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {
  SlidersHorizontal,
  BadgeCheck,
  Users,
  Watch,
  Sparkles,
  Boxes,
} from "lucide-react";
import WatchCard from "./WatchCard";
import FilterList from "./FilterList";
import categoryApi from "../../service/api/categoryApi";
import productApi from "../../service/api/productsApi";
import Navigation from "../Auth/Navigation";
import favoritesApi from "../../service/api/favoritesApi";
const convertToSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/ /g, "_")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

const convertToSlugSubs = (text) => {
  return text
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/ /g, "-")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

const objectToQueryParams = (categoriesObj, search, page = 1) => {
  console.log("cate", categoriesObj);
  const queryParamsArray = [];
  for (const categoryName in categoriesObj) {
    if (categoriesObj.hasOwnProperty(categoryName)) {
      const subCategories = categoriesObj[categoryName];
      const mainCategorySlug = convertToSlug(categoryName);
      const subCategoryNames = Object.keys(subCategories);
      const activeSubCategories = subCategoryNames.filter(
        (subCategoryName) => subCategories[subCategoryName]
      );
      const subCategorySlugs = activeSubCategories.map((subCategoryName) =>
        convertToSlugSubs(subCategoryName)
      );
      const subCategorySlugsString = subCategorySlugs.join(",");

      if (subCategorySlugsString) {
        queryParamsArray.push(`${mainCategorySlug}=${subCategorySlugsString}`);
      }
    }
  }
  if (search) {
    queryParamsArray.push(`search=${search}`);
  }
  queryParamsArray.push(`page=${page}`);
  console.log("query: ", queryParamsArray.join("&"));
  return queryParamsArray.join("&");
};

const ProductFilterPage = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [openFilters, setOpenFilters] = useState({});
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [filters, setFilters] = useState({});
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [login, setLogin] = useState(!!sessionStorage.getItem("userData"));
  if (login) {
    useEffect(() => {
      const fetchFavorites = async () => {
        const response = await favoritesApi.getFavorites();
        setFavorites(response.products);
      };
      fetchFavorites();
    }, []);
  }
  const mapApiData = (data) => {
    const icons = [
      <BadgeCheck size={20} />,
      <Users size={20} />,
      <Watch size={20} />,
      <Sparkles size={20} />,
      <Boxes size={20} />,
    ];

    const filter = {};
    data.forEach((category, index) => {
      const key = category.name;
      const options = category.subCategories.map((sub) => sub.name);
      filter[key] = {
        icon: icons[index],
        options: options,
      };
    });
    return filter;
  };
  useEffect(() => {
    const fetchMainCategoryWithSubs = async () => {
      const response = await categoryApi.getMainCategoryWithSubs();
      setFilters(mapApiData(response.data));
    };
    fetchMainCategoryWithSubs();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const params = objectToQueryParams(selectedFilters, search, page);
      const response = await productApi.getProducts(params);
      setPages(response.pages);
      setProducts(response.products);
    };
    fetchProducts();
  }, [selectedFilters, page, search]);

  const handleFilterClick = (category) => {
    setOpenFilters((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleCheckboxChange = (category, option) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [option]: !prev[category]?.[option],
      },
    }));
  };

  const handleClearFilters = () => {
    setSelectedFilters({});
  };

  const selectedFiltersCount = Object.values(selectedFilters).reduce(
    (count, categoryFilters) =>
      count + Object.values(categoryFilters || {}).filter(Boolean).length,
    0
  );
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOnChangeSearch = (e) => {
    setSearch(e.target.value);
  };
  const filterListProps = {
    filters,
    openFilters,
    selectedFilters,
    onFilterClick: handleFilterClick,
    onCheckboxChange: handleCheckboxChange,
    onClearFilters: handleClearFilters,
  };

  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "background.default",
        minHeight: "100vh",
      }}
    >
      <Navigation />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", gap: 3 }}>
          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={() => setMobileOpen(!mobileOpen)}
                sx={{
                  bgcolor: "background.paper",
                  "&:hover": {
                    bgcolor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                <Badge badgeContent={selectedFiltersCount} color="primary">
                  <SlidersHorizontal />
                </Badge>
              </IconButton>
              <Drawer
                variant="temporary"
                anchor="left"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                sx={{
                  "& .MuiDrawer-paper": {
                    width: 280,
                    bgcolor: "background.default",
                    p: 2,
                  },
                }}
              >
                <FilterList {...filterListProps} />
              </Drawer>
            </>
          ) : (
            <Box sx={{ width: 300, flexShrink: 0 }}>
              <FilterList {...filterListProps} />
            </Box>
          )}

          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#475569",
                mb: 4,
              }}
            >
              Đồng hồ cao cấp
            </Typography>

            <Box sx={{ position: "relative", mb: 4 }}>
              <SearchIcon
                sx={{
                  position: "absolute",
                  left: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#64748b",
                  zIndex: 1,
                }}
              />
              <TextField
                fullWidth
                placeholder="Tìm kiếm đồng hồ..."
                variant="outlined"
                onChange={handleOnChangeSearch}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "30px",
                    backgroundColor: "#f8fafc",
                    pl: "48px",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: "#f1f5f9",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "#ffffff",
                      boxShadow: "0 0 0 2px #e2e8f0",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#e2e8f0",
                    },
                  },
                  "& .MuiInputBase-input": {
                    "&::placeholder": {
                      color: "#94a3b8",
                    },
                  },
                }}
              />
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                  md: "1fr 1fr 1fr",
                  lg: "1fr 1fr 1fr 1fr",
                },
                gap: 3,
              }}
            >
              {products.map((product, index) => {
                const isFavorited = login
                  ? favorites.some((fav) => fav._id === product._id)
                  : false;
                return (
                  <WatchCard
                    key={index}
                    watch={product}
                    favorited={isFavorited}
                  />
                );
              })}
            </Box>

            {pages > 1 && (
              <Stack
                spacing={2}
                sx={{
                  mt: 4,
                  display: "flex",
                  alignItems: "center",
                  "& .MuiPagination-ul": {
                    "& .MuiPaginationItem-root": {
                      color: "#64748b",
                      "&:hover": {
                        backgroundColor: "#f1f5f9",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "#3b82f6",
                        color: "white",
                        fontWeight: "bold",
                        "&:hover": {
                          backgroundColor: "#2563eb",
                        },
                      },
                    },
                  },
                }}
              >
                <Pagination
                  count={pages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size={isMobile ? "small" : "large"}
                  showFirstButton
                  showLastButton
                  siblingCount={isMobile ? 0 : 1}
                  boundaryCount={isMobile ? 1 : 2}
                />
              </Stack>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ProductFilterPage;
