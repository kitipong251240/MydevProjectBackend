import {
  PER_NAME_CLEAR,
  PER_NAME_FAILED,
  PER_NAME_FETCHING,
  PER_NAME_SUCCESS,
} from "../Constants";
import { Pername } from "../types/per.name.type";

export interface PernameState {
  result: Pername[];
  isFetching: boolean;
  isError: boolean;
}

const initialState: PernameState = {
  result: [],
  isFetching: false,
  isError: false,
};

export default (state = initialState, { type, payload }: any) => {
  switch (type) {
    case PER_NAME_FETCHING:
      return { ...state, result: [], isFetching: true, isError: false };
    case PER_NAME_SUCCESS:
      return { ...state, result: payload, isFetching: false, isError: false };
    case PER_NAME_FAILED:
      return { ...state, result: [], isFetching: false, isError: true };
    case PER_NAME_CLEAR:
      return { ...state, result: [], isFetching: false, isError: false };
    default:
      return state;
  }
};
