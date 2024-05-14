import { PER_CLEAR, PER_FAILED, PER_FETCHING, PER_SUCCESS } from "../Constants";
import { Patient } from "../types/patient.type";
import { Per } from "../types/per.type";

export interface PermissionState {
  result: Per[];
  isFetching: boolean;
  isError: boolean;
}

const initialState: PermissionState = {
  result: [],
  isFetching: false,
  isError: false,
};

export default (state = initialState, { type, payload }: any) => {
  switch (type) {
    case PER_FETCHING:
      return { ...state, result: [], isFetching: true, isError: false };
    case PER_SUCCESS:
      return { ...state, result: payload, isFetching: false, isError: false };
    case PER_FAILED:
      return { ...state, result: [], isFetching: false, isError: true };
    case PER_CLEAR:
      return { ...state, result: [], isFetching: false, isError: false };
    default:
      return state;
  }
};
