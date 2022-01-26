import axios from "axios";
import _ from "lodash";

const { API_HOST } = process.env;

const getClient = () => {
    let host = API_HOST;
    if (_.isNil(host)) {
        host = "http://localhost:3000";
    }
    return axios.create({
       baseURL: `${host}/api/`
    });
}

export default getClient;
