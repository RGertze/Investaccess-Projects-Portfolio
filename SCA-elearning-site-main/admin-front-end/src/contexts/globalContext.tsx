
//----------------------------------
//     REACT IMPORTS
//----------------------------------

import React, { createContext, useState, FC } from "react";
import Connection, { GET_TYPE, WSConnection, WS_TOPICS } from "../connection";

//----------------------------------
//     INTERFACE IMPORTS
//----------------------------------

import { ICheckForUnreadMessages, ICheckUnreadMsgsResult, IGlobalContextState, IResponse } from "../interfaces";


//----------------------------------
//     DEFAULT CONTEXT VALUES
//----------------------------------

const defaultContextValues: IGlobalContextState = {
    token: "",
    setToken: () => { },

    newMessagesAvail: false,
    setNewMessagesAvail: () => { },

    wsConn: null,
    setWsConn: () => { },

    checkForUnreadMessages: () => { }
};


//----------------------------------
//     CREATE CONTEXT
//----------------------------------

export const GlobalContext = createContext<IGlobalContextState>(
    defaultContextValues
);


//----------------------------------
//     CREATE COMPONENT
//----------------------------------

const GlobalProvider: FC = ({ children }) => {

    //-------------------------
    //     USE STATE
    //-------------------------

    const [token, setToken] = useState<string>(defaultContextValues.token);
    const [userID, setUserID] = useState<number>(0);
    const [newMessagesAvail, setNewMessagesAvail] = useState<boolean>(defaultContextValues.newMessagesAvail);
    const [wsConn, setWsConn] = useState<WSConnection>(defaultContextValues.wsConn);

    //-------------------
    //     SET TOKEN
    //-------------------

    const setTokenState = (newtoken: string) => {
        setToken(newtoken);
    };

    //-------------------------
    //     SET NEW MSGS AVAIL
    //-------------------------

    const setNewMsgsAvail = (newMsgAvail: boolean) => {
        setNewMsgsAvail(newMsgAvail);
    };

    //-------------------
    //     SET WSCONN
    //-------------------

    const setWsConnState = (userID: string, appendMsg: any) => {

        //----   SEND WS INIT MESSAGE   ----

        let newWsConn = new WSConnection(token, appendMsg, setNewMessagesAvail, false);
        newWsConn.send(WS_TOPICS.INIT, userID);

        setWsConn(newWsConn);

        //----   SET USER ID   ----

        setUserID(parseInt(userID));

    };


    //------------------------------------
    //      CHECK FOR UNREAD MESSAGES
    //------------------------------------

    const checkForUnreadMessages = async () => {
        let data: ICheckForUnreadMessages = {
            userID: userID
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.CHECK_FOR_UNREAD_MESSAGES, token, data);

        if (result.stat === "ok") {
            let res: ICheckUnreadMsgsResult = result.data;
            if (res.newMessages === 0) {
                setNewMessagesAvail(false);
            } else {
                setNewMessagesAvail(true);
            }

            return;
        }

        alert(result.error);
    }


    //-------------------------
    //     RETURN METHOD
    //-------------------------

    return (

        //-------------------------
        //     WRAP IN PROVIDER
        //-------------------------

        <GlobalContext.Provider
            value={{
                setToken: setTokenState,
                token: token,

                newMessagesAvail: newMessagesAvail,
                setNewMessagesAvail: setNewMessagesAvail,

                setWsConn: setWsConnState,
                wsConn: wsConn,

                checkForUnreadMessages: checkForUnreadMessages
            }}
        >
            {children}
        </GlobalContext.Provider>

    );
};

export default GlobalProvider;
