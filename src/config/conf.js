const configLocal = {
  VH_SRV_REGISTRATION: "http://localhost:3002",
};

const configStaging = {
  VH_SRV_REGISTRATION: "https://api.eurokab.info",
};

const configProd = {
  VH_SRV_REGISTRATION: "https://api.kli.one",
};
if (process.env.REACT_APP_LOCAL === "true") {
  module.exports = configLocal;
} else {
  if (process.env.REACT_APP_STAGING === "true") {
    module.exports = configStaging;
  } else {
    module.exports = configProd;
  }
}
