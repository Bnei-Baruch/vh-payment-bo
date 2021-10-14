import * as types from "../constants";

export default function reducer(state = {}, actions) {
  switch (actions.type) {
    case types.SET_TOKEN:
      return {
        ...state,
        token: actions.payload,
      };

    case types.SET_KEYCLOAK_DATA:
      return {
        ...state,
        keycloak: actions.payload,
      };

    case types.SET_USER_ROLE:
      return {
        ...state,
        roles: actions.payload,
      };

    default:
      return state;
  }
}
