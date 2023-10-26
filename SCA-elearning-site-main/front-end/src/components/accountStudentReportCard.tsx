
//#########################################
//        REACT IMPORTS
//#########################################

import React, { Component } from "react";
import Connection, { GET_TYPE } from "../connection";

//#########################################
//        INTERFACE/ENUM IMPORTS
//#########################################

import { IGetSignedGetUrl, IResponse, ISignedGetUrl, IStudentReportCard } from "../interfaces";


//#########################################
//        INTERFACE DEFINITIONS
//#########################################

interface IState {
}

interface IProps {
    token: string,
    report: IStudentReportCard
}


//#########################################
//        CLASS DEFINITION
//#########################################

class AccountReportsCard extends Component<IProps, IState> {

    render() {
        return (
            <div id="account-student-report-card-container">
                <p id="account-student-report-name" style={{ gridColumn: 1 }} onClick={async () => {
                    let data: IGetSignedGetUrl = {
                        filePath: this.props.report.Student_Report_Path
                    }

                    let result: IResponse = await Connection.getReq(GET_TYPE.GET_SIGNED_GET_URL, this.props.token, data);

                    if (result.stat !== "ok") {
                        alert("failed to retrieve file");
                        return;
                    }

                    let urlData: ISignedGetUrl = result.data;

                    Connection.saveFileS3(urlData.url, this.props.report.Student_Report_Name);
                }}>{this.props.report.Student_Report_Name}</p>
                <p style={{ gridColumn: 2 }}>{this.props.report.Student_Report_Term}</p>
                <p style={{ gridColumn: 3 }}>{this.props.report.Student_Report_Year}</p>
            </div>
        );
    }
}

export default AccountReportsCard;
