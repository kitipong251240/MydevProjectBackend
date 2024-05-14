import {
  PREDICT_CLEAR,
  PREDICT_FAILED,
  PREDICT_FETCHING,
  PREDICT_SUCCESS,
  TOKEN,
} from "../Constants";
import { Pre } from "../types/preM.type";

export interface PreState {
  result: Pre | null;
  isFetching: boolean;
  isError: boolean;
}

const initialState: PreState = {
  result: null,
  isFetching: false,
  isError: false,
};

export default (state = initialState, { type, payload }: any) => {
  switch (type) {
    case PREDICT_FETCHING:
      return { result: null, isFetching: true, isError: false };
    case PREDICT_SUCCESS:
      return { result: payload, isFetching: false, isError: false };
    case PREDICT_FAILED:
      return { result: null, isFetching: false, isError: true };
    case PREDICT_CLEAR:
      return { result: null, isFetching: false, isError: true };
    default:
      return state;
  }
};
