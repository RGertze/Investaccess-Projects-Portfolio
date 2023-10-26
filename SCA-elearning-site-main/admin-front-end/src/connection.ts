
//---------     DEPENDENCY IMPORTS    -------------

import Axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import io, { Socket } from "socket.io-client";
import FileSaver from "file-saver";
import { SECTION } from "./components/base";


//---------     INTERFACE/ENUM IMPORTS    -------------



//---------     BASE URL    -------------

const BaseUrl = "https://elearning-swakopca.edu.na/";



//---------------------------------------
//          ENDPOINT ENUMS
//---------------------------------------

export enum GET_TYPE {
    GET_ENROLLED = "enrolled/",
    GET_COURSES_BY_GRADE = "courses/grade/",
    GET_COURSES_SHORT = "courses/short/",
    GET_COURSE_MARKS = "course/students/marks/",
    GET_COURSES_BY_GRADE_SHORT = "courses/grade/short/",
    GET_COURSE_TOPICS = "course/topics/",
    GET_SUBTOPICS = "course/topics/subtopics/",
    GET_MATERIALS_APPROVED = "course/materials/",
    GET_MATERIALS_UNAPPROVED = "course/materials/unapproved/",
    GET_ALL_MATERIALS_UNAPPROVED = "materials/unapproved/",
    GET_MATERIALS_MARKED_FOR_DELETION = "course/materials/marked/deletion/",
    GET_ALL_MATERIALS_MARKED_FOR_DELETION = "materials/marked/deletion/",
    GET_ASSIGNMENTS = "course/assignments/",
    GET_STUDENTS_IN_COURSE = "course/students/",
    GET_COURSES_TAKEN_BY_STUDENT = "students/courses/",
    GET_ALL_STUDENTS = "students/all/",
    GET_ALL_STUDENTS_SHORT = "students/all/short/",
    GET_ALL_STUDENTS_NOT_REGISTERED = "students/unregistered/all/",
    GET_STUDENTS_BY_GRADE = "students/grade/",
    GET_STUDENTS_WITH_MERRITS_BY_COURSE = "course/students/merrits/",
    GET_STUDENT_REPORTS = "students/reports/",
    GET_ASSIGNMENT_MARK = "course/assignments/marks/single/",
    GET_STAFF_MEMBERS = "staff/all/",
    GET_STAFF_SHORT = "staff/all/short/",
    GET_OTHER_COURSE_STAFF = "course/staff/other/",
    GET_COURSES_TAUGHT_BY_STAFF = "staff/courses/",
    GET_POSITIONS_SHORT = "positions/short/",
    GET_NEWS_EVENTS = "news/",
    GET_USERS_TO_MESSAGE = "chat/users/",
    GET_ALL_MESSAGES_BETWEEN_USERS = "chat/messages/",
    GET_HOME_FILES_BY_SECTION = "home/files/section/",
    SEARCH_ALL_STUDENTS = "students/all/search/",
    SEARCH_STUDENTS_IN_COURSE = "course/students/search/",
    SEARCH_STAFF = "staff/search/",

    CHECK_FOR_UNREAD_MESSAGES = "chat/messages/unread/",

    GET_ALL_PARENTS = "parents/all/",
    GET_ALL_TIMETABLES = "parents/files/timetables/all/",
    GET_ALL_CALENDARS = "parents/files/calendars/all/",
    GET_ALL_SUPPORT_DOCUMENTS = "parents/files/support/all/",
    GET_PARENT_FINANCES = "parent/finances/",
    GET_PARENT_FINANCIAL_STATEMENTS = "parent/statements/",
    GET_PARENT_STUDENTS = "parent/students/",
    GET_PARENT_REGISTRATION_REQUESTS = "parents/registrations/",
    GET_PARENT_REGISTRATION_STUDENT_INFO = "parent/registration/student-info/",

    GET_TERMS_AND_CONDITIONS_FILES = "terms-conditions/files/",

    GET_LINKS_MARKED_FOR_DELETION = "links/marked-for-deletion/",
    GET_ALL_LINKS_MARKED_FOR_DELETION = "links/marked-for-deletion/all/",
    GET_ALL_UNAPPROVED_LINKS = "links/unapproved/all/",
    GET_UNAPPROVED_LINKS_BY_TOPIC = "links/topic/unapproved/",
    GET_APPROVED_LINKS_BY_TOPIC = "links/topic/approved/",
    GET_HOME_SECTION_LINKS = "home/links/",

    GET_SIGNED_HOME_FILE_URL = "home/files/url/",
    GET_SIGNED_GET_URL = "file/get/",
    GET_SIGNED_POST_URL = "file/add/"
}

export enum POST_TYPE {
    LOGIN = "login",
    SET_ADMIN_RESOURCE_PASSWORD = "admin/resource-password/update",
    CHECK_ADMIN_RESOURCE_PASSWORD = "admin/resource-password/check",
    ADD_COURSE = "course/add",
    ADD_COURSE_STAFF = "course/staff/add",
    ADD_COURSE_TOPIC = "course/topics/add",
    ADD_SUBTOPIC = "course/topics/subtopics/add",
    ADD_POSITION = "position/add",
    ADD_STAFF_MEMBER = "staff/add",
    ADD_STUDENT = "students/add",
    ADD_STUDENT_REPORT = "students/reports/add",
    ADD_STUDENT_COURSE = "students/courses/add",
    ADD_ALL_STUDENT_COURSES = "students/courses/add/all",
    ADD_NEWS_EVENT = "news/add",
    ADD_SUGGESTION = "suggestions/add",
    ADD_DIRECT_MESSAGE = "chat/messages/add",
    ADD_HOME_FILE = "home/files/add",

    ADD_PARENT = "parents/add",
    ADD_FILE_FOR_PARENTS = "parents/files/add",
    ADD_PARENT_FINANCIAL_STATEMENT = "parent/statements/add",
    ADD_PARENT_STUDENT = "parent/students/add",

    ADD_TERMS_AND_CONDITIONS_FILE = "terms-conditions/add",

    ADD_LINK = "links/add",

    UPDATE_STAFF = "staff/update",
    UPDATE_COURSE = "course/update",
    UPDATE_TOPIC = "course/topics/update",
    APPROVE_MATERIAL = "course/material/approve",
    REJECT_MATERIAL = "course/material/reject",
    UPDATE_STUDENT = "students/update",
    UPDATE_STUDENT_COURSE = "students/courses/marks/update",
    UPDATE_STUDENT_ASSIGNMENT_MARK = "course/assignments/student/mark/update",
    CHANGE_PASSWORD = "users/password/change",

    MARK_MESSAGES_AS_READ = "chat/messages/mark-as-read",

    APPROVE_LINK = "link/approve",

    UPDATE_PARENT = "parent/update",
    UPDATE_PARENT_FINANCES_BALANCE = "parent/finances/balance/update",
    UPDATE_PARENT_FINANCES_NEXT_PAYMENT_DATE = "parent/finances/payment-date/update",

    DELETE_COURSE = "course/delete",
    DELETE_COURSE_TOPIC = "course/topics/delete",
    DELETE_STAFF = "staff/delete",
    DELETE_STUDENT = "students/delete",
    DELETE_STUDENT_COURSE = "students/courses/delete",
    DELETE_NEWS_EVENT = "news/delete",
    DELETE_HOME_FILE = "home/files/delete",
    REMOVE_COURSE_TAUGHT = "staff/courses/remove",

    DELETE_PARENT = "parent/delete",
    DELETE_FILE_FOR_PARENT = "parent/files/delete",
    DELETE_PARENT_FINANCIAL_STATEMENT = "parent/statements/delete",
    DELETE_PARENT_REGISTRATION_REQUEST = "parents/registrations/delete",
    DELETE_TERMS_AND_CONDITIONS_FILE = "terms-conditions/delete",

    DELETE_LINK = "links/delete"
}

//---------------------------------------
//---------------------------------------



//---------------------------------------
//       CONNECTION CLASS DEFINITION
//---------------------------------------

class Connection {

    //---------     GET REQ FUNC    -------------

    public static getReq = async (reqType: GET_TYPE, token: string, data: any) => {
        let response = await Axios.get(BaseUrl + reqType + JSON.stringify(data), {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data;
    }

    //---------     POST REQ FUNC    -------------

    public static postReq = async (reqType: POST_TYPE, token: string, data: any, config: AxiosRequestConfig) => {
        config.headers = {
            "Authorization": `Bearer ${token}`
        }
        let response = await Axios.post(BaseUrl + reqType, data, config);
        return response.data;
    }


    //---------     SAVE FILES S3    -------------

    public static saveFileS3 = async (url: string, fileName: string) => {
        FileSaver.saveAs(url, fileName,);
    }

    //---------     UPLOAD FILE TO S3    -------------

    public static uploadFile = async (url: string, file: File, config: AxiosRequestConfig) => {
        config.headers = {
            "Content-Type": `${file.type}`,
        }

        let response = await Axios.put(url, file, config)

        console.log(response.status);
        return response.status;
    }

}

export default Connection;

//---------------------------------------
//---------------------------------------




//------------------------------------------
//       WS CONNECTION ENUMS
//------------------------------------------

export enum WS_TOPICS {
    INIT = "init",
    DIRECT_MESSAGE_RECV = "direct-message-recv"
}


//------------------------------------------
//          WS CONNECTION 
//------------------------------------------

export class WSConnection {
    private socket: Socket;

    private appendMsg: any = null;
    private handleNewMsgAvail: any = null;

    private chattingWithUser: boolean = false;

    constructor(token: string, appendMsg: any, handleNewMsgAvail: any, chattingWithUser: boolean) {

        //-------------------------------
        //      CONNECT TO SERVER 
        //      AND LISTEN FOR MESSAGES 
        //      FOR TOPIC
        //-------------------------------

        this.socket = io(BaseUrl, { extraHeaders: { Authorization: `Bearer ${token}` } });


        //----   SET FUNCS   ----    

        this.appendMsg = appendMsg;
        this.handleNewMsgAvail = handleNewMsgAvail;

        //----   SET CURR SECT   ----

        this.chattingWithUser = chattingWithUser;


        //----   ON DIRECT MESSAGE RECEIVED   ----    

        this.socket.on(WS_TOPICS.DIRECT_MESSAGE_RECV, (data) => {
            if (this.chattingWithUser) {
                this.appendMsg(data);
            } else {
                this.handleNewMsgAvail(true);
            }
        });

    }

    //-------------------------------
    //      EMIT MESSAGES
    //-------------------------------
    public send(topic: WS_TOPICS, data: any) {
        this.socket.emit(topic, data);
    }

    //---------------------------------------
    //      DISCONNECT SOCKET FROM SERVER
    //---------------------------------------
    public disconnect() {
        this.socket.disconnect();
    }


    //-------------------------------
    //      SETTERS
    //-------------------------------

    //----   SET APPENDMSG   ----    

    public setAppendMsg = (fn: any) => {
        this.appendMsg = fn;
    }

    //----   SET HANDLEMSGNOTIF   ----    

    public setHandleNewMsgAvail = (fn: any) => {
        this.handleNewMsgAvail = fn;
    }

    //----   SET CHATTING WITH USER   ----    

    public setChattingWithUser = (chatting: boolean) => {
        this.chattingWithUser = chatting;
    }
}

//---------------------------------------
//---------------------------------------
