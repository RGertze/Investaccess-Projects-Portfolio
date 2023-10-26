
//-----------------------------------------
//        REACT IMPORTS
//-----------------------------------------

import React, { Component } from "react";

//-----------------------------------------
//        CSS IMPORTS
//-----------------------------------------

import "./accountFinancesSection.css";

//-----------------------------------------
//        COMPONENT IMPORTS
//-----------------------------------------

import AccountFinancesDocumentsCard from "../accountFinancesDocumentCard/accountFinancesDocumentCard";
import { IGetParentFinances, IParentFinances, IResponse } from "../../interfaces";
import Connection, { GET_TYPE } from "../../connection";
import AccountDocumentsCard, { PARENT_FILE_TYPE } from "../accountDocumentCard/accountDocumentCard";

//-----------------------------------------
//        INTERFACE/ENUM IMPORTS
//-----------------------------------------



//-----------------------------------------
//        INTERFACE DEFINITIONS
//-----------------------------------------

interface IState {
    financeDetails: IParentFinances
}

interface IProps {
    token: string,
    parentID: number
}

//-----------------------------------------
//        CLASS DEFINITION
//-----------------------------------------

class AccountFinancesSection extends Component<IProps, IState> {

    //----------------------
    //    CONSTRUCTOR
    //----------------------

    constructor(props: IProps) {
        super(props);

        this.state = {
            financeDetails: null
        }
    }


    //----------------------
    //    COMP DID MOUNT
    //----------------------

    componentDidMount() {
        this.getFinanceDetails();
    }


    //---------------------------
    //    GET FINANCE DETAILS
    //---------------------------

    getFinanceDetails = async () => {
        let data: IGetParentFinances = {
            parentID: this.props.parentID
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_PARENT_FINANCES, this.props.token, data);

        if (result.stat !== "ok") {
            this.setState({ financeDetails: null });
            return;
        }

        this.setState({ financeDetails: result.data[0] });

    }


    //---------------------------
    //      RENDER METHOD
    //---------------------------

    render() {
        return (
            <div id="account-finances-container">
                <AccountFinancesDocumentsCard parentID={this.props.parentID} token={this.props.token} />

                {
                    //----   FINANCIAL STATEMENTS   ----

                    <div id="parent-finances-details-container" className="center">
                        <h2>Financial Details</h2>
                        <div id="parent-finances-details">
                            <div className="table-col">
                                <div className="flex-row parent-finances-details-header">
                                    <h4>Arrears:</h4>
                                </div>
                                <p>N$ {this.state.financeDetails ? this.state.financeDetails.Current_Balance : "0.00"}</p>
                            </div>
                            <div className="table-col">
                                <div className="flex-row parent-finances-details-header">
                                    <h4>Next Payment Due:</h4>
                                </div>
                                <p>{this.state.financeDetails ? this.state.financeDetails.Next_Payment_Due : ""}</p>
                            </div>
                        </div>
                    </div>
                }

                {
                    //----   SUPPORT/DONATION DOCUMENTS   ----

                    <AccountDocumentsCard token={this.props.token} fileType={PARENT_FILE_TYPE.SUPPORT} />
                }
            </div>
        );
    }
}

export default AccountFinancesSection;
