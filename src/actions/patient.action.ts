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
import { history } from "..";
import { Dispatch } from "react";
import { AnyAction } from "redux";
import queryString from "query-string";

export const setPatientFetchingToState = () => ({
  type: PATIENT_FETCHING,
});
const token = localStorage.getItem(TOKEN);
export const setPatientSuccessToState = (payload: Patient[]) => ({
  type: PATIENT_SUCCESS,
  payload,
});

export const setPatientFailedToState = () => ({
  type: PATIENT_FAILED,
});

export const setPatientClearToState = () => ({
  type: PATIENT_CLEAR,
});

export const loadPatient = () => {
  return (dispatch: any) => {
    dispatch(setPatientFetchingToState());
    doGetPatient(dispatch);
  };
};

export const loadPatientByKeyword = (keyword: string) => {
  return async (dispatch: any) => {
    dispatch(setPatientFetchingToState());

    if (keyword) {
      let result = await httpClient.get<any>(
        `${server.PATIENT_URL}/keyword/${keyword}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(setPatientSuccessToState(result.data));
    } else {
      doGetPatient(dispatch);
    }
  };
};

const doGetPatient = async (dispatch: any) => {
  try {
    const result = await httpClient.get<Patient[]>(server.PATIENT_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch(setPatientSuccessToState(result.data));
  } catch (error) {
    dispatch(setPatientFailedToState());
  }
};

export const addPatient = (formData: any) => {
  return async (dispatch: any) => {
    const formDataUrlEncoded = queryString.stringify(formData);

    await httpClient.post(server.PATIENT_URL_ADD, formDataUrlEncoded, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    history.back();
  };
};

export const deletePatient = (id: string) => {
  return async (dispatch: Dispatch<AnyAction>) => {
    dispatch(setPatientFetchingToState());
    await httpClient.delete(`${server.PATIENT_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    await doGetPatient(dispatch);
  };
};

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
      dispatch(setPatientSuccessToState([result.data]));
    } catch (error) {
      alert(JSON.stringify(error));
      dispatch(setPatientFailedToState());
    }
  };
};
