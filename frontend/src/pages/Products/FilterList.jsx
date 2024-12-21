import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Typography,
  FormControlLabel,
  Checkbox,
  Button,
} from "@mui/material";
import { X, ChevronDown, SlidersHorizontal } from "lucide-react";
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
  
const FilterList = ({ 
  filters, 
  openFilters, 
  selectedFilters, 
  onFilterClick, 
  onCheckboxChange, 
  onClearFilters 
}) => {
  return (
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
            onClick={() => onFilterClick(category)}
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
                        onChange={() => onCheckboxChange(category, option)}
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
            onClick={onClearFilters}
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
};

export default FilterList;