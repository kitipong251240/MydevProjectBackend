import {
  server,
  USER_EDIT_FAILED,
  USER_EDIT_FETCHING,
  USER_EDIT_SUCCESS,
  TOKEN,
} from "../Constants";

import { httpClient } from "../utils/httpclient";
import { history } from "..";
import { User } from "../types/user.type";
const token = localStorage.getItem(TOKEN);
export const setUserEditFetchingToState = () => ({
  type: USER_EDIT_FETCHING,
});

export const setUserEditSuccessToState = (payload: User) => ({
  type: USER_EDIT_SUCCESS,
  payload,
});

export const setUserEditFailedToState = () => ({
  type: USER_EDIT_FAILED,
});

export const updateUser = (formData: FormData) => {
  return async (dispatch: any) => {
    await httpClient.put(server.USER_URL, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    history.back();
  };
};

export const getUserById = (id: any) => {
  return async (dispatch: any) => {
    try {
      dispatch(setUserEditFetchingToState());
      let result = await httpClient.get<User>(`${server.USER_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(setUserEditSuccessToState(result.data));
    } catch (error) {
      alert(JSON.stringify(error));
      dispatch(setUserEditFailedToState());
    }
  };
};
