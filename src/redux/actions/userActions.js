import * as types from "../constants";

export function setToken(value) {
  return {
    type: types.SET_TOKEN,
    payload: value,
  };
}
export function setKeycloakData(value) {
  return {
    type: types.SET_KEYCLOAK_DATA,
    payload: value,
  };
}
export function setUserRoles(value) {
  return {
    type: types.SET_USER_ROLE,
    payload: value,
  };
}
