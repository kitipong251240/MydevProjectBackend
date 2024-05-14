import {
  server,
  PER_VALIDATE_CLAER,
  PER_VALIDATE_FAILED,
  PER_VALIDATE_FETCHING,
  PER_VALIDATE_SUCCESS,
  TOKEN,
} from "../Constants";

import { httpClient } from "../utils/httpclient";
import { history } from "..";
import { UserPerValidate } from "../types/user.per.validate.type";
const token = localStorage.getItem(TOKEN);
export const setUserPerValidateFetchingToState = () => ({
  type: PER_VALIDATE_FETCHING,
});

export const setUserPerValidateSuccessToState = (payload: UserPerValidate) => ({
  type: PER_VALIDATE_SUCCESS,
  payload,
});

export const setUserPerValidateFailedToState = () => ({
  type: PER_VALIDATE_FAILED,
});

export const getUserPerValidateById = (id: any) => {
  return async (dispatch: any) => {
    try {
      dispatch(setUserPerValidateFetchingToState());
      let result = await httpClient.get<UserPerValidate>(
        `${server.USER_URL}${server.PER}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(setUserPerValidateSuccessToState(result.data));
    } catch (error) {
      alert(JSON.stringify(error));
      dispatch(setUserPerValidateFailedToState());
    }
  };
};
