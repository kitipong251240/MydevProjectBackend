import {
  server,
  USER_SUCCESS,
  USER_FAILED,
  USER_CLEAR,
  USER_FETCHING,
  TOKEN,
} from "../Constants";
import { httpClient } from "../utils/httpclient";
import { history } from "..";
import { Dispatch } from "react";
import { AnyAction } from "redux";
import { User } from "../types/user.type";
import queryString from "query-string";
import { UserPer } from "../types/user.per.type";

export const setUserFetchingToState = () => ({
  type: USER_FETCHING,
});

export const setUserSuccessToState = (payload: User[]) => ({
  type: USER_SUCCESS,

  payload,
});

export const setUserFailedToState = () => ({
  type: USER_FAILED,
});

export const setUserClearToState = () => ({
  type: USER_CLEAR,
});

export const loadUser = () => {
  return (dispatch: any) => {
    dispatch(setUserFetchingToState());
    doGetUser(dispatch);
  };
};

export const loadUserByKeyword = (keyword: string) => {
  return async (dispatch: any) => {
    dispatch(setUserFetchingToState());

    if (keyword) {
      let result = await httpClient.get<any>(
        `${server.USER_URL}/keyword/${keyword}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(setUserSuccessToState(result.data));
    } else {
      doGetUser(dispatch);
    }
  };
};

const doGetUser = async (dispatch: any) => {
  try {
    const result = await httpClient.get<User[]>(server.USER_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(setUserSuccessToState(result.data));
  } catch (error) {
    dispatch(setUserFailedToState());
  }
};

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

export const addUser = (userData: UserPer) => {
  return async (dispatch: any) => {
    try {
      await httpClient.post(server.USER_URL, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      history.back();
    } catch (error) {
      console.error("Error adding user:", error);
      // Handle error appropriately
    }
  };
};

export const deleteUser = (id: string) => {
  return async (dispatch: Dispatch<AnyAction>) => {
    dispatch(setUserFetchingToState());
    await httpClient.delete(`${server.USER_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    await doGetUser(dispatch);
  };
};
const token = localStorage.getItem(TOKEN);
export const getUserById = (id: any) => {
  return async (dispatch: any) => {
    try {
      dispatch(setUserFetchingToState());
      let result = await httpClient.get<User>(`${server.USER_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(setUserSuccessToState([result.data]));
    } catch (error) {
      alert(JSON.stringify(error));
      dispatch(setUserFailedToState());
    }
  };
};

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