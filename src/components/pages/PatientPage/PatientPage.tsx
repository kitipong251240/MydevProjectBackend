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
import { useDispatch, useSelector } from "react-redux";
import { RootReducers } from "../../../reducers";
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
import Moment from "react-moment";
import { Add, Clear, Search } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useDebounce, useDebounceCallback } from "@react-hook/debounce";
import { Patient } from "../../../types/patient.type";
import { useAppDispatch } from "../../..";
import ListAltIcon from "@mui/icons-material/ListAlt";

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
      <Tooltip title="เพิ่มผู้ป่วย" arrow>
        <Fab
          color="primary"
          aria-label="add"
          component={Link}
          to="/patient/add"
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
          }}
        >
          <Add />
        </Fab>
      </Tooltip>
    </Box>
  );
}

export default function PatientPage() {
  const patientReducer = useSelector(
    (state: RootReducers) => state.patientReducer
  );
  const perAuthReducer = useSelector(
    (state: RootReducers) => state.perAuthReducer
  );
  const accessDiagnose =
    perAuthReducer.result && perAuthReducer.result.length > 0
      ? perAuthReducer.result[0].access_diagnose
      : false;
  const dispatch = useAppDispatch();
  const [keywordSearch, setKeywordSearch] = useDebounce<string>("", 1000);
  const [keywordSearchNoDelay, setKeywordSearchNoDelay] =
    React.useState<string>("");
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [selectedPatient, setSelectedPatient] = React.useState<Patient | null>(
    null
  );

  const navigate = useNavigate();

  React.useEffect(() => {
    dispatch(patientActions.loadPatientByKeyword(keywordSearch));
  }, [keywordSearch]);

  React.useEffect(() => {
    dispatch(patientActions.loadPatient());
  }, []);

  const patientColumns: GridColDef[] = [
    {
      headerName: "ID",
      field: "patient_id",
      width: 90,
    },
    {
      headerName: "NAME",
      field: "patient_fname",
      width: 190,
      renderCell: (params) => (
        <span>
          {params.row.patient_fname} {params.row.patient_lname}
        </span>
      ),
    },
    {
      headerName: "GENDER",
      field: "patient_sex",
      width: 100,
    },
    {
      headerName: "AGE",
      field: "patient_bdate",
      width: 80,
      renderCell: ({ value }: GridRenderCellParams<string>) => (
        <Typography variant="body1">
          <Moment fromNow ago>
            {value}
          </Moment>
        </Typography>
      ),
    },
    {
      headerName: "PHONE",
      width: 150,
      field: "patient_phone",
    },
    {
      headerName: "TIME",
      field: "patient_todate",
      width: 220,
      renderCell: ({ value }: GridRenderCellParams<string>) => (
        <Typography variant="body1">
          <Moment format="DD/MM/YYYY HH:mm">{value}</Moment>
        </Typography>
      ),
    },
    {
      headerName: "STATUS",
      field: "patient_status",
      width: 150,
      renderCell: ({ value }: GridRenderCellParams<number>) => (
        <Typography
          variant="body1"
          sx={{
            fontWeight: "bold",
            backgroundColor:
              value === 0 ? "rgba(255, 0, 0, 0.5)" : "rgba(0, 255, 0, 0.5)",
          }}
        >
          {value === 0 ? "Need Prediction" : "Predicted"}
        </Typography>
      ),
      cellClassName: (params: GridCellParams) => {
        return params.value === 0 ? "need-prediction" : "predicted";
      },
    },

    {
      headerName: "ACTION",
      field: ".",
      width: 170,
      renderCell: ({ row }: GridRenderCellParams<string>) => (
        <Stack direction="row">
          <Tooltip title="Pridict" arrow>
            <IconButton
              aria-label="search"
              size="large"
              sx={{ "&:hover": { backgroundColor: "rgba(0, 255, 0, 0.1)" } }}
              onClick={() => {
                navigate("/patient/" + row.patient_id);
              }}
            >
              <SearchIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit" arrow>
            <IconButton
              aria-label="edit"
              size="large"
              sx={{ "&:hover": { backgroundColor: "rgba(0, 0, 255, 0.1)" } }}
              onClick={() => {
                navigate("/patient/edit/" + row.patient_id);
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
                setSelectedPatient(row);
                setOpenDialog(true);
              }}
            >
              <DeleteIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
    {
      headerName: "DIAGNOSE",
      field: "..",
      width: 150,
      renderCell: ({ row }: GridRenderCellParams<string>) => (
        <Stack direction="row" justifyContent="center">
          <Tooltip title="diagnose" arrow>
            <IconButton
              aria-label="diagnose"
              size="large"
              sx={{ "&:hover": { backgroundColor: "rgba(0, 255, 255, 0.1)" } }}
              onClick={() => {
                if (accessDiagnose) {
                  navigate("/diagnose/" + row.patient_id);
                } else {
                  alert("You don't have access to Diagnose");
                }
              }}
            >
              <ListAltIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  const handleDeleteConfirm = () => {
    dispatch(
      patientActions.deletePatient(String(selectedPatient!.patient_id!))
    );
    setOpenDialog(false);
  };

  const showDialog = () => {
    if (selectedPatient === null) {
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
          {selectedPatient.patient_fname + " " + selectedPatient.patient_lname}
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
          },
        }}
        sx={{ backgroundColor: "white", height: "70vh" }}
        rows={patientReducer.result}
        getRowId={(row) => row.patient_id}
        columns={patientColumns}
        pageSize={10}
        rowsPerPageOptions={[10]}
      />

      {showDialog()}
    </Box>
  );
}
