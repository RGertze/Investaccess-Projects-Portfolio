
//#######################################
//      REACT IMPORTS
//#######################################

import React, { Component } from "react";

//#######################################
//      CONNECTION IMPORTS
//#######################################

import Connection, { POST_TYPE } from "../connection";

//#######################################
//      INTERFACE/ENUM IMPORTS
//#######################################

import { ICourseMark, IResponse, IUpdateStudentCourse } from "../interfaces";


//#######################################
//      INTERFACE DEFINITIONS
//#######################################

interface IState {
    updatedMark: string
}

interface IProps {
    token: string,
    studentID: number,

    courseMark: ICourseMark,
    refreshCourseMarks(): void
}

//#######################################
//#######################################



//#######################################
//      CLASS DEFINITION
//#######################################

class CourseMarksCard extends Component<IProps, IState> {

    //#######################################
    //      CONSTRUCTOR
    //#######################################

    constructor(props: IProps) {
        super(props);

        this.state = {
            updatedMark: ""
        }
    }

    //#######################################
    //      COMPONENT DID MOUNT
    //#######################################

    componentDidMount() {
    }


    //#######################################
    //      MARK INPUT HANDLING
    //#######################################

    handleMarkInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ updatedMark: ev.target.value });
    }


    //#######################################
    //      UPDATE MARK
    //#######################################

    updateMark = async () => {

        if (this.state.updatedMark !== "") {

            let data: IUpdateStudentCourse = {
                studentID: this.props.studentID,
                courseID: this.props.courseMark.Course_ID,
                mark: parseFloat(this.state.updatedMark)
            }

            let result: IResponse = await Connection.postReq(POST_TYPE.UPDATE_STUDENT_COURSE, this.props.token, data, {});

            if (result.stat !== "ok") {
                alert(result.error);
                return;
            }

            alert("Successfully updated mark");
            this.setState({ updatedMark: "" });
            this.props.refreshCourseMarks();
        } else {
            alert("No mark was entered");
        }
    }


    //#######################################
    //      RENDER METHOD
    //#######################################

    render() {
        return (
            <div id="course-marks-card-container">
                <p style={{ gridColumn: 1 }}>{this.props.courseMark.Course_Name}</p>
                <p style={{ gridColumn: 2 }}>{this.props.courseMark.Student_Course_Mark}</p>
                <div id="course-marks-card-mark-update">
                    <input style={{ width: "30%" }} type="number" value={this.state.updatedMark} onChange={(ev) => this.handleMarkInput(ev)} />
                    <button style={{ width: "fit-content" }} onClick={this.updateMark}>Update</button>
                </div>
            </div>
        );
    }
}

export default CourseMarksCard;
