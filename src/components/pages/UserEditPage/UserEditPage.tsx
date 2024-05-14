import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { FormikProps, Form, Field, Formik } from "formik";
import { Select, TextField } from "formik-material-ui";
import * as React from "react";
import { Link, useMatch, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../..";
import { Patient } from "../../../types/patient.type";
import * as userEditActions from "./../../../actions/user.edit.action";
import * as perActions from "./../../../actions/per.action";
import { TOKEN } from "../../../Constants";
import { RootReducers } from "../../../reducers";
import { UserPer } from "../../../types/user.per.type";
import { useSelector } from "react-redux";
import * as bypassActions from "./../../../actions/bypass.action";
import { Bypass } from "../../../types/bypass.type";
import userReducer from "../../../reducers/user.reducer";
type ProfilePageProps = {
  //
};

const ProfilePage: React.FC<any> = () => {
  const dispatch = useAppDispatch();
  const userEditReducer = useSelector(
    (state: RootReducers) => state.userEditReducer
  );
  const [filteredResults, setFilteredResults] = React.useState<Bypass[]>([]);
  const perReducer = useSelector((state: RootReducers) => state.perReducer);
  const bypassReducer = useSelector(
    (state: RootReducers) => state.bypassReducer
  );
  const match = useMatch("/user/edit/:id");
  React.useEffect(() => {
    let id = match?.params.id;
    dispatch(userEditActions.getUserById(id));
    dispatch(perActions.loadPer()); // เรียกใช้ perActions.loadPer() หลังจาก userEditActions.getUserById(id) เสร็จสิ้น
  }, [match]);

  // เรียกใช้ perActions.loadPer() หลังจาก userEditActions.getUserById(id) เสร็จสิ้น

  const [first, setfirst] = React.useState(2);
  const userPerId = userEditReducer.result?.user_per_id;
  React.useEffect(() => {
    dispatch(bypassActions.ByUser());
  }, []);

  React.useEffect(() => {
    // ตรวจสอบว่า pernameReducer.result ไม่เป็น null หรือ undefined
    if (bypassReducer.result) {
      // Flatten ข้อมูลใน pernameReducer.result
      const flattenedResults = bypassReducer.result.flat();

      // กรองออกเฉพาะข้อมูลที่ไม่เหมือนกับ perReducer.result[0]?.per_name
      const newFilteredResults = flattenedResults.filter(
        (user: any) => user !== userEditReducer.result?.user_user
      );

      // ตั้งค่า filteredResults เป็นผลลัพธ์หลังจากกรอง
      setFilteredResults(newFilteredResults);

      // แสดงผลลัพธ์ในคอนโซล
      console.log(newFilteredResults);
      console.log(userEditReducer.result?.user_user);
    }
  }, [bypassReducer.result]); // dependency เป็น pernameReducer.result
  React.useEffect(() => {
    if (userPerId) {
      setfirst(userPerId);
    }
  }, [userPerId]);

  const showForm = ({ values, isSubmitting }: FormikProps<UserPer>) => {
    return (
      <Form>
        <Card>
          <CardContent sx={{ padding: 4 }}>
            <Typography gutterBottom variant="h3">
              User Setting
            </Typography>

            <Field
              style={{ marginTop: 16 }}
              fullWidth
              component={TextField}
              name="user_user"
              type="text"
              label="Username"
            />
            <Field
              style={{ marginTop: 16 }}
              fullWidth
              component={TextField}
              name="user_pass"
              type="text"
              label="New-password"
            />
            <Field
              style={{ marginTop: 16 }}
              fullWidth
              component={TextField}
              name="user_fname"
              type="text"
              label="First Name"
            />
            <br />
            <Field
              style={{ marginTop: 16 }}
              fullWidth
              component={TextField}
              name="user_lname"
              type="text"
              label="Last Name"
            />
            <br />
            <Field
              style={{ marginTop: 16 }}
              fullWidth
              component={TextField}
              name="user_phone"
              type="text"
              label="Phone"
            />
            <br />
            <label id="per_name">Permission</label>
            <br />
            <Field
              name="user_per_id"
              component={Select}
              labelId="user_per_id"
              defaultValue={userEditReducer.result?.user_per_id}
              id="user_per_id"
              sx={{ width: 200 }}
            >
              {perReducer.result?.map((option) => (
                <MenuItem key={option?.per_id} value={option?.per_id}>
                  {option?.per_name}
                </MenuItem>
              ))}
            </Field>

            <br />
            <br />
            <label id="user_status">STATUS</label>
            <br />
            <Field
              name="user_status"
              component={Select}
              labelId="user_status"
              defaultValue={userEditReducer.result?.user_status} // ใช้ user_status แทน user_per_id
              id="user_status"
              sx={{ width: 200 }}
            >
              <MenuItem value={0}>Inactive</MenuItem>
              <MenuItem value={1}>Active</MenuItem>
            </Field>
          </CardContent>
          <CardActions>
            <Button
              disabled={isSubmitting}
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              sx={{ marginRight: 1 }}
            >
              Update
            </Button>
            <Button component={Link} to="/user" variant="outlined" fullWidth>
              Cancel
            </Button>
          </CardActions>
        </Card>
      </Form>
    );
  };
  const initialValues: UserPer = {
    user_id: 1,
    user_pass: "",
    user_user: "",
    user_fname: "",
    user_lname: "",
    user_phone: "",
    user_status: 0,
    user_per_id: userEditReducer.result?.user_per_id,
    per_id: 1,
    per_name: "",
    access_diagnose: false,
    access_report: false,
    access_manageuser: false,
    access_position: false,
    access_patient: false,
  };
  const initialFormValues =
    userEditReducer.result !== null
      ? { ...userEditReducer.result, user_pass: "" }
      : initialValues;

  return (
    <Box>
      <Formik
        enableReinitialize
        initialValues={initialFormValues}
        validate={(values) => {
          let errors: any = {};
          if (!values.user_user) errors.user_user = "Enter Username";
          else if (values.user_user.length < 4) {
            errors.user_user = "Username must be at least 4 characters";
          } else if (
            filteredResults
              .flat()
              .some((user: any) => user === values.user_user)
          ) {
            errors.user_user = "Username already exists";
          }
          if (!values.user_fname) errors.user_fname = "Enter FirstName";
          if (!values.user_lname) errors.user_lname = "Enter LastName";
          if (!values.user_phone) errors.user_phone = "Enter Your Number";
          if (values.user_phone[0] !== "0")
            errors.user_phone = "Enter 0 on first digit";
          else if (
            isNaN(
              Number(values.user_phone[1]) &&
                Number(values.user_phone[2]) &&
                Number(values.user_phone[3]) &&
                Number(values.user_phone[4]) &&
                Number(values.user_phone[5]) &&
                Number(values.user_phone[6]) &&
                Number(values.user_phone[7]) &&
                Number(values.user_phone[8]) &&
                Number(values.user_phone[9])
            )
          )
            errors.user_phone = "please Enter number or 10 digit";
          else if (values.user_phone[10])
            errors.user_phone = "please Enter Just 10 digit";

          return errors;
        }}
        onSubmit={async (values, { setSubmitting }) => {
          let formData = new FormData();
          let id = match?.params.id;
          formData.append("user_id", String(id));
          formData.append("user_user", String(values.user_user));
          formData.append("user_fname", String(values.user_fname));
          formData.append("user_lname", String(values.user_lname));
          formData.append("user_phone", String(values.user_phone));
          formData.append("user_status", String(values.user_status));
          formData.append("user_per_id", String(values.user_per_id));

          if (values.user_pass) {
            formData.append("user_pass", String(values.user_pass));
          } else {
            formData.append("user_pass", String(""));
          }
          dispatch(userEditActions.updateUser(formData));
          setSubmitting(false);
        }}
      >
        {(props: any) => userEditReducer.result && showForm(props)}
      </Formik>
    </Box>
  );
};

export default ProfilePage;
