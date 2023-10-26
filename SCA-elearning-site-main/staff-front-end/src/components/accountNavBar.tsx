
//#########################################
//        REACT IMPORTS
//#########################################

import React, { Component } from "react";

//#########################################
//        INTERFACE DEFINITIONS
//#########################################

interface IState {
}

interface IProps {
}

//#########################################
//        CLASS DEFINITION
//#########################################

class AccountNavBar extends Component<IProps, IState> {

    render() {
        return (
            <div id="account-navbar-container">
                <h3 className="account-navbar-opts">Info</h3>
            </div>
        );
    }
}

export default AccountNavBar;
