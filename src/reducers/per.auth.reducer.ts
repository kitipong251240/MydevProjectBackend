import {
  PER_AUTH_CLEAR,
  PER_AUTH_FAILED,
  PER_AUTH_FETCHING,
  PER_AUTH_SUCCESS,
} from "../Constants";
import { Patient } from "../types/patient.type";
import { PerAuth } from "../types/per.authen.type";
import { Per } from "../types/per.type";

export interface PermissionAuthState {
  result: PerAuth[];
  isFetching: boolean;
  isError: boolean;
}

const initialState: PermissionAuthState = {
  result: [],
  isFetching: false,
  isError: false,
};

export default (state = initialState, { type, payload }: any) => {
  switch (type) {
    case PER_AUTH_FETCHING:
      return { ...state, result: [], isFetching: true, isError: false };
    case PER_AUTH_SUCCESS:
      return { ...state, result: payload, isFetching: false, isError: false };
    case PER_AUTH_FAILED:
      return { ...state, result: [], isFetching: false, isError: true };
    case PER_AUTH_CLEAR:
      return { ...state, result: [], isFetching: false, isError: false };
    default:
      return state;
  }
};
