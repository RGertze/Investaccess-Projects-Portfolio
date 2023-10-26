
//----------------------------------
//     REACT IMPORTS
//----------------------------------

import React, { createContext, useState, FC, useEffect } from "react";
import { IGlobalContext } from "../api/interfaces/interfaces";
import { Connection } from "../api/connection";


const defaultContextValues: IGlobalContext = {
    logout: () => { },
    email: "",
    setEmail: (email: string) => { },
    userId: 0,
    setUserId: (userId: number) => { },
    roleId: 0,
    setRoleId: (roleId: number) => { },
    isLoggedIn: false,
    setIsLoggedIn: (isLoggedIn: boolean) => { }
};

export const GlobalContext = createContext<IGlobalContext>(
    defaultContextValues
);


interface IProps {
    children: React.ReactNode
}

const GlobalProvider: FC<IProps> = ({ children }) => {

    const [email, setEmail] = useState('');
    const [userId, setUserId] = useState(0);
    const [roleId, setRoleId] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);


    const logout = () => {

        setEmail("");
        setIsLoggedIn(false);

        Connection.clearLocalStorage();

        window.location.href = "/login";
    }

    return (
        <GlobalContext.Provider value={{
            email: email,
            roleId: roleId,
            setRoleId: setRoleId,
            userId: userId,
            setUserId: setUserId,
            setEmail: setEmail,
            isLoggedIn: isLoggedIn,
            setIsLoggedIn: setIsLoggedIn,

            logout: logout,
        }}>
            {children}
        </GlobalContext.Provider >

    );

};

export default GlobalProvider;