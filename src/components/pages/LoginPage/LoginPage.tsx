import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, FormikProps } from "formik";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  SxProps,
  TextField,
  Theme,
  Typography,
} from "@mui/material";
import { User } from "../../../types/user.type";
import { useDispatch, useSelector } from "react-redux";
import { RootReducers } from "../../../reducers";
import * as loginActions from "../../../actions/login.action";
import { useAppDispatch } from "../../..";

type LoginPageProps = {};

const LoginPage: React.FC<any> = () => {
  const loginReducer = useSelector((state: RootReducers) => state.loginReducer);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const classes: SxProps<Theme> | any = {
    root: { display: "flex", justifyContent: "center" },
    buttons: { marginTop: 2 },
  };

  const [openModal, setOpenModal] = React.useState(false); // State สำหรับเปิด-ปิด modal

  const handleOpenModal = () => {
    setOpenModal(true); // เปิด modal เมื่อคลิกที่ปุ่ม
  };

  const handleCloseModal = () => {
    setOpenModal(false); // ปิด modal เมื่อคลิกปุ่มปิดหรือส่วนอื่น ๆ ของ modal
  };

  const showFormV2 = ({
    handleSubmit,
    handleChange,
    isSubmitting,
    values,
  }: FormikProps<User>) => {
    return (
      <form onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="user_user"
          label="Username"
          onChange={handleChange}
          value={values.user_user}
          autoComplete="email"
          autoFocus
        />

        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="user_pass"
          label="Password"
          onChange={handleChange}
          value={values.user_pass}
          type="password"
        />
        <br />

        {loginReducer.isError && <Alert severity="error">Login failed</Alert>}

        <Stack direction="row" spacing={2} sx={classes.buttons}>
          <Button
            onClick={handleOpenModal} // เปิด modal เมื่อคลิกปุ่ม "detail"
            type="button"
            fullWidth
            variant="outlined"
          >
            ข้อตกลงการใช้งาน
          </Button>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loginReducer.isFetching}
          >
            Login
          </Button>
        </Stack>
      </form>
    );
  };

  const initialValues: User = {
    user_user: "",
    user_pass: "",
    user_fname: "",
    user_lname: "",
    user_phone: "",
    user_status: 0,
    user_per_id: 0,
  };

  return (
    <>
      <Box sx={classes.root}>
        <div>
          {" "}
          <Typography
            gutterBottom
            variant="h1"
            component="h1"
            style={{ color: "white", marginTop: "120px" }}
          >
            EYE DISEASE <br />
            SYSTEM
            <br />
            <div>
              {" "}
              <Typography
                gutterBottom
                variant="h5"
                component="h5"
                style={{ color: "white", marginTop: "50px" }}
              >
                "Developing Innovations for Eye Health"
              </Typography>
            </div>
          </Typography>
        </div>

        <Card sx={{ maxWidth: 345, marginLeft: 30, marginTop: 20 }}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              Login
            </Typography>
            <Formik
              onSubmit={(values, {}) => {
                dispatch(loginActions.login(values, navigate));
              }}
              initialValues={initialValues}
            >
              {(props) => showFormV2(props)}
            </Formik>
          </CardContent>
        </Card>
      </Box>

      {/* Modal */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>ข้อตกลงการใช้งานระบบ</DialogTitle>
        <DialogContent>
          <Typography>
            ข้อตกลงการใช้งานระบบวินิจฉัยโรคประสาททางตาโดยใช้ปัญญาประดิษฐ์เพื่อการศึกษาและวิจัยสามารถจัดเตรียมได้ตามต่อไปนี้
            เป็นเพียงการจำลองเว็บไซต์ระบบของโรงพยาบาล:
            <br />
            <br />
            1. **การเข้าใช้งานระบบ** <br />-
            ผู้ใช้จะต้องลงทะเบียนและเข้าสู่ระบบด้วยบัญชีผู้ใช้ที่ได้รับการอนุมัติจากผู้ดูแลระบบโดยผู้ดูแลระบบจะเพิ่มผู้ใช้งานที่ยื่นขอเข้ามา.
            <br />
            - การเข้าใช้งานระบบจะต้องใช้ชื่อผู้ใช้และรหัสผ่านที่ถูกต้องเท่านั้น.
            <br />
            <br />
            2. **การเข้าถึงข้อมูล** <br />-
            ผู้ใช้ที่ได้รับสิทธิ์จะสามารถเข้าถึงข้อมูลที่เกี่ยวข้องกับโครงการวิจัยเท่านั้น.
            <br />-
            ข้อมูลที่ถูกเข้าถึงจะต้องมีการควบคุมความเป็นส่วนตัวและเป็นความลับตามกฎหมายที่เกี่ยวข้อง.
            <br />
            <br />
            3. **การใช้งาน AI ในการวินิจฉัย** <br />
            - การใช้ AI
            ในการวินิจฉัยจะใช้เพื่อวิเคราะห์ภาพจอประสาทตาเท่านั้นและไม่ได้ใช้เพื่อวินิจฉัยโรคในบุคคลโดยตรง.
            <br />
            - ผู้ใช้จะได้รับคำแนะนำจากแพทย์เมื่อได้ผลการวินิจฉัยจากระบบ
            ในการวินิจฉัยและผลลัพธ์ที่ได้เป็นเพียงเครื่องมือในการสนับสนุนการวินิจฉัยของแพทย์.
            <br />
            <br />
            4. **การรายงานผล** - ผู้ใช้จะสามารถรับผลการวินิจฉัยจาก AI
            <br />
            ในรูปแบบของรายงานที่สรุปผลการวินิจฉัยและข้อมูลที่เกี่ยวข้อง.
            <br />
            -
            ผู้ใช้สามารถร้องเรียนหรือขอข้อมูลเพิ่มเติมเกี่ยวกับผลการวินิจฉัยได้ที่ผู้ดูแลระบบหรือผู้ดูแลโครงการ.
            <br />
            <br />
            5. **การรักษาความปลอดภัย** <br />-
            ระบบจะมีการเข้ารหัสข้อมูลและมีมาตรการความปลอดภัยที่เหมาะสมเพื่อป้องกันการเข้าถึงข้อมูลโดยไม่ได้รับอนุญาต.
            <br />-
            มีการสำรองข้อมูลและการควบคุมการเข้าถึงข้อมูลเพื่อป้องกันข้อมูลไม่ให้สูญหายหรือถูกทำลาย.
            <br />
            <br />
            6. **การข้อยกเว้นและความรับผิดชอบ** <br />-
            ผู้ใช้ต้องปฏิบัติตามข้อตกลงและเงื่อนไขการใช้งานที่กำหนดไว้.
            <br />
            -
            ผู้ดูแลระบบหรือผู้ดูแลโครงการจะไม่รับผิดชอบต่อความเสียหายหรือการใช้งานที่ไม่ถูกต้องของผู้ใช้.
            <br />
            <br />
            ข้อตกลงการใช้งานนี้จะช่วยให้ระบบมีการใช้งานอย่างถูกต้องและปลอดภัย
            โดยเน้นการใช้งานเพื่อการศึกษาและวิจัยเท่านั้น
            โดยไม่มีวัตถุประสงค์ในการวินิจฉัยโรคหรือให้การรักษาแทนแพทย์ผู้เชี่ยวชาญในสาขาด้านการแพทย์ครับ/ค่ะ.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default LoginPage;
