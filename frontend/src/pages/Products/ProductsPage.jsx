import React, { useEffect, useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Typography,
  IconButton,
  useMediaQuery,
  Container,
  Checkbox,
  FormControlLabel,
  Badge,
  Button,
} from "@mui/material";
import { X } from "lucide-react";
import {
  ChevronDown,
  SlidersHorizontal,
  Watch,
  Users,
  Sparkles,
  Boxes,
  BadgeCheck,
} from "lucide-react";
import WatchCard from "./WatchCard";
import categoryApi from "../../service/api/categoryApi";

const COLORS = {
  primary: "#1976d2",
  secondary: "#9c27b0",
  text: {
    primary: "#1a1a1a",
    secondary: "#666666",
  },
  background: {
    default: "#f9fafb",
    paper: "#ffffff",
  },
  divider: "#e0e0e0",
  hover: "rgba(25, 118, 210, 0.08)",
};

const ProductFilterPage = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [openFilters, setOpenFilters] = useState({});
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [filters, setFilters] = useState({});

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

  const FilterList = () => (
    <List
      sx={{
        width: "100%",
        maxWidth: 360,
        bgcolor: COLORS.background.paper,
        borderRadius: 4,
        boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.1)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
        },
      }}
    >
      <Typography
        variant="h6"
        sx={{
          p: 2,
          borderBottom: `1px solid ${COLORS.divider}`,
          color: COLORS.text.primary,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <SlidersHorizontal size={20} />
        Bộ lọc tìm kiếm
      </Typography>

      {Object.entries(filters).map(([category, { icon, options }]) => (
        <React.Fragment key={category}>
          <ListItem
            component="div"
            sx={{
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: COLORS.hover,
                "& .MuiBox-root": {
                  transform: "scale(1.1)",
                },
              },
              borderLeft: openFilters[category]
                ? `4px solid ${COLORS.primary}`
                : "4px solid transparent",
              cursor: "pointer",
            }}
            onClick={() => handleFilterClick(category)}
          >
            <Box
              sx={{
                mr: 2,
                color: openFilters[category]
                  ? COLORS.primary
                  : COLORS.text.secondary,
                transition: "transform 0.2s ease",
                display: "flex",
                alignItems: "center",
              }}
            >
              {icon}
            </Box>
            <ListItemText
              primary={category}
              sx={{
                "& .MuiTypography-root": {
                  fontWeight: openFilters[category] ? 700 : 500,
                  color: openFilters[category]
                    ? COLORS.primary
                    : COLORS.text.primary,
                  transition: "all 0.2s ease",
                },
              }}
            />
            <Box
              sx={{
                transition: "transform 0.2s ease",
                transform: openFilters[category] ? "rotate(-180deg)" : "none",
                color: openFilters[category]
                  ? COLORS.primary
                  : COLORS.text.secondary,
              }}
            >
              <ChevronDown size={20} />
            </Box>
          </ListItem>

          <Collapse in={openFilters[category]} timeout="auto" unmountOnExit>
            <List
              component="div"
              disablePadding
              sx={{
                bgcolor: "rgba(25, 118, 210, 0.03)",
              }}
            >
              {options.map((option) => (
                <ListItem
                  key={option}
                  component="div"
                  sx={{
                    pl: 4,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: COLORS.hover,
                    },
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedFilters[category]?.[option] || false}
                        onChange={() => handleCheckboxChange(category, option)}
                        sx={{
                          color: COLORS.text.secondary,
                          "&.Mui-checked": {
                            color: COLORS.primary,
                          },
                          "& .MuiSvgIcon-root": {
                            fontSize: 20,
                          },
                          transition: "all 0.2s ease",
                        }}
                      />
                    }
                    label={
                      <Typography
                        variant="body2"
                        sx={{
                          color: selectedFilters[category]?.[option]
                            ? COLORS.primary
                            : COLORS.text.secondary,
                          fontWeight: selectedFilters[category]?.[option]
                            ? 600
                            : 400,
                          transition: "all 0.2s ease",
                        }}
                      >
                        {option}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Collapse>
        </React.Fragment>
      ))}

      {Object.keys(selectedFilters).length > 0 && (
        <Box
          sx={{
            p: 2,
            borderTop: `1px solid ${COLORS.divider}`,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            variant="contained"
            size="small"
            onClick={() => setSelectedFilters({})}
            startIcon={<X size={16} />}
            sx={{
              textTransform: "none",
              bgcolor: COLORS.primary,
              boxShadow: "none",
              "&:hover": {
                boxShadow: "none",
                bgcolor: "rgba(25, 118, 210, 0.9)",
              },
            }}
          >
            Xóa bộ lọc
          </Button>
        </Box>
      )}
    </List>
  );

  const selectedFiltersCount = Object.values(selectedFilters).reduce(
    (count, categoryFilters) =>
      count + Object.values(categoryFilters || {}).filter(Boolean).length,
    0
  );

  return (
    <Box sx={{ bgcolor: COLORS.background.default, minHeight: "100vh" }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", gap: 3 }}>
          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={() => setMobileOpen(!mobileOpen)}
                sx={{
                  bgcolor: COLORS.background.paper,
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
                    bgcolor: COLORS.background.default,
                    p: 2,
                  },
                }}
              >
                <FilterList />
              </Drawer>
            </>
          ) : (
            <Box sx={{ width: 300, flexShrink: 0 }}>
              <FilterList />
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
            ></Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ProductFilterPage;
