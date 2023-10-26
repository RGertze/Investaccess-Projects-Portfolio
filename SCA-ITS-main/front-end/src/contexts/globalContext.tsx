
//----------------------------------
//     REACT IMPORTS
//----------------------------------

import React, { createContext, useState, FC, useEffect } from "react";
import { Connection } from "../connection";
import { IGlobalContext, UserType } from "../interfaces/general_interfaces";


//----------------------------------
//     DEFAULT CONTEXT VALUES
//----------------------------------

const defaultContextValues: IGlobalContext = {
    isMobile: false,

    userId: 0,
    setUserId: (newUserId) => { },


    userRegistrationComplete: false,
    setUserRegistrationComplete: () => { },

    username: "",
    setUsername: () => { },

    userType: UserType.PUBLIC,
    setUserType: () => { },

    token: "",
    setToken: () => { },

    studentsButtonFlashing: false,
    setStudentsButtonFlashing: () => { },

    logout: () => { },
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

    const [userId, setUserId] = useState<number>(defaultContextValues.userId);
    const [userRegistrationComplete, setUserRegistrationComplete] = useState<boolean>(defaultContextValues.userRegistrationComplete);
    const [username, setUsername] = useState<string>(defaultContextValues.username);
    const [userType, setUserType] = useState<UserType>(defaultContextValues.userType);
    const [token, setToken] = useState<string>(defaultContextValues.token);


    const [studentsFlashing, setStudentsFlashing] = useState(false);

    //-------------------------------
    //     COMPONENT DID MOUNT
    //-------------------------------
    useEffect(() => {

        checkIfMobile();

        // set event listener for window size
        window.addEventListener("resize", checkIfMobile);
        return () => {
            window.removeEventListener("resize", checkIfMobile);
        }

    }, []);

    //---------------------------
    //     LOGOUT
    //---------------------------
    const logout = () => {

        setUserId(0);
        setUsername("");
        setUserType(UserType.PUBLIC);
        setToken("");

        Connection.clearLocalStorage();
    }

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

    //-------------------------
    //     RETURN METHOD
    //-------------------------

    return (

        //-------------------------
        //     WRAP IN PROVIDER
        //-------------------------

        <GlobalContext.Provider value={{
            isMobile: isMobile,

            userId: userId,
            setUserId: setUserId,

            userRegistrationComplete: userRegistrationComplete,
            setUserRegistrationComplete: setUserRegistrationComplete,

            username: username,
            setUsername: setUsername,

            userType: userType,
            setUserType: setUserType,

            token: token,
            setToken: setToken,

            studentsButtonFlashing: studentsFlashing,
            setStudentsButtonFlashing: setStudentsFlashing,

            logout: logout,
        }}>
            {children}
        </GlobalContext.Provider >

    );

};

export default GlobalProvider;
