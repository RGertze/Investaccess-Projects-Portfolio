// react imports
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Connection, { POST_TYPE } from "../connection";
import { ILogin, IResponse } from "../interfaces";


// interface definitions

interface IProps {
    login(username: string, token: string): void
}


const LoginSection = (props: IProps) => {

    //----   STATE   ----

    const [staffID, setStaffID] = useState("");
    const [password, setPassword] = useState("");


    //----   REACT-ROUTER NAVIGATE HOOK   ----

    const navigate = useNavigate();


    //----   KEYPRESS HANDLER   ----

    const onKeyPressHandler = (ev: React.KeyboardEvent<HTMLInputElement>) => {
        if (ev.key === "Enter") {
            login();
        }
    }


    //----------    POST LOGIN   ------------

    const login = async () => {

        let data: ILogin = {
            loginType: 0,
            username: staffID,
            password: password
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.LOGIN, "", data, {});


        if (result.stat !== "ok") {
            alert(result.error);
            return;
        }

        props.login(staffID, result.token);
        navigate("/student/home");
    }


    //----------    RENDER   ------------

    return (
        <div id="login-container">
            <div id="login-form">
                <label className="login-labels">Username:</label>
                <input className="login-input" onChange={(ev) => setStaffID(ev.target.value)} />
                <br></br>
                <label className="login-labels">Password:</label>
                <input className="login-input" type="password" onKeyPress={onKeyPressHandler} onChange={(ev) => setPassword(ev.target.value)} />
                <br></br>
                <div id="login-submit" onClick={login}>
                    <h3>Login</h3>
                </div>
            </div>
        </div>
    );
}

export default LoginSection;
