import {
  BY_PASS_CLEAR,
  BY_PASS_FAILED,
  BY_PASS_FETCHING,
  BY_PASS_SUCCESS,
} from "../Constants";
import { Bypass } from "../types/bypass.type";

export interface BypassState {
  result: Bypass[];
  isFetching: boolean;
  isError: boolean;
}

const initialState: BypassState = {
  result: [],
  isFetching: false,
  isError: false,
};

export default (state = initialState, { type, payload }: any) => {
  switch (type) {
    case BY_PASS_FETCHING:
      return { ...state, result: [], isFetching: true, isError: false };
    case BY_PASS_SUCCESS:
      return { ...state, result: payload, isFetching: false, isError: false };
    case BY_PASS_FAILED:
      return { ...state, result: [], isFetching: false, isError: true };
    case BY_PASS_CLEAR:
      return { ...state, result: [], isFetching: false, isError: false };
    default:
      return state;
  }
};
