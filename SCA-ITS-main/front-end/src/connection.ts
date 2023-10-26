import axios from "axios";
import Axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { IResponse, ITokenRefresh, UserType } from "./interfaces/general_interfaces";

export const BaseUrl = "http://localhost:5000";

export enum GET_ENDPOINT {
    GET_USER = "/api/user/",

    GET_USER_PROFILE_PIC = "/api/user/profile-pic/",

    GET_REQUIRED_REGISTRATION_DOCS_FOR_PARENTS = "/api/registration/required-docs/parents/",
    GET_UPLOADED_PARENT_REGISTRATION_DOCS = "/api/registration/parent/required-docs/uploaded",
    GET_REGISTRATION_STATUS_FOR_PARENT = "/api/registration/parent/status/",
    REQUEST_PARENT_REGISTRATION_APPROVAL = "/api/registration/parent/approval/request/",

    GET_REGISTRATION_REQUESTS = "/api/registration/requests",
    GET_PARENT_REGISTRATION_REQUESTS = "/api/admin/parent/registration/all",
    GET_STUDENT_REGISTRATION_REQUESTS = "/api/admin/student/registration/all",

    GET_PARENT_REGISTRATION_FEE_FILES = "/api/registration/parent/registration-fee/files/{parentId}",
    GET_STUDENT_THERAPY_FILES = "/api/registration/student/therapy/files/{studentNumber}",

    GET_PARENT_PROFILE = "/api/parent/profile/",

    GET_ALL_MEDICAL_CONDITIONS = "/api/medical-conditions/",
    GET_ALL_MEDICAL_CONDITIONS_FOR_STUDENTS = "/api/student-medical-conditions/{studentNumber}",

    GET_ALL_NON_SCA_SIBLINGS_FOR_STUDENT = "/api/students/non-sca-siblings/{studentNumber}",
    GET_ALL_OTHER_PARENTS_FOR_PARENT = "/api/other-parents/{id}",
    GET_ALL_STUDENT_OTHER_PARENTS = "/api/student/other-parents/{studentNumber}",

    GET_STUDENT_INTERVIEW_DETAILS = "/api/registration/student/interview/{studentNumber}",

    GET_STUDENT = "/api/student/",
    GET_ALL_STUDENTS_FOR_PARENT = "/api/student/parent/all/",
    GET_REQUIRED_REGISTRATION_DOCS_FOR_STUDENTS = "/api/registration/required-docs/students/",
    GET_UPLOADED_STUDENT_REGISTRATION_DOCS = "/api/registration/student/required-docs/uploaded",
    GET_REGISTRATION_STATUS_FOR_STUDENT = "/api/registration/student/status/",
    REQUEST_STUDENT_REGISTRATION_APPROVAL = "/api/registration/student/approval/request/",

    GET_STAFF = "/api/staff/",
    GET_COURSE = "/api/courses/",

    GET_ALL_COURSE_CATEGORIES = "/api/course-categories",
    GET_ALL_COURSE_TYPES = "/api/courses/course-types/all",

    GET_COURSES_FOR_STAFF = "/api/courses/all/staff/",
    GET_COURSES_FOR_STUDENT = "/api/courses/all/students/",

    GET_STUDENTS_FOR_STAFF = "/api/student/staff/all/",

    ADMIN_GET_DASHBOARD = "/api/admin/dashboard",

    ADMIN_GET_PARENT_BALANCES = "/api/finances/statements/balances",

    ADMIN_GET_ALL_PARENTS = "/api/parent/all",
    ADMIN_GET_ALL_STUDENTS = "/api/student/all",
    ADMIN_GET_ALL_STAFF = "/api/staff/all",
    ADMIN_GET_ALL_COURSES = "/api/courses/all",

    ADMIN_GET_ALL_COURSE_STAFF = "/api/courses/staff/",
    ADMIN_GET_ALL_COURSE_STUDENTS = "/api/courses/students/",

    GET_ALL_PROGRESS_REPORTS = "/api/progress-reports/all",
    GET_PROGRESS_REPORT = "/api/progress-reports/",
    GET_ALL_PROGRESS_REPORT_CATEGORIES = "/api/progress-reports/categories/all/",
    GET_ALL_ASSESSMENTS_FOR_CATEGORY = "/api/progress-reports/categories/assessments/all/",
    GET_ALL_COURSE_PROGRESS_REPORTS = "/api/courses/progress-reports/",
    GET_STUDENT_PROGRESS_REPORTS = "/api/student/progress-reports/",
    GET_STUDENT_ASSESSMENTS = "/api/student/progress-reports/assessments",
    GET_ALL_STUDENT_ASSESSMENTS_FOR_COURSE_PROGRESS_REPORT = "/api/progress-reports/categories/assessments/students/",
    GET_ALL_ASSESSMENTS_FOR_PROGRESS_REPORT = "/api/progress-reports/categories/assessments/",

    GET_ALL_EXAM_MARKS_FOR_PROGRESS_REPORT = "/api/progress-reports/exam/students/",

    GET_ALL_REPORT_GROUPS = "/api/reports/groups",
    GET_STUDENT_REPORTS = "/api/reports/",
    GET_REPORT_DETAILS = "/api/reports/details/{reportId}",
    GET_PERSONA_CATEGORIES = "/api/reports/persona-categories/",
    GET_ALL_PERSONAS = "/api/reports/personas",
    GET_COURSE_REMARKS = "/api/reports/course-remarks/",
    GET_PERSONA_GRADES = "/api/reports/persona-grades/",

    RERUN_SINGLE_GENERATED_REPORT_FILE = "/api/reports/generate/re-run/{id}",
    RERUN_ALL_GENERATED_REPORT_FILES = "/api/reports/generate/re-run/all/{id}",



    GET_ALL_PRE_PRIMARY_PROGRESS_REPORTS = "/api/pre-primary-progress-reports",
    GET_STUDENT_PRE_PRIMARY_PROGRESS_REPORTS_BY_PROGRESS_REPORT = "/api/pre-primary-progress-reports/{id}/students",
    GET_STUDENT_PRE_PRIMARY_PROGRESS_REPORTS = "/api/pre-primary-progress-reports/students/{studentNumber}",
    GET_STUDENT_PRE_PRIMARY_PROGRESS_REPORT = "/api/pre-primary-progress-reports/{id}",
    GET_STUDENT_PRE_PRIMARY_PROGRESS_REPORT_BY_REPORT_ID = "/api/pre-primary-progress-reports/by-report/{reportId}",

    GET_DEV_GROUPS = "/api/pre-primary-progress-reports/development-groups",
    GET_DEV_CATEGORIES = "/api/pre-primary-progress-reports/development-categories",
    GET_DEV_ASSESSMENTS = "/api/pre-primary-progress-reports/development-assessments",
    GET_DEV_ASSESSMENT_GRADES = "/api/pre-primary-progress-reports/development-assessment-grades/{studentProgressReportId}",



    ADMIN_GET_REPORT_GENERATION_JOBS = "/api/reports/generate/",
    ADMIN_GET_GENERATED_REPORT_FILES = "/api/reports/generate/files/",

    GET_ALL_GENERATED_REPORTS_FOR_STUDENT = "/api/reports/students/{studentNumber}/generated/",


    GET_PARENT_FINANCIAL_STATEMENT = "/api/finances/statements/{parentId}",
    GET_PARENT_FINANCIAL_STATEMENT_AS_PDF = "/api/finances/statements/{parentId}/pdf",
    GET_PROOF_OF_DEPOSITS_FOR_PARENT = "/api/finances/proof-of-deposit/{parentId}",
    GET_PENDING_PROOF_OF_DEPOSITS = "/api/finances/proof-of-deposit/pending",

    ADMIN_GET_FEES_FOR_GRADES = "/api/finances/fees-for-grades",
}
export enum POST_ENDPOINT {
    LOGIN = "/api/auth/login",
    REGISTER_USER = "/api/auth/account/register",

    UPDATE_USER = "/api/user/update",
    UPDATE_USER_PROFILE_PIC = "/api/user/profile-pic",

    EDIT_PARENT_PROFILE = "/api/parent/profile/edit",

    ADD_REQUIRED_REGISTRATION_DOC = "/api/registration/required-docs",
    EDIT_REQUIRED_REGISTRATION_DOC = "/api/registration/required-docs/edit",

    UPLOAD_PARENT_REQUIRED_REGISTRATION_DOC = "/api/registration/parents/files/upload",
    DELETE_PARENT_REGISTRATION_FILE = "/api/registration/parents/files/delete",

    UPLOAD_STUDENT_REQUIRED_REGISTRATION_DOC = "/api/registration/students/files/upload",
    DELETE_STUDENT_REGISTRATION_FILE = "/api/registration/students/files/delete",

    APPROVE_PARENT_REGISTRATION = "/api/admin/parent/registration/approve",
    REJECT_PARENT_REGISTRATION = "/api/admin/parent/registration/reject",

    EDIT_STUDENT_REGISTRATION_STATUS = "/api/registration/student/status/edit",
    EDIT_PARENT_REGISTRATION_STATUS = "/api/registration/parent/status/edit",

    ADD_STUDENT_THERAPY_FILE = "/api/registration/student/therapy/files",
    ADD_PARENT_REGISTRATION_FEE_FILE = "/api/registration/parent/registration-fee/files",

    APPROVE_STUDENT_REGISTRATION = "/api/admin/student/registration/approve",
    REJECT_STUDENT_REGISTRATION = "/api/admin/student/registration/reject",

    REFRESH_TOKEN = "/api/auth/token/refresh",

    EDIT_STUDENT_MEDICAL_CONDITIONS = "/api/student-medical-conditions/",

    ADD_NON_SCA_SIBLING = "/api/students/non-sca-siblings",
    EDIT_NON_SCA_SIBLING = "/api/students/non-sca-siblings/edit",

    ADD_OTHER_PARENT = "/api/other-parents",
    EDIT_OTHER_PARENT = "/api/other-parents/edit",

    ADD_STUDENT_OTHER_PARENT = "/api/student/other-parents/",

    ADD_STUDENT = "/api/student/add",
    EDIT_STUDENT = "/api/student/edit",
    EDIT_STUDENTS_BULK = "/api/student/edit/bulk",

    UPDATE_STUDENT_INTERVIEW_COMMENTS = "/api/registration/student/interview/comments",
    UPDATE_STUDENT_INTERVIEW_DATE = "/api/registration/student/interview/date",

    USER_EDIT_PASSWORD = "/api/user/password/edit",

    ADMIN_ADD_PARENT = "/api/parent/add",
    ADMIN_ADD_STUDENT = "/api/student/admin/add",
    ADMIN_ADD_STAFF = "/api/staff/",
    ADMIN_ADD_COURSE_CATEGORY = "/api/course-categories",
    ADMIN_ADD_COURSE = "/api/courses/",
    ADMIN_ADD_COURSE_STAFF = "/api/courses/staff/",
    ADMIN_ADD_COURSE_STUDENT = "/api/courses/students/",
    ADMIN_ADD_PROGRESS_REPORT = "/api/progress-reports/",
    ADMIN_ADD_PROGRESS_REPORT_CATEGORY = "/api/progress-reports/categories/",
    ADMIN_ADD_PROGRESS_REPORT_ASSESSMENT = "/api/progress-reports/categories/assessments/",
    ADMIN_ADD_COURSE_PROGRESS_REPORT = "/api/courses/progress-reports/",

    ADMIN_EDIT_PASSWORD = "/api/admin/users/password/edit",

    ADMIN_EDIT_COURSE_CATEGORY = "/api/course-categories/edit",
    ADMIN_EDIT_COURSE = "/api/courses/edit",

    ADMIN_UPDATE_PROGRESS_REPORT_TEMPLATE = "/api/progress-reports/edit",
    ADMIN_UPDATE_PROGRESS_REPORT_CATEGORY = "/api/progress-reports/categories/edit",
    ADMIN_UPDATE_PROGRESS_REPORT_ASSESSMENT = "/api/progress-reports/categories/assessments/edit",

    UPDATE_STUDENT_ASSESSMENT_MARK = "/api/student/progress-reports/assessments/update",
    UPDATE_STUDENT_EXAM_MARK = "/api/student/progress-reports/exam/update",

    UPDATE_REPORT_DETAILS = "/api/reports/details",
    UPDATE_COURSE_REMARK = "/api/reports/course-remarks/",
    UPDATE_PERSONA_GRADE = "/api/reports/persona-grades/",


    ADMIN_ADD_PRE_PRIMARY_PROGRESS_REPORT = "/api/pre-primary-progress-reports/add",
    ADMIN_EDIT_PRE_PRIMARY_PROGRESS_REPORT = "/api/pre-primary-progress-reports/edit",
    UPDATE_DEVELOPMENT_ASSESSMENT_GRADE = "/api/pre-primary-progress-reports/grade/edit",

    ADMIN_ADD_REPORT_GROUP = "/api/reports/groups",
    ADMIN_ADD_REPORT_GENERATION_JOB = "/api/reports/generate/",

    ADMIN_ADD_STATEMENT_ITEM = "/api/finances/statements",
    ADD_PROOF_OF_DEPOSIT = "/api/finances/proof-of-deposit",
    ADMIN_EDIT_PROOF_OF_DEPOSIT_STATUS = "/api/finances/proof-of-deposit/status/edit",
    EDIT_PROOF_OF_DEPOSIT = "/api/finances/proof-of-deposit/edit",

    EDIT_FEES_FOR_GRADES = "/api/finances/fees-for-grades",


    ADMIN_SYNC_ALL_ITS_USERS = "/api/moodle-sync/its-users",


    GET_SIGNED_GET_URL = "/api/s3/signed/get",
    GET_SIGNED_PUT_URL = "/api/s3/signed/put"
}
export enum DELETE_ENDPOINT {
    ADMIN_DELETE_REQUIRED_REGISTRATION_DOC = "/api/registration/required-docs/{id}",
    ADMIN_DELETE_COURSE_STAFF = "/api/courses/staff/delete",
    ADMIN_DELETE_COURSE_STUDENTS = "/api/courses/students/delete",
    ADMIN_DELETE_PROGRESS_REPORT_TEMPLATE = "/api/progress-reports/",
    ADMIN_DELETE_PROGRESS_REPORT_CATEGORY = "/api/progress-reports/categories/",
    ADMIN_DELETE_PROGRESS_REPORT_ASSESSMENT = "/api/progress-reports/categories/assessments/",
    ADMIN_DELETE_COURSE_PROGRESS_REPORT = "/api/courses/progress-reports/delete/",
    ADMIN_DELETE_REPORT_GROUP = "/api/reports/groups/",
    ADMIN_DELETE_REPORT_GENERATION_JOB = "/api/reports/generate/",

    ADMIN_DELETE_USER = "/api/user/{userId}",

    ADMIN_DELETE_COURSE_CATEGORY = "/api/course-categories/delete",
    ADMIN_DELETE_COURSE = "/api/courses/{courseId}",

    ADMIN_DELETE_PRE_PRIMARY_PROGRESS_REPORT = "/api/pre-primary-progress-reports/{id}",

    DELETE_STUDENT = "/api/student/{studentNumber}",

    DELETE_NON_SCA_SIBLING = "/api/students/non-sca-siblings/{id}",
    DELETE_OTHER_PARENT = "/api/other-parents/{id}",
    DELETE_STUDENT_OTHER_PARENT = "/api/student/other-parents/{studentNumber}/{parentId}",

    DELETE_STUDENT_THERAPY_FILE = "/api/registration/student/therapy/files/{filePath}",
    DELETE_PARENT_REGISTRATION_FEE_FILE = "/api/registration/parent/registration-fee/files/{filePath}",

    ADMIN_DELETE_PROOF_OF_DEPOSIT = "/api/finances/proof-of-deposit/{id}",
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
    USERNAME = "username",
    TOKEN = "token",
    REFRESH_TOKEN = "refresh_token",
    USER_ID = "user_id",
    USER_TYPE = "user_type",
    IS_APPROVED = "is_approved"
}

enum USER_DEFAULT_PAGE {
    ADMIN = "/admin",
    PARENT = "/parent",
    STAFF = "/staff"
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
        this.isApproved = isApproved.toString();

        this.setLocalStorage(username, token, refreshToken, userId.toString(), userType.toString(), isApproved.toString());
    }

    //----   BUILD FROM LOCAL STORAGE   ----
    public static buildFromLocalStorage() {
        this.username = localStorage.getItem(STORAGE_ITEM.USERNAME) ?? "";
        this.token = localStorage.getItem(STORAGE_ITEM.TOKEN) ?? "";
        this.refreshToken = localStorage.getItem(STORAGE_ITEM.REFRESH_TOKEN) ?? "";
        this.userId = localStorage.getItem(STORAGE_ITEM.USER_ID) ?? "";
        this.userType = localStorage.getItem(STORAGE_ITEM.USER_TYPE) ?? "";
        this.isApproved = localStorage.getItem(STORAGE_ITEM.IS_APPROVED) ?? "";
    }

    //----   SET LOCAL STORAGE   ----
    private static setLocalStorage(username, token, refreshToken, userId: string, userType: string, isApproved: string) {
        localStorage.setItem(STORAGE_ITEM.USERNAME, username);
        localStorage.setItem(STORAGE_ITEM.TOKEN, token);
        localStorage.setItem(STORAGE_ITEM.REFRESH_TOKEN, refreshToken);
        localStorage.setItem(STORAGE_ITEM.USER_ID, userId);
        localStorage.setItem(STORAGE_ITEM.USER_TYPE, userType);
        localStorage.setItem(STORAGE_ITEM.IS_APPROVED, isApproved);
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

            if (response.status === 400) {
                return { errorMessage: `Bad request: ${(response.data.errorMessage !== undefined) ? response.data.errorMessage : ""}`, data: "" };
            }

            if (response.status === 401) {
                // refresh token if it exists and try again
                if (Connection.token !== "" && retryCount === 1) {
                    if (await this.refreshJwtToken()) {
                        // retry and increase retry count
                        return this.handleRequest(reqType, data, config, requestType, retryCount + 1);
                    }

                    // send user to login page
                    window.location.href = "/";
                    return { errorMessage: "unauthorized", data: "" };
                } else if (Connection.token === "") {
                    // send user to login page if 401 response received and there is no token
                    window.location.href = "/";
                    return { errorMessage: "unauthorized", data: "" };
                }
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

        this.setLocalStorage(this.username, this.token, this.refreshToken, this.userId, this.userType, this.isApproved);

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

    //---------     DOWNLOAD FILE FROM S3    -------------

    public static downloadS3File = async (url: string, config: AxiosRequestConfig): Promise<IResponse> => {
        try {
            let response = await Axios.get(url, config)

            return { errorMessage: "", data: response.data };
        } catch (error) {
            console.log(error);
            return { errorMessage: "Error occured retrieving file, try again later", data: "" };
        }
    }

    //---------     DOWNLOAD FILE FROM BACK-END    -------------

    public static downloadBackEndFile = async (url: string, config: AxiosRequestConfig): Promise<IResponse> => {
        try {
            // set token
            config.headers = {
                "Authorization": `Bearer ${this.token}`
            }

            let response = await Axios.get(url, config)

            return { errorMessage: "", data: response.data };
        } catch (error) {
            console.log(error);
            return { errorMessage: "Error occured retrieving file, try again later", data: "" };
        }
    }
}

