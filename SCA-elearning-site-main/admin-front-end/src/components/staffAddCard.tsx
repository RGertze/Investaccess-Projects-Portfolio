
//##################################
//      REACT IMPORTS
//##################################

import React, { Component, Fragment } from "react";


//##################################
//      CONNECTION IMPORTS
//##################################

import Connection, { POST_TYPE } from "../connection";


//##################################
//      COMPONENT IMPORTS
//##################################



//##################################
//      INTERFACE IMPORTS
//##################################

import { IAddStaff, IPositionShort, IResponse, IStaffMember, IUpdateStaff } from "../interfaces";


//##################################
//      ENUM DEFINITIONS
//##################################

enum INPUT {
    POS_ID,
    NAME,
    SURNAME,
    AGE,
    CELL,
    EMAIL,
    PASSWORD,
    PASSWORD_CONFIRM
}


//##################################
//      INTERFACE DEFINITIONS
//##################################

interface IState {
    toggled: boolean,
    staff: IAddStaff,
    confirmPwordIn: string
}

interface IProps {
    token: string,
    positions: IPositionShort[],
    getUpdatedStaff(): Promise<any>,
    isUpdating: boolean,
    staffToUpdate: IStaffMember,
    changeInputState(isUpdating: boolean, staffToUpdate: IStaffMember): void
}


//##################################
//      CLASS DEFINITION
//##################################

class StaffAddCard extends Component<IProps, IState> {

    //##################################
    //      CONSTRUCTOR
    //##################################

    constructor(props: IProps) {
        super(props);

        this.state = {
            toggled: false,
            staff: {
                positionID: 0,
                staffName: "",
                staffSurname: "",
                staffAge: 0,
                staffCell: "",
                staffEmail: "",
                staffPassword: ""
            },
            confirmPwordIn: ""
        }
    }


    //##################################
    //      COMPONENT DID UPDATE
    //##################################

    componentDidUpdate(prevProps: IProps) {
        if (prevProps.staffToUpdate !== this.props.staffToUpdate && this.props.isUpdating && this.props.staffToUpdate !== null) {
            let staff: IAddStaff = {
                positionID: this.props.positions.find(pos => pos.Position_Name = this.props.staffToUpdate.Position_Name).Position_ID,
                staffName: this.props.staffToUpdate.Staff_Name,
                staffSurname: this.props.staffToUpdate.Staff_Surname,
                staffAge: this.props.staffToUpdate.Staff_Age,
                staffCell: this.props.staffToUpdate.Staff_Cell,
                staffEmail: this.props.staffToUpdate.Staff_Email,
                staffPassword: ""
            }

            this.setState({ staff: staff, toggled: true });
        }
    }


    //##################################
    //      TOGGLE
    //##################################

    handleToggle = async () => {
        if (!this.state.toggled) {
            this.setState({ toggled: true })
        } else {
            this.setState({ toggled: false })
        }
    }


    //##################################
    //      INPUT HANDLER
    //##################################

    handleInput = (inType: INPUT, ev: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        let staff: IAddStaff = {
            positionID: this.state.staff.positionID,
            staffName: this.state.staff.staffName,
            staffSurname: this.state.staff.staffSurname,
            staffAge: this.state.staff.staffAge,
            staffCell: this.state.staff.staffCell,
            staffEmail: this.state.staff.staffEmail,
            staffPassword: this.state.staff.staffPassword
        }

        switch (inType) {
            case INPUT.POS_ID:
                staff.positionID = parseInt(ev.target.value);
                break;
            case INPUT.NAME:
                if (ev.target.value.length < 51) {
                    staff.staffName = ev.target.value;
                }
                break;
            case INPUT.SURNAME:
                if (ev.target.value.length < 51) {
                    staff.staffSurname = ev.target.value;
                }
                break;
            case INPUT.AGE:
                if (parseInt(ev.target.value) > 0) {
                    staff.staffAge = parseInt(ev.target.value);
                } else {
                    staff.staffAge = 0;
                }
                break;
            case INPUT.CELL:
                if (ev.target.value.length < 16) {
                    staff.staffCell = ev.target.value;
                }
                break;
            case INPUT.EMAIL:
                if (ev.target.value.length < 51) {
                    staff.staffEmail = ev.target.value;
                }
                break;
            case INPUT.PASSWORD:
                if (ev.target.value.length < 301) {
                    staff.staffPassword = ev.target.value;
                }
                break;
            case INPUT.PASSWORD_CONFIRM:
                this.setState({ confirmPwordIn: ev.target.value });
                return;
            default:
                return;
        }

        this.setState({ staff: staff });
    }


    //###############################
    //      CLEAR INPUT FIELDS 
    //###############################

    clearInput = () => {
        let staff: IAddStaff = {
            positionID: 0,
            staffName: "",
            staffSurname: "",
            staffAge: 0,
            staffCell: "",
            staffEmail: "",
            staffPassword: ""
        }

        this.setState({ staff: staff, confirmPwordIn: "" });
    }


    //###############################
    //      VALIDATE INPUT 
    //###############################

    validateData = (data: IAddStaff): boolean => {
        if (data.positionID === 0) {
            alert("please choose a position");
            return false;
        }

        if (data.staffName === "") {
            alert("please enter a name");
            return false;
        }

        if (data.staffSurname === "") {
            alert("please enter a surname");
            return false;
        }

        if (data.staffAge === 0) {
            alert("please enter a valid age");
            return false;
        }

        if (data.staffAge < 18) {
            alert("age must be 18 or greater");
            return false;
        }

        if (data.staffCell.length < 10) {       // better validation needed here
            alert("please enter a valid cell phone number");
            return false;
        }

        if (data.staffEmail === "") {
            alert("please enter a valid email address");
            return false;
        }

        if (!this.props.isUpdating && data.staffPassword === "") {
            alert("please enter a valid password");
            return false;
        }

        if (!this.props.isUpdating && this.state.confirmPwordIn !== data.staffPassword) {
            alert("passwords do not match");
            return false;
        }

        return true
    }


    //##################################
    //      ADD NEW STAFF MEMBER 
    //##################################

    addStaffMember = async () => {
        let data: IAddStaff = this.state.staff;

        if (this.validateData(data)) {
            let result: IResponse = await Connection.postReq(POST_TYPE.ADD_STAFF_MEMBER, this.props.token, data, {});

            if (result.stat !== "ok") {
                alert("failed to add staff member: " + result.error);
                return;
            }

            alert("staff member successfully added");
            this.clearInput();
            this.props.getUpdatedStaff();
        }
    }


    //##################################
    //      UPDATE STAFF MEMBER 
    //##################################

    updateStaffMember = async () => {
        let data: IUpdateStaff = {
            staffID: this.props.staffToUpdate.Staff_ID,
            posID: this.state.staff.positionID,
            name: this.state.staff.staffName,
            surname: this.state.staff.staffSurname,
            age: this.state.staff.staffAge,
            cell: this.state.staff.staffCell,
            email: this.state.staff.staffEmail
        }

        if (this.validateData(this.state.staff)) {
            let result: IResponse = await Connection.postReq(POST_TYPE.UPDATE_STAFF, this.props.token, data, {});

            if (result.stat !== "ok") {
                alert("failed to update staff details");
                return;
            }

            alert("staff details successfully updated");
            this.clearInput();
            this.props.getUpdatedStaff();
            this.props.changeInputState(false, null);
        }
    }


    //##################################
    //      RENDER METHOD
    //##################################

    render() {
        return (
            <div id="staff-add-card-container">
                <div id={this.state.toggled ? "staff-add-card-title" : "staff-add-card-title-untoggled"} onClick={this.handleToggle}><h3>{this.props.isUpdating ? "Update Staff Details" : "Add New Staff Member"} {this.state.toggled ? "\u25B2" : "\u25BC"}</h3></div>
                {this.state.toggled &&
                    <div id="staff-add-card-content-container">
                        <div id="staff-add-card-labels-container">
                            <label className="staff-add-card-labels">Position:</label>
                            <label className="staff-add-card-labels">Name:</label>
                            <label className="staff-add-card-labels">Surname:</label>
                            <label className="staff-add-card-labels">Age:</label>
                            <label className="staff-add-card-labels">Cell number:</label>
                            <label className="staff-add-card-labels">Email address:</label>
                            {
                                !this.props.isUpdating &&
                                <Fragment>
                                    <label className="staff-add-card-labels">New password:</label>
                                    <label className="staff-add-card-labels">Confirm password:</label>
                                </Fragment>
                            }
                        </div>
                        <div id="staff-add-card-input-container">
                            <select className="staff-add-card-input" style={{ width: "50%" }} onChange={(ev) => this.handleInput(INPUT.POS_ID, ev)}>
                                {
                                    this.props.positions.map((pos) => {
                                        return (
                                            <option value={pos.Position_ID}>{pos.Position_Name}</option>
                                        );
                                    })
                                }
                            </select>
                            <input value={this.state.staff.staffName} className="staff-add-card-input" type="text" onChange={(ev) => this.handleInput(INPUT.NAME, ev)} />
                            <input value={this.state.staff.staffSurname} className="staff-add-card-input" type="text" onChange={(ev) => this.handleInput(INPUT.SURNAME, ev)} />
                            <input value={this.state.staff.staffAge.toString()} className="staff-add-card-input" type="number" onChange={(ev) => this.handleInput(INPUT.AGE, ev)} />
                            <input value={this.state.staff.staffCell} className="staff-add-card-input" type="text" onChange={(ev) => this.handleInput(INPUT.CELL, ev)} />
                            <input value={this.state.staff.staffEmail} className="staff-add-card-input" type="text" onChange={(ev) => this.handleInput(INPUT.EMAIL, ev)} />

                            {
                                !this.props.isUpdating &&
                                <Fragment>
                                    <input value={this.state.staff.staffPassword} className="staff-add-card-input" type="text" onChange={(ev) => this.handleInput(INPUT.PASSWORD, ev)} />
                                    <input value={this.state.confirmPwordIn} className="staff-add-card-input" type="text" onChange={(ev) => this.handleInput(INPUT.PASSWORD_CONFIRM, ev)} />
                                </Fragment>
                            }
                        </div>
                        <div id="staff-add-card-button-container">
                            <button className="staff-add-card-button" onClick={() => {
                                if (!this.props.isUpdating) {
                                    this.addStaffMember();
                                } else {
                                    this.updateStaffMember();
                                }
                            }}>{this.props.isUpdating ? "Update" : "Add"}</button>
                            <button className="staff-add-card-button" onClick={() => {
                                if (!this.props.isUpdating) {
                                    this.clearInput();
                                } else {
                                    this.clearInput();
                                    this.props.changeInputState(false, null);
                                }
                            }}>{this.props.isUpdating ? "Cancel" : "Clear"}</button>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default StaffAddCard;
