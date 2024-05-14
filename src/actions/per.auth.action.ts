import {
  server,
  PER_CLEAR,
  PER_FAILED,
  PER_FETCHING,
  PER_SUCCESS,
  TOKEN,
  PER_AUTH_FETCHING,
  PER_AUTH_SUCCESS,
  PER_AUTH_FAILED,
  PER_AUTH_CLEAR,
} from "../Constants";
import { Patient } from "../types/patient.type";
import { httpClient } from "../utils/httpclient";
import { history } from "..";
import { Dispatch } from "react";
import { AnyAction } from "redux";
import queryString from "query-string";
import { Per } from "../types/per.type";
import { PerAuth } from "../types/per.authen.type";

export const setPerFetchingToState = () => ({
  type: PER_AUTH_FETCHING,
});
const token = localStorage.getItem(TOKEN);
export const setPerSuccessToState = (payload: PerAuth[]) => ({
  type: PER_AUTH_SUCCESS,
  payload,
});

export const setPerFailedToState = () => ({
  type: PER_AUTH_FAILED,
});

export const setPerClearToState = () => ({
  type: PER_AUTH_CLEAR,
});

export const loadPer = () => {
  return (dispatch: any) => {
    dispatch(setPerFetchingToState());
    doGetPer(dispatch);
  };
};

export const loadPerByKeyword = (keyword: string) => {
  return async (dispatch: any) => {
    dispatch(setPerFetchingToState());

    if (keyword) {
      let result = await httpClient.get<any>(
        `${server.PER_URL}/keyword/${keyword}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(setPerSuccessToState(result.data));
    } else {
      doGetPer(dispatch);
    }
  };
};

const doGetPer = async (dispatch: any) => {
  try {
    const result = await httpClient.get<PerAuth[]>(server.PER_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch(setPerSuccessToState(result.data));
  } catch (error) {
    dispatch(setPerFailedToState());
  }
};

export const addPer = (formData: any) => {
  return async (dispatch: any) => {
    const formDataUrlEncoded = queryString.stringify(formData);

    await httpClient.post(server.PER_URL_ADD, formDataUrlEncoded, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    history.back();
  };
};

export const deletePer = (id: string) => {
  return async (dispatch: Dispatch<AnyAction>) => {
    dispatch(setPerFetchingToState());
    await httpClient.delete(`${server.PER_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    await doGetPer(dispatch);
  };
};

export const getPerAuthById = (id: any) => {
  return async (dispatch: any) => {
    try {
      dispatch(setPerFetchingToState());
      let result = await httpClient.get<PerAuth>(`${server.PER_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(setPerSuccessToState([result.data]));
    } catch (error) {
      alert(JSON.stringify(error));
      dispatch(setPerFailedToState());
    }
  };
};
