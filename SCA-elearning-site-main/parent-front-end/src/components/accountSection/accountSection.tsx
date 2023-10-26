
//-----------------------------------------
//        REACT IMPORTS
//-----------------------------------------

import React, { Component } from "react";

//-----------------------------------------
//        CSS IMPORTS
//-----------------------------------------

import "./accountSection.css";

//-----------------------------------------
//        COMPONENT IMPORTS
//-----------------------------------------

import AccountNavBar from "../accountNavbar/accountNavBar";
import AccountInfoSection from "../accountInfoSection/accountInfoSection";
import AccountDocumentsSection from "../accountDocumentsSection/accountsDocumentsSection";
import AccountFinancesSection from "../accountFinancesSection/accountFinancesSection";


//-----------------------------------------
//        ENUM DEFINITIONS
//-----------------------------------------

export enum ACCOUNT_SECTION {
    INFO,
    FINANCES,
    DOCUMENTS
}

//-----------------------------------------
//        INTERFACE DEFINITIONS
//-----------------------------------------

interface IState {
    currentSection: ACCOUNT_SECTION
}

interface IProps {
    token: string,
    parentID: number
}

//-----------------------------------------
//        CLASS DEFINITION
//-----------------------------------------

class AccountSection extends Component<IProps, IState> {

    //-----------------------------------------
    //        CONSTRUCTOR
    //-----------------------------------------

    constructor(props: IProps) {
        super(props);

        this.state = {
            currentSection: ACCOUNT_SECTION.INFO
        }
    }


    //-----------------------------------------
    //        CHANGE SECTION
    //-----------------------------------------

    changeSection = (sect: ACCOUNT_SECTION) => {
        this.setState({ currentSection: sect });
    }


    //-----------------------------------------
    //        RENDER METHOD
    //-----------------------------------------

    render() {
        return (
            <div id="account-section-container">

                <AccountNavBar changeSection={this.changeSection} />

                {
                    //----------    INFO SECTION    ------------

                    (this.state.currentSection === ACCOUNT_SECTION.INFO) &&
                    <AccountInfoSection token={this.props.token} parentID={this.props.parentID} />
                }

                {
                    //----------    FINANCES SECTION    ------------

                    (this.state.currentSection === ACCOUNT_SECTION.FINANCES) &&
                    <AccountFinancesSection token={this.props.token} parentID={this.props.parentID} />
                }

                {
                    //----------    DOCUMENTS SECTION    ------------

                    (this.state.currentSection === ACCOUNT_SECTION.DOCUMENTS) &&
                    <AccountDocumentsSection token={this.props.token} />
                }

            </div>
        );
    }
}

export default AccountSection;
