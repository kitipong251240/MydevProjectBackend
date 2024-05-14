import {
  server,
  PATIENT_EDIT_FAILED,
  PATIENT_EDIT_FETCHING,
  PATIENT_EDIT_SUCCESS,
  TOKEN,
} from "../Constants";

import { httpClient } from "../utils/httpclient";
import { history } from "..";
import { Patient } from "../types/patient.type";
const token = localStorage.getItem(TOKEN);
export const setPatientEditFetchingToState = () => ({
  type: PATIENT_EDIT_FETCHING,
});

export const setPatientEditSuccessToState = (payload: Patient) => ({
  type: PATIENT_EDIT_SUCCESS,
  payload,
});

export const setPatientEditFailedToState = () => ({
  type: PATIENT_EDIT_FAILED,
});

export const updatePatient = (formData: FormData) => {
  return async (dispatch: any) => {
    await httpClient.put(server.PATIENT_URL, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    history.back();
  };
};

export const getPatientById = (id: any) => {
  return async (dispatch: any) => {
    try {
      dispatch(setPatientEditFetchingToState());
      let result = await httpClient.get<Patient>(
        `${server.PATIENT_URL}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(setPatientEditSuccessToState(result.data));
    } catch (error) {
      alert(JSON.stringify(error));
      dispatch(setPatientEditFailedToState());
    }
  };
};
