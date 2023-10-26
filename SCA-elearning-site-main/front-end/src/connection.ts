
//---------     DEPENDENCY IMPORTS    -------------

import Axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import io, { Socket } from "socket.io-client";
import FileSaver from "file-saver";


//---------     INTERFACE/ENUM IMPORTS    -------------



//---------     BASE URL    -------------

const BaseUrl = "https://elearning-swakopca.edu.na/";



//---------------------------------------
//          ENDPOINT ENUMS
//---------------------------------------

export enum GET_TYPE {
    GET_ENROLLED = "enrolled/",
    GET_COURSES_BY_GRADE = "courses/grade/",
    GET_COURSE_OVERVIEW = "course/overview/",
    GET_COURSE_TOPICS = "course/topics/",
    GET_SUBTOPICS = "course/topics/subtopics/",
    GET_MATERIALS = "course/materials/",
    GET_MATERIAL_PATH = "course/materials/path/",
    GET_ASSIGNMENTS = "course/assignments/",
    GET_COURSE_ANNOUNCEMENTS = "course/announcements/",
    GET_ASSIGNMENT_PATH = "course/assignments/path/",
    GET_ASSIGNMENT_MARKS = "course/assignments/marks/",
    GET_ASSESSMENT_MARKS = "student/assessments/marks/",
    GET_COURSE_MARKS = "course/students/marks/",
    GET_STUDENT_REPORTS = "students/reports/",
    GET_STUDENT_ASSIGNMENT_PATHS = "course/assignments/student/path/",
    GET_STUDENT_DETAILS = "students/details/single/",
    GET_NEWS_EVENTS = "news/",
    GET_USERS_TO_MESSAGE = "chat/users/",
    GET_ALL_MESSAGES_BETWEEN_USERS = "chat/messages/",
    GET_HOME_FILES_BY_SECTION = "home/files/section/",
    GET_SIGNED_NEWS_IMG_URL = "news/image/",
    GET_SIGNED_HOME_FILE_URL = "home/files/url/",

    GET_ROOT_RESOURCE_TOPICS_FOR_STUDENT = "resources/topics/root/students/",
    GET_SUB_RESOURCE_TOPICS_FOR_STUDENT = "resources/topics/sub/students/",
    GET_RESOURCE_FILES_BY_TOPIC = "resources/files/topic/",

    GET_QUIZZES_BY_COURSE = "course/quizzes/",
    GET_QUIZ_QUESTIONS = "course/quiz/questions/",
    GET_QUIZ_ANSWERS = "course/quiz/question/answers/",

    GET_STUDENT_QUIZ_ATTEMPTS = "student/quizzes/",
    GET_STUDENT_QUIZ_FILES = "student/quiz/question/files/",
    GET_STUDENT_QUIZ_UNSTRUCTURED_ANSWERS = "student/quiz/question/answers/unstructured/",
    GET_STUDENT_QUIZ_STRUCTURED_ANSWER = "student/quiz/question/answers/structured/",

    GET_APPROVED_LINKS_BY_TOPIC = "links/topic/approved/",
    GET_LINKS_BY_TOPIC = "links/topic/",
    GET_COURSE_ASSIGNMENT_LINKS = "assignment/links/",
    GET_HOME_SECTION_LINKS = "home/links/",

    CHECK_FOR_UNREAD_MESSAGES = "chat/messages/unread/",

    GET_SIGNED_GET_URL = "file/get/",
    GET_SIGNED_POST_URL = "file/add/"
}

export enum POST_TYPE {
    LOGIN = "login",
    UPLOAD = "upload",
    ADD_STUDENT_ASSIGNMENT = "course/assignments/student/add",
    ADD_SUGGESTION = "suggestions/add",
    ADD_DIRECT_MESSAGE = "chat/messages/add",
    MARK_MESSAGES_AS_READ = "chat/messages/mark-as-read",
    ADD_STUDENT_QUIZ = "student/quizzes/add",
    ADD_STUDENT_QUIZ_UNSTRUCTURED_ANSWER = "student/quiz/answers/unstructured/add",
    ADD_STUDENT_QUIZ_STRUCTURED_ANSWER = "student/quiz/answers/structured/add",
    ADD_STUDENT_QUIZ_FILE = "student/quiz/answers/file/add",
    END_STUDENT_QUIZ_ATTEMPT = "student/quiz/end",
    DELETE_STUDENT_ASSIGNMENT = "course/assignments/student/delete",
    DELETE_STUDENT_QUIZ_FILE = "student/quiz/answers/file/delete"
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


    //---------     SAVE FILES    -------------

    public static saveFile = async (filePath: string, fileName: string) => {
        FileSaver.saveAs(BaseUrl + filePath, fileName);
    }

    //---------     SAVE FILES S3    -------------

    public static saveFileS3 = async (url: string, fileName: string) => {
        FileSaver.saveAs(url, fileName,);
    }

    //---------     UPLOAD FILE S3    -------------

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
