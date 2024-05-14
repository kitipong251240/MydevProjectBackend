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
import * as preMActions from "./../../../actions/preM.action";
import * as userActions from "./../../../actions/user.action";
import * as patientEditActions from "./../../../actions/patient.edit.action";
import * as imgActions from "./../../../actions/img.action";
import { TOKEN } from "../../../Constants";
import { RootReducers } from "../../../reducers";
import { useDebounce } from "@react-hook/debounce";
import predictReducer from "../../../reducers/predict.reducer";
import { User } from "../../../types/user.type";
import userReducer from "../../../reducers/user.reducer";
import { wait } from "@testing-library/user-event/dist/utils";
import { Img } from "../../../types/img.type";
import patientEditReducer from "../../../reducers/patient.edit.reducer";
import { ImgPatient } from "../../../types/img.patient.type";
import preMReducer from "../../../reducers/preM.reducer";
import { Console } from "console";
import { Pre } from "../../../types/preM.type";
import axios from "axios";
type PredictPageProps = {
  //
};

const PredictPage: React.FC<any> = () => {
  const patientReducer = useSelector(
    (state: RootReducers) => state.patientReducer
  );
  const preReducer = useSelector(
    (state: RootReducers) => state.preMReducer.result
  );
  const dispatch = useAppDispatch();
  const [patientData, setPatientData] = React.useState<Patient | null>(null);
  const [preData, setpreData] = React.useState<Pre | null>(null);
  const navigate = useNavigate();
  const [userData, setUserData] = React.useState<User | null>(null);
  const userReducer = useSelector((state: RootReducers) => state.userReducer);
  const imgReducer = useSelector((state: RootReducers) => state.imgReducer);
  const patientEditReducer = useSelector(
    (state: RootReducers) => state.patientEditReducer
  );

  const match = useMatch("/patient/:id");
  React.useEffect(() => {
    const fetchData = async () => {
      let id = match?.params.id;
      await dispatch(patientActions.getPatientById(id));
    };
    fetchData();
  }, []);
  const initialValues: ImgPatient = {
    patient_fname: patientData?.patient_fname || "",
    patient_lname: patientData?.patient_lname || "",
    patient_phone: patientData?.patient_phone || "",
    patient_bdate: patientData?.patient_bdate || new Date(),
    patient_sex: patientData?.patient_sex || "",
    patient_status: patientData?.patient_status || 0,
    patient_recent_id: patientData?.patient_recent_id || 0,
    img_id: 0,
    img_disease: "cataract",
    img_percent: 0,
    img_patient_id: patientData?.patient_id || 0,
    img_symptom: "",
    img_user_id: 0,
  };
  React.useEffect(() => {
    console.log("preReducer has changed:", preReducer);
  }, [preReducer]);
  React.useEffect(() => {
    const fetchData = async () => {
      if (patientReducer.result.length > 0) {
        let idU = patientReducer.result[0].patient_recent_id.toString();
        await dispatch(userActions.getUserById(idU));
      }
    };
    fetchData();
  }, [patientReducer.result]); // อัพเดทเมื่อ patientReducer.result เปลี่ยน

  React.useEffect(() => {
    const fetchData = async () => {
      if (patientReducer.result.length > 0) {
        await setPatientData(patientReducer.result[0]);
      }
      if (userReducer.result.length > 0) {
        await setUserData(userReducer.result[0]);
      }
    };
    fetchData();
  }, [patientReducer.result, userReducer.result]); // อัพเดทเมื่อ patientReducer.result หรือ userReducer.result เปลี่ยน

  const initialValuesUser: User = {
    user_fname: userData?.user_fname || "",
    user_lname: userData?.user_lname || "",
    user_user: "",
    user_pass: "",
    user_phone: "",
    user_status: 0,
    user_per_id: 0,
  };

  const token = localStorage.getItem(TOKEN);
  // แยกส่วนของ Token
  const tokenParts = token!.split(".");
  const encodedPayload = tokenParts[1];

  // ถอดสตริง base64 เพื่อให้ได้ส่วนของ payload
  const decodedPayload = atob(encodedPayload);

  // แปลง payload เป็น object
  const decodedToken = JSON.parse(decodedPayload);

  const showPreviewImage = (values: any) => {
    if (values.file_obj) {
      return (
        <img
          src={values.file_obj}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            textAlign: "center",
          }}
        />
      );
    }
  };
  const showForm = ({
    values,
    setFieldValue,
    isSubmitting,
  }: FormikProps<ImgPatient>) => {
    return (
      <Form>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Card sx={{ width: "50%", margin: "5px" }}>
            <CardContent sx={{ padding: 4 }}>
              <Typography gutterBottom variant="h3">
                Patient Information
              </Typography>

              <Typography variant="h6" gutterBottom>
                First Name:{" "}
                <span style={{ fontWeight: "normal" }}>
                  {initialValues.patient_fname}
                </span>
              </Typography>
              <br />
              <Typography variant="h6" gutterBottom>
                Last Name:{" "}
                <span style={{ fontWeight: "normal" }}>
                  {initialValues.patient_lname}
                </span>
              </Typography>
              <br />
              <Typography variant="h6" gutterBottom>
                Phone:{" "}
                <span style={{ fontWeight: "normal" }}>
                  {initialValues.patient_phone}
                </span>
              </Typography>
              <br />
              <Typography variant="h6" gutterBottom>
                Birth Day:{" "}
                <span style={{ fontWeight: "normal" }}>
                  {initialValues.patient_bdate
                    ? initialValues.patient_bdate.toString()
                    : ""}
                </span>
              </Typography>
              <br />
              <Typography variant="h6" gutterBottom>
                Sex:{" "}
                <span style={{ fontWeight: "normal" }}>
                  {initialValues.patient_sex}
                </span>
              </Typography>
              <br />
              <Typography variant="h6" gutterBottom>
                Recent User:{" "}
                <span style={{ fontWeight: "normal" }}>
                  {initialValuesUser.user_fname +
                    " " +
                    initialValuesUser.user_lname}
                </span>
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ width: "50%", textAlign: "center", margin: "5px" }}>
            <CardContent sx={{ padding: 4 }}>
              <div style={{ margin: 16 }}>
                <div
                  style={{
                    width: 400,
                    height: 400,
                    border: "2px solid #000", // เปลี่ยนสีเทาด้วยครับหรือสีที่คุณต้องการ
                    borderRadius: 10, // ใส่ Border radius ให้กับกรอบรูป
                    objectFit: "cover",
                    display: "block", // ทำให้ Element เป็น block element
                    margin: "auto", // ย้าย Element ไปตรงกลาง
                  }}
                >
                  {/* เรียกใช้งานฟังก์ชัน showPreviewImage เพื่อแสดงรูป */}
                  {showPreviewImage(values)}
                </div>
              </div>
              <img
                src={`${process.env.PUBLIC_URL}/images/ic_photo.png`}
                style={{ width: 25, height: 20 }}
              />
              <span style={{ color: "#00B0CD", marginLeft: 10 }}>
                Add Picture
              </span>
              <input
                type="file"
                onChange={(e: React.ChangeEvent<any>) => {
                  e.preventDefault();
                  setFieldValue("file", e.target.files[0]); // for upload
                  setFieldValue(
                    "file_obj",
                    URL.createObjectURL(e.target.files[0])
                  ); // for preview image
                }}
                name="image"
                click-type="type1"
                multiple
                accept="image/*"
                id="files"
                style={{ padding: "20px 0 0 20px" }}
              />
            </CardContent>
          </Card>
          <Card sx={{ width: "50%", margin: "5px" }}>
            <CardContent sx={{ padding: 4 }}>
              <Typography gutterBottom variant="h3">
                Predict Detail
              </Typography>
              <br />
              <Typography variant="h6" gutterBottom>
                ระบุอาการร่วม:{" "}
                <span style={{ fontWeight: "normal" }}>
                  <Field
                    style={{ marginTop: 16 }}
                    fullWidth
                    component={TextField}
                    name="img_symptom"
                    type="text"
                    multiline
                    rows={4} // กำหนดจำนวนบรรทัดที่แสดงอย่างน้อย
                  />
                </span>
              </Typography>
              <br /> <br /> <br /> <br />
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
                <Button
                  component={Link}
                  to="/patient"
                  variant="outlined"
                  fullWidth
                >
                  Cancel
                </Button>
              </CardActions>
            </CardContent>
          </Card>
        </Box>
      </Form>
    );
  };

  return (
    <Box>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            let id = match?.params.id;
            let formData = new FormData();
            formData.append("patient_id", String(id));

            formData.append(
              "patient_fname",
              String(initialValues.patient_fname)
            );
            formData.append(
              "patient_lname",
              String(initialValues.patient_lname)
            );
            formData.append("patient_sex", String(initialValues.patient_sex));
            if (initialValues.patient_bdate !== undefined) {
              formData.append(
                "patient_bdate",
                initialValues.patient_bdate.toString()
              );
            }
            formData.append(
              "patient_phone",
              String(initialValues.patient_phone)
            );
            formData.append(
              "patient_recent_id",
              String(initialValues.patient_recent_id)
            );

            formData.append("patient_status", String("1"));

            // แก้ชื่อตัวแปร formDataIMG เป็น formData
            let formDataIMG = new FormData();

            formDataIMG.append("image", values.file);
            formDataIMG.append("img_disease", values.img_disease);
            formDataIMG.append("img_percent", String(values.img_percent));
            formDataIMG.append("img_patient_id", String(values.img_patient_id));
            formDataIMG.append("img_symptom", values.img_symptom);
            formDataIMG.append("img_user_id", String(decodedToken.id));

            // ใช้ dispatch และ setSubmitting อย่างถูกต้อง
            try {
              const response = await axios.post(
                "http://localhost:8000/api/v1/screening",
                formDataIMG,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                }
              );

              const responseData = response.data;
              if (responseData.result === 1) {
                await dispatch(imgActions.addImage(formDataIMG));
                await dispatch(patientEditActions.updatePatient(formData));
              } else {
                alert("is not Retina Image");
              }
            } catch (error) {
              console.error("Error predicting image:", error);
            }
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
export default PredictPage;
