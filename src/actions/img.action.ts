import {
  server,
  IMG_CLEAR,
  IMG_FAILED,
  IMG_FETCHING,
  IMG_SUCCESS,
  TOKEN,
} from "../Constants";
import { Img } from "../types/img.type";
import { httpClient } from "../utils/httpclient";
import { history } from "..";
import { Dispatch } from "react";
import { AnyAction } from "redux";
const token = localStorage.getItem(TOKEN);
export const setImageFetchingToState = () => ({
  type: IMG_FETCHING,
});

export const setImageSuccessToState = (payload: Img[]) => ({
  type: IMG_SUCCESS,
  payload,
});

export const setImageFailedToState = () => ({
  type: IMG_FAILED,
});

export const setImageClearToState = () => ({
  type: IMG_CLEAR,
});

export const loadImage = () => {
  return (dispatch: any) => {
    dispatch(setImageFetchingToState());
    doGetImage(dispatch);
  };
};

export const loadImageByKeyword = (keyword: string) => {
  return async (dispatch: any) => {
    dispatch(setImageFetchingToState());

    if (keyword) {
      let result = await httpClient.get<any>(
        `${server.IMG_URL}/keyword/${keyword}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(setImageSuccessToState(result.data));
    } else {
      doGetImage(dispatch);
    }
  };
};

const doGetImage = async (dispatch: any) => {
  try {
    const result = await httpClient.get<Img[]>(server.IMG_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(setImageSuccessToState(result.data));
  } catch (error) {
    dispatch(setImageFailedToState());
  }
};

export const predictImage = (formData: FormData) => {
  return async (dispatch: any) => {
    await httpClient.post(server.PREDICT_M, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
};

export const addImage = (formData: FormData) => {
  return async (dispatch: any) => {
    await httpClient.post(server.IMG_URL_ADD, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
};

export const deleteImage = (id: string) => {
  return async (dispatch: Dispatch<AnyAction>) => {
    dispatch(setImageFetchingToState());
    await httpClient.delete(`${server.IMG_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    await doGetImage(dispatch);
  };
};
export const getImageById = (id: any) => {
  return async (dispatch: any) => {
    try {
      dispatch(setImageFetchingToState());
      let result = await httpClient.get<Img>(`${server.DIAGNOSE}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(setImageSuccessToState([result.data]));
    } catch (error) {
      alert(JSON.stringify(error));
      dispatch(setImageFailedToState());
    }
  };
};
