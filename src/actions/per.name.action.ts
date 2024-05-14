import {
  server,
  PER_NAME_CLEAR,
  PER_NAME_FAILED,
  PER_NAME_FETCHING,
  PER_NAME_SUCCESS,
  TOKEN,
} from "../Constants";
import { httpClient } from "../utils/httpclient";
import { history } from "..";
import { Dispatch } from "react";
import { AnyAction } from "redux";
import { Pername } from "../types/per.name.type";
import queryString from "query-string";

export const setPernameFetchingToState = () => ({
  type: PER_NAME_FETCHING,
});

export const setPernameSuccessToState = (payload: Pername[]) => ({
  type: PER_NAME_SUCCESS,

  payload,
});

export const setPernameFailedToState = () => ({
  type: PER_NAME_FAILED,
});

export const setPernameClearToState = () => ({
  type: PER_NAME_CLEAR,
});

const token = localStorage.getItem(TOKEN);

const PerName = async (dispatch: any) => {
  try {
    const result = await httpClient.get<Pername[]>(
      `${server.PER_URL}/bypassper`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    dispatch(setPernameSuccessToState(result.data));
  } catch (error) {
    dispatch(setPernameFailedToState());
  }
};

export const BypassPerName = () => {
  return (dispatch: any) => {
    dispatch(setPernameFetchingToState());
    PerName(dispatch);
  };
};
