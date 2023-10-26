
//#########################################
//        REACT IMPORTS
//#########################################

import React, { Component } from "react";
import Connection, { GET_TYPE } from "../connection";

//#########################################
//        COMPONENT IMPORTS
//#########################################

import AccountStudentReportCard from "./accountStudentReportCard";

//#########################################
//        INTERFACE/ENUM IMPORTS
//#########################################

import { IGetStudentReports, IResponse, IStudentReportCard } from "../interfaces";


//#########################################
//        INTERFACE DEFINITIONS
//#########################################

interface IState {
    reports: IStudentReportCard[]
}

interface IProps {
    token: string,
    studentID: number
}


//#########################################
//        CLASS DEFINITION
//#########################################

class AccountReportsCard extends Component<IProps, IState> {

    //#########################################
    //        CONSTRUCTOR
    //#########################################

    constructor(props: IProps) {
        super(props);

        this.state = {
            reports: []
        }
    }


    //#########################################
    //        COMPONENT DID MOUNT
    //#########################################

    componentDidMount() {
        this.getReports();
    }


    //#########################################
    //        GET REPORTS
    //#########################################

    getReports = async () => {
        let data: IGetStudentReports = {
            studentID: this.props.studentID
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_STUDENT_REPORTS, this.props.token, data);

        if (result.stat === "ok") {
            this.setState({ reports: result.data });
            return;
        }

        this.setState({ reports: [] });
    }


    render() {
        return (
            <div id="account-reports-card-container">
                <h2 id="account-reports-card-title">Reports</h2>

                <div id="account-reports-card-header">
                    <h3 className="account-reports-card-header-values" style={{ gridColumn: 1 }}>File Name</h3>
                    <h3 className="account-reports-card-header-values" style={{ gridColumn: 2 }}>Term</h3>
                    <h3 className="account-reports-card-header-values" style={{ gridColumn: 3 }}>Year</h3>
                </div>

                {
                    this.state.reports.map((report) => {
                        return (
                            <AccountStudentReportCard report={report} token={this.props.token} />
                        );
                    })
                }

                {
                    this.state.reports.length === 0 &&
                    <h3 style={{ color: "white", textAlign: "center" }}>No reports found!</h3>
                }

            </div>
        );
    }
}

export default AccountReportsCard;
