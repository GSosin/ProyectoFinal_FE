'use client';
import React, { useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Box } from "@mui/material";

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: "rgb(55, 65, 81)",
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

const MenuTrigger = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '6px 16px',
  borderRadius: theme.shape.borderRadius,
  cursor: 'pointer',
  userSelect: 'none',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:disabled': {
    cursor: 'default',
    pointerEvents: 'none',
    opacity: 0.6,
  },
}));

export default function ReusableMenu({
  buttonText = "Opciones",
  menuItems = [],
  buttonVariant = "contained",
  buttonColor = "primary",
  disabled = false,
  size = "medium",
  insideButton = false,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (onClick, data) => {
    onClick(data);
    handleClose();
  };

  const commonProps = {
    id: "reusable-menu-button",
    'aria-controls': open ? "reusable-menu" : undefined,
    'aria-haspopup': "true",
    'aria-expanded': open ? "true" : undefined,
    onClick: handleClick,
    disabled: disabled,
  };

  const renderTrigger = () => {
    if (insideButton) {
      return (
        <MenuTrigger
          {...commonProps}
          sx={{
            color: buttonColor === 'primary' ? 'primary.main' : 'inherit',
            fontSize: '0.875rem',
            fontWeight: 500,
            textTransform: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          {buttonText}
          <KeyboardArrowDownIcon />
        </MenuTrigger>
      );
    }

    return (
      <Button
        {...commonProps}
        variant={buttonVariant}
        color={buttonColor}
        size={size}
        disableElevation
        endIcon={<KeyboardArrowDownIcon />}
      >
        {buttonText}
      </Button>
    );
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      {renderTrigger()}
      <StyledMenu
        id="reusable-menu"
        MenuListProps={{
          'aria-labelledby': "reusable-menu-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {menuItems.map((item) => {
          if (item.type === "divider") {
            return <Divider key={item.id} sx={{ my: 0.5 }} />;
          }

          const IconComponent = item.icon;

          return (
            <MenuItem
              key={item.id}
              onClick={() => handleMenuItemClick(item.onClick, item.data)}
              disabled={item.disabled}
              disableRipple
            >
              {IconComponent && <IconComponent />}
              {item.label}
            </MenuItem>
          );
        })}
      </StyledMenu>
    </div>
  );
}
