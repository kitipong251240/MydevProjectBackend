import * as React from "react";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Header from "./components/layouts/Header";
import Menu from "./components/layouts/Menu";
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import LoginPage from "./components/pages/LoginPage";

import UserPage from "./components/pages/UserPage";

import { blueGrey, blue } from "@mui/material/colors";
import { useSelector } from "react-redux";
import { RootReducers } from "./reducers";
import * as loginActions from "./actions/login.action";
import PublicRoutes from "./router/public.routes";
import ProtectedRoutes from "./router/protected.routes";
import { useAppDispatch } from ".";
import PatientPage from "./components/pages/PatientPage";
import ReportPage from "./components/pages/ReportPage";
import AboutUS from "./components/pages/AboutUS";
import PatientCreatePage from "./components/pages/PatientCreatePage";
import PatientEditPage from "./components/pages/PatientEditPage";
import PridictPage from "./components/pages/PridictPage";
import ProfilePage from "./components/pages/ProfilePage";
import { TOKEN } from "./Constants";
import PermissionPage from "./components/pages/PermissionPage";
import AddUserPage from "./components/pages/AddUserPage";
import UserEditPage from "./components/pages/UserEditPage";
import PerSetPage from "./components/pages/PerSetPage";
import * as perAuthActions from "./actions/per.auth.action";
import PerEditPage from "./components/pages/PerEditPage";
import DiagnosePage from "./components/pages/DiagnosePage";
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

const theme = createTheme({
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage:
            "url(" +
            `${process.env.PUBLIC_URL}/images/background_menu.jpg` +
            ")",
          width: drawerWidth,
        },
      },
    },
  },
  typography: {
    fontFamily: "Fredoka",
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
  },
  spacing: 8,
  palette: {
    primary: process.env.REACT_APP_IS_PRODUCTION == "0" ? blue : blueGrey,
    background: {
      default: "#CFD2D6",
    },
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function App() {
  const [open, setOpen] = React.useState(false);
  const loginReducer = useSelector((state: RootReducers) => state.loginReducer);
  const dispatch = useAppDispatch();
  const perAuthReducer = useSelector(
    (state: RootReducers) => state.perAuthReducer
  );
  const location = useLocation();
  const navigate = useNavigate();

  const accessPatient =
    perAuthReducer.result && perAuthReducer.result.length > 0
      ? perAuthReducer.result[0].access_patient
      : false;
  const accessReport =
    perAuthReducer.result && perAuthReducer.result.length > 0
      ? perAuthReducer.result[0].access_report
      : false;
  const accessDiagnose =
    perAuthReducer.result && perAuthReducer.result.length > 0
      ? perAuthReducer.result[0].access_diagnose
      : false;
  const accessManageuser =
    perAuthReducer.result && perAuthReducer.result.length > 0
      ? perAuthReducer.result[0].access_manageuser
      : false;
  const accessPermission =
    perAuthReducer.result && perAuthReducer.result.length > 0
      ? perAuthReducer.result[0].access_position
      : false;
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    // รันเมื่อ App ถูกโหลด

    const token = localStorage.getItem(TOKEN);
    if (token) {
      const tokenParts = token.split(".");
      const encodedPayload = tokenParts[1];

      // Decode payload
      const decodedPayload = atob(encodedPayload);

      // Parse payload to get user role
      const decodedToken = JSON.parse(decodedPayload);
      const userRole = decodedToken.role;

      // Check if perReducer.result exists and has at least one element
      dispatch(perAuthActions.getPerAuthById(userRole));
      dispatch(loginActions.restoreLogin());
    }
  }, []);

  React.useEffect(() => {
    if (perAuthReducer.result && perAuthReducer.result.length > 0) {
      console.log(perAuthReducer.result);
    }
  }, [perAuthReducer.result]);

  React.useEffect(() => {
    // เมื่อค่า loginReducer.result มีการเปลี่ยนแปลง
    if (loginReducer.result) {
      // ถ้า loginReducer.result มีค่า (คือมีการล็อกอิน)
      navigate("/");
    }
  }, [loginReducer.result]);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        {loginReducer.result && (
          <Header open={open} onDrawerOpen={handleDrawerOpen} />
        )}
        {loginReducer.result && (
          <Menu open={open} onDrawerClose={handleDrawerClose} />
        )}
        <Main
          open={open}
          sx={{
            backgroundImage: loginReducer.result
              ? "none"
              : `url(${process.env.PUBLIC_URL}/images/1234.png)`,
            backgroundSize: "cover",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            overflow: "auto", // Add this to enable scrolling if content overflows
          }}
        >
          <DrawerHeader />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<PublicRoutes />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Protected routes */}

            <Route path="/" element={<ProtectedRoutes />}>
              {accessPermission && (
                <>
                  <Route path="/permission" element={<PermissionPage />} />
                  <Route path="/per/add" element={<PerSetPage />} />
                  <Route path="/per/edit/:id" element={<PerEditPage />} />
                </>
              )}
              {accessPatient && (
                <>
                  <Route path="/patient" element={<PatientPage />} />
                  <Route path="/patient/add" element={<PatientCreatePage />} />
                  <Route
                    path="/patient/edit/:id"
                    element={<PatientEditPage />}
                  />
                </>
              )}
              {accessDiagnose && (
                <>
                  <Route path="/diagnose/:id" element={<DiagnosePage />} />
                  <Route path="/patient/:id" element={<PridictPage />} />
                </>
              )}
              {accessManageuser && (
                <>
                  <Route path="/user/add" element={<AddUserPage />} />
                  <Route path="/user" element={<UserPage />} />
                  <Route path="/user/edit/:id" element={<UserEditPage />} />
                </>
              )}
              {accessReport && (
                <>
                  <Route path="/report" element={<ReportPage />} />
                </>
              )}

              <Route path="/user/pro/:id" element={<ProfilePage />} />
              <Route path="/aboutus" element={<AboutUS />} />
            </Route>
          </Routes>
        </Main>
      </Box>
    </ThemeProvider>
  );
}

const NotFound = () => (
  <div>
    <h1>404 - Not Found!</h1>
    <Link to="/Login">Go Home</Link>
  </div>
);
