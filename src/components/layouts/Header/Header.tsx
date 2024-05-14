import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import * as loginActions from "../../../actions/login.action";
import { useAppDispatch } from "../../..";
import { TOKEN } from "../../../Constants";
import { MouseEvent } from "react"; // Import MouseEvent
import Popover from "@mui/material/Popover";
import MenuItem from "@mui/material/MenuItem";

const drawerWidth = 240;

const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "open",
})<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

type HeaderProp = {
  open: boolean;
  onDrawerOpen: () => void;
};

export default function Header({ open, onDrawerOpen }: HeaderProp) {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const token = localStorage.getItem(TOKEN);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open1 = Boolean(anchorEl);

  const handleMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(loginActions.logout(navigate));
    handleClose();
  };
  // แยกส่วนของ Token ออกมา
  const tokenParts = token!.split(".");
  const encodedPayload = tokenParts[1];

  // ถอดสตริง base64 เพื่อให้ได้ส่วนของ payload
  const decodedPayload = atob(encodedPayload);

  // แปลง payload เป็น object
  const decodedToken = JSON.parse(decodedPayload);

  const handleProfileSetting = () => {
    const id = decodedToken.id;
    navigate(`/user/pro/${id}`);
    handleClose();
  };

  const handleDrawerOpen = () => {
    // setOpen(true);
    onDrawerOpen();
  };

  return (
    <AppBar position="fixed" open={open}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{ mr: 2, ...(open && { display: "none" }) }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          Eye Disease System V.
          {process.env.REACT_APP_VERSION}
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Typography
          variant="h6"
          noWrap
          component="div"
          style={{
            fontWeight: 300,
            color: "blue",
            border: "2px solid blue",
            backgroundColor: "white",
            borderRadius: "5px",
            padding: "8px",
          }}
        >
          USER: {decodedToken.sub}
        </Typography>

        <Box sx={{ display: { xs: "none", md: "flex" } }}>
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Popover
            anchorEl={anchorEl}
            open={open1}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={handleProfileSetting}>Profile Settings</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Popover>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
