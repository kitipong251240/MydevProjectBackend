import {
  USER_CLEAR,
  USER_FAILED,
  USER_FETCHING,
  USER_SUCCESS,
} from "../Constants";
import { User } from "../types/user.type";

export interface UserState {
  result: User[];
  isFetching: boolean;
  isError: boolean;
}

const initialState: UserState = {
  result: [],
  isFetching: false,
  isError: false,
};

export default (state = initialState, { type, payload }: any) => {
  switch (type) {
    case USER_FETCHING:
      return { ...state, result: [], isFetching: true, isError: false };
    case USER_SUCCESS:
      return { ...state, result: payload, isFetching: false, isError: false };
    case USER_FAILED:
      return { ...state, result: [], isFetching: false, isError: true };
    case USER_CLEAR:
      return { ...state, result: [], isFetching: false, isError: false };
    default:
      return state;
  }
};
