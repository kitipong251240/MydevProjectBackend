import { IMG_CLEAR, IMG_FAILED, IMG_FETCHING, IMG_SUCCESS } from "../Constants";
import { ImgPatient } from "../types/img.patient.type";

export interface ImagePatientState {
  result: ImgPatient[];
  isFetching: boolean;
  isError: boolean;
}

const initialState: ImagePatientState = {
  result: [],
  isFetching: false,
  isError: false,
};

export default (state = initialState, { type, payload }: any) => {
  switch (type) {
    case IMG_FETCHING:
      return { ...state, result: [], isFetching: true, isError: false };
    case IMG_SUCCESS:
      return { ...state, result: payload, isFetching: false, isError: false };
    case IMG_FAILED:
      return { ...state, result: [], isFetching: false, isError: true };
    case IMG_CLEAR:
      return { ...state, result: [], isFetching: false, isError: false };
    default:
      return state;
  }
};
