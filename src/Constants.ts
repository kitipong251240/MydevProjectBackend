// Success Page
export const LOGIN_FETCHING = "LOGIN_FETCHING";
export const LOGIN_FAILED = "LOGIN_FAILED";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGOUT = "LOGOUT";

// Add user Page
export const ADD_USER_FETCHING = "ADD_USER_FETCHING";
export const ADD_USER_SUCCESS = "ADD_USER_SUCCESS";
export const ADD_USER_FAILED = "ADD_USER_FAILED";

// User Page
export const USER_FETCHING = "USER_FETCHING";
export const USER_SUCCESS = "USER_SUCCESS";
export const USER_FAILED = "USER_FAILED";
export const USER_CLEAR = "USER_CLEAR";

// Permission Page
export const PER_FETCHING = "PER_FETCHING";
export const PER_SUCCESS = "PER_SUCCESS";
export const PER_FAILED = "PER_FAILED";
export const PER_CLEAR = "PER_CLEAR";

// Permission Auth Page
export const PER_AUTH_FETCHING = "PER_AUTH_FETCHING";
export const PER_AUTH_SUCCESS = "PER_AUTH_SUCCESS";
export const PER_AUTH_FAILED = "PER_AUTH_FAILED";
export const PER_AUTH_CLEAR = "PER_AUTH_CLEAR";

// Image Page
export const IMG_FETCHING = "IMG_FETCHING";
export const IMG_SUCCESS = "IMG_SUCCESS";
export const IMG_FAILED = "IMG_FAILED";
export const IMG_CLEAR = "IMG_CLEAR";

// Patient Page
export const PATIENT_FETCHING = "PATIENT_FETCHING";
export const PATIENT_SUCCESS = "PATIENT_SUCCESS";
export const PATIENT_FAILED = "PATIENT_FAILED";
export const PATIENT_CLEAR = "PATIENT_CLEAR";

// Patient EDIT Page
export const PATIENT_EDIT_FETCHING = "PATIENT_EDIT_FETCHING";
export const PATIENT_EDIT_SUCCESS = "PATIENT_EDIT_SUCCESS";
export const PATIENT_EDIT_FAILED = "PATIENT_EDIT_FAILED";
export const PATIENT_EDIT_CLEAR = "PATIENT_EDIT_CLEAR";

// Stock Edit Page
export const USER_EDIT_FETCHING = "USER_EDIT_FETCHING";
export const USER_EDIT_SUCCESS = "USER_EDIT_SUCCESS";
export const USER_EDIT_FAILED = "USER_EDIT_FAILED";
export const USER_EDIT_CLEAR = "USER_EDIT_CLEAR";

// Predict system
export const PREDICT_FETCHING = "PREDICT_FETCHING";
export const PREDICT_SUCCESS = "PREDICT_SUCCESS";
export const PREDICT_FAILED = "PREDICT_FAILED";
export const PREDICT_CLEAR = "PREDICT_CLEAR";

// Pervalidate system
export const PER_VALIDATE_FETCHING = "PER_VALIDATE_FETCHING";
export const PER_VALIDATE_SUCCESS = "PER_VALIDATE_SUCCESS";
export const PER_VALIDATE_FAILED = "PER_VALIDATE_FAILED";
export const PER_VALIDATE_CLAER = "PER_VALIDATE_CLAER";

// ByPass system
export const BY_PASS_FETCHING = "By_PASS_FETCHING";
export const BY_PASS_SUCCESS = "By_PASS_SUCCESS";
export const BY_PASS_FAILED = "By_PASS_FAILED";
export const BY_PASS_CLEAR = "By_PASS_CLEAR";

// ByPass system
export const PER_NAME_FETCHING = "PER_NAME_FETCHING";
export const PER_NAME_SUCCESS = "PER_NAME_SUCCESS";
export const PER_NAME_FAILED = "PER_NAME_FAILED";
export const PER_NAME_CLEAR = "PER_NAME_CLEAR";

export const apiUrl = "http://localhost:8000/api/v1";
export const imageUrl = "http://localhost:8000";

export const YES = "YES";
export const NO = "NO";
export const OK = "ok";
export const NOK = "nok";
export const TOKEN = "TOKEN";

export const LOGIN_STATUS = "LOGIN_STATUS";

export const server = {
  LOGIN_URL: `/login`,
  ADD_USER_URL: `/user`,
  USER_URL: `/user`,
  LOGIN_PASSED: `yes`,
  PATIENT_URL: "/patient",
  PER_URL: "/permission",
  PER_URL_ADD: "/permission/add",
  PATIENT_URL_ADD: "/patient/add",
  IMG_URL_ADD: "/image/add",
  PREDICT_M: "/screening",
  IMG_URL: "/image",
  DIAGNOSE: "/image",
  BYPASS: "/bypassuser",
  PERNAME: "/pername",
  PER: "/per",
};

// Error Code
export const E_PICKER_CANCELLED = "E_PICKER_CANCELLED";
export const E_PICKER_CANNOT_RUN_CAMERA_ON_SIMULATOR =
  "E_PICKER_CANNOT_RUN_CAMERA_ON_SIMULATOR";
export const E_PERMISSION_MISSING = "E_PERMISSION_MISSING";
export const E_PICKER_NO_CAMERA_PERMISSION = "E_PICKER_NO_CAMERA_PERMISSION";
export const E_USER_CANCELLED = "E_USER_CANCELLED";
export const E_UNKNOWN = "E_UNKNOWN";
export const E_DEVELOPER_ERROR = "E_DEVELOPER_ERROR";
export const TIMEOUT_NETWORK = "ECONNABORTED"; // request service timeout
export const NOT_CONNECT_NETWORK = "NOT_CONNECT_NETWORK";

//////////////// Localization Begin ////////////////
export const NETWORK_CONNECTION_MESSAGE =
  "Cannot connect to server, Please try again.";
export const NETWORK_TIMEOUT_MESSAGE =
  "A network timeout has occurred, Please try again.";
export const UPLOAD_PHOTO_FAIL_MESSAGE =
  "An error has occurred. The photo was unable to upload.";
