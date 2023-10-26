import Axios from "axios";

const REQ_TYPE_GET = 1;
const REQ_TYPE_POST = 2;
const REQ_TYPE_DEL = 3;
const REQ_TYPE_PUT = 4;


export class Connection {

    static BaseUrl = "http://localhost:5000";

    /**
     * handles all requests
     * @param {string} endpoint 
     * @param {any} data 
     * @param {AxiosRequestConfig} config 
     * @param {number} requestType 
     * @param {number} retryCount 
     * @returns {Promise<{errorMessage:string, data: any}>}
     */
    static handleRequest = async (endpoint, data, config, requestType, retryCount = 1) => {
        try {

            // set token
            // config.headers = {
            //     "Authorization": `Bearer ${this.token}`
            // }

            // only throw error if response >= 500
            // config.validateStatus = (status) => {
            //     return status < 500;
            // }

            let url = this.BaseUrl + endpoint;
            let response;
            switch (requestType) {
                case REQ_TYPE_GET:
                    response = await Axios.get(url, config);
                    break;
                case REQ_TYPE_POST:
                    response = await Axios.post(url, data, config);
                    break;
                case REQ_TYPE_DEL:
                    response = await Axios.delete(url, config);
                    break;
                default:
                    return { errorMessage: "an error occurred", data: "" };
            }

            if (response.status === 400) {
                return { errorMessage: `Bad request: ${(response.data.errorMessage !== undefined) ? response.data.errorMessage : ""}`, data: "" };
            }

            if (response.status === 403) {
                return { errorMessage: `forbidden: ${response.data.errorMessage ? response.data.errorMessage : ""}`, data: "" };
            }

            if (response.status === 404) {
                if (response.data.errorMessage) {
                    return { errorMessage: response.data.errorMessage, data: "" };
                }
                return { errorMessage: "Not found", data: "" };
            }

            return response.data;
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that is greater than or equal to 500
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
                return { errorMessage: "server error", data: "" };
            } else if (error.request) {
                // The request was made but no response was received
                return { errorMessage: "No response from server", data: "" };
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
                return { errorMessage: "request setup error", data: "" };
            }
        }
    }

    /**
     * Perform get request 
     * @param {string} endpoint 
     * @param {any} data 
     * @returns {Promise<{errorMessage:string, data: any}>}
     */
    static getRequest = async (endpoint, data) => {
        return await this.handleRequest(endpoint, data, {}, REQ_TYPE_GET);
    }

    /**
     * Perform post request
     * @param {string} endpoint 
     * @param {any} data 
     * @param {AxiosRequestConfig} config 
     * @returns {Promise<{errorMessage:string, data: any}>}
     */
    static postRequest = async (endpoint, data, config) => {
        return await this.handleRequest(endpoint, data, config, REQ_TYPE_POST);
    }

    /**
     * Perform delete request
     * @param {string} endpoint 
     * @returns {Promise<{errorMessage:string, data: any}>}
     */
    static delRequest = async (endpoint) => {
        return await this.handleRequest(endpoint, "", {}, REQ_TYPE_DEL);
    }
}