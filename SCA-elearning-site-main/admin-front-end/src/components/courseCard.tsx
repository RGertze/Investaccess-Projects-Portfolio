
//----------------------------------
//      REACT IMPORTS
//----------------------------------

import React, { Component } from "react";
import Connection, { GET_TYPE, POST_TYPE } from "../connection";


//----------------------------------
//      INTERFACE IMPORTS
//----------------------------------

import { IAddCourseStaff, ICourseDetails, IDeleteCourse, IGetOtherCourseStaff, IGetStaffShort, IResponse, IStaffShort } from "../interfaces";

//----------------------------------
//      COMPONENT IMPORTS
//----------------------------------

import CourseTopicCard from "./courseTopicCard/courseTopicCard";
import AddRounded from "@material-ui/icons/AddRounded";


//----------------------------------
//      INTERFACE DEFINITIONS
//----------------------------------

interface IState {
    toggled: boolean,

    addingOtherStaff: boolean,
    otherStaff: IStaffShort[],

    staffShort: IStaffShort[],
    inStaffIndex: number
}

interface IProps {
    token: string,

    course: ICourseDetails,
    grade: number,
    setUpdating(isUpdating: boolean, courseToUpdate: ICourseDetails): void,
    refreshCourses(grade: number): Promise<void>
}


//----------------------------------
//      CLASS DEFINITION
//----------------------------------

class CourseCard extends Component<IProps, IState> {

    //----------------------------------
    //      CONSTRUCTOR
    //----------------------------------

    constructor(props: IProps) {
        super(props);

        this.state = {
            toggled: false,
            addingOtherStaff: false,
            otherStaff: [],
            staffShort: [],
            inStaffIndex: 0
        }
    }


    //----------------------------------
    //      HANDLE TOGGLE
    //----------------------------------

    handleToggle = async () => {
        if (!this.state.toggled) {
            this.setState({ toggled: true });
            this.getOtherStaffMembers();
        } else {
            this.setState({ toggled: false });
        }
    }


    //----------------------------------
    //      TOGGLE ADD COURSE STAFF
    //----------------------------------

    toggleAddCourseStaff = () => {
        let addingOtherStaff = !this.state.addingOtherStaff;
        this.setState({ addingOtherStaff: addingOtherStaff });
        this.getStaffShort();
    }


    //----------------------------------
    //      GET OTHER STAFF
    //----------------------------------

    getOtherStaffMembers = async () => {
        let data: IGetOtherCourseStaff = {
            courseID: this.props.course.Course_ID
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_OTHER_COURSE_STAFF, this.props.token, data);

        if (result.stat === "ok") {
            this.setState({ otherStaff: result.data });
            return;
        }

        this.setState({ otherStaff: [] });
    }


    //----------------------------------
    //      ADD COURSE STAFF
    //----------------------------------

    addCourseStaff = async () => {
        let data: IAddCourseStaff = {
            staffID: this.state.staffShort[this.state.inStaffIndex].Staff_ID,
            courseID: this.props.course.Course_ID
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.ADD_COURSE_STAFF, this.props.token, data, {});

        if (result.stat === "ok") {
            alert("success");
            this.toggleAddCourseStaff();
            this.getOtherStaffMembers();
            return;
        }

        alert(result.error);
    }


    //----------------------------------
    //      GET SHORT VERSION OF STAFF
    //----------------------------------

    getStaffShort = async () => {
        let data: IGetStaffShort = {}

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_STAFF_SHORT, this.props.token, data);

        if (result.stat === "ok") {
            this.setState({ staffShort: result.data, inStaffIndex: 0 });
            return;
        }

        alert("error occured retrieving staff members");
        this.toggleAddCourseStaff();
    }


    //----------------------------------
    //      DELETE COURSE
    //----------------------------------

    deleteCourse = async () => {
        let data: IDeleteCourse = {
            courseID: this.props.course.Course_ID
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.DELETE_COURSE, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert("Failed to remove course: " + result.error);
            return;
        }

        alert("course successfully removed");
        this.props.refreshCourses(this.props.grade);
    }


    //----------------------------------
    //      RENDER METHOD
    //----------------------------------

    render() {
        return (
            <div id="course-card-container">

                <div id="course-card-info-container" onClick={this.handleToggle}>
                    <p>{this.props.course.Course_ID}</p>
                    <p id="course-card-info-name">{this.props.course.Course_Name}</p>
                    <p>{this.props.course.Course_Desc}</p>
                    <p>{this.props.course.Staff_Name}</p>
                </div>


                {

                    //----------------------------------
                    //      UPDATE / DELETE BUTTONS
                    //----------------------------------

                    this.state.toggled &&
                    <div id="course-card-buttons-container">
                        <div id="course-card-buttons-delete" className="course-card-buttons"><h3 onClick={this.deleteCourse}>remove</h3></div>
                        <div id="course-card-buttons-update" className="course-card-buttons"><h3 onClick={() => this.props.setUpdating(true, this.props.course)}>update</h3></div>
                    </div>
                }

                {
                    //----------------------------------
                    //      DISPLAY OTHER STAFF
                    //----------------------------------

                    this.state.toggled &&
                    <div id="course-other-staff-container" className="center">
                        <div id="course-other-staff-header" className="title-col center">
                            <h3>Other Staff: </h3>
                            <AddRounded id="add-course-staff-button" onClick={this.toggleAddCourseStaff} />
                        </div>
                        {
                            this.state.otherStaff.map(staff => {
                                return (
                                    <p>{staff.Staff_Name}</p>
                                )
                            })
                        }
                        {
                            (this.state.otherStaff.length === 0) &&
                            <p>No other staff</p>
                        }
                    </div>
                }

                {
                    //----------------------------------
                    //      ADD COURSE STAFF
                    //----------------------------------

                    this.state.addingOtherStaff &&
                    <div className="add-card-overlay">
                        <div id="add-course-staff-container" className="flex-column">
                            <select style={{ width: "200px" }} defaultValue="choose staff" value={this.state.inStaffIndex} onChange={(ev) => this.setState({ inStaffIndex: parseInt(ev.target.value) })}>
                                {
                                    this.state.staffShort.map((staff, index) => {
                                        return (
                                            <option value={index}>{staff.Staff_Name}</option>
                                        );
                                    })
                                }
                            </select>
                            <div className="flex-row">
                                <button onClick={this.addCourseStaff}>Add</button>
                                <button onClick={this.toggleAddCourseStaff}>Cancel</button>
                            </div>
                        </div>
                    </div>
                }

                {

                    //----------------------------------
                    //      DISPLAY TOPICS
                    //----------------------------------
                    this.state.toggled &&
                    <CourseTopicCard course={this.props.course} token={this.props.token} />
                }



            </div>
        );
    }
}

export default CourseCard;
