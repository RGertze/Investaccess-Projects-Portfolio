
//-----------------------------------------
//        REACT IMPORTS
//-----------------------------------------

import React, { Component } from "react";

//-----------------------------------------
//        COMPONENT IMPORTS
//-----------------------------------------

import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { IGetStudentDetails, IResponse, IStudentDetails } from "../interfaces";
import Connection, { GET_TYPE } from "../connection";

//-----------------------------------------
//        ENUM DEFINITIONS
//-----------------------------------------



//-----------------------------------------
//        INTERFACE DEFINITIONS
//-----------------------------------------

interface IState {
    studentDetails: IStudentDetails
}

interface IProps {
    token: string,
    studentID: number
}

//-----------------------------------------
//        CLASS DEFINITION
//-----------------------------------------

class AccountInfoCard extends Component<IProps, IState> {

    //-----------------------------------------
    //        CONSTRUCTOR
    //-----------------------------------------

    constructor(props: IProps) {
        super(props);

        this.state = {
            studentDetails: {
                Student_ID: null,
                Student_Name: "",
                Student_Grade: null,
                Student_Age: null,
                Student_Guardian_Email_M: "",
                Student_Guardian_Email_F: "",
                Student_Guardian_Cell: ""
            }
        }
    }


    //-----------------------------------------
    //        COMPONENT DID MOUNT
    //-----------------------------------------

    componentDidMount() {
        this.getStudentDetails();
    }


    //-----------------------------------------
    //        GET STUDENT DETAILS
    //-----------------------------------------

    getStudentDetails = async () => {
        let data: IGetStudentDetails = {
            studentID: this.props.studentID
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_STUDENT_DETAILS, this.props.token, data);

        if (result.stat !== "ok") {
            alert("failed to retrieve student details. Try again later");
            return;
        }

        this.setState({ studentDetails: result.data });

    }

    //-----------------------------------------
    //-----------------------------------------



    //-----------------------------------------
    //        RENDER METHOD
    //-----------------------------------------

    render() {
        return (
            <div id="account-info-card-container">
                <div id="account-info-card-icon">
                    <AccountCircleIcon style={{ width: "100%", height: "100%", color: "#666666" }} />
                </div>

                <div id="account-info-card-personal-info-container">

                    <h1 id="account-info-card-personal-info-name">{this.state.studentDetails.Student_Name}</h1>

                    <div id="account-info-card-personal-info">
                        <h3 className="account-info-card-personal-info-values">Student ID: {this.state.studentDetails.Student_ID}</h3>
                        <h3 className="account-info-card-personal-info-values">Grade: {this.state.studentDetails.Student_Grade}</h3>
                        <h3 className="account-info-card-personal-info-values">Age: {this.state.studentDetails.Student_Age}</h3>
                    </div>
                </div>

                <div id="account-info-card-contact-details-container">
                    <div className="account-info-card-contact-details">
                        <h3>Guardian Email Addresses:</h3>
                        <div>
                            <h4>M:</h4>
                            <p>
                                {this.state.studentDetails.Student_Guardian_Email_M === "" ? "N/A" : this.state.studentDetails.Student_Guardian_Email_M}
                            </p>
                        </div>
                        <div>
                            <h4>F:</h4>
                            {this.state.studentDetails.Student_Guardian_Email_F === "" ? "N/A" : this.state.studentDetails.Student_Guardian_Email_F}
                        </div>
                    </div>

                    <div className="account-info-card-contact-details">
                        <h3>Guardian Cell Number:</h3>
                        <p>{this.state.studentDetails.Student_Guardian_Cell}</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default AccountInfoCard;
