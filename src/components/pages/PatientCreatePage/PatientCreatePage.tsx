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
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../..";
import { Patient } from "../../../types/patient.type";
import * as patientActions from "./../../../actions/patient.action";
import { TOKEN } from "../../../Constants";

type PatientCreatePageProps = {
  //
};

const PatientCreatePage: React.FC<any> = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem(TOKEN);
  // แยกส่วนของ Token ออกมา
  const tokenParts = token!.split(".");
  const encodedPayload = tokenParts[1];

  // ถอดสตริง base64 เพื่อให้ได้ส่วนของ payload
  const decodedPayload = atob(encodedPayload);

  // แปลง payload เป็น object
  const decodedToken = JSON.parse(decodedPayload);
  const showForm = ({ values, isSubmitting }: FormikProps<Patient>) => {
    return (
      <Form>
        <Card>
          <CardContent sx={{ padding: 4 }}>
            <Typography gutterBottom variant="h3">
              Patient Information
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
            <label id="patient_sex">Gender</label>
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
        initialValues={initialValues}
        onSubmit={(values, { setSubmitting }) => {
          // alert(JSON.stringify(values));
          const patientData = {
            patient_fname: values.patient_fname,
            patient_lname: values.patient_lname,
            patient_phone: values.patient_phone,
            patient_bdate: values.patient_bdate,
            patient_sex: values.patient_sex,
            patient_status: values.patient_status,

            patient_recent_id: values.patient_recent_id,
          };

          dispatch(patientActions.addPatient(patientData));
          setSubmitting(false);
        }}
      >
        {(props: any) => showForm(props)}
      </Formik>
    </Box>
  );
};

export default PatientCreatePage;
