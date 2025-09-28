import React, { useState, useEffect } from "react";
import Keycloak from "keycloak-js";

import { setKeycloakData, setLoggedInUser } from "../redux/actions/userActions";
import { useDispatch } from "react-redux";

import ErrorLogin from "../views/ErrorLogin";
import LoadingScreen from "../views/LoadingScreen";
import { fetchProfile } from "../redux/actions/profileActions";

const Auth = (props) => {
  const [auth, setAuth] = useState({ keycloak: null, authenticated: false });
  const [access, setAccess] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const keycloak = new Keycloak(window.APP_CONFIG.KEYCLOAK_CONFIG);
    keycloak
      .init({ onLoad: "login-required", checkLoginIframe: false })
      .then((authenticated) => {
        if (keycloak.realmAccess.roles.includes("vh_admin") || 
              keycloak.realmAccess.roles.includes("vh_root")) {
          setAccess(true);
        }
        keycloak.loadUserProfile().then(function () {
          dispatch(setKeycloakData(keycloak));
          const profile = {
            username: keycloak.profile.username,
            firstName: keycloak.profile.firstName,
            lastName: keycloak.profile.lastName,
            email: keycloak.profile.email,
            token: keycloak.token,
            // TODO: Add gender to the response
            gender: "male",
          };
          setAuth({
            keycloak,
            authenticated,
            profile,
          });
        });
      }).catch((err) => {
        console.error("Keycloak initialization failed:", err);
      })
  }, [dispatch]);

  if (auth.keycloak) {
    if (auth.authenticated) {
      dispatch(setLoggedInUser(auth));
      dispatch(fetchProfile());
      if (access) {
        return <>{props.children}</>;
      } else {
        return <div>User don't have Rights to view this application</div>;
      }
    } else {
      return (
        <>
          <ErrorLogin />
        </>
      );
    }
  } else {
    return (
      <div>
        <LoadingScreen />
      </div>
    );
  }
};

export default Auth;
