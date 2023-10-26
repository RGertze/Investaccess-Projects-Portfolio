import Axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { IApiTokens, IResult } from "./interfaces/interfaces";

enum AUTH_ENDPOINTS {
    LOGIN = "/api/auth/login",
    REGISTER = "/api/auth/register",
    REFRESH_TOKEN = "/api/auth/refresh-token",
}

enum STORAGE_ITEM {
    EMAIL = "email",
    TOKEN = "token",
    REFRESH_TOKEN = "refresh_token",
    USER_ID = "user_id",
    ROLE_ID = "role_id",
    IS_APPROVED = "is_approved"
}

enum REQUEST_TYPE {
    GET = 1,
    POST = 2,
    DEL = 3,
    PUT = 4
}

export enum ERROR_MESSAGES {
    NOT_INITIALIZED = "not_initialized",
    INVALID_REQUEST_TYPE = "invalid_request_type",
    SERVER_ERROR = "Server error occurred, try again later",
    NO_RESPONSE_ERROR = "No response received, try again later",
    REQUEST_SETUP_ERROR = "Error sending request, try again later"
}

export class Connection {
    private static readonly BaseUrl: string = "http://localhost:5000";

    public static userId: string = "";
    public static username: string = "";
    public static userType: string = "";
    public static token: string = "";
    public static refreshToken: string = "";
    public static isApproved: string = "";

    //----   SET CONNECTION DETAILS   ----
    public static setConnectionDetail(username, token, refreshToken, userId: number, userType: number, isApproved: number) {
        this.username = username;
        this.token = token;
        this.refreshToken = refreshToken;
        this.userId = userId.toString();
        this.userType = userType.toString();

        this.setLocalStorage(username, token, refreshToken, userId.toString(), userType.toString(), isApproved.toString());
    }

    //----   BUILD FROM LOCAL STORAGE   ----
    public static buildFromLocalStorage() {
        this.username = localStorage.getItem(STORAGE_ITEM.EMAIL) ?? "";
        this.token = localStorage.getItem(STORAGE_ITEM.TOKEN) ?? "";
        this.refreshToken = localStorage.getItem(STORAGE_ITEM.REFRESH_TOKEN) ?? "";
        this.userId = localStorage.getItem(STORAGE_ITEM.USER_ID) ?? "";
        this.userType = localStorage.getItem(STORAGE_ITEM.ROLE_ID) ?? "";
    }

    //----   SET LOCAL STORAGE   ----
    private static setLocalStorage(username, token, refreshToken, userId: string, userType: string, isApproved: string) {
        localStorage.setItem(STORAGE_ITEM.EMAIL, username);
        localStorage.setItem(STORAGE_ITEM.TOKEN, token);
        localStorage.setItem(STORAGE_ITEM.REFRESH_TOKEN, refreshToken);
        localStorage.setItem(STORAGE_ITEM.USER_ID, userId);
        localStorage.setItem(STORAGE_ITEM.ROLE_ID, userType);
    }

    //----   CLEAR LOCAL STORAGE   ----
    public static clearLocalStorage() {
        localStorage.clear();
    }

    //----   HANDLE HTTP REQUEST   ----
    private static handleRequest = async (reqType: string, data: any, config: AxiosRequestConfig, requestType: REQUEST_TYPE, retryCount = 1): Promise<IResult> => {
        try {

            // set token
            config.headers = {
                "Authorization": `Bearer ${this.token}`
            }

            // only throw error if response >= 500
            config.validateStatus = (status) => {
                return status < 500;
            }

            let url = this.BaseUrl + reqType;
            let response: AxiosResponse<any, any>;
            switch (requestType) {
                case REQUEST_TYPE.GET:
                    response = await Axios.get(url, config);
                    break;
                case REQUEST_TYPE.POST:
                    response = await Axios.post(url, data, config);
                    break;
                case REQUEST_TYPE.DEL:
                    response = await Axios.delete(url, config);
                    break;
                default:
                    return {
                        statusCode: 500,
                        message: ERROR_MESSAGES.INVALID_REQUEST_TYPE,
                        data: ""
                    };
            }

            if (response.status === 400) {
                return { statusCode: 400, message: `Bad request: ${(response.data.message !== undefined) ? response.data.message : ""}`, data: "" };
            }

            if (response.status === 401) {
                // refresh token if it exists and try again
                if (Connection.token !== "" && retryCount === 1) {
                    if (await this.refreshJwtToken()) {
                        // retry and increase retry count
                        return this.handleRequest(reqType, data, config, requestType, retryCount + 1);
                    }

                    // send user to login page
                    window.location.href = "/login";
                    return { statusCode: 401, message: "unauthorized", data: "" };
                } else if (Connection.token === "") {
                    // send user to login page if 401 response received and there is no token
                    window.location.href = "/login";
                    return { statusCode: 401, message: "unauthorized", data: "" };
                }
            }

            if (response.status === 403) {
                return { statusCode: 403, message: `forbidden: ${response.data.errorMessage ? response.data.errorMessage : ""}`, data: "" };
            }

            if (response.status === 404) {
                if (response.data.message) {
                    return { statusCode: 404, message: response.data.message, data: "" };
                }
                return { statusCode: 404, message: "Not found", data: "" };
            }

            return response.data as IResult;
        } catch (error: any) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that is greater than or equal to 500
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
                return { statusCode: error.response.status, message: ERROR_MESSAGES.SERVER_ERROR, data: "" };
            } else if (error.request) {
                // The request was made but no response was received
                return { statusCode: 509, message: ERROR_MESSAGES.NO_RESPONSE_ERROR, data: "" };
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
                return { statusCode: 999, message: ERROR_MESSAGES.REQUEST_SETUP_ERROR, data: "" };
            }
        }
    }

    private static refreshJwtToken = async (): Promise<boolean> => {
        let data = {
            token: this.token,
            refreshToken: this.refreshToken
        }

        let response = await this.handleRequest(AUTH_ENDPOINTS.REFRESH_TOKEN, data, {}, REQUEST_TYPE.POST, 2);
        if (response.message.length > 0) {
            console.log(response);
            return false;
        }

        let tokens: IApiTokens = response.data;
        this.token = tokens.token;
        this.refreshToken = tokens.refreshToken;

        this.setLocalStorage(this.username, this.token, this.refreshToken, this.userId, this.userType, this.isApproved);

        return true;
    }

    public static getRequest = async (reqType: string, data: any): Promise<IResult> => {
        return await this.handleRequest(reqType, data, {}, REQUEST_TYPE.GET);
    }

    public static postRequest = async (reqType: string, data: any, config: AxiosRequestConfig): Promise<IResult> => {
        return await this.handleRequest(reqType, data, config, REQUEST_TYPE.POST);
    }

    public static delRequest = async (reqType: string): Promise<IResult> => {
        return await this.handleRequest(reqType, "", {}, REQUEST_TYPE.DEL);
    }
}

