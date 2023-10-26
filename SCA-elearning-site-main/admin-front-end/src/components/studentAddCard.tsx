
//----------------------------------
//      REACT IMPORTS
//----------------------------------

import React, { Component, Fragment } from "react";


//----------------------------------
//      CONNECTION IMPORTS
//----------------------------------

import Connection, { POST_TYPE } from "../connection";


//----------------------------------
//      COMPONENT IMPORTS
//----------------------------------

import CourseTaughtCard from "./courseTaughtCard";


//----------------------------------
//      INTERFACE IMPORTS
//----------------------------------

import { IAddStaff, IAddStudent, IPositionShort, IResponse, IStudentAll, IUpdateStudent } from "../interfaces";
import { STUDENT_INPUT_STATE } from "./studentsSection";


//----------------------------------
//      ENUM DEFINITIONS
//----------------------------------

enum INPUT {
    NAME,
    SURNAME,
    AGE,
    GRADE,
    CELL,
    EMAIL_M,
    EMAIL_F,
    PASSWORD,
    PASSWORD_CONFIRM
}


//----------------------------------
//      INTERFACE DEFINITIONS
//----------------------------------

interface IState {
    toggled: boolean,
    student: IAddStudent,
    confirmPwordIn: string
}

interface IProps {
    token: string,

    getUpdatedStudents(): Promise<any>,

    inputState: STUDENT_INPUT_STATE,
    studentToUpdate: IStudentAll,
    changeInputState(state: STUDENT_INPUT_STATE, student: IStudentAll): void
}


//----------------------------------
//      CLASS DEFINITION
//----------------------------------

class StudentAddCard extends Component<IProps, IState> {

    //----------------------------------
    //      CONSTRUCTOR
    //----------------------------------

    constructor(props: IProps) {
        super(props);

        this.state = {
            toggled: false,
            student: {
                studentFirstname: "",
                studentSurname: "",
                studentAge: 0,
                studentGrade: 0,
                studentGuardianCell: "",
                studentGuardianEmailM: "",
                studentGuardianEmailF: "",
                studentPassword: ""
            },
            confirmPwordIn: ""
        }
    }


    //----------------------------------
    //      COMPONENT DID UPDATE
    //----------------------------------

    componentDidUpdate(prevProps: IProps) {
        if (prevProps.studentToUpdate !== this.props.studentToUpdate && this.props.inputState === STUDENT_INPUT_STATE.UPDATE && this.props.studentToUpdate !== null) {
            let student: IAddStudent = {
                studentFirstname: this.props.studentToUpdate.Student_First_Name,
                studentSurname: this.props.studentToUpdate.Student_Surname_Name,
                studentAge: this.props.studentToUpdate.Student_Age,
                studentGrade: this.props.studentToUpdate.Student_Grade,
                studentGuardianCell: this.props.studentToUpdate.Student_Guardian_Cell,
                studentGuardianEmailM: this.props.studentToUpdate.Student_Guardian_Email_M,
                studentGuardianEmailF: this.props.studentToUpdate.Student_Guardian_Email_F,
                studentPassword: ""
            }

            this.setState({ student: student, toggled: true });
        }
    }


    //----------------------------------
    //      TOGGLE
    //----------------------------------

    handleToggle = async () => {
        if (!this.state.toggled) {
            this.setState({ toggled: true })
        } else {
            this.setState({ toggled: false })
        }
    }


    //----------------------------------
    //      INPUT HANDLER
    //----------------------------------

    handleInput = (inType: INPUT, ev: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        let student: IAddStudent = {
            studentFirstname: this.state.student.studentFirstname,
            studentSurname: this.state.student.studentSurname,
            studentAge: this.state.student.studentAge,
            studentGrade: this.state.student.studentGrade,
            studentGuardianCell: this.state.student.studentGuardianCell,
            studentGuardianEmailM: this.state.student.studentGuardianEmailM,
            studentGuardianEmailF: this.state.student.studentGuardianEmailF,
            studentPassword: this.state.student.studentPassword
        }

        switch (inType) {
            case INPUT.NAME:
                if (ev.target.value.length < 51) {
                    student.studentFirstname = ev.target.value;
                }
                break;
            case INPUT.SURNAME:
                if (ev.target.value.length < 51) {
                    student.studentSurname = ev.target.value;
                }
                break;
            case INPUT.AGE:
                if (parseInt(ev.target.value) > 0) {
                    student.studentAge = parseInt(ev.target.value);
                } else {
                    student.studentAge = 0;
                }
                break;
            case INPUT.GRADE:
                if (parseInt(ev.target.value) >= 0) {
                    student.studentGrade = parseInt(ev.target.value);
                } else {
                    student.studentGrade = 0;
                }
                break;
            case INPUT.CELL:
                if (ev.target.value.length < 16) {
                    student.studentGuardianCell = ev.target.value;
                }
                break;
            case INPUT.EMAIL_M:
                if (ev.target.value.length < 501) {
                    student.studentGuardianEmailM = ev.target.value;
                }
                break;
            case INPUT.EMAIL_F:
                if (ev.target.value.length < 501) {
                    student.studentGuardianEmailF = ev.target.value;
                }
                break;
            case INPUT.PASSWORD:
                if (ev.target.value.length < 301) {
                    student.studentPassword = ev.target.value;
                }
                break;
            case INPUT.PASSWORD_CONFIRM:
                this.setState({ confirmPwordIn: ev.target.value });
                return;
            default:
                return;
        }

        this.setState({ student: student });
    }


    //-------------------------------
    //      CLEAR INPUT FIELDS 
    //-------------------------------

    clearInput = () => {
        let student: IAddStudent = {
            studentFirstname: "",
            studentSurname: "",
            studentAge: 0,
            studentGrade: 0,
            studentGuardianCell: "",
            studentGuardianEmailM: "",
            studentGuardianEmailF: "",
            studentPassword: ""
        }

        this.setState({ student: student, confirmPwordIn: "" });
    }


    //-------------------------------
    //      VALIDATE INPUT 
    //-------------------------------

    validateData = (): boolean => {

        if (this.state.student.studentFirstname === "") {
            alert("please enter a name");
            return false;
        }

        if (this.state.student.studentSurname === "") {
            alert("please enter a surname");
            return false;
        }

        if (this.state.student.studentAge === 0) {
            alert("please enter a valid age");
            return false;
        }

        if (this.state.student.studentGrade < 0 || this.state.student.studentGrade > 7) {
            alert("please enter a valid grade (1 - 7)");
            return false;
        }

        if (this.state.student.studentGuardianCell.length < 10) {       // better validation needed here
            alert("please enter a valid cell phone number");
            return false;
        }

        if (this.props.inputState === STUDENT_INPUT_STATE.ADD && this.state.student.studentPassword === "") {
            alert("please enter a valid password");
            return false;
        }

        if (this.props.inputState === STUDENT_INPUT_STATE.ADD && this.state.confirmPwordIn !== this.state.student.studentPassword) {
            alert("passwords do not match");
            return false;
        }

        return true
    }


    //----------------------------------
    //      UPDATE STUDENT 
    //----------------------------------

    updateStudent = async () => {

        if (this.validateData()) {

            let data: IUpdateStudent = {
                studentID: this.props.studentToUpdate.Student_ID,
                name: this.state.student.studentFirstname,
                surname: this.state.student.studentSurname,
                age: this.state.student.studentAge,
                grade: this.state.student.studentGrade,
                cell: this.state.student.studentGuardianCell,
                emailM: this.state.student.studentGuardianEmailM,
                emailF: this.state.student.studentGuardianEmailF
            }

            let result: IResponse = await Connection.postReq(POST_TYPE.UPDATE_STUDENT, this.props.token, data, {});

            if (result.stat !== "ok") {
                alert("failed to update student details: " + result.error);
                return;
            }

            alert("successfully updated student details");
            this.clearInput();
            this.props.getUpdatedStudents();
            this.props.changeInputState(STUDENT_INPUT_STATE.ADD, null);
        }
    }


    //----------------------------------
    //      ADD NEW STUDENT 
    //----------------------------------

    addStudent = async () => {
        if (this.validateData()) {
            let data: IAddStudent = this.state.student;
            let result: IResponse = await Connection.postReq(POST_TYPE.ADD_STUDENT, this.props.token, data, {});

            if (result.stat !== "ok") {
                alert("failed to add student");
                return;
            }

            alert("student successfully added");
            this.clearInput();
            this.props.getUpdatedStudents();
        }
    }


    //----------------------------------
    //      RENDER METHOD
    //----------------------------------

    render() {
        return (
            <div id="student-add-card-container">
                <div id={this.state.toggled ? "student-add-card-title" : "student-add-card-title-untoggled"} onClick={this.handleToggle}><h3>{this.props.inputState === STUDENT_INPUT_STATE.UPDATE ? "Update Student Details" : "Add New Student"} {this.state.toggled ? "\u25B2" : "\u25BC"}</h3></div>
                {this.state.toggled &&
                    <div id="student-add-card-content-container">
                        <div className="student-add-card-input-element">
                            <label >Name:</label>
                            <input value={this.state.student.studentFirstname} type="text" onChange={(ev) => this.handleInput(INPUT.NAME, ev)} />
                        </div>
                        <div className="student-add-card-input-element">
                            <label >Surname:</label>
                            <input value={this.state.student.studentSurname} type="text" onChange={(ev) => this.handleInput(INPUT.SURNAME, ev)} />
                        </div>
                        <div className="student-add-card-input-element">
                            <label >Age:</label>
                            <input value={this.state.student.studentAge.toString()} type="number" onChange={(ev) => this.handleInput(INPUT.AGE, ev)} />
                        </div>
                        <div className="student-add-card-input-element">
                            <label >Grade:</label>
                            <input value={this.state.student.studentGrade.toString()} type="number" onChange={(ev) => this.handleInput(INPUT.GRADE, ev)} />
                        </div>
                        <div className="student-add-card-input-element">
                            <label >Cell number:</label>
                            <input value={this.state.student.studentGuardianCell} type="text" onChange={(ev) => this.handleInput(INPUT.CELL, ev)} />
                        </div>
                        <div className="student-add-card-input-element">
                            <label >Email address (M):</label>
                            <textarea value={this.state.student.studentGuardianEmailM} onChange={(ev) => this.handleInput(INPUT.EMAIL_M, ev)} />
                        </div>
                        <div className="student-add-card-input-element">
                            <label >Email address (F):</label>
                            <textarea value={this.state.student.studentGuardianEmailF} onChange={(ev) => this.handleInput(INPUT.EMAIL_F, ev)} />
                        </div>
                        {
                            //-----    ONLY DISPLAY WHEN ADDING    -----
                            this.props.inputState === STUDENT_INPUT_STATE.ADD &&
                            <Fragment>
                                <div className="student-add-card-input-element">
                                    <label >New password:</label>
                                    <input value={this.state.student.studentPassword} type="text" onChange={(ev) => this.handleInput(INPUT.PASSWORD, ev)} />
                                </div>
                                <div className="student-add-card-input-element">
                                    <label >Confirm password:</label>
                                    <input value={this.state.confirmPwordIn} type="text" onChange={(ev) => this.handleInput(INPUT.PASSWORD_CONFIRM, ev)} />
                                </div>
                            </Fragment>
                        }

                        <div id="student-add-card-button-container">
                            <button className="student-add-card-button" onClick={() => {
                                if (this.props.inputState === STUDENT_INPUT_STATE.ADD) {
                                    this.addStudent();
                                } else {
                                    this.updateStudent();
                                }
                            }}>{this.props.inputState === STUDENT_INPUT_STATE.ADD ? "Add" : "Update"}</button>
                            <button className="student-add-card-button" onClick={() => {
                                if (this.props.inputState === STUDENT_INPUT_STATE.ADD) {
                                    this.clearInput();
                                } else {
                                    this.clearInput();
                                    this.props.changeInputState(STUDENT_INPUT_STATE.ADD, null);
                                }
                            }}>{this.props.inputState === STUDENT_INPUT_STATE.ADD ? "Clear" : "Cancel"}</button>
                        </div>

                    </div>
                }
            </div>
        );
    }
}

export default StudentAddCard;
