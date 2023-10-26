import { HttpTransportType, HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import axios from "axios";
import Axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { url } from "inspector";
import { USER_TYPE } from "./interfaces/general_enums";
import { IGlobalContext, IResponse, ISignedGetRequest, ITokenRefresh } from "./interfaces/general_interfaces";

const BaseUrl = "http://localhost:5008";

export enum GET_ENDPOINT {
    GET_USER = "/api/user/",
    GET_ALL_USERS = "/api/user/all",
    GET_ALL_PATIENTS = "/api/user/patients",
    SEARHC_PATIENTS = "/api/patient/search",

    GET_ALL_DOCTOR_SPECIALTY_TYPES = "/api/doctor/specialties",
    GET_ALL_DOCTORS = "/api/doctor/all",
    SEARCH_DOCTORS = "/api/doctor/search",

    GET_USER_PROFILE_PIC = "/api/user/profile-pic/",

    GET_DOCTOR_PROFILE = "/api/doctor/profile/",
    GET_PATIENT_PROFILE = "/api/patient/profile/",
    GET_ALL_DOCTOR_WORK_HISTORY = "/api/doctor/work-history/",

    GET_ALL_DOCTOR_EDUCATION = "/api/doctor/education/",

    GET_DOCTOR_REVIEWS = "/api/doctor/reviews/",

    GET_PATIENT_PROFILE_FOR_DOCTOR = "/api/patient/profile/access",
    GET_PATIENT_PROFILE_ACCESS_STATUS = "/api/patient/profile/access/check",
    GET_ALL_PATIENT_PROFILE_ACCESS_REQUESTS = "/api/patient/profile/access/requests/",
    GET_DOCTORS_WITH_PROFILE_ACCESS = "/api/patient/profile/access/all/",

    GET_PATIENT_NEXT_OF_KIN = "/api/patient/next-of-kin/",
    GET_ALL_PATIENT_HEALTH_SUMMARIES = "/api/patient/{patientId}/health-summaries",
    GET_SINGLE_HEALTH_SUMMARY = "/api/patient/health-summaries/{summaryId}",

    GET_PATIENT_DOCTOR_TYPES = "/api/doctor/personal/types",
    GET_REQUESTS_TO_BE_PERSONAL_DOCTOR = "/api/doctor/personal/requests/",
    GET_REQUEST_TO_BE_PERSONAL_DOCTOR_STATUS = "/api/doctor/personal/requests/check",
    GET_ALL_A_DOCTORS_PATIENTS = "/api/doctor/patients",
    GET_ALL_A_PATIENTS_DOCTORS = "/api/patient/doctors/",

    GET_ALL_MEDICAL_AID_SCHEMES = "/api/medicalscheme",
    GET_GENDERS = "/api/patient/genders",
    GET_BLOOD_TYPES = "/api/patient/blood-types",

    GET_APPOINTMENT_SLOTS_FOR_DOCTOR = "/api/appointment-slots/doctor/",

    GET_APPOINTMENT_VIA_CODE = "/api/appointments/single",

    GET_ALL_APPOINTMENTS = "/api/appointments",
    GET_ALL_APPOINTMENTS_FOR_DOCTOR = "/api/appointments/doctor/",
    GET_ALL_APPOINTMENTS_FOR_PATIENT = "/api/appointments/patient/",

    GET_UPCOMING_APPOINTMENTS_FOR_PATIENT = "/api/appointments/patient/upcoming/",
    GET_APPOINTMENT_HISTORY_FOR_PATIENT = "/api/appointments/patient/history/",
    GET_PENDING_APPOINTMENTS_FOR_DOCTOR = "/api/appointments/doctor/pending/",
    GET_UPCOMING_APPOINTMENTS_FOR_DOCTOR = "/api/appointments/doctor/upcoming/",
    GET_APPOINTMENT_HISTORY_FOR_DOCTOR = "/api/appointments/doctor/history/",

    GET_MESSAGES_BETWEEN_USERS = "/api/direct-message/all",
    GET_USERS_BEING_MESSAGED = "/api/direct-message/users/",

    GET_UNSEEN_NOTIFICATIONS = "/api/notifications/unseen/",
    GET_ALL_NOTIFICATIONS = "/api/notifications/all/",
    CHECK_FOR_NOTIFICATIONS = "/api/notifications/check/",

    GET_RECEPTIONISTS_FOR_DOCTOR = "/api/receptionists/all/",
    GET_RECEPTIONIST = "/api/receptionists/",

    REQUEST_PASSWORD_RESET = "/api/auth/password/reset/",
}
export enum POST_ENDPOINT {
    LOGIN = "/api/auth/login",
    REGISTER_USER = "/api/auth/account/register",
    REGISTER_PATIENT = "/api/user/patient/register",
    REGISTER_DOCTOR = "/api/user/doctor/register",

    UPDATE_USER = "/api/user/update",
    UPDATE_USER_PROFILE_PIC = "/api/user/profile-pic",
    UPDATE_PATIENT_PROFILE = "/api/patient/profile/update/",
    UPDATE_DOCTOR_PROFILE = "/api/doctor/profile/update/",
    UPDATE_USER_ACCOUNT_STATUS = "/api/user/account-status",

    ADD_DOCTOR_SPECIALTY = "/api/specialties/",
    EDIT_DOCTOR_SPECIALTY = "/api/specialties/edit",

    ADD_DOCTOR_WORK_HISTORY = "/api/doctor/work-history/",

    ADD_DOCTOR_EDUCATION = "/api/doctor/education/",

    ADD_DOCTOR_REVIEW = "/api/doctor/review/",

    REQUEST_PATIENT_PROFILE_ACCESS = "/api/patient/profile/access",
    APPROVE_PATIENT_PROFILE_ACCESS = "/api/patient/profile/access/approve",
    REJECT_PATIENT_PROFILE_ACCESS = "/api/patient/profile/access/reject",
    REVOKE_PATIENT_PROFILE_ACCESS = "/api/patient/profile/access/revoke",

    ADD_PATIENT_NEXT_OF_KIN = "/api/patient/next-of-kin",
    EDIT_PATIENT_NEXT_OF_KIN = "/api/patient/next-of-kin/edit",
    ADD_HEALTH_SUMMARY = "/api/patient/health-summaries/",
    UPDATE_HEALTH_SUMMARY = "/api/patient/health-summaries/edit",

    REQUEST_DOCTOR_TO_BE_PERSONAL_DOCTOR = "/api/doctor/personal/requests/",
    APPROVE_REQUEST_TO_BE_PERSONAL_DOCTOR = "/api/doctor/personal/requests/approve",
    REJECT_REQUEST_TO_BE_PERSONAL_DOCTOR = "/api/doctor/personal/requests/reject",

    ADD_APPOINTMENT_SLOT = "/api/appointment-slots/",
    ADD_APPOINTMENT_SLOT_MULTIPLE = "/api/appointment-slots/multiple",

    ADD_NEW_APPOINTMENT = "/api/appointments/",
    APPROVE_APPOINTMENT = "/api/appointments/approve/",
    REJECT_APPOINTMENT = "/api/appointments/reject/",

    CANCEL_APPOINTMENT = "/api/appointments/cancel/",

    ADD_DIRECT_MESSAGE = "/api/direct-message/",

    ADD_RECEPTIONIST = "/api/receptionists/",

    CONFIRM_PASSWORD_RESET = "/api/auth/password/reset/confirm",
    RESET_PASSWORD = "/api/auth/password/reset",

    REFRESH_TOKEN = "/api/auth/token/refresh",

    GET_SIGNED_GET_URL = "/api/s3/signed/get",
    GET_SIGNED_PUT_URL = "/api/s3/signed/put"
}
export enum DELETE_ENDPOINT {
    DELETE_WORK_HISTORY = "/api/doctor/work-history/",
    DELETE_DOCTOR_EDUCATION = "/api/doctor/education/",
    DELETE_DOCTOR_REVIEW = "/api/doctor/review/",
    DELETE_APPOINTMENT_SLOT = "/api/appointment-slots/",
    DELETE_RECEPTIONIST = "/api/receptionists/",
    DELETE_PATEINT_NEXT_OF_KIN = "/api/patient/next-of-kin/",
    DELETE_DOCTOR_SPECIALTY = "/api/specialties/",
    DELETE_HEALTH_SUMMARY = "/api/patient/health-summaries/{summaryId}",

    DELETE_USER = "/api/user/{userId}",
}

export enum ERROR_MESSAGES {
    NOT_INITIALIZED = "not_initialized",
    INVALID_REQUEST_TYPE = "invalid_request_type",
    SERVER_ERROR = "Server error occurred, try again later",
    NO_RESPONSE_ERROR = "No response received, try again later",
    REQUEST_SETUP_ERROR = "Error sending request, try again later"
}
enum REQUEST_TYPE {
    GET = 1,
    POST = 2,
    DEL = 3,
    PUT = 4
}
enum STORAGE_ITEM {
    TOKEN = "token",
    REFRESH_TOKEN = "refresh_token",
    USER_ID = "user_id",
    USER_TYPE = "user_type"
}
enum USER_DEFAULT_PAGE {
    ADMIN = "/admin",
    DOCTOR = "/doctor",
    PATIENT = "/patient"
}

/**
 *  Connection class:
 * 
 *  class that handles http requests and keeps track of jwt token
 * 
 *  Attributes:
 *  Public Methods:
 *      getRequest -> IResponse
 *      postRequest -> IResponse
 *      delRequest -> IResponse
 *      getS3GetUrl -> IResponse
 *      getS3PutUrl -> IResponse
 * 
 *  Private Methods:
 *      handleRequest -> IResponse
 */
export class Connection {

    public static userId: string = "";
    public static userType: string = "";
    public static token: string = "";
    public static refreshToken: string = "";

    //----   SET CONNECTION DETAILS   ----
    public static setConnectionDetail(token, refreshToken, userId: number, userType: number) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.userId = userId.toString();
        this.userType = userType.toString();

        this.setLocalStorage(token, refreshToken, userId.toString(), userType.toString());
    }

    //----   BUILD FROM LOCAL STORAGE   ----
    public static buildFromLocalStorage() {
        this.token = localStorage.getItem(STORAGE_ITEM.TOKEN) ?? "";
        this.refreshToken = localStorage.getItem(STORAGE_ITEM.REFRESH_TOKEN) ?? "";
        this.userId = localStorage.getItem(STORAGE_ITEM.USER_ID) ?? "";
        this.userType = localStorage.getItem(STORAGE_ITEM.USER_TYPE) ?? "";
    }

    //----   SET LOCAL STORAGE   ----
    private static setLocalStorage(token, refreshToken, userId: string, userType: string) {
        localStorage.setItem(STORAGE_ITEM.TOKEN, token);
        localStorage.setItem(STORAGE_ITEM.REFRESH_TOKEN, refreshToken);
        localStorage.setItem(STORAGE_ITEM.USER_ID, userId);
        localStorage.setItem(STORAGE_ITEM.USER_TYPE, userType);
    }

    //----   CLEAR LOCAL STORAGE   ----
    public static clearLocalStorage() {
        localStorage.clear();
    }

    //----   HANDLE HTTP REQUEST   ----
    private static handleRequest = async (reqType: string, data: any, config: AxiosRequestConfig, requestType: REQUEST_TYPE, retryCount = 1): Promise<IResponse> => {
        try {

            // set token
            config.headers = {
                "Authorization": `Bearer ${this.token}`
            }

            // only throw error if response >= 500
            config.validateStatus = (status) => {
                return status < 500;
            }

            let url = BaseUrl + reqType;
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
                    return { errorMessage: ERROR_MESSAGES.INVALID_REQUEST_TYPE, data: "" };
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
                    return { errorMessage: "unauthorized", data: "" };
                } else if (Connection.token === "") {
                    // send user to login page if 401 response received and there is no token
                    window.location.href = "/login";
                    return { errorMessage: "unauthorized", data: "" };
                }
            }

            // // send user to their respective home page if 403 response received
            // if (response.status === 403) {
            //     let errMsg: string | undefined = response.data.errorMessage;
            //     if (!errMsg) {
            //         switch (Connection.userId) {
            //             case USER_TYPE.ADMIN.toString():
            //                 window.location.href = USER_DEFAULT_PAGE.ADMIN;
            //                 break;
            //             case USER_TYPE.DOCTOR.toString():
            //                 window.location.href = USER_DEFAULT_PAGE.DOCTOR;
            //                 break;
            //             case USER_TYPE.PATIENT.toString():
            //                 window.location.href = USER_DEFAULT_PAGE.PATIENT;
            //                 break;
            //         }
            //         return { errorMessage: `forbidden`, data: "" };
            //     }
            //     return { errorMessage: `forbidden: ${response.data.errorMessage}`, data: "" };
            // }

            return response.data as IResponse;
        } catch (error: any) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that is greater than or equal to 500
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
                return { errorMessage: ERROR_MESSAGES.SERVER_ERROR, data: "" };
            } else if (error.request) {
                // The request was made but no response was received
                return { errorMessage: ERROR_MESSAGES.NO_RESPONSE_ERROR, data: "" };
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
                return { errorMessage: ERROR_MESSAGES.REQUEST_SETUP_ERROR, data: "" };
            }
        }
    }

    private static refreshJwtToken = async (): Promise<boolean> => {
        let data = {
            token: this.token,
            refreshToken: this.refreshToken
        }

        let response = await this.handleRequest(POST_ENDPOINT.REFRESH_TOKEN, data, {}, REQUEST_TYPE.POST, 2);
        if (response.errorMessage.length > 0) {
            console.log(response);
            return false;
        }

        let tokens: ITokenRefresh = response.data;
        this.token = tokens.token;
        this.refreshToken = tokens.refreshToken;

        this.setLocalStorage(this.token, this.refreshToken, this.userId, this.userType);

        return true;
    }

    public static getRequest = async (reqType: string, data: any): Promise<IResponse> => {
        return await this.handleRequest(reqType, data, {}, REQUEST_TYPE.GET);
    }

    public static postRequest = async (reqType: string, data: any, config: AxiosRequestConfig): Promise<IResponse> => {
        return await this.handleRequest(reqType, data, config, REQUEST_TYPE.POST);
    }

    public static delRequest = async (reqType: string): Promise<IResponse> => {
        return await this.handleRequest(reqType, "", {}, REQUEST_TYPE.DEL);
    }

    //---------     GET S3 GET URL    -------------
    public static getS3GetUrl = async (filePath: string): Promise<IResponse> => {
        let result: IResponse = await Connection.handleRequest(POST_ENDPOINT.GET_SIGNED_GET_URL, {
            filePath: filePath
        }, {}, REQUEST_TYPE.POST);

        return result;
    }

    //---------     UPLOAD FILE TO S3    -------------

    public static uploadFile = async (url: string, file: File, config: AxiosRequestConfig) => {
        try {
            config.headers = {
                "Content-Type": `${file.type}`,
            }

            let response = await Axios.put(url, file, config)

            console.log(response.status);
            return response.status;
        } catch (error) {
            console.log(error);
            return 500;
        }
    }
}


export enum HUB {
    DIRECT_MESSAGE_HUB = "/hubs/direct-message",
    NOTIFICATIONS_HUB = "/hubs/notifications",
}
//----   WS CONNECTION   ----

export class WsConnection {

    public static buildWs = (hubType: HUB): HubConnection => {
        const conn = new HubConnectionBuilder()
            .withUrl(BaseUrl + hubType,
                {
                    accessTokenFactory: () => Connection.token,
                    skipNegotiation: true,
                    transport: HttpTransportType.WebSockets
                })
            .withAutomaticReconnect()
            .build();

        return conn;
    }
}


