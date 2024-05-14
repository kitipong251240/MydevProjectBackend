import {
  server,
  TOKEN,
  PREDICT_FETCHING,
  PREDICT_SUCCESS,
  PREDICT_FAILED,
  PREDICT_CLEAR,
} from "../Constants";
import { Pre } from "../types/preM.type";
import { httpClient } from "../utils/httpclient";

import { Dispatch } from "react";
import { AnyAction } from "redux";
const token = localStorage.getItem(TOKEN);
export const setPreFetchingToState = () => ({
  type: PREDICT_FETCHING,
});

export const setPreSuccessToState = (payload: Pre) => ({
  type: PREDICT_SUCCESS,
  payload,
});

export const setPreFailedToState = () => ({
  type: PREDICT_FAILED,
});

export const setPreClearToState = () => ({
  type: PREDICT_CLEAR,
});

export const predictImage = (formData: FormData) => {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      const response = await httpClient.post(server.PREDICT_M, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = response.data; // หาก response นั้นมีข้อมูลที่คุณต้องการ
      dispatch(setPreSuccessToState(responseData)); // dispatch ข้อมูลที่ได้เพื่อทำการเก็บ state
    } catch (error) {
      console.error("Error predicting image:", error);
      dispatch(setPreFailedToState()); // หากเกิด error ในการ predict ให้ dispatch ว่าเกิด error
    }
  };
};

// preMActions.ts
export const predictImageSuccess = (prediction: any, result: any) => ({
  type: "PREDICT_IMAGE_SUCCESS",
  payload: { prediction, result },
});
