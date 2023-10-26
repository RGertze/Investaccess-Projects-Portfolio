
//-----------------------------------------
//        REACT IMPORTS
//-----------------------------------------

import React, { Component } from "react";

//-----------------------------------------
//        CSS IMPORTS
//-----------------------------------------

import "./accountNavBar.css";

//-----------------------------------------
//        INTERFACE/ENUM IMPORTS
//-----------------------------------------

import { ACCOUNT_SECTION } from "../accountSection/accountSection";


//-----------------------------------------
//        INTERFACE DEFINITIONS
//-----------------------------------------

interface IState {
}

interface IProps {
    changeSection(sect: ACCOUNT_SECTION): void
}

//-----------------------------------------
//        CLASS DEFINITION
//-----------------------------------------

class AccountNavBar extends Component<IProps, IState> {

    render() {
        return (
            <div id="account-navbar-container">
                <h3 className="account-navbar-opts" onClick={() => this.props.changeSection(ACCOUNT_SECTION.INFO)}>Info</h3>
                <h3 className="account-navbar-opts" onClick={() => this.props.changeSection(ACCOUNT_SECTION.FINANCES)}>Documents</h3>
                <h3 className="account-navbar-opts" onClick={() => this.props.changeSection(ACCOUNT_SECTION.DOCUMENTS)}>School Info</h3>
            </div>
        );
    }
}

export default AccountNavBar;
