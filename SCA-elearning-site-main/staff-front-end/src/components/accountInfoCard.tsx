
//#########################################
//        REACT IMPORTS
//#########################################

import React, { Component } from "react";

//#########################################
//        COMPONENT IMPORTS
//#########################################

import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { IGetStaffDetails, IResponse, IStaffDetails } from "../interfaces";
import Connection, { GET_TYPE } from "../connection";

//#########################################
//        ENUM DEFINITIONS
//#########################################



//#########################################
//        INTERFACE DEFINITIONS
//#########################################

interface IState {
    staffDetails: IStaffDetails
}

interface IProps {
    token: string,
    staffID: number
}

//#########################################
//        CLASS DEFINITION
//#########################################

class AccountInfoCard extends Component<IProps, IState> {

    //#########################################
    //        CONSTRUCTOR
    //#########################################

    constructor(props: IProps) {
        super(props);

        this.state = {
            staffDetails: {
                Staff_ID: null,
                Position_Name: "",
                Staff_Name: "",
                Staff_Age: null,
                Staff_Cell: "",
                Staff_Email: ""
            }
        }
    }


    //#########################################
    //        COMPONENT DID MOUNT
    //#########################################

    componentDidMount() {
        this.getStaffDetails();
    }


    //#########################################
    //        GET STUDENT DETAILS
    //#########################################

    getStaffDetails = async () => {
        let data: IGetStaffDetails = {
            staffID: this.props.staffID
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_STAFF_DETAILS, this.props.token, data);

        if (result.stat !== "ok") {
            alert("failed to retrieve staff details. Try again later");
            return;
        }

        this.setState({ staffDetails: result.data });

    }

    //#########################################
    //#########################################



    //#########################################
    //        RENDER METHOD
    //#########################################

    render() {
        return (
            <div id="account-info-card-container">
                <div id="account-info-card-icon">
                    <AccountCircleIcon style={{ width: "100%", height: "100%", color: "#666666" }} />
                </div>

                <div id="account-info-card-personal-info-container">

                    <h1 id="account-info-card-personal-info-name">{this.state.staffDetails.Staff_Name}</h1>

                    <div id="account-info-card-personal-info">
                        <h3 className="account-info-card-personal-info-values">Staff ID: {this.state.staffDetails.Staff_ID}</h3>
                        <h3 className="account-info-card-personal-info-values">Position: {this.state.staffDetails.Position_Name}</h3>
                        <h3 className="account-info-card-personal-info-values">Age: {this.state.staffDetails.Staff_Age}</h3>
                    </div>
                </div>

                <div id="account-info-card-contact-details-container">
                    <div className="account-info-card-contact-details">
                        <h3>Email Address:</h3>
                        <p>{this.state.staffDetails.Staff_Email}</p>
                    </div>

                    <div className="account-info-card-contact-details">
                        <h3>Cell Number:</h3>
                        <p>{this.state.staffDetails.Staff_Cell}</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default AccountInfoCard;
