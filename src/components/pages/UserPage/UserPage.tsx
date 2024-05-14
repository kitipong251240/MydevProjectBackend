import * as React from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import { TOKEN } from "../../../Constants";
import DeleteIcon from "@mui/icons-material/Delete";
import * as userActions from "../../../actions/user.action";
import { useSelector } from "react-redux";
import { RootReducers } from "../../../reducers";
import TransferIcon from "@mui/icons-material/TransferWithinAStation";
import {
  Stack,
  IconButton,
  Box,
  TextField,
  Fab,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
} from "@mui/material";

import { Add, Clear, Search } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useDebounce } from "@react-hook/debounce";

import { useAppDispatch } from "../../..";
import { User } from "../../../types/user.type";

interface QuickSearchToolbarProps {
  clearSearch: () => void;
  onChange: () => void;
  value: string;
}

function QuickSearchToolbar(
  props: QuickSearchToolbarProps & {
    isInactiveUserVisible: boolean;
    handleToggleUserButton: () => void;
    decodedToken: any;
  }
) {
  return (
    <Box
      sx={{
        p: 0.5,
        pb: 0,
        position: "relative",
      }}
    >
      <TextField
        variant="standard"
        value={props.value}
        onChange={props.onChange}
        placeholder="Search"
        InputProps={{
          startAdornment: <Search fontSize="small" />,
          endAdornment: (
            <IconButton
              title="Clear"
              aria-label="Clear"
              size="small"
              style={{ visibility: props.value ? "visible" : "hidden" }}
              onClick={props.clearSearch}
            >
              <Clear fontSize="small" />
            </IconButton>
          ),
        }}
        sx={{
          width: {
            xs: 1,
            sm: "auto",
          },
          m: (theme) => theme.spacing(1, 0.5, 1.5),
          "& .MuiSvgIcon-root": {
            mr: 0.5,
          },
          "& .MuiInput-underline:before": {
            borderBottom: 1,
            borderColor: "divider",
          },
        }}
      />
      {/* เพิ่มปุ่ม "เพิ่มผู้ใช้" */}
      <Tooltip title="Add User">
        <Fab
          color="primary"
          aria-label="add"
          component={Link}
          to="/user/add"
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
          }}
        >
          <Add />
        </Fab>
      </Tooltip>

      {props.decodedToken.sub.toString() === "admin" && (
        <Tooltip
          title={props.isInactiveUserVisible ? "Inactive User" : "Active User"}
        >
          <Fab
            color={props.isInactiveUserVisible ? "error" : "primary"}
            aria-label="transfer"
            component={Link}
            to="/user"
            sx={{
              position: "absolute",
              top: 10,
              right: 80,
            }}
            onClick={props.handleToggleUserButton}
          >
            <TransferIcon />
          </Fab>
        </Tooltip>
      )}
    </Box>
  );
}

export default function UserPage() {
  const userReducer = useSelector((state: RootReducers) => state.userReducer);
  const dispatch = useAppDispatch();
  const [keywordSearch, setKeywordSearch] = useDebounce<string>("", 1000);
  const [keywordSearchNoDelay, setKeywordSearchNoDelay] =
    React.useState<string>("");
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [isInactiveUserVisible, setIsInactiveUserVisible] =
    React.useState<boolean>(true);
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const navigate = useNavigate();
  const token = localStorage.getItem(TOKEN);
  const tokenParts = token!.split(".");
  const encodedPayload = tokenParts[1];
  const decodedPayload = atob(encodedPayload);
  const decodedToken = JSON.parse(decodedPayload);

  const handleToggleUserButton = () => {
    setIsInactiveUserVisible(!isInactiveUserVisible);
  };
  React.useEffect(() => {
    dispatch(userActions.loadUserByKeyword(keywordSearch));
  }, [keywordSearch]);

  React.useEffect(() => {
    dispatch(userActions.loadUser());
  }, []);

  const userColumns: GridColDef[] = [
    {
      headerName: "ID",
      field: "user_id",
      width: 90,
    },
    {
      headerName: "USERNAME",
      width: 150,
      field: "user_user",
    },
    {
      headerName: "NAME",
      field: "user_fname",
      width: 190,
      renderCell: (params) => (
        <span>
          {params.row.user_fname} {params.row.user_lname}
        </span>
      ),
    },

    {
      headerName: "PHONE",
      width: 150,
      field: "user_phone",
    },

    {
      headerName: "STATUS",
      field: "user_status",
      width: 150,
      renderCell: ({ value }: GridRenderCellParams<number>) => (
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            backgroundColor: value === 1 ? "green" : "red",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ marginLeft: value === 1 ? 100 : 100 }}>
            {value === 1 ? "Active" : "Inactive"}
          </div>
        </div>
      ),
    },
    {
      headerName: "ACTION",
      field: ".",
      width: 170,
      renderCell: ({ row }: GridRenderCellParams<string>) => (
        <Stack direction="row">
          <Tooltip title="Edit" arrow>
            <IconButton
              aria-label="edit"
              size="large"
              sx={{ "&:hover": { backgroundColor: "rgba(0, 0, 255, 0.1)" } }}
              onClick={() => {
                navigate("/user/edit/" + row.user_id);
              }}
            >
              <EditIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
          {isInactiveUserVisible ? (
            <Tooltip title="Delete" arrow>
              <IconButton
                aria-label="delete"
                size="large"
                sx={{ "&:hover": { backgroundColor: "rgba(255, 0, 0, 0.1)" } }}
                onClick={() => {
                  setSelectedUser(row);
                  setOpenDialog(true);
                }}
              >
                <DeleteIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
          ) : null}
        </Stack>
      ),
    },
  ];

  const handleDeleteConfirm = () => {
    const formData = new FormData(); // สร้างอ็อบเจกต์ FormData
    formData.append("user_id", String(selectedUser!.user_id!));
    formData.append("user_fname", String(selectedUser!.user_fname!));
    formData.append("user_user", String(selectedUser!.user_user!));
    formData.append("user_lname", String(selectedUser!.user_lname!));
    formData.append("user_phone", String(selectedUser!.user_phone!));
    formData.append("user_status", "0");
    dispatch(userActions.updateUser(formData)); // ส่ง FormData ไปยังฟังก์ชัน updateUser
    setOpenDialog(false);
  };

  const showDialog = () => {
    if (selectedUser === null) {
      return "";
    }

    return (
      <Dialog
        open={openDialog}
        keepMounted
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          Confirm to delete patient data? :{" "}
          {selectedUser.user_fname + " " + selectedUser.user_lname}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            You cannot restore deleted patient.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="info">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box>
      <DataGrid
        components={{ Toolbar: QuickSearchToolbar }}
        componentsProps={{
          toolbar: {
            value: keywordSearchNoDelay,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              setKeywordSearch(e.target.value);
              setKeywordSearchNoDelay(e.target.value);
              console.log(e.target.value);
            },
            clearSearch: () => {
              setKeywordSearch("");
              setKeywordSearchNoDelay("");
            },
            isInactiveUserVisible,
            handleToggleUserButton,
            decodedToken,
          },
        }}
        sx={{ backgroundColor: "white", height: "70vh" }}
        rows={userReducer.result.filter((user) =>
          isInactiveUserVisible
            ? user.user_status === 1 &&
              user.user_user !== "admin" &&
              user.user_user !== decodedToken.sub
            : user.user_status === 0 &&
              user.user_user !== "admin" &&
              user.user_user !== decodedToken.sub
        )}
        getRowId={(row) => row.user_id}
        columns={userColumns}
        pageSize={10}
        rowsPerPageOptions={[10]}
      />

      {showDialog()}
    </Box>
  );
}
