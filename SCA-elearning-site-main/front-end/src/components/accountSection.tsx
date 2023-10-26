
//#########################################
//        REACT IMPORTS
//#########################################

import React, { Component } from "react";

//#########################################
//        COMPONENT IMPORTS
//#########################################

import AccountNavBar from "./accountNavBar";
import AccountInfoCard from "./accountInfoCard";
import AccountMarksCard from "./accountMarksCard";
import AccountReportsCard from "./accountReportsCard";


//#########################################
//        ENUM DEFINITIONS
//#########################################

export enum ACCOUNT_SECTION {
    INFO,
    MARKS,
    REPORTS
}

//#########################################
//        INTERFACE DEFINITIONS
//#########################################

interface IState {
    currentSection: ACCOUNT_SECTION
}

interface IProps {
    token: string,
    studentID: number
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
    //        CHANGE SECTION
    //#########################################

    changeSection = (sect: ACCOUNT_SECTION) => {
        this.setState({ currentSection: sect });
    }


    //#########################################
    //        RENDER METHOD
    //#########################################

    render() {
        return (
            <div id="account-section-container">

                <AccountNavBar changeSection={this.changeSection} />

                {
                    //##########    INFO SECTION    ############

                    this.state.currentSection === ACCOUNT_SECTION.INFO &&
                    <AccountInfoCard token={this.props.token} studentID={this.props.studentID} />
                }

                {
                    //##########    MARKS SECTION    ############

                    this.state.currentSection === ACCOUNT_SECTION.MARKS &&
                    <AccountMarksCard token={this.props.token} studentID={this.props.studentID} />
                }

                {
                    //##########    REPORTS SECTION    ############

                    this.state.currentSection === ACCOUNT_SECTION.REPORTS &&
                    <AccountReportsCard token={this.props.token} studentID={this.props.studentID} />
                }

            </div>
        );
    }
}

export default AccountSection;
