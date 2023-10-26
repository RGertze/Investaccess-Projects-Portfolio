
//#########################################
//        REACT IMPORTS
//#########################################

import React, { Component } from "react";

//#########################################
//        COMPONENT IMPORTS
//#########################################

import AccountNavBar from "./accountNavBar";
import AccountInfoCard from "./accountInfoCard";


//#########################################
//        ENUM DEFINITIONS
//#########################################

enum ACCOUNT_SECTION {
    INFO,
    MARKS
}

//#########################################
//        INTERFACE DEFINITIONS
//#########################################

interface IState {
    currentSection: ACCOUNT_SECTION
}

interface IProps {
    token: string,
    staffID: number
}

//#########################################
//        CLASS DEFINITION
//#########################################

class AccountSection extends Component<IProps, IState> {

    //#########################################
    //        CONSTRUCTOR
    //#########################################

    constructor(props: IProps) {
        super(props);

        this.state = {
            currentSection: ACCOUNT_SECTION.INFO
        }
    }


    //#########################################
    //        RENDER METHOD
    //#########################################

    render() {
        return (
            <div id="account-section-container">

                <AccountNavBar />

                {
                    //##########    INFO SECTION    ############

                    this.state.currentSection === ACCOUNT_SECTION.INFO &&
                    <AccountInfoCard token={this.props.token} staffID={this.props.staffID} />
                }

            </div>
        );
    }
}

export default AccountSection;
