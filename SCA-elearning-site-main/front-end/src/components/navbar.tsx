// react imports

import React, { useState } from "react";

// COMPONENT IMPORTS

import Chat from "@material-ui/icons/Chat";

// interface/enum imports
import { SECTION } from "./base";
import { useNavigate } from "react-router-dom";
import { MarkUnreadChatAltRounded } from "@mui/icons-material";
import { GlobalContext } from "../contexts/globalContext";


interface IProps {
    loggedIn: boolean,
    logout(): any,
    changeSection(sect: SECTION): void,
    toggleChat(): void
}


const Navbar = (props: IProps) => {

    //----   STATE   ----

    const [toggled, setToggled] = useState(false);

    //----   RR HOOKS   ----

    const navigate = useNavigate();

    return (
        <GlobalContext.Consumer>
            {context => (
                <nav id="nav-container">
                    <div id="nav-title">SCA E-learning</div>
                    <div id="nav-toggle" onClick={() => setToggled(!toggled)}>
                        <span className="nav-toggle-bar"></span>
                        <span className="nav-toggle-bar"></span>
                        <span className="nav-toggle-bar"></span>
                    </div>
                    <div id={toggled ? "nav-items-list" : "nav-items-list-untoggled"}>
                        <ul>

                            {props.loggedIn &&
                                <React.Fragment>
                                    <li><h4 className="nav-items" onClick={() => { navigate("/student/home"); setToggled(false); }}>Home</h4></li>
                                    <li><h4 className="nav-items" onClick={() => { navigate("/student/courses"); setToggled(false); }}>Courses</h4></li>
                                </React.Fragment>
                            }

                            <li><h4 className="nav-items" onClick={() => { navigate("/student/news"); setToggled(false); }}>News/Events</h4></li>

                            {props.loggedIn &&
                                <li className="flex-row">
                                    {
                                        !context.newMessagesAvail &&
                                        <Chat id="nav-chat" className="center" onClick={() => {
                                            setToggled(false);
                                            props.toggleChat();
                                        }} />
                                    }
                                    {
                                        context.newMessagesAvail &&
                                        <MarkUnreadChatAltRounded id="nav-chat-new-msg" className="center" onClick={() => {
                                            setToggled(false);
                                            props.toggleChat();
                                        }} />
                                    }
                                </li>
                            }

                            <li id="nav-acc">
                                <div id="nav-acc-container">
                                    <h3>Account</h3>
                                    <div id="nav-acc-dropdown">
                                        {props.loggedIn &&
                                            <React.Fragment>
                                                <h4 className="nav-acc-items" onClick={() => { navigate("/student/account"); setToggled(false); }}>View Account</h4>
                                                <h4 className="nav-acc-items" onClick={() => {
                                                    location.href = "https://elearning-swakopca.edu.na/";
                                                    //this.props.logout(); this.setState({ toggled: false }); 
                                                }}>Logout</h4>
                                            </React.Fragment>
                                        }
                                        {!props.loggedIn &&
                                            <React.Fragment>
                                                <h4 className="nav-acc-items" onClick={() => { navigate("/student/"); setToggled(false); }}>Login</h4>
                                            </React.Fragment>
                                        }
                                    </div>
                                </div>

                            </li>
                        </ul>
                    </div>
                </nav >
            )}
        </GlobalContext.Consumer>
    );
}

export default Navbar;
