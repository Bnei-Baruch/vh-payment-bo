window.APP_CONFIG = {
    SHORT_SHA: '{{env.Getenv "SHORT_SHA" "-"}}',
    BASE_STATIC_PATH: "/static",
    VH_API_BASE_URL: '{{env.Getenv "VH_API_BASE_URL" "https://api.eurokab.info"}}',
    KEYCLOAK_CONFIG: {
        realm: '{{env.Getenv "KEYCLOAK_REALM" "master"}}',
        url: '{{env.Getenv "KEYCLOAK_URL" "https://auth.2serv.eu/auth/"}}',
        clientId: '{{env.Getenv "KEYCLOAK_CLIENT_ID" "membership_pay_dev"}}'
    }
};
