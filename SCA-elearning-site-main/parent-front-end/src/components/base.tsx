//  react imports
import React, { Component } from "react";

//  connection imports
import Connection, { POST_TYPE, WSConnection, WS_TOPICS } from "../connection";

//  component imports
import Navbar from "./navbar";
import LoginSection from "./loginSection";
import { ICheckTermsAndConditionsAccepted, ILogin } from "../interfaces";
import RegistrationSection from "./registrationSection/registrationSection";
import NewsSection from "./newsSection";
import Footer from "./footer";
import HomeSection from "./homeSection/homeSection";
import AccountSection from "./accountSection/accountSection";
import ChatSection from "./chatSection/chatSection";

//  interface/enum imports
import { IResponse } from "../interfaces";
import TermsAndConditionsCard from "./termsAndConditionsCard/termsAndConditionsCard";

// enum definitions
export enum SECTION {
    HOME,
    ACCOUNT,
    LOGIN,
    REGISTRATION,
    NEWS
}

// interface definitions
interface IState {
    loggedIn: boolean,
    token: string,
    parentID: number,

    currentSection: SECTION,

    chatOpen: boolean,
    acceptTermsAndConditions: boolean
}



// --------------------------------------
//          CLASS DEFINITION
// --------------------------------------

class Base extends Component<{}, IState> {
    constructor(props: any) {
        super(props);

        let sect: SECTION = SECTION.LOGIN;
        if (sessionStorage.getItem("registering")) {
            sect = SECTION.REGISTRATION;
            sessionStorage.clear();
        }

        this.state = {
            loggedIn: false,
            token: "",
            parentID: 0,

            currentSection: sect,
            chatOpen: false,

            acceptTermsAndConditions: false
        }
    }


    // --------------------------------------
    //      HANDLE NAVBAR SECTION CHANGES
    // --------------------------------------

    handleNavBarSectChange = (sect: SECTION) => {
        this.setState({ currentSection: sect });
    }

    // --------------------------------------
    //      TOGGLE CHAT
    // --------------------------------------

    toggleChat = () => {
        let chatOpen = !this.state.chatOpen;
        this.setState({ chatOpen: chatOpen });
    }


    //----------    POST LOGIN   ------------

    login = async (username: string, password: string): Promise<boolean> => {

        let data: ILogin = {
            loginType: 3,
            username: username,
            password: password
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.LOGIN, "", data, {});

        if (result.stat !== "ok") {
            alert(result.error);
            return;
        }


        this.setState({ token: result.token, parentID: parseInt(username), loggedIn: true, currentSection: SECTION.ACCOUNT }, () => this.checkTermsAndCondtionsAccepted());
    }

    // --------------------------------------
    // --------------------------------------



    //----------    LOGOUT   ------------

    logout = async () => {
        this.setState({
            loggedIn: false,
            parentID: null,
            token: null,
            currentSection: SECTION.LOGIN
        });
    }

    // --------------------------------------
    // --------------------------------------


    //----------    CHECK TERMS AND CONDITIONS ACCEPTED   ------------

    checkTermsAndCondtionsAccepted = async () => {

        let data: ICheckTermsAndConditionsAccepted = {
            parentID: this.state.parentID
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.CHECK_TERMS_AND_CONDITIONS_ACCEPTED, this.state.token, data, {});

        if (result.stat !== "ok") {
            this.setState({ acceptTermsAndConditions: true });
            return;
        }
    }

    // --------------------------------------
    // --------------------------------------


    // --------------------------------------
    //      RENDER METHOD
    // --------------------------------------

    render() {
        return (
            <div id="base-container">
                <Navbar toggleChat={this.toggleChat} loggedIn={this.state.loggedIn} logout={this.logout} changeSection={this.handleNavBarSectChange} />

                {

                    //----------       LOGIN SECTION      ---------------

                    this.state.currentSection === SECTION.LOGIN &&
                    <LoginSection changeSection={this.handleNavBarSectChange} login={this.login} />

                }

                {

                    //----------       REGISTRATION SECTION      ---------------

                    this.state.currentSection === SECTION.REGISTRATION &&
                    <RegistrationSection changeSection={this.handleNavBarSectChange} />

                }

                {

                    //----------       REGISTRATION SECTION      ---------------

                    this.state.acceptTermsAndConditions &&
                    <TermsAndConditionsCard token={this.state.token} parentID={this.state.parentID} closePopup={() => this.setState({ acceptTermsAndConditions: false })} />
                }

                {

                    //----------       HOME SECTION      ---------------

                    this.state.currentSection === SECTION.HOME &&
                    <HomeSection token={this.state.token} />
                }

                {

                    //----------       ACCOUNT SECTION      ---------------

                    this.state.currentSection === SECTION.ACCOUNT &&
                    <AccountSection token={this.state.token} parentID={this.state.parentID} />
                }

                {

                    //----------       NEWS/EVENTS SECTION      ---------------

                    this.state.currentSection === SECTION.NEWS &&
                    <NewsSection token={this.state.token} />
                }

                {
                    //----------       CHAT SECTION      ---------------
                    this.state.chatOpen &&
                    <ChatSection token={this.state.token} userID={this.state.parentID} toggleChat={this.toggleChat} />
                }

                <Footer />

            </div>
        );
    }
}

export default Base;

// --------------------------------------
// --------------------------------------
