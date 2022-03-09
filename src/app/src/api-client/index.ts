import axios from "axios";
import _ from "lodash";

const { API_HOST } = process.env;

const getClient = () => {
    let host = API_HOST;
    if (_.isNil(host)) {
        host = `${document.location.origin.replace(/:[0-9]+/g, "")}:3000`;
    }
    return axios.create({
       baseURL: `${host}/api/`
    });
}

export default getClient;
