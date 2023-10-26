
//-----------------------------------------
//        REACT IMPORTS
//-----------------------------------------

import React, { Component } from "react";

//-----------------------------------------
//        CSS IMPORTS
//-----------------------------------------

import "./parentStudentsCard.css";

//-----------------------------------------
//        COMPONENT IMPORTS
//-----------------------------------------

import AddRounded from "@material-ui/icons/AddRounded";

//-----------------------------------------
//        INTERFACE IMPORTS
//-----------------------------------------

import { IAddParentStudent, IDeleteParentRegistrationRequest, IGetAllStudents, IGetParentRegistrationStudentInfo, IGetParentStudents, IParentRegistrationStudentInfo, IResponse, IStudentAllShort, } from "../../interfaces";
import Connection, { GET_TYPE, POST_TYPE } from "../../connection";
import EditRounded from "@material-ui/icons/EditRounded";
import DeleteForever from "@material-ui/icons/DeleteForever";
import { AxiosRequestConfig } from "axios";
import EmptyListNotification from "../../../../staff-front-end/src/components/emptyListNotification/emptyListNotification";


//-----------------------------------------
//        INTERFACE DEFINITIONS
//-----------------------------------------

interface IState {
    toggled: boolean,

    addingStudent: boolean,
    studentIndexValue: number,

    studentsShort: IStudentAllShort[],
    parentStudents: IStudentAllShort[],

    parentStudentInfo: IParentRegistrationStudentInfo
}

interface IProps {
    token: string,
    parentID: number,
    parentIDNum: string
}


//-----------------------------------------
//        CONSTS/ENUMS
//-----------------------------------------




//-----------------------------------------
//        CLASS DEFINITION
//-----------------------------------------

class ParentStudentsCard extends Component<IProps, IState> {

    //----------------------
    //    CONSTRUCTOR
    //----------------------

    constructor(props: IProps) {
        super(props);

        this.state = {
            toggled: false,
            addingStudent: false,
            studentIndexValue: -1,
            studentsShort: [],
            parentStudents: [],
            parentStudentInfo: null
        }
    }


    //----------------------
    //    COMP DID MOUNT
    //----------------------

    componentDidMount() {
        this.getParentRegStudentInfo();
        this.getAllStudentsShort();
    }


    //----------------------
    //    HANDLE TOGGLE
    //----------------------

    handleToggle = () => {
        let toggled = !this.state.toggled;

        if (toggled) {
            this.getParentStudents();
        }

        this.setState({ toggled: toggled });
    }


    //----------------------------
    //    TOGGLE ADDING STUDENT
    //----------------------------

    toggleAddingStudent = () => {
        let addingStudent = !this.state.addingStudent;

        if (!addingStudent) {
            this.setState({ studentIndexValue: -1 });
        }

        this.setState({ addingStudent: addingStudent });
    }


    //------------------------------------
    //    GET PARENT REG STUDENT INFO
    //------------------------------------

    getParentRegStudentInfo = async () => {
        let data: IGetParentRegistrationStudentInfo = {
            idNum: this.props.parentIDNum
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_PARENT_REGISTRATION_STUDENT_INFO, this.props.token, data);

        if (result.stat !== "ok") {
            this.setState({ parentStudentInfo: null });
            return;
        }

        this.setState({ parentStudentInfo: result.data });
    }


    //------------------------------
    //    GET ALL STUDENTS SHORT
    //------------------------------

    getAllStudentsShort = async () => {
        let data: IGetAllStudents = {}

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_ALL_STUDENTS_SHORT, this.props.token, data);

        if (result.stat !== "ok") {
            this.setState({ studentsShort: [], studentIndexValue: -1 });
            return;
        }

        this.setState({ studentsShort: result.data, studentIndexValue: 0 });
    }


    //------------------------------
    //    GET PARENT STUDENTS 
    //------------------------------

    getParentStudents = async () => {
        let data: IGetParentStudents = {
            parentID: this.props.parentID
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_PARENT_STUDENTS, this.props.token, data);

        if (result.stat !== "ok") {
            this.setState({ parentStudents: [] });
            return;
        }

        this.setState({ parentStudents: result.data });
    }


    //------------------------------
    //    ADD PARENT STUDENT
    //------------------------------

    addParentStudent = async () => {
        if (this.state.studentIndexValue === -1) {
            alert("Choose a student!");
            return;
        }

        let data: IAddParentStudent = {
            parentID: this.props.parentID,
            studentID: this.state.studentsShort[this.state.studentIndexValue].Student_ID
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.ADD_PARENT_STUDENT, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert("Failed to add student: " + result.error);
            return;
        }

        this.getParentStudents();
        alert("successfully added student!");
        this.setState({ studentIndexValue: 0, addingStudent: false });
    }


    //------------------------------
    //    DELETE PARENT REG REQ
    //------------------------------

    deleteParentRegReq = async () => {

        let data: IDeleteParentRegistrationRequest = {
            idNum: this.props.parentIDNum
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.DELETE_PARENT_REGISTRATION_REQUEST, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert("Failed to delete registration record: " + result.error);
            return;
        }

        alert("successfully deleted registration record!");
        this.setState({ parentStudentInfo: null });
    }


    //----------------------
    //    RENDER METHOD
    //----------------------

    render() {
        return (
            <div id="parent-files-container" className="center">
                {
                    //----   ADD PARENT STUDENT CARD   ----

                    this.state.addingStudent &&
                    <div className="add-card-overlay">
                        <div id="add-course-staff-container" className="flex-column">
                            <select style={{ width: "200px" }} defaultValue="Choose Student" value={this.state.studentIndexValue} onChange={(ev) => this.setState({ studentIndexValue: parseInt(ev.target.value) })}>
                                {
                                    this.state.studentsShort.map((student, index) => {
                                        return (
                                            <option value={index}>{student.Student_ID} --- {student.Student_First_Name} {student.Student_Surname_Name}</option>
                                        );
                                    })
                                }
                            </select>
                            <div className="flex-row">
                                <button onClick={this.addParentStudent}>Add</button>
                                <button onClick={this.toggleAddingStudent}>Cancel</button>
                            </div>
                        </div>
                    </div>
                }
                {
                    //----   TITLE   ----

                    <div id="parent-files-title" className="center title-col" >
                        <div className="flex-row" onClick={this.handleToggle}>
                            <h2 className="center">Students {this.state.toggled ? "\u25B2" : "\u25BC"}</h2>
                        </div>
                        <AddRounded className="center add-rounded-button" style={{ transform: "scale(1.4)" }} onClick={this.toggleAddingStudent} />
                    </div>
                }

                {
                    //----   PARENT REG STUDENT INFO   ----

                    (this.state.parentStudentInfo && this.state.toggled) &&
                    <div id="parent-student-info-container" className="center flex-column">
                        <h4>Student Info provided during registration:</h4>
                        <p className="center">{this.state.parentStudentInfo.Parent_Children_Info}</p>
                        <DeleteForever className="parent-delete-button center" style={{ transform: "scale(1.3)" }} onClick={this.deleteParentRegReq} />
                    </div>
                }

                {
                    //----   HEADER   ----

                    this.state.toggled &&
                    <div id="files-header" className="center files-table">
                        <h3>ID</h3>
                        <h3>Name</h3>
                    </div>
                }

                {
                    //----   LIST STUDENTS   ----

                    this.state.toggled &&
                    this.state.parentStudents.map(student => {
                        return (
                            <div className="center files-table">
                                <p className="center">{student.Student_ID}</p>
                                <p className="center">{student.Student_First_Name} {student.Student_Surname_Name}</p>
                                <DeleteForever className="parent-delete-button center" style={{ transform: "scale(1.3)" }} onClick={() => { }} />
                            </div>
                        )
                    })
                }

                {
                    //----   EMPTY LIST NOTIF   ----

                    (this.state.toggled && this.state.parentStudents.length === 0) &&
                    <EmptyListNotification message={"No students found"} color={"#FFFFFF"} />
                }

            </div >
        );
    }
}

export default ParentStudentsCard;
