//  react imports
import React, { Component, createRef } from "react";

//  connection imports
import Connection, { GET_TYPE, POST_TYPE, WS_TOPICS } from "../connection";

//  component imports
import LoginSection from "./loginSection";
import NavBar from "./navBar";
import Footer from "./footer";
import ParentsSection from "./parentsSection/parentsSection";
import { AsyncCoursesSection, AsyncStudentsSection, AsyncStaffSection, AsyncNewsSection } from "../async-components/asyncSections";
import { AsyncStudentReportCard } from "../async-components/asyncStudentReportCard";
import Chat from "@mui/icons-material/Chat";
import MarkUnreadChatAltRounded from "@mui/icons-material/MarkUnreadChatAltRounded";


//  interface/enum imports
import { IResponse, ILogin, IGlobalContextState } from "../interfaces";
import HomeSection from "./homeSection/homeSection";
import ChatSection from "./chatSection/chatSection";
import GlobalProvider, { GlobalContext } from "../contexts/globalContext";

// enum definitions
export enum SECTION {
    LOGIN,
    HOME,
    STAFF,
    COURSES,
    PARENTS,
    STUDENTS,
    NEWS
}

// interface definitions

interface IProps {
    context: IGlobalContextState
}

interface IState {
    loggedIn: boolean,
    token: string,
    username: string,

    currentSection: SECTION,
    baseRef: React.RefObject<HTMLDivElement>,

    chatToggled: boolean
}



// --------------------------------------
//          CLASS DEFINITION
// --------------------------------------

class Base extends Component<IProps, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
            loggedIn: false,
            token: "",
            username: "",

            currentSection: SECTION.LOGIN,
            baseRef: createRef(),

            chatToggled: false
        }

    }


    // --------------------------------------
    //      COMPONENT DID MOUNT
    // --------------------------------------

    componentDidMount() {

        // --------------------------------------
        //      PRELOAD SECTIONS
        // --------------------------------------
        AsyncCoursesSection.preload();
        AsyncStudentsSection.preload();
        AsyncStaffSection.preload();
        AsyncNewsSection.preload();

        //----  PRELOADED HERE TO MINIMIZE WAIT TIME 
        //----  IF A REPORT NEEDS TO BE GENERATED
        AsyncStudentReportCard.preload();   // LARGEST FILE SIZE

    }


    // --------------------------------------
    //      HANDLE SCROLL
    // --------------------------------------

    handleScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {

        // --------------------------------------
        //      HANDLE STUDENT HEADER SCROLLING
        // --------------------------------------
        if (this.state.currentSection === SECTION.STUDENTS) {
            let header = document.getElementById("students-section-table-header-container");
            let nav = document.getElementById("navbar-container");
            let studentSort = document.getElementById("students-section-sort-container");

            if (header && nav) {
                let headerRect = header.getBoundingClientRect();
                let navRect = nav.getBoundingClientRect();
                let studentSortRect = studentSort.getBoundingClientRect();

                // -----------------------------------------------------------------
                //      SET HEADER TO STICK TO TOP ONCE A CERTAIN POS IS REACHED
                // -----------------------------------------------------------------
                let stick = () => {
                    let width = headerRect.width;
                    let left = headerRect.left;
                    header.style.position = "fixed";

                    //----    KEEP WIDTH AND POSITION THE SAME   ----
                    header.style.left = `${left}px`;
                    header.style.width = `${width}px`;
                }

                if (navRect.bottom > 500) {
                    if (headerRect.top <= 50) {
                        stick();
                        header.style.top = "10.1vh";
                    }
                }
                if (navRect.bottom < 500) {
                    if (headerRect.top <= navRect.bottom) {
                        stick();
                        header.style.top = navRect.bottom.toString() + "px";
                    }
                }

                if (headerRect.top < studentSortRect.bottom) {
                    header.style.position = "initial";
                }
            }
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
        let chatToggled = !this.state.chatToggled;

        if (!chatToggled) {
            this.props.context.wsConn.setChattingWithUser(false);
            this.props.context.wsConn.setAppendMsg(null);
        }

        this.setState({ chatToggled: chatToggled });
    }


    // --------------------------------------
    //      HANDLE REQUESTS TO BACK-END
    // --------------------------------------


    //----------    POST LOGIN   ------------

    login = async (username: string, password: string): Promise<any> => {

        let data: ILogin = {
            loginType: 2,
            username: username,
            password: password
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.LOGIN, "", data, {});

        if (result.stat !== "ok") {
            alert(result.error);
            return;
        }

        this.setState({ token: result.token, username: username, loggedIn: true, currentSection: SECTION.HOME });

        //----   INIT CONTEXT VALUES   ----

        this.props.context.setToken(result.token);
        this.props.context.setWsConn(username, null, null);

        //----   CHECK FOR NEW MESSAGES   ----

        this.props.context.checkForUnreadMessages();
    }

    // --------------------------------------
    // --------------------------------------



    //----------    LOGOUT   ------------

    logout = () => {
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
            <div id="base-container">

                <div id="base-title" className="flex-row center">
                    <h1 >Administration</h1>
                    {
                        (this.state.loggedIn && !this.props.context.newMessagesAvail) &&
                        <Chat id="chat-toggle" onClick={this.toggleChat} />
                    }
                    {
                        (this.state.loggedIn && this.props.context.newMessagesAvail) &&
                        <MarkUnreadChatAltRounded id="chat-toggle" onClick={this.toggleChat} />
                    }
                </div>

                <NavBar loggedIn={this.state.loggedIn} logout={this.logout} changeSection={this.handleNavBarSectChange} />

                <div ref={this.state.baseRef} id="content-container" onScroll={ev => this.handleScroll(ev)}>
                    {

                        //----------       LOGIN SECTION      ---------------

                        this.state.currentSection === SECTION.LOGIN &&
                        <LoginSection login={this.login} />

                    }
                    {

                        //----------       HOME SECTION      ---------------

                        this.state.currentSection === SECTION.HOME &&
                        <HomeSection userID={parseInt(this.state.username)} token={this.state.token} />

                    }
                    {

                        //----------       STAFF SECTION      ---------------

                        this.state.currentSection === SECTION.STAFF &&
                        <AsyncStaffSection token={this.state.token} />

                    }
                    {

                        //----------       COURSES SECTION      ---------------

                        this.state.currentSection === SECTION.COURSES &&
                        <AsyncCoursesSection token={this.state.token} />

                    }
                    {

                        //----------       PARENTS SECTION      ---------------

                        this.state.currentSection === SECTION.PARENTS &&
                        <ParentsSection token={this.state.token} />

                    }
                    {

                        //----------       STUDENTS SECTION      ---------------

                        this.state.currentSection === SECTION.STUDENTS &&
                        <AsyncStudentsSection token={this.state.token} />

                    }
                    {

                        //----------       NEWS/EVENTS SECTION      ---------------

                        this.state.currentSection === SECTION.NEWS &&
                        <AsyncNewsSection token={this.state.token} />

                    }
                    {

                        //----------       CHAT SECTION      ---------------

                        this.state.chatToggled &&
                        <ChatSection token={this.state.token} userID={parseInt(this.state.username)} toggleChat={this.toggleChat} />

                    }

                </div>

                <Footer />

            </div>
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
