import { combineReducers } from "redux";
import loginReducer, { LoginState } from "./login.reducer";
import userReducer, { UserState } from "./user.reducer";
import userEditReducer, { UserEditState } from "./user.edit.reducer";
import patientReducer, { PatientState } from "./patient.reducer";
import patientEditReducer, { PatientEditState } from "./patient.edit.reducer";
import predictReducer, { PredictState } from "./predict.reducer";
import imgReducer, { ImagePatientState } from "./img.reducer";
import perReducer, { PermissionState } from "./per.reducer";
import perAuthReducer, { PermissionAuthState } from "./per.auth.reducer";
import preMReducer, { PreState } from "./preM.reducer";
import bypassReducer, { BypassState } from "./bypass.reducer";
import pernameReducer, { PernameState } from "./per.name.reducer";
import userpervalidateReducer, {
  UserPerValidateState,
} from "./user.per.validate.reducer";
export default combineReducers({
  loginReducer,
  userReducer,
  patientReducer,
  predictReducer,
  patientEditReducer,
  imgReducer,
  userEditReducer,
  perReducer,
  perAuthReducer,
  preMReducer,
  bypassReducer,
  userpervalidateReducer,
  pernameReducer,
});

export interface RootReducers {
  loginReducer: LoginState;
  userReducer: UserState;
  patientReducer: PatientState;
  predictReducer: PredictState;
  patientEditReducer: PatientEditState;
  imgReducer: ImagePatientState;
  userEditReducer: UserEditState;
  perReducer: PermissionState;
  perAuthReducer: PermissionAuthState;
  preMReducer: PreState;
  bypassReducer: BypassState;
  userpervalidateReducer: UserPerValidateState;
  pernameReducer: PernameState;
}
