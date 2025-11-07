// staging
// window.APP_CONFIG = {
//   VH_API_BASE_URL: "https://api.eurokab.info",
//   KEYCLOAK_CONFIG: {
//     realm: "master",
//     url: "https://auth.2serv.eu/auth/",
//     clientId: "membership_pay_dev",
//   },
// };

// production
// window.APP_CONFIG = {
//     VH_API_BASE_URL: 'https://api.kli.one',
//     KEYCLOAK_CONFIG: {
//         realm: 'main',
//         url: 'https://accounts.kab.info/auth/',
//         clientId: 'membership_pay'
//     }
// };

// local backend, production keycloak
window.APP_CONFIG = {
    VH_API_BASE_URL: 'http://localhost:9000',
    KEYCLOAK_CONFIG: {
        realm: 'main',
        url: 'https://accounts.kab.info/auth/',
        clientId: 'membership_pay'
    }
};