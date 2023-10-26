
//----------------------------------
//      REACT IMPORTS
//----------------------------------

import React, { Component, Fragment } from "react";

//----------------------------------
//      CSS IMPORTS
//----------------------------------
import "./changePasswordCard.css";


//----------------------------------
//      INTERFACE IMPORTS
//----------------------------------

import { IChangePassword, ICourseTaughtByStaff, IDeleteStaff, IGetCoursesTaughtByStaff, IResponse, IStaffMember } from "../../interfaces";
import Connection, { GET_TYPE, POST_TYPE } from "../../connection";


//----------------------------------
//      INTERFACE DEFINITIONS
//----------------------------------

interface IState {
    newPassword: string,
    confPassword: string
}

interface IProps {
    token: string,
    userType: number,
    userID: number,
    setChangingPassword(value: boolean): void
}


//----------------------------------
//      CLASS DEFINITION
//----------------------------------

class ChangePasswordCard extends Component<IProps, IState> {

    //----------------------------------
    //      CONSTRUCTOR
    //----------------------------------

    constructor(props: IProps) {
        super(props);

        this.state = {
            newPassword: "",
            confPassword: ""
        }
    }


    //----------------------------------
    //      CHANGE PASSWORD
    //----------------------------------

    changePassword = async () => {
        //----------------------------
        //   CHECK FOR EMPTY FIELDS
        //----------------------------
        if (this.state.newPassword !== "" && this.state.confPassword !== "") {

            //------------------------------
            //   CHECK IF PASSWORDS MATCH
            //------------------------------
            if (this.state.newPassword !== this.state.confPassword) {
                alert("passwords do not match");
                return;
            }

            let data: IChangePassword = {
                newPassword: this.state.newPassword,
                userType: this.props.userType,
                userID: this.props.userID
            }

            let result: IResponse = await Connection.postReq(POST_TYPE.CHANGE_PASSWORD, this.props.token, data, {});

            if (result.stat !== "ok") {
                alert("failed to change password: " + result.error);
                return;
            }

            alert("successfully changed password");
            this.props.setChangingPassword(false);

            return;
        }
        alert("please fill in all fields");
    }



    //----------------------------------
    //      RENDER METHOD
    //----------------------------------

    render() {
        return (
            <div id="change-password-container" className="center flex-column">
                <div className="center form-col" id="change-password-container">
                    <p style={{ gridColumn: 1 }}>New password</p>
                    <input value={this.state.newPassword} style={{ gridColumn: 2 }} className="center" type="password" onChange={ev => this.setState({ newPassword: ev.target.value })} />
                    <p style={{ gridColumn: 1 }}>Confirm password</p>
                    <input value={this.state.confPassword} style={{ gridColumn: 2 }} className="center" type="password" onChange={ev => this.setState({ confPassword: ev.target.value })} />
                    <div className="center flex-row" style={{ gridColumn: "1/3" }}>
                        <button onClick={this.changePassword}>Confirm</button>
                        <button onClick={() => this.props.setChangingPassword(false)}>Cancel</button>
                    </div>
                </div>

            </div>
        );
    }
}

export default ChangePasswordCard;
