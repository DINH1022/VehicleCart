import React, { useEffect, useState } from "react";
import {
  Box,
  Drawer,
  Typography,
  IconButton,
  useMediaQuery,
  Container,
  Badge,
} from "@mui/material";
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

const convertToSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/ /g, "_")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

const convertToSlugSubs = (text) => {
  return text
    .toLowerCase()
    .replace(/ /g, "-")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

const objectToQueryParams = (categoriesObj) => {
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

  return queryParamsArray.join("&");
};

const ProductFilterPage = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [openFilters, setOpenFilters] = useState({});
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [filters, setFilters] = useState({});
  const [products, setProducts] = useState([]);

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
      const params = objectToQueryParams(selectedFilters);
      const response = await productApi.getProducts(params);
      setProducts(response.products);
    };
    fetchProducts();
  }, [selectedFilters]);

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

  const filterListProps = {
    filters,
    openFilters,
    selectedFilters,
    onFilterClick: handleFilterClick,
    onCheckboxChange: handleCheckboxChange,
    onClearFilters: handleClearFilters,
  };

  return (
    <Box sx={{ display: "flex", bgcolor: "background.default", minHeight: "100vh" }}>
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
                color: "#1a237e",
                mb: 4,
              }}
            >
              Đồng hồ cao cấp
            </Typography>
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
              {products.map((product, index) => (
                <WatchCard key={index} watch={product} />
              ))}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ProductFilterPage;