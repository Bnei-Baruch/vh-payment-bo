import axios from 'axios';
const getCustomerActivity = (limit = 10, skip) => {
    return axios.get(`${window.APP_CONFIG.VH_API_BASE_URL}/pay/payments/activities?limit=${limit}&skip=${skip}`).then(res => res.data);
}

export default getCustomerActivity;