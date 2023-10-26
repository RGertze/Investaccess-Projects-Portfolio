
//----------------------------------
//      REACT IMPORTS
//----------------------------------

import React, { Component } from "react";
import { GlobalContext } from "../contexts/globalContext";


//----------------------------------
//      INTERFACE IMPORTS
//----------------------------------

import { SECTION } from "./base";

//----------------------------------
//      INTERFACE DEFINITIONS
//----------------------------------

interface IState {
    toggled: boolean
}

interface IProps {
    loggedIn: boolean,
    logout(): any,
    changeSection(sect: SECTION): any
}

//----------------------------------
//      CLASS DEFINITION
//----------------------------------

class NavBar extends Component<IProps, IState> {
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
            <GlobalContext.Consumer>
                {context => (
                    <div id="navbar-container">
                        {
                            this.props.loggedIn &&
                            <React.Fragment>

                                <div id="navbar-toggle" onClick={() => this.setState({ toggled: !this.state.toggled })}>
                                    <span className="navbar-toggle-bar"></span>
                                    <span className="navbar-toggle-bar"></span>
                                    <span className="navbar-toggle-bar"></span>
                                </div>

                                <h3 className={!this.state.toggled ? "navbar-opts" : "navbar-opts-toggled"} onClick={() => this.changeSection(SECTION.HOME)} > Home</h3>
                                <h3 className={!this.state.toggled ? "navbar-opts" : "navbar-opts-toggled"} onClick={() => this.changeSection(SECTION.STAFF)} > Staff</h3>
                                <h3 className={!this.state.toggled ? "navbar-opts" : "navbar-opts-toggled"} onClick={() => this.changeSection(SECTION.COURSES)}>Courses</h3>
                                <h3 className={!this.state.toggled ? "navbar-opts" : "navbar-opts-toggled"} onClick={() => this.changeSection(SECTION.PARENTS)} > Parents</h3>
                                <h3 className={!this.state.toggled ? "navbar-opts" : "navbar-opts-toggled"} onClick={() => this.changeSection(SECTION.STUDENTS)}>Students</h3>
                                <h3 className={!this.state.toggled ? "navbar-opts" : "navbar-opts-toggled"} onClick={() => this.changeSection(SECTION.NEWS)}>News/Events</h3>
                                <h3 className={!this.state.toggled ? "navbar-opts" : "navbar-opts-toggled"} onClick={() => {
                                    location.href = "https://elearning-swakopca.edu.na/";
                                    /*this.props.logout(); */
                                    /*this.setState({ toggled: false })*/
                                }}>Logout</h3>
                            </React.Fragment>
                        }
                    </div>
                )}
            </GlobalContext.Consumer>
        );
    }
}

export default NavBar;
