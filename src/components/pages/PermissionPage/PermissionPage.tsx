import * as React from "react";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import { GridCellParams } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { imageUrl } from "../../../Constants";
import * as patientActions from "../../../actions/patient.action";
import * as perActions from "../../../actions/per.action";
import * as pervalidateActions from "../../../actions/user.per.validate.action";

import { useDispatch, useSelector } from "react-redux";
import { RootReducers } from "../../../reducers";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import {
  Typography,
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
  Grid,
  Tooltip,
} from "@mui/material";
import NumberFormat from "react-number-format";
import Moment from "react-moment";
import {
  Add,
  AddShoppingCart,
  AssignmentReturn,
  Clear,
  NewReleases,
  Search,
  Star,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useDebounce, useDebounceCallback } from "@react-hook/debounce";
import { Patient } from "../../../types/patient.type";
import { Img } from "../../../types/img.type";
import StockCard from "../../layouts/StockCard";
import { useAppDispatch } from "../../..";
import { Per } from "../../../types/per.type";
import { UserPerValidate } from "../../../types/user.per.validate.type";

interface QuickSearchToolbarProps {
  clearSearch: () => void;
  onChange: () => void;
  value: string;
}

function QuickSearchToolbar(props: QuickSearchToolbarProps) {
  return (
    <Box
      sx={{
        p: 0.5,
        pb: 0,
      }}
    >
      <Fab
        color="primary"
        aria-label="add"
        component={Link}
        to="/per/add"
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
        }}
      >
        <Add />
      </Fab>
    </Box>
  );
}

export default function PermissionPage() {
  const perReducer = useSelector((state: RootReducers) => state.perReducer);
  const dispatch = useAppDispatch();
  const [keywordSearch, setKeywordSearch] = useDebounce<string>("", 1000);
  const [keywordSearchNoDelay, setKeywordSearchNoDelay] =
    React.useState<string>("");
  const [selectedPer, setSelectedPer] = React.useState<Per | null>(null);
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [openDeleteErrorDialog, setOpenDeleteErrorDialog] =
    React.useState<boolean>(false);
  const navigate = useNavigate();
  React.useEffect(() => {
    dispatch(perActions.loadPerByKeyword(keywordSearch));
  }, [keywordSearch]);

  React.useEffect(() => {
    dispatch(perActions.loadPer());
  }, []);

  const perColumns: GridColDef[] = [
    {
      headerName: "ID",
      field: "per_id",
      width: 90,
    },
    {
      headerName: "PERMISSSION NAME",
      field: "per_name",
      width: 200,
    },
    {
      headerName: "ACCESS DIAGNOSE",
      field: "access_diagnose",
      width: 200,
      renderCell: (params) =>
        params.value ? (
          <CheckCircleIcon style={{ color: "green" }} />
        ) : (
          <CancelIcon style={{ color: "red" }} />
        ),
    },
    {
      headerName: "ACCESS REPORT",
      field: "access_report",
      width: 200,
      renderCell: (params) =>
        params.value ? (
          <CheckCircleIcon style={{ color: "green" }} />
        ) : (
          <CancelIcon style={{ color: "red" }} />
        ), // เงื่อนไขและไอคอนตามเงื่อนไข
    },
    {
      headerName: "ACCESS MANAGEUSER",
      field: "access_manageuser",
      width: 200,
      renderCell: (params) =>
        params.value ? (
          <CheckCircleIcon style={{ color: "green" }} />
        ) : (
          <CancelIcon style={{ color: "red" }} />
        ),
    },
    {
      headerName: "ACCESS PERMISSION",
      field: "access_position",
      width: 200,
      renderCell: (params) =>
        params.value ? (
          <CheckCircleIcon style={{ color: "green" }} />
        ) : (
          <CancelIcon style={{ color: "red" }} />
        ),
    },
    {
      headerName: "ACCESS PATIENT",
      field: "access_patient",
      width: 200,
      renderCell: (params) =>
        params.value ? (
          <CheckCircleIcon style={{ color: "green" }} />
        ) : (
          <CancelIcon style={{ color: "red" }} />
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
                navigate("/per/edit/" + row.per_id);
              }}
            >
              <EditIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete" arrow>
            <IconButton
              aria-label="delete"
              size="large"
              sx={{ "&:hover": { backgroundColor: "rgba(255, 0, 0, 0.1)" } }}
              onClick={() => {
                setSelectedPer(row);
                setOpenDialog(true);
              }}
            >
              <DeleteIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];
  const handleDeleteErrorDialogClose = () => {
    setOpenDeleteErrorDialog(false);
  };
  const handleDeleteConfirm = async () => {
    try {
      await dispatch(perActions.deletePer(String(selectedPer!.per_id!)));
      setOpenDialog(false);
    } catch (error) {
      console.log("Error deleting permission");
      setOpenDialog(false);
      setOpenDeleteErrorDialog(true);
    }
  };
  const showDialog = () => {
    if (selectedPer === null) {
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
          Confirm to delete permission data? : {selectedPer.per_name}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            You cannot restore deleted permission.
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
  const showDeleteErrorDialog = () => {
    return (
      <Dialog
        open={openDeleteErrorDialog}
        onClose={handleDeleteErrorDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Error"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Failed to delete the permission. Please try again later.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDeleteErrorDialogClose}
            color="primary"
            autoFocus
          >
            OK
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
          },
        }}
        sx={{ backgroundColor: "white", height: "70vh" }}
        rows={perReducer.result.filter((item) => item.per_name !== "admin")}
        getRowId={(row) => row.per_id}
        columns={perColumns}
        pageSize={10}
        rowsPerPageOptions={[10]}
      />
      {showDeleteErrorDialog()}
      {showDialog()}
    </Box>
  );
}
