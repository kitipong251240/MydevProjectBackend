import {
  server,
  BY_PASS_SUCCESS,
  BY_PASS_FAILED,
  BY_PASS_CLEAR,
  BY_PASS_FETCHING,
  TOKEN,
} from "../Constants";
import { httpClient } from "../utils/httpclient";
import { history } from "..";
import { Dispatch } from "react";
import { AnyAction } from "redux";
import { User } from "../types/user.type";
import queryString from "query-string";
import { Bypass } from "../types/bypass.type";

export const setUserFetchingToState = () => ({
  type: BY_PASS_FETCHING,
});

export const setUserSuccessToState = (payload: User[]) => ({
  type: BY_PASS_SUCCESS,

  payload,
});

export const setUserFailedToState = () => ({
  type: BY_PASS_FAILED,
});

export const setUserClearToState = () => ({
  type: BY_PASS_CLEAR,
});

const token = localStorage.getItem(TOKEN);

const ByPassUser = async (dispatch: any) => {
  try {
    const result = await httpClient.get<User[]>(
      `${server.USER_URL}/bypassuser`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    dispatch(setUserSuccessToState(result.data));
  } catch (error) {
    dispatch(setUserFailedToState());
  }
};

export const ByUser = () => {
  return (dispatch: any) => {
    dispatch(setUserFetchingToState());
    ByPassUser(dispatch);
  };
};
