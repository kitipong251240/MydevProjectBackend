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
import { TOKEN } from "../../../Constants";
import { RootReducers } from "../../../reducers";
import patientEditReducer from "../../../reducers/patient.edit.reducer";

type PatientEditPageProps = {
  //
};

const PatientEditPage: React.FC<any> = () => {
  const dispatch = useAppDispatch();
  const patientEditReducer = useSelector(
    (state: RootReducers) => state.patientEditReducer
  );

  const match = useMatch("/patient/edit/:id");
  React.useEffect(() => {
    let id = match?.params.id;
    dispatch(patientEditActions.getPatientById(id));
  }, []);
  const navigate = useNavigate();

  const token = localStorage.getItem(TOKEN);
  // แยกส่วนของ Token ออกมา
  const tokenParts = token!.split(".");
  const encodedPayload = tokenParts[1];

  // ถอดสตริง base64 เพื่อให้ได้ส่วนของ payload
  const decodedPayload = atob(encodedPayload);
  const decodedToken = JSON.parse(decodedPayload);

  const showForm = ({ values, isSubmitting }: FormikProps<Patient>) => {
    return (
      <Form>
        <Card>
          <CardContent sx={{ padding: 4 }}>
            <Typography gutterBottom variant="h3">
              Patient Information(Edit)
            </Typography>

            <Field
              style={{ marginTop: 16 }}
              fullWidth
              component={TextField}
              name="patient_fname"
              type="text"
              label="First Name"
            />
            <br />
            <Field
              style={{ marginTop: 16 }}
              fullWidth
              component={TextField}
              name="patient_lname"
              type="text"
              label="Last Name"
            />
            <br />
            <Field
              style={{ marginTop: 16 }}
              fullWidth
              component={TextField}
              name="patient_phone"
              type="text"
              label="Phone"
            />
            <br />
            <br />
            <label htmlFor="patient_bdate">Birth day </label>
            <Field
              style={{ marginTop: 16 }}
              fullWidth
              component={TextField}
              name="patient_bdate"
              type="date"
            />
            <br />
            <br />
            <label id="patient_sex">Sex</label>
            <br />
            <Field
              name="patient_sex"
              component={Select}
              labelId="patient_sex"
              id="patient_sex"
              defaultValue="Male"
              sx={{ width: 200 }}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
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
  const initialValues: Patient = {
    patient_fname: "",
    patient_lname: "",
    patient_phone: "",
    patient_bdate: new Date(),
    patient_sex: "",
    patient_status: 0,
    patient_recent_id: decodedToken.id,
  };
  return (
    <Box>
      <Formik
        enableReinitialize
        initialValues={
          patientEditReducer.result ? patientEditReducer.result : initialValues
        }
        validate={(values) => {
          let errors: any = {};
          if (!values.patient_fname) errors.patient_fname = "Enter FirstName";
          if (!values.patient_lname) errors.patient_lname = "Enter LastName";
          if (!values.patient_phone) errors.patient_phone = "Enter Your Number";
          if (values.patient_phone[0] !== "0")
            errors.patient_phone = "Enter 0 on first digit";
          else if (
            isNaN(
              Number(values.patient_phone[1]) &&
                Number(values.patient_phone[2]) &&
                Number(values.patient_phone[3]) &&
                Number(values.patient_phone[4]) &&
                Number(values.patient_phone[5]) &&
                Number(values.patient_phone[6]) &&
                Number(values.patient_phone[7]) &&
                Number(values.patient_phone[8]) &&
                Number(values.patient_phone[9])
            )
          )
            errors.patient_phone = "please Enter number or 10 digit";
          else if (values.patient_phone[10])
            errors.patient_phone = "please Enter Just 10 digit";
          if (!values.patient_sex) errors.patient_sex = "Select Your Gender";
          if (values.patient_bdate === initialValues.patient_bdate)
            errors.patient_bdate = "Select Your Birth date";
          return errors;
        }}
        onSubmit={async (values, { setSubmitting }) => {
          let formData = new FormData();
          let id = match?.params.id;
          formData.append("patient_id", String(id));
          formData.append("patient_fname", String(values.patient_fname));
          formData.append("patient_lname", String(values.patient_lname));
          formData.append("patient_sex", String(values.patient_sex));
          if (values.patient_bdate !== undefined) {
            formData.append("patient_bdate", values.patient_bdate.toString());
          }
          formData.append("patient_phone", String(values.patient_phone));
          formData.append(
            "patient_recent_id",
            String(values.patient_recent_id)
          );

          formData.append("patient_status", String(values.patient_status));

          dispatch(patientEditActions.updatePatient(formData));
          setSubmitting(false);
        }}
      >
        {(props: any) => showForm(props)}
      </Formik>
    </Box>
  );
};

export default PatientEditPage;
