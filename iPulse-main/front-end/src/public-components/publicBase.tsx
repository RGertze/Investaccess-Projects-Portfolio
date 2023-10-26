
import React from "react";
import { GlobalContext } from "../contexts/globalContext";
import comingSoonImg from "../assets/images/coming-soon.webp";
import { Route, Routes } from "react-router-dom";
import RegistrationPage from "./registration-page/RegistrationPage";
import AccountCreatedPage from "./account-created-page/accountCreated";
import LoginPage from "./login-page/loginPage";
import PasswordResetPage from "../shared-components/password-reset-page/passwordResetPage";
import AllDoctorsPage from "../shared-components/all-doctors-page/allDoctorsPage";


let PublicBase = () => {
    return (
        <GlobalContext.Consumer>
            {context => (

                <Routes>
                    <Route path="" element={
                        <div style={{ padding: "20px" }}>
                            <img className="rounded" src={comingSoonImg} height={200} width={200} />
                        </div>
                    } />

                    <Route path="doctors" element={<AllDoctorsPage context={context} />} />

                    <Route path="register" element={<RegistrationPage context={context} />} />
                    <Route path="account-created" element={<AccountCreatedPage email={context.username} />} />

                    <Route path="login" element={<LoginPage context={context} />} />
                    <Route path="password-reset" element={<PasswordResetPage context={context} />} />
                </Routes>
            )}
        </GlobalContext.Consumer>
    );
}


export default PublicBase;