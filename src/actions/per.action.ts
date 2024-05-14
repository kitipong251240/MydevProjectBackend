import {
  server,
  PER_CLEAR,
  PER_FAILED,
  PER_FETCHING,
  PER_SUCCESS,
  TOKEN,
} from "../Constants";
import { Patient } from "../types/patient.type";
import { httpClient } from "../utils/httpclient";
import { history } from "..";
import { Dispatch } from "react";
import { AnyAction } from "redux";
import queryString from "query-string";
import { Per } from "../types/per.type";

export const setPerFetchingToState = () => ({
  type: PER_FETCHING,
});
const token = localStorage.getItem(TOKEN);
export const setPerSuccessToState = (payload: Per[]) => ({
  type: PER_SUCCESS,
  payload,
});

export const setPerFailedToState = () => ({
  type: PER_FAILED,
});

export const setPerClearToState = () => ({
  type: PER_CLEAR,
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
    const result = await httpClient.get<Per[]>(server.PER_URL, {
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
  return async (dispatch: any, response: any) => {
    try {
      const formDataUrlEncoded = queryString.stringify(formData);
      response = await httpClient.post(server.PER_URL_ADD, formDataUrlEncoded, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      dispatch(setPerSuccessToState(response.data));
      if (response.data.error) {
        alert(response.data.error);
      } else {
        alert("insert successfull");
        history.back();
      }
    } catch (error) {
      alert("Error adding permission");
      dispatch(setPerFailedToState());
    }
  };
};

export const deletePer = (id: string) => {
  return async (dispatch: any) => {
    dispatch(setPerFetchingToState());
    try {
      const response = await httpClient.delete(`${server.PER_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.error) {
        console.log(response.data.error);
        alert("ไม่สามารถลบสิทธิ์การเข้าถึงนี้ได้ เนื่องจากมี User ใช้งานอยู่");
      }
      // แสดงผล response ใน console log
      await doGetPer(dispatch);
    } catch (error: any) {
      console.log("Error deleting permission:", error);
      const errorMessage =
        error.response?.data?.error ||
        "An error occurred while deleting permission.";
      alert(errorMessage);
    }
  };
};

export const updatePer = (formData: any) => {
  return async (dispatch: any) => {
    try {
      const formDataUrlEncoded = queryString.stringify(formData);
      await httpClient.put(server.PER_URL, formDataUrlEncoded, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      history.back();
    } catch (error) {
      alert("Error update permission");
      dispatch(setPerFailedToState());
    }
  };
};

export const getPerById = (id: any) => {
  return async (dispatch: any) => {
    try {
      dispatch(setPerFetchingToState());
      let result = await httpClient.get<Per>(`${server.PER_URL}/${id}`, {
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
