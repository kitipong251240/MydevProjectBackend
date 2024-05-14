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
import { Autocomplete } from "formik-material-ui";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../..";
import { Patient } from "../../../types/patient.type";
import * as patientActions from "./../../../actions/patient.action";
import * as userActions from "./../../../actions/user.action";
import * as perActions from "./../../../actions/per.action";
import * as bypassActions from "./../../../actions/bypass.action";
import { TOKEN } from "../../../Constants";
import { User } from "../../../types/user.type";
import { Per } from "../../../types/per.type";
import { RootReducers } from "../../../reducers";
import { UserPer } from "../../../types/user.per.type";
import userReducer from "../../../reducers/user.reducer";
import bypassReducer from "../../../reducers/bypass.reducer";

type PatientCreatePageProps = {
  //
};

const AddUserPage: React.FC<any> = () => {
  const perReducer = useSelector((state: RootReducers) => state.perReducer);
  const bypassReducer = useSelector(
    (state: RootReducers) => state.bypassReducer
  );
  const dispatch = useAppDispatch();
  const [selectedPatient, setSelectedPatient] = React.useState<Patient | null>(
    null
  );
  React.useEffect(() => {
    dispatch(perActions.loadPer());
  }, []);
  React.useEffect(() => {
    dispatch(bypassActions.ByUser());
  }, []);
  console.log(bypassReducer.result);
  const navigate = useNavigate();
  const token = localStorage.getItem(TOKEN);
  // แยกส่วนของ Token ออกมา
  const tokenParts = token!.split(".");
  const encodedPayload = tokenParts[1];

  // ถอดสตริง base64 เพื่อให้ได้ส่วนของ payload
  const decodedPayload = atob(encodedPayload);

  // แปลง payload เป็น object
  const decodedToken = JSON.parse(decodedPayload);
  const showForm = ({ values, isSubmitting }: FormikProps<UserPer>) => {
    return (
      <Form>
        <Card>
          <CardContent sx={{ padding: 4 }}>
            <Typography gutterBottom variant="h3">
              User Information
            </Typography>
            <Field
              style={{ marginTop: 16 }}
              fullWidth
              component={TextField}
              name="user_user"
              type="text"
              label="Username"
            />
            <br />
            <Field
              style={{ marginTop: 16 }}
              fullWidth
              component={TextField}
              name="user_pass"
              type="password"
              label="Password"
            />
            <br />
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
            <br />
            <label id="per_name">Permission</label>
            <br />
            <Field
              name="per_id"
              component={Select}
              labelId="per_id"
              id="per_id"
              defaultValue="1"
              sx={{ width: 200 }}
            >
              {perReducer.result.map((option) => (
                <MenuItem key={option.per_id} value={option.per_id}>
                  {option.per_name}
                </MenuItem>
              ))}
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
              Create
            </Button>
            <Button component={Link} to="/patient" variant="outlined" fullWidth>
              Cancl
            </Button>
          </CardActions>
        </Card>
      </Form>
    );
  };

  const initialValues: UserPer = {
    user_user: "",
    user_pass: "",
    user_fname: "",
    user_lname: "",
    user_phone: "",
    user_per_id: 0,
    user_status: 1,
    per_id: 1,
    per_name: "",
    access_diagnose: false,
    access_report: false,
    access_manageuser: false,
    access_position: false,
    access_patient: false,
  };

  return (
    <Box>
      <Formik
        validate={(values) => {
          let errors: any = {};

          if (!values.user_user) errors.user_user = "Enter Username";
          else if (values.user_user.length < 4) {
            errors.user_user = "Username must be at least 4 characters";
          } else if (
            bypassReducer.result.some(
              (user: any, index: number) => user[0] === values.user_user
            )
          ) {
            errors.user_user = "Username already exists";
          }
          if (!values.user_pass) errors.user_pass = "Enter Password";
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
            errors.user_phone = "Please enter a valid phone number";
          else if (values.user_phone[10])
            errors.user_phone = "please Enter Just 10 digit";
          return errors;
        }}
        initialValues={initialValues}
        onSubmit={(values, { setSubmitting }) => {
          try {
            const userData = {
              user_user: values.user_user || "",
              user_pass: values.user_pass || "",
              user_fname: values.user_fname || "",
              user_lname: values.user_lname || "",
              user_phone: values.user_phone || "",
              user_status: values.user_status || 1,
              user_per_id: values.per_id,
              per_name: "",
              access_diagnose: false,
              access_report: false,
              access_manageuser: false,
              access_position: false,
              access_patient: false,
            };

            dispatch(userActions.addUser(userData));

            setSubmitting(false);
          } catch (error) {
            console.error("Error submitting form:", error);
            // Make sure to still set submitting to false in case of errors
            setSubmitting(false);
          }
        }}
      >
        {(props: any) => showForm(props)}
      </Formik>
    </Box>
  );
};

export default AddUserPage;
