//  react imports
import React, { Component } from "react";

//  connection imports
import Connection, { POST_TYPE, WSConnection, WS_TOPICS } from "../connection";

//  component imports
import Navbar from "./navbar";
import CoursesSection from "./coursesSection";
import LoginSection from "./loginSection";
import { IGlobalContextState, ILogin } from "../interfaces";
import NewsSection from "./newsSection";
import AccountSection from "./accountSection";
import ChatSection from "./chatSection/chatSection";
import Footer from "./footer";
import HomeSection from "./homeSection/homeSection";

//  interface/enum imports
import { IResponse } from "../interfaces";
import SuggestionBox from "./suggestionBox/suggestionBox";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import GlobalProvider, { GlobalContext } from "../contexts/globalContext";

// enum definitions
export enum SECTION {
    HOME,
    COURSES,
    NEWS,
    LOGIN,
    ACCOUNT
}

// interface definitions
interface IState {
    loggedIn: boolean,
    token: string,
    username: string,

    currentSection: SECTION,

    chatOpen: boolean
}

interface IProps {
    context: IGlobalContextState
}



// --------------------------------------
//          CLASS DEFINITION
// --------------------------------------

class Base extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loggedIn: false,
            token: "",
            username: "",

            currentSection: SECTION.LOGIN,
            chatOpen: false
        }
    }


    // --------------------------------------
    //      HANDLE NAVBAR SECTION CHANGES
    // --------------------------------------

    handleNavBarSectChange = (sect: SECTION) => {
        if (sect === SECTION.COURSES) {
            this.setState({ currentSection: SECTION.HOME }, () => this.setState({ currentSection: sect }));
        } else {
            this.setState({ currentSection: sect });
        }
    }


    // --------------------------------------
    //      TOGGLE CHAT
    // --------------------------------------

    toggleChat = () => {
        let chatOpen = !this.state.chatOpen;

        if (!chatOpen) {
            this.props.context.wsConn.setChattingWithUser(false);
            this.props.context.wsConn.setAppendMsg(null);
        }

        this.setState({ chatOpen: chatOpen });
    }


    // --------------------------------------
    //      HANDLE REQUESTS TO BACK-END
    // --------------------------------------


    //----------    POST LOGIN   ------------

    login = (username: string, token: string) => {
        this.setState({ token: token, username: username, loggedIn: true, currentSection: SECTION.HOME });

        this.props.context.setToken(token);
        this.props.context.setWsConn(username, null, null);

        //----   CHECK FOR NEW MESSAGES   ----

        this.props.context.checkForUnreadMessages();
    }


    //----------    LOGOUT   ------------

    logout = async () => {
        this.setState({
            loggedIn: false,
            username: null,
            token: null,
            currentSection: SECTION.LOGIN
        });
    }


    // --------------------------------------
    // --------------------------------------



    // --------------------------------------
    //      RENDER METHOD
    // --------------------------------------

    render() {
        return (
            <BrowserRouter>
                <div id="base-container">

                    <Navbar loggedIn={this.state.loggedIn} logout={this.logout} changeSection={this.handleNavBarSectChange} toggleChat={this.toggleChat} />

                    <Routes>

                        {

                            //----------       COURSES SECTION      ---------------

                            <Route path="/student/courses/*" element={<CoursesSection token={this.state.token} username={this.state.username} />} />

                        }

                        {

                            //----------       LOGIN SECTION      ---------------

                            <Route path="/student/" element={<LoginSection login={this.login} />} />

                        }

                        {

                            //----------       HOME SECTION      ---------------

                            <Route path="/student/home" element={<HomeSection token={this.state.token} />} />

                        }

                        {

                            //----------       ACCOUT SECTION      ---------------

                            <Route path="/student/account" element={<AccountSection studentID={parseInt(this.state.username)} token={this.state.token} />} />

                        }

                        {

                            //----------       NEWS/EVENTS SECTION      ---------------

                            <Route path="/student/news" element={<NewsSection token={this.state.token} />} />

                        }
                    </Routes>

                    {
                        //----------       CHAT SECTION      ---------------

                        this.state.chatOpen &&
                        <ChatSection token={this.state.token} userID={parseInt(this.state.username)} toggleChat={this.toggleChat} />
                    }

                    <Footer />

                </div>
            </BrowserRouter>
        );
    }
}

const BaseWithContext = (props: any) => {
    return (
        <GlobalProvider>
            <GlobalContext.Consumer>
                {
                    context => (
                        <Base context={context} />
                    )
                }
            </GlobalContext.Consumer>
        </GlobalProvider>
    )
}

export default BaseWithContext;

// --------------------------------------
// --------------------------------------
