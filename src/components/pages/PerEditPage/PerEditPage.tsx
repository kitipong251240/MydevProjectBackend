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
import * as pernameActions from "./../../../actions/per.name.action";
import TextField from "@mui/material/TextField";
import { ChangeEvent } from "react";
import { useMatch } from "react-router-dom";
import { Pername } from "../../../types/per.name.type";
import perReducer from "../../../reducers/per.reducer";

function not(a: readonly string[], b: readonly string[]) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a: readonly string[], b: readonly string[]) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a: readonly string[], b: readonly string[]) {
  return [...a, ...not(b, a)];
}

export default function PerEditPage() {
  const perReducer = useSelector((state: RootReducers) => state.perReducer);
  const [error, setError] = React.useState("");
  const dispatch = useAppDispatch();
  const [filteredResults, setFilteredResults] = React.useState<Pername[]>([]);
  const pernameReducer = useSelector(
    (state: RootReducers) => state.pernameReducer
  );
  const match = useMatch("/per/edit/:id");
  React.useEffect(() => {
    let id = match?.params.id;
    dispatch(perActions.getPerById(id));
    dispatch(pernameActions.BypassPerName());
  }, []);
  React.useEffect(() => {
    // ตรวจสอบว่า pernameReducer.result ไม่เป็น null หรือ undefined
    if (pernameReducer.result) {
      // Flatten ข้อมูลใน pernameReducer.result
      const flattenedResults = pernameReducer.result.flat();

      // กรองออกเฉพาะข้อมูลที่ไม่เหมือนกับ perReducer.result[0]?.per_name
      const newFilteredResults = flattenedResults.filter(
        (per: any) => per !== perReducer.result[0]?.per_name
      );

      // ตั้งค่า filteredResults เป็นผลลัพธ์หลังจากกรอง
      setFilteredResults(newFilteredResults);

      // แสดงผลลัพธ์ในคอนโซล
      // console.log(newFilteredResults);
    }
  }, [pernameReducer.result]); // dependency เป็น pernameReducer.result

  // console.log(perReducer.result[0]?.per_name);
  // console.log(pernameReducer.result.flat()[0]);

  React.useEffect(() => {
    // เมื่อค่า perReducer.result มีการเปลี่ยนแปลง
    if (perReducer.result && perReducer.result.length > 0) {
      // ดึงค่าจาก perReducer.result[0] เพื่อใช้ในการกำหนดค่า left และ right
      const {
        access_patient,
        access_manageuser,
        access_position,
        access_report,
        access_diagnose,
      } = perReducer.result[0];
      // กำหนดค่า left และ right ตามค่าที่ได้รับ
      setLeft([
        ...(access_patient ? [] : ["Access_Patient"]),
        ...(access_manageuser ? [] : ["Access_ManageUser"]),
        ...(access_position ? [] : ["Access_Position"]),
        ...(access_report ? [] : ["Access_Report"]),
        ...(access_diagnose ? [] : ["Access_Diagnose"]),
      ]);
      setRight([
        ...(access_patient ? ["Access_Patient"] : []),
        ...(access_manageuser ? ["Access_ManageUser"] : []),
        ...(access_position ? ["Access_Position"] : []),
        ...(access_report ? ["Access_Report"] : []),
        ...(access_diagnose ? ["Access_Diagnose"] : []),
      ]);
    }
  }, [perReducer.result]);

  const [checked, setChecked] = React.useState<string[]>([]);
  const [left, setLeft] = React.useState<string[]>([]);
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

  React.useEffect(() => {
    if (perReducer.result && perReducer.result.length > 0) {
      setPerName(perReducer.result[0].per_name);
    }
  }, [perReducer.result]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!perName.trim()) {
      setError("Permission name is required");
      return;
    }
    if (filteredResults.flat().some((per: any) => per === perName)) {
      setError("Permission name already exists");
      return;
    }
    console.log(filteredResults.flat());
    console.log(perName);
    let id = match?.params.id;
    const perData = {
      per_id: id,
      per_name: perName,
      access_diagnose: right.some((data) => data === "Access_Diagnose"),
      access_report: right.some((data) => data === "Access_Report"),
      access_patient: right.some((data) => data === "Access_Patient"),
      access_manageuser: right.some((data) => data === "Access_ManageUser"),
      access_position: right.some((data) => data === "Access_Position"),
    };

    dispatch(perActions.updatePer(perData));
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
        error={!!error}
        helperText={error}
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
