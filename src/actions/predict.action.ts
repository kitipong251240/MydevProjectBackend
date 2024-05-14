import {
  server,
  PATIENT_CLEAR,
  PATIENT_FAILED,
  PATIENT_FETCHING,
  PATIENT_SUCCESS,
  TOKEN,
} from "../Constants";
import { Patient } from "../types/patient.type";
import { httpClient } from "../utils/httpclient";

export const setPatientFetchingToState = () => ({
  type: PATIENT_FETCHING,
});

export const setPatientSuccessToState = (payload: Patient) => ({
  type: PATIENT_SUCCESS,
  payload,
});

export const setPatientFailedToState = () => ({
  type: PATIENT_FAILED,
});
const token = localStorage.getItem(TOKEN);
export const getPatientById = (id: any) => {
  return async (dispatch: any) => {
    try {
      dispatch(setPatientFetchingToState());
      let result = await httpClient.get<Patient>(
        `${server.PATIENT_URL}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(setPatientSuccessToState(result.data));
    } catch (error) {
      alert(JSON.stringify(error));
      dispatch(setPatientFailedToState());
    }
  };
};
