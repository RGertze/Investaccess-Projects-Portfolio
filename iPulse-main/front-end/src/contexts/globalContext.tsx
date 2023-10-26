
//----------------------------------
//     REACT IMPORTS
//----------------------------------

import { HubConnection } from "@microsoft/signalr";
import React, { createContext, useState, FC, useEffect } from "react";
import { Connection, GET_ENDPOINT, HUB, WsConnection } from "../connection";
import { NOTIFICATIONS_METHOD, NOTIFICATIONS_TYPE, THEME_TYPE } from "../interfaces/general_enums";
import { IGlobalContext, INotification, IResponse, IUser, UserType } from "../interfaces/general_interfaces";
import { errorToast, notificationToast } from "../shared-components/alert-components/toasts";
import { ITheme, LightTheme } from "../themes";


//----------------------------------
//     DEFAULT CONTEXT VALUES
//----------------------------------

const defaultContextValues: IGlobalContext = {
    isMobile: true,

    theme: LightTheme,
    setTheme: (themeType) => { },

    userId: 0,
    setUserId: (newUserId) => { },

    username: "",
    setUsername: () => { },

    userType: UserType.PUBLIC,
    setUserType: () => { },

    token: "",
    setToken: () => { },

    showChat: false,
    setShowChat: () => { },

    newMessage: false,
    setNewMessage: () => { },
    userBeingMessaged: {
        userId: 0,
        email: "",
        firstName: "",
        lastName: "",
        profilePicPath: "",
    },
    setUserBeingMessaged: () => { },
    clearUserBeingMessaged: () => { },

    showNotifications: false,
    setShowNotifications: () => { },

    newNotification: false,
    setNewNotification: () => { },

    notificationsWs: WsConnection.buildWs(HUB.NOTIFICATIONS_HUB),
    setNotificationsWs: () => { },

    newNotificationRecv: undefined,
    setNewNotificationRecv: () => { },

    logout: () => { }
};


//----------------------------------
//     CREATE CONTEXT
//----------------------------------

export const GlobalContext = createContext<IGlobalContext>(
    defaultContextValues
);


//----------------------------------
//     CREATE INTERFACES
//----------------------------------
interface IProps {
    children: React.ReactNode
}

//----------------------------------
//     CREATE COMPONENT
//----------------------------------

const GlobalProvider: FC<IProps> = ({ children }) => {

    //-------------------------
    //     USE STATE
    //-------------------------
    const [isMobile, setIsMobile] = useState<boolean>(defaultContextValues.isMobile);

    const [theme, setTheme] = useState<ITheme>(defaultContextValues.theme);

    const [userId, setUserId] = useState<number>(defaultContextValues.userId);
    const [username, setUsername] = useState<string>(defaultContextValues.username);
    const [userType, setUserType] = useState<UserType>(defaultContextValues.userType);
    const [token, setToken] = useState<string>(defaultContextValues.token);
    const [showChat, setShowChat] = useState<boolean>(defaultContextValues.showChat);
    const [newMessage, setNewMessage] = useState<boolean>(defaultContextValues.newMessage);
    const [userBeingMessaged, setUserBeingMessaged] = useState<IUser>(defaultContextValues.userBeingMessaged);

    const [newNotification, setNewNotification] = useState<boolean>(defaultContextValues.newNotification);
    const [showNotifications, setShowNotifications] = useState(defaultContextValues.showNotifications);
    const [notificationsWs, setNotificationsWs] = useState<HubConnection>(defaultContextValues.notificationsWs);
    const [newNotificationRecv, setNewNotificationRecv] = useState<INotification | undefined>(defaultContextValues.newNotificationRecv);

    const chatWithUser = (user: IUser) => {
        setUserBeingMessaged(user);
        setShowChat(true);
    }

    const clearUserBeingMessaged = () => {
        setUserBeingMessaged(defaultContextValues.userBeingMessaged);
    }

    const changeTheme = (themeType: THEME_TYPE) => {
        if (themeType === THEME_TYPE.LIGHT) {
            setTheme(LightTheme);
        }
        if (themeType === THEME_TYPE.DARK) {
        }
    }

    //-------------------------------
    //     COMPONENT DID MOUNT
    //-------------------------------
    useEffect(() => {

        // check if mobile
        checkIfMobile();

    }, []);

    //-------------------------
    //     ON TOKEN CHANGE
    //-------------------------
    useEffect(() => {

        if (token !== "") {

            // disconnect current ws
            disconnectWs();

            // create new ws for notifications
            setupWsConnection();

            // check for notifications
            checkForNotifications();
        }
    }, [token]);

    //---------------------------------
    //     ON NEW NOTIFICATION RECV
    //---------------------------------
    useEffect(() => {

        if (newNotificationRecv) {
            if (!showNotifications && newNotificationRecv.typeId !== NOTIFICATIONS_TYPE.MESSAGE) {
                notificationToast(newNotificationRecv, 2500);
                setNewNotification(true);
            }

            if (newNotificationRecv.typeId === NOTIFICATIONS_TYPE.MESSAGE) {
                if (!showChat)
                    notificationToast(newNotificationRecv, 2500);

                setNewMessage(true);
                return;
            }
        }

    }, [newNotificationRecv]);

    //---------------------------
    //     CHECK IF MOBILE
    //---------------------------
    const checkIfMobile = () => {
        const width = window.innerWidth;
        if (width <= 1100) {
            setIsMobile(true);
            return;
        }

        setIsMobile(false);
    }

    //---------------------------
    //     SETUP WS CONNECTION
    //---------------------------
    const setupWsConnection = async () => {
        const conn = WsConnection.buildWs(HUB.NOTIFICATIONS_HUB);

        try {
            await conn.start();
            conn.on(NOTIFICATIONS_METHOD.CLIENT_NOTIFICATION_RECEIVED, data => {
                setNewNotificationRecv(data);
            });
            setNotificationsWs(conn);
        } catch (ex: any) {
            console.log(ex);
            errorToast(ex, true, 2000);
        }
    }

    //-------------------------
    //     DISCONNECT WS
    //-------------------------
    const disconnectWs = () => {
        if (notificationsWs) {
            notificationsWs.off(NOTIFICATIONS_METHOD.CLIENT_NOTIFICATION_RECEIVED);
            notificationsWs.stop();
        }
    }


    //--------------------------------
    //     CHECK FOR NOTIFICATIONS
    //--------------------------------
    const checkForNotifications = async () => {
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.CHECK_FOR_NOTIFICATIONS + userId, "");
        if (result.errorMessage.length > 0) {
            console.log(result.errorMessage);
            errorToast(result.errorMessage, true);
            return;
        }
        setNewNotification(result.data.unseen);
    }

    //--------------------------------
    //          LOGOUT
    //--------------------------------
    const logout = () => {
        // clear local storage
        Connection.clearLocalStorage();

        // update context
        setUserId(0);
        setUsername("");
        setUserType(0);
        setToken("");
    }

    //-------------------------
    //     RETURN METHOD
    //-------------------------

    return (

        //-------------------------
        //     WRAP IN PROVIDER
        //-------------------------

        <GlobalContext.Provider value={{
            isMobile: isMobile,

            theme: theme,
            setTheme: changeTheme,

            userId: userId,
            setUserId: setUserId,

            username: username,
            setUsername: setUsername,

            userType: userType,
            setUserType: setUserType,

            token: token,
            setToken: setToken,

            showChat: showChat,
            setShowChat: setShowChat,

            newMessage: newMessage,
            setNewMessage: setNewMessage,
            userBeingMessaged: userBeingMessaged,
            setUserBeingMessaged: chatWithUser,
            clearUserBeingMessaged: clearUserBeingMessaged,

            newNotification: newNotification,
            setNewNotification: setNewNotification,

            showNotifications: showNotifications,
            setShowNotifications: setShowNotifications,

            notificationsWs: WsConnection.buildWs(HUB.NOTIFICATIONS_HUB),
            setNotificationsWs: setNotificationsWs,

            newNotificationRecv: newNotificationRecv,
            setNewNotificationRecv: setNewNotificationRecv,

            logout: logout
        }}>
            {children}
        </GlobalContext.Provider >

    );

};

export default GlobalProvider;
