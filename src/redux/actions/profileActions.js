import axios from "axios";
import i18next from "i18next";
import {
  FETCH_PROFILE_SUCCESS,
  FETCH_PROFILE_FAILED,
  UPDATE_PROFILE_FAILED,
} from "../constants";

const apiProfile = (method, url, data, token) => {
  return axios[method](url, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const fetchProfile = () => {
  return (dispatch, getState) => {
    const { subject, token, profile } = getState().userReducer.info.keycloak;

    return axios
      .get(`${window.APP_CONFIG.VH_API_BASE_URL}/profile/v1/profile/${subject}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(
        ({ data }) => dispatch({ type: FETCH_PROFILE_SUCCESS, payload: data }),
        ({ message, response }) => {
          if (response && response.status === 404) {
            const data = {
              keycloak_id: subject,
              first_name_vernacular: profile.firstName,
              last_name_vernacular: profile.lastName,
              primary_email: profile.email,
            };

            apiProfile("post", window.APP_CONFIG.VH_API_BASE_URL + '/profile/v1/profile', data, token)
              .then((res) => {
                dispatch(fetchProfile());
                console.log("Success post response:", res);
              })
              .catch((error) => {
                dispatch({
                  type: UPDATE_PROFILE_FAILED,
                  payload: i18next.t("Global.requestError"),
                });
                console.error("Failed post response:", error);
              });
          } else {
            dispatch({ type: FETCH_PROFILE_FAILED, payload: message });
          }
        }
      );
  };
};
