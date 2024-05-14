import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import Layers from "@mui/icons-material/Layers";
import BarChart from "@mui/icons-material/BarChart";
import Person from "@mui/icons-material/Person";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { NavLink } from "react-router-dom";
import { Stack } from "@mui/material";
import * as loginActions from "../../../actions/login.action";
import * as userActions from "../../../actions/user.action";
import { useAppDispatch } from "../../..";
import { TOKEN } from "../../../Constants";
import ContentPasteGoIcon from "@mui/icons-material/ContentPasteGo";
import { useSelector } from "react-redux";
import { RootReducers } from "../../../reducers";
const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
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
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

type MenuProp = {
  open: boolean;
  onDrawerClose: () => void;
};

export default function Menu({ open, onDrawerClose }: MenuProp) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const handleDrawerClose = () => {
    // setOpen(false);
    onDrawerClose();
  };

  const MyNavLink = React.forwardRef<any, any>((props, ref) => (
    <NavLink
      ref={ref}
      to={props.to}
      className={(navProps) =>
        `${props.className} ${
          navProps.isActive === props.to ? props.activeClassName : ""
        }`
      }
    >
      {props.children}
    </NavLink>
  ));
  const perAuthReducer = useSelector(
    (state: RootReducers) => state.perAuthReducer
  );
  const accessPatient =
    perAuthReducer.result && perAuthReducer.result.length > 0
      ? perAuthReducer.result[0].access_patient
      : false;
  const accessReport =
    perAuthReducer.result && perAuthReducer.result.length > 0
      ? perAuthReducer.result[0].access_report
      : false;

  const accessManageuser =
    perAuthReducer.result && perAuthReducer.result.length > 0
      ? perAuthReducer.result[0].access_manageuser
      : false;
  const accessPermission =
    perAuthReducer.result && perAuthReducer.result.length > 0
      ? perAuthReducer.result[0].access_position
      : false;
  const token = localStorage.getItem(TOKEN);

  // แยกส่วนของ Token ออกมา
  const tokenParts = token!.split(".");
  const encodedPayload = tokenParts[1];

  // ถอดสตริง base64 เพื่อให้ได้ส่วนของ payload
  const decodedPayload = atob(encodedPayload);

  // แปลง payload เป็น object
  const decodedToken = JSON.parse(decodedPayload);
  const path = "/user/pro/" + decodedToken.id;
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <DrawerHeader>
        <Stack direction="row" alignItems="center">
          <img
            src={`${process.env.PUBLIC_URL}/images/123456.png`}
            style={{ height: 20 }}
          />
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </Stack>
      </DrawerHeader>
      <Divider />
      <List>
        {/* Stock */}
        {accessPatient && (
          <ListItem
            button
            to="/patient"
            component={MyNavLink}
            activeClassName="Mui-selected"
            exact
          >
            <ListItemIcon>
              <Layers />
            </ListItemIcon>
            <ListItemText primary="Patient" />
          </ListItem>
        )}

        {/* Report */}
        {accessReport && (
          <ListItem
            button
            to="/report"
            component={MyNavLink}
            activeClassName="Mui-selected"
            exact
          >
            <ListItemIcon>
              <BarChart />
            </ListItemIcon>
            <ListItemText primary="Report" />
          </ListItem>
        )}
        {/* Settings */}
        <ListItem
          button
          to={path}
          component={MyNavLink}
          activeClassName="Mui-selected"
          exact
        >
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Profile Setting" />
        </ListItem>

        <Divider />

        {/* Users*/}
        {accessManageuser && (
          <ListItem
            button
            to="/user"
            component={MyNavLink}
            activeClassName="Mui-selected"
            exact
          >
            <ListItemIcon>
              <AccountBoxIcon />
            </ListItemIcon>
            <ListItemText primary="Users Management" />
          </ListItem>
        )}
        {/* Permission*/}
        {accessPermission && (
          <ListItem
            button
            to="/permission"
            component={MyNavLink}
            activeClassName="Mui-selected"
            exact
          >
            <ListItemIcon>
              <ContentPasteGoIcon />
            </ListItemIcon>
            <ListItemText primary="Set Permission" />
          </ListItem>
        )}
        {/*About us */}
        <ListItem
          button
          to="/aboutus"
          component={MyNavLink}
          activeClassName="Mui-selected"
          exact
        >
          <ListItemIcon>
            <Person />
          </ListItemIcon>
          <ListItemText primary="AboutUs" />
        </ListItem>

        {/* Logout */}
        <ListItem
          button
          onClick={() => {
            dispatch(loginActions.logout(navigator));
          }}
        >
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
        <Divider />
      </List>
    </Drawer>
  );
}
