
//#########################################
//        REACT IMPORTS
//#########################################

import React, { Component, Fragment } from "react";
import Connection, { GET_TYPE } from "../connection";

//#########################################
//        COMPONENT IMPORTS
//#########################################

import AssignmentCard from "./assignmentCard";

//#########################################
//        INTERFACE IMPORTS
//#########################################

import { ICourseAssignment, ICourseTakenByStudent, IGetCourseAssignments, IResponse } from "../interfaces";


//#########################################
//        INTERFACE DEFINITIONS
//#########################################

interface IState {
    toggled: boolean,
    currentCourse: number,
    assignments: ICourseAssignment[]
}

interface IProps {
    token: string,
    studentID: number,
    coursesTaken: ICourseTakenByStudent[]
}

//#########################################
//        CLASS DEFINITION
//#########################################

class ReportCard extends Component<IProps, IState> {

    //#########################################
    //        CONSTRUCTOR
    //#########################################

    constructor(props: IProps) {
        super(props);

        this.state = {
            toggled: false,
            currentCourse: (this.props.coursesTaken[0]) ? this.props.coursesTaken[0].Course_ID : 0,
            assignments: []
        }
    }


    //##################################
    //      COMPONENT DID MOUNT
    //##################################

    componentDidMount() {
        this.getCourseAssignments();
    }


    //##################################
    //      COMPONENT DID UPDATE
    //##################################

    componentDidUpdate(prevProps: IProps) {
        if (prevProps.coursesTaken.length !== this.props.coursesTaken.length) {
            if (this.props.coursesTaken.length > 0) {
                this.setState({ currentCourse: this.props.coursesTaken[0].Course_ID });
            }
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
    //      TOGGLE
    //##################################

    handleCourseChange = async (ev: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({ currentCourse: parseInt(ev.target.value) }, () => {
            this.getCourseAssignments();
        });
    }


    //##################################
    //      GET COURSE ASSIGNMENTS
    //##################################

    getCourseAssignments = async () => {
        let data: IGetCourseAssignments = {
            courseID: this.state.currentCourse
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_ASSIGNMENTS, this.props.token, data);

        if (result.stat === "ok") {
            this.setState({ assignments: result.data });
            return;
        }

        this.setState({ assignments: [] });
    }


    //#########################################
    //        RENDER METHOD
    //#########################################

    render() {
        return (
            <div id="student-assignments-card-container">
                <div id="student-assignments-card-title" onClick={this.handleToggle}><h3>Assignments {this.state.toggled ? "\u25B2" : "\u25BC"}</h3></div>

                {
                    this.state.toggled &&
                    <Fragment>
                        <div id="student-assignments-card-course-selector">
                            <p>Choose course:</p>
                            <select value={this.state.currentCourse} onChange={(ev) => this.handleCourseChange(ev)}>
                                {
                                    this.props.coursesTaken.map((course) => {
                                        return (
                                            <option key={course.Course_ID} value={course.Course_ID}>{course.Course_Name}</option>
                                        );
                                    })
                                }
                            </select>
                        </div>

                        <div id="student-assignments-card-header">
                            <h4 style={{ gridColumn: 1 }}>Name</h4>
                            <h4 style={{ gridColumn: 2 }}>Mark Available</h4>
                            <h4 style={{ gridColumn: 3 }}>Mark Obtained</h4>
                        </div>

                        {
                            this.state.assignments.map((assignment) => {
                                return (
                                    <AssignmentCard key={assignment.Course_Assignment_Path} assignment={assignment} token={this.props.token} studentID={this.props.studentID} />
                                );
                            })
                        }
                        {
                            this.state.assignments.length === 0 &&
                            <h3 style={{ color: "white", textAlign: "center" }}>No assignments found!</h3>
                        }

                    </Fragment>
                }
            </div>
        );
    }
}

export default ReportCard;
