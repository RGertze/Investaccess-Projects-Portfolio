
//##################################
//      REACT IMPORTS
//##################################

import React, { Component, Fragment } from "react";
import Connection, { GET_TYPE, POST_TYPE } from "../connection";


//##################################
//      INTERFACE IMPORTS
//##################################

import { IAddCourse, ICourseDetails, IGetStaffShort, IResponse, IStaffShort, IUpdateCourse } from "../interfaces";

//##################################
//      INTERFACE DEFINITIONS
//##################################

enum INPUT {
    STAFF_ID,
    NAME,
    DESC,
    GRADE
}


//##################################
//      INTERFACE DEFINITIONS
//##################################

interface IState {
    toggled: boolean,

    course: IAddCourse,

    staffShort: IStaffShort[]
}

interface IProps {
    token: string,

    isUpdating: boolean,
    courseToUpdate: ICourseDetails,
    updateGrade: number,

    setUpdating(isUpdating: boolean, courseToUpdate: ICourseDetails): void,
    refreshCourses(grade: number): Promise<any>
}


//##################################
//      CLASS DEFINITION
//##################################

class CourseAddCard extends Component<IProps, IState> {

    //##################################
    //      CONSTRUCTOR
    //##################################

    constructor(props: IProps) {
        super(props);

        this.state = {
            toggled: false,
            course: {
                staffID: 0,
                courseName: "",
                courseDesc: "",
                courseGrade: 0
            },
            staffShort: []
        }
    }


    //##################################
    //      COMPONENT DID MOUNT
    //##################################

    componentDidMount() {
        this.getStaffShort();
    }


    //##################################
    //      COMPONENT DID UPDATE
    //##################################

    componentDidUpdate(prevProps: IProps) {
        if ((!prevProps.isUpdating && this.props.isUpdating) || prevProps.courseToUpdate !== this.props.courseToUpdate && this.props.courseToUpdate !== null) {
            let staff = this.state.staffShort.find(staff => staff.Staff_Name === this.props.courseToUpdate.Staff_Name);
            this.setState({
                course: {
                    staffID: (staff) ? staff.Staff_ID : null,
                    courseName: this.props.courseToUpdate.Course_Name,
                    courseDesc: this.props.courseToUpdate.Course_Desc,
                    courseGrade: null
                },
                toggled: true
            });
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
    //      HANDLE INPUT
    //##################################

    handleInput = (inType: INPUT, ev: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        let course: IAddCourse = {
            staffID: this.state.course.staffID,
            courseName: this.state.course.courseName,
            courseDesc: this.state.course.courseDesc,
            courseGrade: this.state.course.courseGrade
        }

        switch (inType) {
            case INPUT.STAFF_ID:
                course.staffID = parseInt(ev.target.value);
                break;
            case INPUT.NAME:
                if (ev.target.value.length < 51) {
                    course.courseName = ev.target.value;
                }
                break;
            case INPUT.DESC:
                if (ev.target.value.length < 101) {
                    course.courseDesc = ev.target.value;
                }
                break;
            case INPUT.GRADE:
                if (parseInt(ev.target.value) > 0) {
                    course.courseGrade = parseInt(ev.target.value);
                } else {
                    course.courseGrade = 0;
                }
                break;
        }

        this.setState({ course: course });
    }


    //##################################
    //      VALIDATE DATA
    //##################################

    validateData = (): boolean => {
        if (this.state.course.courseName === "") {
            alert("enter a course name");
            return false;
        }
        if (this.state.course.courseDesc === "") {
            alert("enter a course description");
            return false;
        }
        if (!this.props.isUpdating && (this.state.course.courseGrade < 1 || this.state.course.courseGrade > 7)) {
            alert("grade must be between 1 and 7");
            return false;
        }
        if (this.state.course.staffID === 0) {
            alert("choose a staff member to teach the course");
            return false;
        }

        return true;
    }

    //##################################
    //      CLEAR INPUT
    //##################################

    clearInput = () => {
        let input: IAddCourse = {
            staffID: this.state.course.staffID,
            courseName: "",
            courseDesc: "",
            courseGrade: 0
        }

        this.setState({ course: input });
    }


    //##################################
    //      GET SHORT VERSION OF STAFF
    //##################################

    getStaffShort = async () => {
        let data: IGetStaffShort = {}

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_STAFF_SHORT, this.props.token, data);

        if (result.stat === "ok") {
            let course = this.state.course;
            let staff: IStaffShort = result.data[0];
            course.staffID = staff.Staff_ID;
            this.setState({ staffShort: result.data, course: course });
        }
    }


    //##################################
    //      ADD COURSE
    //##################################

    addCourse = async () => {
        if (this.validateData) {
            let data: IAddCourse = this.state.course;

            let result: IResponse = await Connection.postReq(POST_TYPE.ADD_COURSE, this.props.token, data, {});

            if (result.stat !== "ok") {
                alert("failed to add course: " + result.error);
                return;
            }

            alert("successfully added course");
            this.clearInput();
            this.props.refreshCourses(data.courseGrade);
        }
    }


    //##################################
    //      UPDATE COURSE
    //##################################

    updateCourse = async () => {
        let data: IUpdateCourse = {
            staffID: this.state.course.staffID,
            courseID: this.props.courseToUpdate.Course_ID,
            courseName: this.state.course.courseName,
            courseDesc: this.state.course.courseDesc
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.UPDATE_COURSE, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert("failed to update course");
            return;
        }

        alert("Successfully updated course");
        this.clearInput();
        this.props.refreshCourses(this.props.updateGrade);
        this.props.setUpdating(false, null);
    }


    //##################################
    //      RENDER METHOD
    //##################################

    render() {
        return (
            <div id="course-add-card-container">

                <div id={this.state.toggled ? "course-add-card-title" : "course-add-card-title-untoggled"} onClick={this.handleToggle}><h3>{!this.props.isUpdating ? "Add Course" : "Update Course"} {this.state.toggled ? "\u25B2" : "\u25BC"}</h3></div>
                {this.state.toggled &&
                    <div id="course-add-card-content-container">
                        <div id="course-add-card-labels-container">
                            <label className="course-add-card-labels">Course Name:</label>
                            <label className="course-add-card-labels">Course Description:</label>
                            {
                                !this.props.isUpdating &&
                                <label className="course-add-card-labels">Course Grade:</label>
                            }
                            <label className="course-add-card-labels">Course Staff:</label>
                        </div>

                        <div id="course-add-card-input-container">
                            <input value={this.state.course.courseName} style={{ width: "70%" }} className="course-add-card-input" type="text" onChange={(ev) => this.handleInput(INPUT.NAME, ev)} />
                            <input value={this.state.course.courseDesc} style={{ width: "70%" }} className="course-add-card-input" type="text" onChange={(ev) => this.handleInput(INPUT.DESC, ev)} />
                            {
                                !this.props.isUpdating &&
                                <input value={this.state.course.courseGrade.toString()} style={{ width: "70%" }} className="course-add-card-input" type="number" onChange={(ev) => this.handleInput(INPUT.GRADE, ev)} />
                            }
                            <select style={{ width: "50%" }} defaultValue="choose staff" value={this.state.course.staffID} onChange={(ev) => this.handleInput(INPUT.STAFF_ID, ev)}>
                                {
                                    this.state.staffShort.map((staff) => {
                                        return (
                                            <option value={staff.Staff_ID}>{staff.Staff_Name}</option>
                                        );
                                    })
                                }
                            </select>
                        </div>

                        <div id="course-add-card-button-container">
                            <button style={{ width: "20%" }} onClick={() => {
                                if (this.props.isUpdating) {
                                    this.updateCourse();
                                } else {
                                    this.addCourse();
                                }
                            }}>{!this.props.isUpdating ? "Add" : "Update"}</button>
                            <button style={{ width: "20%" }} onClick={() => {
                                this.clearInput();
                                if (this.props.isUpdating) {
                                    this.props.setUpdating(false, null);
                                }
                            }}>{!this.props.isUpdating ? "Clear" : "Cancel"}</button>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default CourseAddCard;
