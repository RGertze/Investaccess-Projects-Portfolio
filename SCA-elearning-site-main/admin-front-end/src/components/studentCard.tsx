

//----------------------------------
//      REACT IMPORTS
//----------------------------------

import React, { Component, Fragment } from "react";
import Connection, { GET_TYPE, POST_TYPE } from "../connection";

//----------------------------------
//      COMPONENT IMPORTS
//----------------------------------

import CourseTakenCard from "./courseTakenCard";
import { AsyncStudentReportCard } from "../async-components/asyncStudentReportCard";
import StudentAssignmentsCard from "./studentAssignmentsCard";
import StudentCourseMarksCard from "./studentCourseMarksCard";
import ChangePasswordCard from "./changePasswordCard/changePasswordCard";

//----------------------------------
//      INTERFACE IMPORTS
//----------------------------------

import { IAddAllStudentCourses, IAddStudentCourse, ICourseShort, ICourseTakenByStudent, IDeleteStudent, IDeleteStudentCourse, IGetCoursesByGradeShort, IGetCoursesTakenByStudent, IResponse, IStudentAll } from "../interfaces";
import { STUDENT_INPUT_STATE } from "./studentsSection";


//----------------------------------
//      ENUM DEFINITIONS
//----------------------------------


//----------------------------------
//      INTERFACE DEFINITIONS
//----------------------------------

interface IState {
    toggled: boolean,
    changingPassword: boolean,
    infoScrollRef: React.RefObject<HTMLDivElement>,

    addCourseValue: number,

    coursesForGrade: ICourseShort[],
    coursesTaken: ICourseTakenByStudent[]
}

interface IProps {
    token: string,
    student: IStudentAll,
    updateStudentDetails(state: STUDENT_INPUT_STATE.UPDATE, student: IStudentAll): void,
    getUpdatedStudents(): Promise<any>
}


//----------------------------------
//      CLASS DEFINITION
//----------------------------------

class StudentCard extends Component<IProps, IState> {

    //----------------------------------
    //      CONSTRUCTOR
    //----------------------------------

    constructor(props: IProps) {
        super(props);

        this.state = {
            toggled: false,
            changingPassword: false,
            infoScrollRef: React.createRef(),

            addCourseValue: 0,

            coursesForGrade: [],
            coursesTaken: []
        }
    }


    //----------------------------------
    //      COMPONENT DID MOUNT
    //----------------------------------

    componentDidMount() {
    }


    //----------------------------------
    //      COMPONENT DID UPDATE
    //----------------------------------

    componentDidUpdate() {
        //console.log(this.state.coursesForGrade);
    }


    //----------------------------------
    //      SCROLL HANDLER
    //---------------------------------

    handleScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
        //-------------------------------------------------
        //      SET HEADER SCROLL POS TO INFO SCROLL POS
        //-------------------------------------------------
        document.getElementById('students-section-table-header-container').scrollLeft = this.state.infoScrollRef.current.scrollLeft;
    }


    //----------------------------------
    //      HANDLE TOGGLE
    //----------------------------------

    handleToggle = async () => {
        if (!this.state.toggled) {
            await this.getCoursesTaken();
            this.setState({ toggled: true });
            await this.getCoursesByGradeShort();
        } else {
            this.setState({ toggled: false });
        }
    }


    //--------------------------------------
    //      SET CHANGING PASSWORD STATE
    //--------------------------------------

    setChangingPassword = (value: boolean) => {
        this.setState({ changingPassword: value });
    }


    //----------------------------------
    //      GET COURSES BY GRADE SHORT
    //----------------------------------

    getCoursesByGradeShort = async () => {
        let data: IGetCoursesByGradeShort = {
            grade: this.props.student.Student_Grade
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_COURSES_BY_GRADE_SHORT, this.props.token, data);

        if (result.stat === "ok") {
            this.setState({ coursesForGrade: result.data }, () => this.setState({ addCourseValue: this.state.coursesForGrade[0].Course_ID }));
        }
    }


    //----------------------------------
    //      GET COURSES TAKEN
    //----------------------------------

    getCoursesTaken = async () => {
        let data: IGetCoursesTakenByStudent = {
            username: this.props.student.Student_ID.toString()
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_COURSES_TAKEN_BY_STUDENT, this.props.token, data);

        if (result.stat === "ok") {
            this.setState({ coursesTaken: result.data });
        }
    }


    //----------------------------------
    //      REMOVE STUDENT
    //----------------------------------

    removeStudent = async () => {
        let data: IDeleteStudent = {
            studentID: this.props.student.Student_ID
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.DELETE_STUDENT, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert("failed to remove student");
            return;
        }

        await this.handleToggle();
        alert("successfully removed student and all related data");
        this.props.getUpdatedStudents();
    }


    //----------------------------------
    //      ADD STUDENT COURSE
    //----------------------------------

    addStudentCourse = async () => {
        if (this.state.addCourseValue !== 0) {
            let data: IAddStudentCourse = {
                courseID: this.state.addCourseValue,
                studentID: this.props.student.Student_ID
            }

            let result: IResponse = await Connection.postReq(POST_TYPE.ADD_STUDENT_COURSE, this.props.token, data, {});

            if (result.stat !== "ok") {
                alert("failed to add student course");
                return;
            }

            alert("successfully added student course");
            this.getCoursesTaken();
        }
    }


    //----------------------------------
    //      ADD ALL STUDENT COURSES
    //----------------------------------

    addAllStudentCourses = async () => {
        if (this.state.coursesForGrade.length !== 0) {
            let data: IAddAllStudentCourses = {
                studentID: this.props.student.Student_ID
            }

            let result: IResponse = await Connection.postReq(POST_TYPE.ADD_ALL_STUDENT_COURSES, this.props.token, data, {});

            if (result.stat !== "ok") {
                alert("failed to add student courses");
                return;
            }

            alert("successfully added student courses");
            this.getCoursesTaken();
            return;
        }

        alert("no courses available to add");
    }


    //----------------------------------
    //      REMOVE STUDENT COURSE
    //----------------------------------

    removeStudentCourse = async (courseID: number) => {
        let data: IDeleteStudentCourse = {
            studentID: this.props.student.Student_ID,
            courseID: courseID
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.DELETE_STUDENT_COURSE, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert(result.error);
            return;
        }

        alert("successfully removed course");

        this.getCoursesTaken();
    }



    //----------------------------------
    //      RENDER METHOD
    //----------------------------------

    render() {
        return (
            <div id="student-card-container">

                <div ref={this.state.infoScrollRef} id="student-card-info-container" onClick={() => this.handleToggle()} onScroll={ev => this.handleScroll(ev)}>
                    <p>{this.props.student.Student_ID}</p>
                    <p id="student-card-info-name">{this.props.student.Student_First_Name}</p>
                    <p>{this.props.student.Student_Surname_Name}</p>
                    <p>{this.props.student.Student_Age}</p>
                    <p>{this.props.student.Student_Grade}</p>
                    <p>{this.props.student.Student_Guardian_Cell}</p>
                </div>

                {
                    this.state.toggled &&
                    <Fragment>

                        <div id="student-card-buttons-container">
                            <div id="student-card-remove-student-button" onClick={this.removeStudent}>
                                <p>Remove Student</p>
                            </div>

                            <div id="student-card-update-student-button" onClick={() => this.props.updateStudentDetails(STUDENT_INPUT_STATE.UPDATE, this.props.student)}>
                                <p>Update Details</p>
                            </div>

                            <div id="student-card-update-student-button" style={{ gridColumn: 3 }} onClick={() => this.setChangingPassword(true)}>
                                <p>Change Password</p>
                            </div>
                            {
                                //    CHANGE PASSWORD

                                this.state.changingPassword &&
                                <ChangePasswordCard token={this.props.token} userType={2} userID={this.props.student.Student_ID} setChangingPassword={this.setChangingPassword} />
                            }
                        </div>


                        <AsyncStudentReportCard token={this.props.token} student={this.props.student} />

                        <StudentAssignmentsCard token={this.props.token} studentID={this.props.student.Student_ID} coursesTaken={this.state.coursesTaken} />

                        <StudentCourseMarksCard token={this.props.token} studentID={this.props.student.Student_ID} coursesTaken={this.state.coursesTaken} />


                        <h3 id="student-card-courses-taken-title">Courses Taken:</h3>

                        <div id="student-card-add-course">
                            <h4>Add course:</h4>
                            <select value={this.state.addCourseValue} onChange={(ev) => { this.setState({ addCourseValue: parseInt(ev.target.value) }) }}>
                                {
                                    this.state.coursesForGrade.map((course) => {
                                        return (
                                            <option value={course.Course_ID}>{course.Course_Name}</option>
                                        );
                                    })
                                }
                            </select>
                            <button id="student-card-add-course-button" onClick={() => this.addStudentCourse()}>Add</button>
                            <button id="student-card-add-course-button" onClick={() => this.addAllStudentCourses()}>Add All</button>
                        </div>

                        {this.state.coursesTaken.map((course) => {
                            return (
                                <div id="student-card-courses-taken-container">
                                    <CourseTakenCard course={course} />
                                    <div id="student-card-courses-taken-remove" onClick={() => this.removeStudentCourse(course.Course_ID)}><h4>remove</h4></div>
                                </div>
                            );
                        })
                        }
                    </Fragment>

                }
            </div>
        );
    }
}

export default StudentCard;
