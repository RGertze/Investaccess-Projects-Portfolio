
//----------------------------------
//      REACT IMPORTS
//----------------------------------

import React, { Component } from "react";

//----------------------------------
//      COMPONENT IMPORTS
//----------------------------------

import StudentCard from "./studentCard";
import StudentAddCard from "./studentAddCard";

//----------------------------------
//      INTERFACE IMPORTS
//----------------------------------

import { ICourseShort, IGetAllStudents, IGetCoursesShort, IGetStudentsByGrade, IGetStudentsInCourse, IGetStudentsWithMerritsByCourse, IResponse, ISearchAllStudents, IStudentAll } from "../interfaces";
import Connection, { GET_TYPE } from "../connection";

//----------------------------------
//      ENUM DEFINITIONS
//----------------------------------

enum FILTER {
    ALL,
    GRADE,
    COURSE,
    MERRITS
}

export enum STUDENT_INPUT_STATE {
    ADD,
    UPDATE
}

//----------------------------------
//      INTERFACE DEFINITIONS
//----------------------------------

interface IState {
    filter: FILTER,

    inputState: STUDENT_INPUT_STATE,
    studentToUpdate: IStudentAll,

    students: IStudentAll[],

    nameIn: string,
    surnameIn: string,

    courses: ICourseShort[]
}

interface IProps {
    token: string,
}


//----------------------------------
//      CLASS DEFINITION
//----------------------------------

class StudentsSection extends Component<IProps, IState> {

    //----------------------------------
    //      CONSTRUCTOR
    //----------------------------------

    constructor(props: IProps) {
        super(props);

        this.state = {
            filter: FILTER.ALL,

            inputState: STUDENT_INPUT_STATE.ADD,
            studentToUpdate: null,

            students: [],

            nameIn: "",
            surnameIn: "",

            courses: []
        }
    }


    //----------------------------------
    //      COMPONENT DID MOUNT
    //----------------------------------

    componentDidMount() {
        this.getAllStudents();
        this.getCoursesShort();
    }


    //----------------------------------
    //      HANDLE FILTER CHANGE
    //----------------------------------

    handleFilter = async (filter: FILTER) => {
        switch (filter) {
            case FILTER.ALL:
                this.getAllStudents();
                break;
            case FILTER.GRADE:
                this.getStudentsByGrade(0);
                break;
            case FILTER.COURSE:
                if (this.state.courses[0]) {
                    this.getStudentsByCourse(this.state.courses[0].Course_ID);
                }
                break;
            case FILTER.MERRITS:
                if (this.state.courses[0]) {
                    this.getStudentsWithMerritsByCourse(this.state.courses[0].Course_ID);
                }
                break;
            default:
                return;
        }

        this.setState({ filter: filter });
    }


    //----------------------------------
    //      HANDLE INPUT STATE CHANGE
    //----------------------------------

    handleInputStateChange = (state: STUDENT_INPUT_STATE, student: IStudentAll) => {
        if (state === STUDENT_INPUT_STATE.UPDATE) {
            document.getElementById("content-container").scrollTop = 0;
            this.setState({ inputState: state, studentToUpdate: student });
            return;
        }
        this.setState({ inputState: state, studentToUpdate: null });
    }


    //----------------------------------
    //      GET ALL STUDENTS
    //----------------------------------

    getAllStudents = async () => {
        let data: IGetAllStudents = {}

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_ALL_STUDENTS, this.props.token, data);

        if (result.stat === "ok") {
            /*
             *  When retrieving students, the state should first be set to 
             *  empty. This will force a rerender of the student cards.
             *  This fixes an issue that occurs when a student card is 
             *  toggled and the student list is changed, eg when searching 
             *  for students, causing the wrong student card to be displayed 
             *  for another student due to card remaining rendered through
             *  a state change. 
             *  
             *  This is applied to this function and all other functions 
             *  that involve retrieving students
             * */
            this.setState({ students: [] }, () => this.setState({ students: result.data }));
            return;
        }

        this.setState({ students: [] });
    }


    //----------------------------------
    //      SEARCH ALL STUDENTS
    //----------------------------------

    searchAllStudents = async () => {
        let data: ISearchAllStudents = {
            name: this.state.nameIn,
            surname: this.state.surnameIn
        }

        //console.log(data);

        let result: IResponse = await Connection.getReq(GET_TYPE.SEARCH_ALL_STUDENTS, this.props.token, data);

        if (result.stat === "ok") {
            this.setState({ students: [], nameIn: "", surnameIn: "", filter: FILTER.ALL }, () => this.setState({ students: result.data }));
            return;
        }

        alert(result.error);
    }


    //----------------------------------
    //      GET STUDENTS BY GRADE
    //----------------------------------

    getStudentsByGrade = async (grade: number) => {
        let data: IGetStudentsByGrade = {
            grade: grade
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_STUDENTS_BY_GRADE, this.props.token, data);


        if (result.stat === "ok") {
            this.setState({ students: [] }, () => this.setState({ students: result.data }));
            return;
        }

        this.setState({ students: [] });
    }


    //----------------------------------
    //      GET STUDENTS BY COURSE
    //----------------------------------

    getStudentsByCourse = async (courseID: number) => {

        let data: IGetStudentsInCourse = {
            courseID: courseID
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_STUDENTS_IN_COURSE, this.props.token, data);

        if (result.stat === "ok") {
            this.setState({ students: [] }, () => this.setState({ students: result.data }));
            return;
        }

        this.setState({ students: [] });
    }


    //---------------------------------------------
    //      GET STUDENTS WITH MERRITS BY COURSE
    //---------------------------------------------

    getStudentsWithMerritsByCourse = async (courseID: number) => {

        let data: IGetStudentsWithMerritsByCourse = {
            courseID: courseID
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_STUDENTS_WITH_MERRITS_BY_COURSE, this.props.token, data);

        if (result.stat === "ok") {
            this.setState({ students: [] }, () => this.setState({ students: result.data }));
            return;
        }

        this.setState({ students: [] });
    }


    //----------------------------------
    //      GET COURSES SHORT
    //----------------------------------

    getCoursesShort = async () => {

        let data: IGetCoursesShort = {}

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_COURSES_SHORT, this.props.token, data);

        if (result.stat === "ok") {
            this.setState({ courses: result.data });
        }
    }



    //----------------------------------
    //      RENDER METHOD
    //----------------------------------

    render() {
        return (
            <div id="students-section-container">

                <StudentAddCard token={this.props.token} getUpdatedStudents={this.getAllStudents} inputState={this.state.inputState} studentToUpdate={this.state.studentToUpdate} changeInputState={this.handleInputStateChange} />

                <div id="students-section-search-container">
                    <label>Name:</label>
                    <input value={this.state.nameIn} type="text" onChange={(ev) => this.setState({ nameIn: ev.target.value })} />
                    <label>Surname:</label>
                    <input value={this.state.surnameIn} type="text" onChange={(ev) => this.setState({ surnameIn: ev.target.value })} />
                    <button onClick={this.searchAllStudents}>Search</button>
                </div>

                <div id="students-section-sort-container">

                    <select value={this.state.filter} onChange={(ev) => this.handleFilter(parseInt(ev.target.value))}>
                        <option value={FILTER.ALL}>All</option>
                        <option value={FILTER.GRADE}>Grade</option>
                        <option value={FILTER.COURSE}>Course</option>
                        <option value={FILTER.MERRITS}>Merrits</option>
                    </select>

                    {

                        //-----   GRADE FILTER    -----

                        this.state.filter === FILTER.GRADE &&
                        <select onChange={(ev) => this.getStudentsByGrade(parseInt(ev.target.value))}>
                            <option value={0}>0</option>
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                            <option value={6}>6</option>
                            <option value={7}>7</option>
                        </select>

                    }

                    {

                        //-----   COURSE FILTER    -----

                        (this.state.filter === FILTER.COURSE || this.state.filter === FILTER.MERRITS) &&
                        <select onChange={(ev) => {
                            if (this.state.filter === FILTER.COURSE)
                                this.getStudentsByCourse(parseInt(ev.target.value));
                            else
                                this.getStudentsWithMerritsByCourse(parseInt(ev.target.value));
                        }}>
                            {
                                this.state.courses.map((course) => {
                                    return (
                                        <option value={course.Course_ID}>{course.Course_Name}</option>
                                    );
                                })
                            }
                        </select>

                    }

                </div>

                <div id="students-section-table-header-container">
                    <h3 >ID</h3>
                    <h3 >Name</h3>
                    <h3 >Surname</h3>
                    <h3 >Age</h3>
                    <h3 >Grade</h3>
                    <h3 >Cell</h3>
                </div>

                {
                    this.state.students.map((student) => {
                        return (
                            <StudentCard updateStudentDetails={this.handleInputStateChange} token={this.props.token} student={student} getUpdatedStudents={this.getAllStudents} />
                        );
                    })
                }

                {
                    this.state.students.length === 0 &&
                    <h3 style={{ textAlign: "center", color: "white" }}>No records found!</h3>
                }

            </div>
        );
    }
}

export default StudentsSection;
