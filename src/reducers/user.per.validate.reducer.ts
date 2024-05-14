import {
  PER_VALIDATE_CLAER,
  PER_VALIDATE_FAILED,
  PER_VALIDATE_FETCHING,
  PER_VALIDATE_SUCCESS,
} from "../Constants";
import { UserPerValidate } from "../types/user.per.validate.type";

export interface UserPerValidateState {
  result: UserPerValidate[];
  isFetching: boolean;
  isError: boolean;
}

const initialState: UserPerValidateState = {
  result: [],
  isFetching: false,
  isError: false,
};

export default (state = initialState, { type, payload }: any) => {
  switch (type) {
    case PER_VALIDATE_FETCHING:
      return { ...state, result: [], isFetching: true, isError: false };
    case PER_VALIDATE_SUCCESS:
      return { ...state, result: payload, isFetching: false, isError: false };
    case PER_VALIDATE_FAILED:
      return { ...state, result: [], isFetching: false, isError: true };
    case PER_VALIDATE_CLAER:
      return { ...state, result: [], isFetching: false, isError: false };
    default:
      return state;
  }
};
