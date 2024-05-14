import {
  PATIENT_EDIT_FAILED,
  PATIENT_EDIT_FETCHING,
  PATIENT_EDIT_SUCCESS,
} from "../Constants";
import { Patient } from "../types/patient.type";

export interface PatientEditState {
  result: Patient | null;
  isFetching: boolean;
  isError: boolean;
}

const initialState: PatientEditState = {
  result: null,
  isFetching: false,
  isError: false,
};

export default (state = initialState, { type, payload }: any) => {
  switch (type) {
    case PATIENT_EDIT_FETCHING:
      return { ...state, result: null, isFetching: true, isError: false };
    case PATIENT_EDIT_SUCCESS:
      return { ...state, result: payload, isFetching: false, isError: false };
    case PATIENT_EDIT_FAILED:
      return { ...state, result: null, isFetching: false, isError: true };
    default:
      return state;
  }
};
