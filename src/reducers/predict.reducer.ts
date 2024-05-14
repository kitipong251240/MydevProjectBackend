import {
  PATIENT_CLEAR,
  PATIENT_FAILED,
  PATIENT_FETCHING,
  PATIENT_SUCCESS,
  TOKEN,
} from "../Constants";
import { Patient } from "../types/patient.type";

export interface PredictState {
  result: Patient[];
  isFetching: boolean;
  isError: boolean;
}

const initialState: PredictState = {
  result: [],
  isFetching: false,
  isError: false,
};

export default (state = initialState, { type, payload }: any) => {
  switch (type) {
    case PATIENT_FETCHING:
      return { ...state, result: [], isFetching: true, isError: false };
    case PATIENT_SUCCESS:
      return { ...state, result: payload, isFetching: false, isError: false };
    case PATIENT_FAILED:
      return { ...state, result: [], isFetching: false, isError: true };
    case PATIENT_CLEAR:
      return { ...state, result: [], isFetching: false, isError: false };
    default:
      return state;
  }
};
