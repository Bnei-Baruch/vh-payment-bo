window.APP_CONFIG = {
    BUILD_TIME: '{{ (time.Now).UTC }}',
    REG_BRANCH: '{{env.Getenv "CI_COMMIT_REF_NAME" "-"}}',
    REF_VERSION: '{{env.Getenv "CI_COMMIT_SHA" "-"}}',
    VH_SRV_REGISTRATION: '{{env.Getenv "VH_SRV_REGISTRATION" "https://api.eurokab.info/profile/v1/profile"}}',
    KEYCLOAK_CONFIG: {
        realm: '{{env.Getenv "KEYCLOAK_REALM" "master"}}',
        url: '{{env.Getenv "KEYCLOAK_URL" "https://auth.2serv.eu/auth/"}}',
        clientId: '{{env.Getenv "KEYCLOAK_CLIENT_ID" "membership_pay_dev"}}'
    }
};