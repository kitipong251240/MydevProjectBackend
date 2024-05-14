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
import { Link, useMatch, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../..";
import { Patient } from "../../../types/patient.type";
import * as patientActions from "./../../../actions/patient.action";
import * as patientEditActions from "./../../../actions/patient.edit.action";
import * as userEditActions from "./../../../actions/user.edit.action";
import { TOKEN } from "../../../Constants";
import { RootReducers } from "../../../reducers";
import userEditReducer from "../../../reducers/user.edit.reducer";
import { User } from "../../../types/user.type";
import * as bypassActions from "./../../../actions/bypass.action";
import { Bypass } from "../../../types/bypass.type";
type ProfilePageProps = {
  //
};

const ProfilePage: React.FC<any> = () => {
  const dispatch = useAppDispatch();
  const userEditReducer = useSelector(
    (state: RootReducers) => state.userEditReducer
  );
  const bypassReducer = useSelector(
    (state: RootReducers) => state.bypassReducer
  );
  const [filteredResults, setFilteredResults] = React.useState<Bypass[]>([]);
  const token = localStorage.getItem(TOKEN);
  // แยกส่วนของ Token ออกมา
  const tokenParts = token!.split(".");
  const encodedPayload = tokenParts[1];

  // ถอดสตริง base64 เพื่อให้ได้ส่วนของ payload
  const decodedPayload = atob(encodedPayload);
  const decodedToken = JSON.parse(decodedPayload);
  React.useEffect(() => {
    dispatch(bypassActions.ByUser());
    const filteredResults = bypassReducer.result.filter(
      (user: any) => !user[0].includes(decodedToken.sub)
    );

    setFilteredResults(filteredResults);
    // Do something with filteredResults if needed
    console.log(filteredResults);
  }, []);
  console.log(bypassReducer.result);
  console.log(decodedToken.sub);

  const match = useMatch("/user/pro/:id");
  React.useEffect(() => {
    let id = match?.params.id;
    dispatch(userEditActions.getUserById(id));
  }, []);
  const navigate = useNavigate();

  const showForm = ({ values, isSubmitting }: FormikProps<User>) => {
    return (
      <Form>
        <Card>
          <CardContent sx={{ padding: 4 }}>
            <Typography gutterBottom variant="h3">
              User Setting
            </Typography>

            {userEditReducer.result && (
              <Field
                style={{ marginTop: 16 }}
                fullWidth
                component={TextField}
                name="user_user"
                type="text"
                label="Username"
                disabled={userEditReducer.result.user_user === "admin"}
              />
            )}
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
            <Button component={Link} to="/patient" variant="outlined" fullWidth>
              Cancel
            </Button>
          </CardActions>
        </Card>
      </Form>
    );
  };
  const initialValues: User = {
    user_id: 0,
    user_pass: "",
    user_user: "",
    user_fname: "",
    user_lname: "",
    user_phone: "",
    user_status: 0,
    user_per_id: 0,
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
            filteredResults.some(
              (user: any, index: number) => user[0] === values.user_user
            )
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
        {(props: any) => showForm(props)}
      </Formik>
    </Box>
  );
};

export default ProfilePage;
