// react imports

import React, { Component } from "react";

// COMPONENT IMPORTS

import Chat from "@material-ui/icons/Chat";

// interface/enum imports
import { SECTION } from "./base";

interface IState {
    toggled: boolean
}

interface IProps {
    loggedIn: boolean,
    logout(): any,
    changeSection(sect: SECTION): void,
    toggleChat(): void
}

class Navbar extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            toggled: false
        }
    }

    changeSection = (sect: SECTION) => {
        this.props.changeSection(sect);
        this.setState({ toggled: false });
    }

    render() {
        return (
            <nav id="nav-container">
                <div id="nav-title">SCA E-learning</div>
                <div id="nav-toggle" onClick={() => this.setState({ toggled: !this.state.toggled })}>
                    <span className="nav-toggle-bar"></span>
                    <span className="nav-toggle-bar"></span>
                    <span className="nav-toggle-bar"></span>
                </div>
                <div id={this.state.toggled ? "nav-items-list" : "nav-items-list-untoggled"}>
                    <ul>

                        {this.props.loggedIn &&
                            <React.Fragment>
                                <li><h4 className="nav-items" onClick={() => this.changeSection(SECTION.HOME)}>Home</h4></li>
                            </React.Fragment>
                        }

                        <li><h4 className="nav-items" onClick={() => this.changeSection(SECTION.NEWS)}>News/Events</h4></li>

                        {
                            this.props.loggedIn &&

                            <li className="flex-row">
                                <Chat id="nav-chat" className="center" style={{ transform: "scale(1.3)" }} onClick={() => {
                                    this.setState({ toggled: false });
                                    this.props.toggleChat();
                                }} />
                            </li>
                        }

                        <li id="nav-acc">
                            <div id="nav-acc-container">
                                <h3>Account</h3>
                                <div id="nav-acc-dropdown">
                                    {this.props.loggedIn &&
                                        <React.Fragment>
                                            <h4 className="nav-acc-items" onClick={() => this.changeSection(SECTION.ACCOUNT)}>Account</h4>
                                            <h4 className="nav-acc-items" onClick={() => {
                                                location.href = "https://elearning-swakopca.edu.na/";
                                                //this.props.logout(); this.setState({ toggled: false }); 
                                            }}>Logout</h4>
                                        </React.Fragment>
                                    }
                                    {!this.props.loggedIn &&
                                        <React.Fragment>
                                            <h4 className="nav-acc-items" onClick={() => this.changeSection(SECTION.LOGIN)}>Login</h4>
                                        </React.Fragment>
                                    }
                                </div>
                            </div>

                        </li>
                    </ul>
                </div>
            </nav >
        );
    }
}

export default Navbar;
