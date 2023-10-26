
import React from "react";
import { GlobalContext } from "../contexts/globalContext";
import comingSoonImg from "../assets/images/coming-soon.webp";
import { Route, Routes } from "react-router-dom";
import RegistrationPage from "./registration-page/RegistrationPage";
import AccountCreatedPage from "./account-created-page/accountCreated";
import LoginPage from "./login-page/loginPage";
import { StudentRegistrationForm } from "../parent-components/student-registration-form/studentRegistrationForm";
import { AdminRegistrationPage } from "../admin-components/admin-registration-page/adminRegistrationPage";
import { ParentRegistrationForm } from "../parent-components/parent-registration-form/parentRegistrationForm";


let PublicBase = () => {
    return (
        <GlobalContext.Consumer>
            {context => (

                <Routes>
                    <Route path="home" element={
                        <div style={{ padding: "20px" }}>

                        </div>
                    } />


                    <Route path="register" element={<RegistrationPage context={context} />} />
                    <Route path="account-created" element={<AccountCreatedPage email={context.username} />} />

                    <Route path="" element={<LoginPage context={context} />} />


                    {/* <Route path="testing" element={<StudentRegistrationForm context={context} studentNumber="220038627" />} />
                    <Route path="testing/admin" element={<AdminRegistrationPage context={context} />} />


                    <Route path="testing/parent" element={<ParentRegistrationForm context={context} parentId={2} />} /> */}
                </Routes>
            )}
        </GlobalContext.Consumer>
    );
}


export default PublicBase;