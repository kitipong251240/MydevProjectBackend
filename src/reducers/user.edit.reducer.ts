import {
  USER_EDIT_FAILED,
  USER_EDIT_FETCHING,
  USER_EDIT_SUCCESS,
} from "../Constants";
import { User } from "../types/user.type";

export interface UserEditState {
  result: User | null;
  isFetching: boolean;
  isError: boolean;
}

const initialState: UserEditState = {
  result: null,
  isFetching: false,
  isError: false,
};

export default (state = initialState, { type, payload }: any) => {
  switch (type) {
    case USER_EDIT_FETCHING:
      return { ...state, result: null, isFetching: true, isError: false };
    case USER_EDIT_SUCCESS:
      return { ...state, result: payload, isFetching: false, isError: false };
    case USER_EDIT_FAILED:
      return { ...state, result: null, isFetching: false, isError: true };
    default:
      return state;
  }
};
