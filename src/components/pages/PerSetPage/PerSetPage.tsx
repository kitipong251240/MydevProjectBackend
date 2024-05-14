import * as React from "react";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import * as perActions from "../../../actions/per.action";
import { Per } from "../../../types/per.type";
import { RootReducers } from "../../../reducers";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../..";
import { Field } from "formik";

import TextField from "@mui/material/TextField";
import { ChangeEvent } from "react";
import perReducer from "../../../reducers/per.reducer";
import { Alert } from "@mui/material";

function not(a: readonly string[], b: readonly string[]) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a: readonly string[], b: readonly string[]) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a: readonly string[], b: readonly string[]) {
  return [...a, ...not(b, a)];
}

export default function PerSetPage() {
  const userReducer = useSelector((state: RootReducers) => state.userReducer);
  const [error, setError] = React.useState("");
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    dispatch(perActions.loadPer());
  }, []);
  const [checked, setChecked] = React.useState<string[]>([]);
  const [left, setLeft] = React.useState<string[]>([
    "Access_Diagnose",
    "Access_Report",
    "Access_ManageUser",
    "Access_Position",
    "Access_Patient",
  ]);
  const [right, setRight] = React.useState<string[]>([]);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items: readonly string[]) =>
    intersection(checked, items).length;

  const handleToggleAll = (items: readonly string[]) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };
  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };
  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const customList = (title: React.ReactNode, items: readonly string[]) => (
    <Card>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={
              numberOfChecked(items) === items.length && items.length !== 0
            }
            indeterminate={
              numberOfChecked(items) !== items.length &&
              numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{
              "aria-label": "all items selected",
            }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <List
        sx={{
          width: 400,
          height: 300,
          bgcolor: "background.paper",
          overflow: "auto",
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((value: string) => {
          const labelId = `transfer-list-all-item-${value}-label`;
          return (
            <ListItemButton
              key={value}
              role="listitem"
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    "aria-labelledby": labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={value} />
            </ListItemButton>
          );
        })}
      </List>
    </Card>
  );
  const [perName, setPerName] = React.useState<string>("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!perName.trim()) {
      setError("Permission name is required");
      return;
    }
    // Handle form submission logic
    const perData = {
      per_name: perName,
      access_diagnose: right.some((data) => data === "Access_Diagnose"),
      access_report: right.some((data) => data === "Access_Report"),
      access_patient: right.some((data) => data === "Access_Patient"),
      access_manageuser: right.some((data) => data === "Access_ManageUser"),
      access_position: right.some((data) => data === "Access_Position"),
    };

    try {
      // Assuming addPer returns a Promise
      await dispatch(perActions.addPer(perData));
      // Handle success, e.g., redirect or show a success message
    } catch (error) {
      // Handle error, e.g., show an error message
      setError("Error creating permission");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item>{customList("Choices", left)}</Grid>
        <Grid item>
          <Grid container direction="column" alignItems="center">
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleCheckedRight}
              disabled={leftChecked.length === 0}
              aria-label="move selected right"
            >
              &gt;
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleCheckedLeft}
              disabled={rightChecked.length === 0}
              aria-label="move selected left"
            >
              &lt;
            </Button>
            {error && <Alert severity="error">{error}</Alert>}
          </Grid>
        </Grid>
        <Grid item>{customList("Chosen", right)}</Grid>
      </Grid>
      <br />
      <TextField
        fullWidth
        variant="standard"
        label="Enter Permission Name"
        value={perName}
        onChange={(e) => setPerName(e.target.value)}
        error={!!error} // กำหนดให้ error prop เป็น true ถ้ามีข้อความ error
        helperText={error} // แสดงข้อความ error บน TextField
      />
      <br />
      <br />
      <br />
      <Button
        fullWidth
        variant="contained"
        color="primary"
        type="submit"
        sx={{ marginRight: 1 }}
      >
        Create
      </Button>
    </form>
  );
}
