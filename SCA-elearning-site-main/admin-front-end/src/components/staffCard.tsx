
//----------------------------------
//      REACT IMPORTS
//----------------------------------

import React, { Component, Fragment } from "react";

//----------------------------------
//      COMPONENT IMPORTS
//----------------------------------

import CourseTaughtCard from "./courseTaughtCard";
import ChangePasswordCard from "./changePasswordCard/changePasswordCard";


//----------------------------------
//      INTERFACE IMPORTS
//----------------------------------

import { ICourseTaughtByStaff, IDeleteStaff, IGetCoursesTaughtByStaff, IResponse, IStaffMember } from "../interfaces";
import Connection, { GET_TYPE, POST_TYPE } from "../connection";


//----------------------------------
//      INTERFACE DEFINITIONS
//----------------------------------

interface IState {
    toggled: boolean,
    changingPassword: boolean,
    coursesTaught: ICourseTaughtByStaff[]
}

interface IProps {
    token: string,
    staff: IStaffMember,
    refreshStaff(): Promise<any>,
    updateStaff(isUpdating: boolean, staffToUpdate: IStaffMember): void
}


//----------------------------------
//      CLASS DEFINITION
//----------------------------------

class StaffCard extends Component<IProps, IState> {

    //----------------------------------
    //      CONSTRUCTOR
    //----------------------------------

    constructor(props: IProps) {
        super(props);

        this.state = {
            toggled: false,
            changingPassword: false,
            coursesTaught: []
        }
    }


    //----------------------------------
    //      HANDLE TOGGLE
    //----------------------------------

    handleToggle = async () => {
        if (!this.state.toggled) {

            this.setState({ toggled: true });

            await this.getCoursesTaught();

            return;
        }

        this.setState({ toggled: false });
    }


    //--------------------------------------
    //      SET CHANGING PASSWORD STATE
    //--------------------------------------

    setChangingPassword = (value: boolean) => {
        this.setState({ changingPassword: value });
    }


    //----------------------------------
    //      REMOVE STAFF
    //----------------------------------

    removeStaff = async () => {
        let data: IDeleteStaff = {
            staffID: this.props.staff.Staff_ID
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.DELETE_STAFF, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert("failed to remove staff member: " + result.error);
            return;
        }

        await this.handleToggle();
        alert("successfully removed staff and all related data");
        this.props.refreshStaff();
    }


    //----------------------------------
    //      GET COURSES TAUGHT
    //----------------------------------

    getCoursesTaught = async () => {
        let data: IGetCoursesTaughtByStaff = {
            staffID: this.props.staff.Staff_ID
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_COURSES_TAUGHT_BY_STAFF, this.props.token, data);

        if (result.stat === "ok") {
            this.setState({ coursesTaught: result.data });
        } else {
            this.setState({ coursesTaught: [] });
        }
    }


    //----------------------------------
    //      RENDER METHOD
    //----------------------------------

    render() {
        return (
            <div id="staff-card-container">
                <div id="staff-card-table-record" className="staff-section-table" onClick={this.handleToggle}>
                    <p style={{ gridColumn: 1 }}>{this.props.staff.Staff_ID}</p>
                    <p style={{ gridColumn: 2 }} id="staff-card-table-name">{this.props.staff.Staff_Name + "   " + this.props.staff.Staff_Surname}</p>
                    <p style={{ gridColumn: 3 }}>{this.props.staff.Position_Name}</p>
                    <p style={{ gridColumn: 4 }}>{this.props.staff.Staff_Cell}</p>
                </div>

                {
                    this.state.toggled &&
                    <Fragment>

                        <div id="staff-card-buttons-container">
                            <div id="staff-card-remove-student-button" onClick={this.removeStaff}>
                                <p>Remove Staff</p>
                            </div>

                            <div id="staff-card-update-student-button" onClick={() => this.props.updateStaff(true, this.props.staff)}>
                                <p>Update Staff</p>
                            </div>

                            <div id="staff-card-update-student-button" style={{ gridColumn: 3 }} onClick={() => this.setState({ changingPassword: true })}>
                                <p>Change Password</p>
                            </div>

                            {
                                //    CHANGE PASSWORD

                                this.state.changingPassword &&
                                <ChangePasswordCard token={this.props.token} userType={1} userID={this.props.staff.Staff_ID} setChangingPassword={this.setChangingPassword} />
                            }
                        </div>

                        <div id="staff-card-courses-container">
                            <h4 id="staff-card-courses-title">Courses taught by {this.props.staff.Staff_Name}:</h4>
                            {
                                this.state.coursesTaught.map((course) => {
                                    return (
                                        <CourseTaughtCard staffID={this.props.staff.Staff_ID} key={course.Course_ID} token={this.props.token} course={course} refreshCourseTaught={this.getCoursesTaught} />
                                    );
                                })
                            }
                        </div>
                    </Fragment>
                }
            </div>
        );
    }
}

export default StaffCard;
