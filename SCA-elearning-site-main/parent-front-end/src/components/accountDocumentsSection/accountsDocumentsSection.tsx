
//-----------------------------------------
//        REACT IMPORTS
//-----------------------------------------

import React, { Component } from "react";

//-----------------------------------------
//        CSS IMPORTS
//-----------------------------------------

import "./accountsDocumentsSection.css";

//-----------------------------------------
//        COMPONENT IMPORTS
//-----------------------------------------

import AccountDocumentsCard, { PARENT_FILE_TYPE } from "../accountDocumentCard/accountDocumentCard";

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
    token: string
}

//-----------------------------------------
//        CLASS DEFINITION
//-----------------------------------------

class AccountDocumentsSection extends Component<IProps, IState> {

    render() {
        return (
            <div id="account-documents-container">
                <AccountDocumentsCard token={this.props.token} fileType={PARENT_FILE_TYPE.CALENDAR} />
                <AccountDocumentsCard token={this.props.token} fileType={PARENT_FILE_TYPE.TIMETABLE} />
            </div>
        );
    }
}

export default AccountDocumentsSection;
