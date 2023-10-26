
//#########################################
//        REACT IMPORTS
//#########################################

import React, { Component, Fragment } from "react";
import Connection, { GET_TYPE } from "../connection";

//#########################################
//        COMPONENT IMPORTS
//#########################################

import CourseMarksCard from "./courseMarksCard";

//#########################################
//        INTERFACE IMPORTS
//#########################################

import { ICourseMark, ICourseTakenByStudent, IGetCourseMarks, IResponse } from "../interfaces";


//#########################################
//        INTERFACE DEFINITIONS
//#########################################

interface IState {
    toggled: boolean,
    courseMarks: ICourseMark[]
}

interface IProps {
    token: string,
    studentID: number,
    coursesTaken: ICourseTakenByStudent[]
}

//#########################################
//        CLASS DEFINITION
//#########################################

class StudentCourseMarksCard extends Component<IProps, IState> {

    //#########################################
    //        CONSTRUCTOR
    //#########################################

    constructor(props: IProps) {
        super(props);

        this.state = {
            toggled: false,
            courseMarks: []
        }
    }


    //##################################
    //      COMPONENT DID MOUNT
    //##################################

    componentDidMount() {
        this.getCourseMarks();
    }


    //##################################
    //      COMPONENT DID UPDATE
    //##################################

    componentDidUpdate(prevProps: IProps) {
        if (prevProps.coursesTaken !== this.props.coursesTaken) {
            this.getCourseMarks();
        }
    }


    //#########################################
    //        GET COURSE MARKS
    //#########################################

    getCourseMarks = async () => {
        let data: IGetCourseMarks = {
            username: this.props.studentID.toString()
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_COURSE_MARKS, this.props.token, data);

        if (result.stat === "ok") {
            this.setState({ courseMarks: result.data });
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


    //#########################################
    //        RENDER METHOD
    //#########################################

    render() {
        return (
            <div id="student-course-marks-card-container">
                <div id="student-course-marks-card-title" onClick={this.handleToggle}><h3>Course Marks {this.state.toggled ? "\u25B2" : "\u25BC"}</h3></div>

                {
                    this.state.toggled &&
                    <Fragment>
                        <div id="student-course-marks-card-header">
                            <h4 style={{ gridColumn: 1 }}>Course</h4>
                            <h4 style={{ gridColumn: 2 }}>Mark Obtained</h4>
                        </div>

                        {
                            this.state.courseMarks.length === 0 &&
                            <h3 style={{ color: "white", textAlign: "center" }}>No courses found!</h3>
                        }

                        {
                            this.state.courseMarks.map(mark => {
                                return (
                                    <CourseMarksCard token={this.props.token} studentID={this.props.studentID} courseMark={mark} refreshCourseMarks={this.getCourseMarks} />
                                );
                            })
                        }

                    </Fragment>
                }
            </div>
        );
    }
}

export default StudentCourseMarksCard;
