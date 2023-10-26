
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
    GET_NEWS_EVENTS = "news/",
    GET_USERS_TO_MESSAGE = "chat/users/",
    GET_ALL_MESSAGES_BETWEEN_USERS = "chat/messages/",
    GET_HOME_FILES_BY_SECTION = "home/files/section/",
    GET_SIGNED_NEWS_IMG_URL = "news/image/",
    GET_SIGNED_HOME_FILE_URL = "home/files/url/",

    GET_PARENT_DETAILS = "parent/details/",
    GET_ALL_TIMETABLES = "parents/files/timetables/all/",
    GET_ALL_CALENDARS = "parents/files/calendars/all/",
    GET_ALL_SUPPORT_DOCUMENTS = "parents/files/support/all/",
    GET_PARENT_FINANCES = "parent/finances/",
    GET_PARENT_FINANCIAL_STATEMENTS = "parent/statements/",

    GET_TERMS_AND_CONDITIONS_FILES = "terms-conditions/files/",

    GET_HOME_SECTION_LINKS = "home/links/",


    GET_SIGNED_GET_URL = "file/get/",
    GET_SIGNED_POST_URL = "file/add/"
}

export enum POST_TYPE {
    LOGIN = "login",
    UPLOAD = "upload",

    ADD_DIRECT_MESSAGE = "chat/messages/add",
    ADD_PARENT_REGISTRATION_REQUEST = "parents/registrations/add",

    ADD_TERMS_AND_CONDITIONS_ACCEPTED = "terms-conditions/accepted/add",
    CHECK_TERMS_AND_CONDITIONS_ACCEPTED = "terms-conditions/accepted/check",

    UPDATE_PARENT = "parent/update"
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
    INIT = "init"
}


//------------------------------------------
//       WS CONNECTION CLASS DEFINITION
//------------------------------------------

export class WSConnection {
    private socket: Socket;

    constructor(token: string, userID: string, appendMsg: any) {

        //-------------------------------
        //      CONNECT TO SERVER 
        //      AND LISTEN FOR MESSAGES 
        //      FOR TOPIC
        //-------------------------------
        this.socket = io(BaseUrl, { extraHeaders: { Authorization: `Bearer ${token}` } });

        //----------------------------
        //      ON MESSAGE RECEIVED    
        //----------------------------
        this.socket.on(userID, (data) => {
            appendMsg(data);
            console.log(data);
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
}

//---------------------------------------
//---------------------------------------
