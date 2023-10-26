
//---------------------------------------
//      REACT IMPORTS
//---------------------------------------

import React, { Component } from "react";

//---------------------------------------
//      COMPONENT IMPORTS
//---------------------------------------

import CourseAnnouncement from "./courseAnnouncement";
import CourseMaterialCard from "./courseMaterialCard";
import StudentCard from "./studentCard";
import EmptyListNotification from "./emptyListNotification/emptyListNotification";
import RefreshButton from "./refreshButton/refreshButton";
import Connection, { GET_TYPE, POST_TYPE } from "../connection";
import { AxiosRequestConfig } from "axios";

//---------------------------------------
//      INTERFACE/ENUM IMPORTS
//---------------------------------------

import { IAddCourseAnnouncement, IAddCourseAssignment, IAddCourseMaterial, IAssignmentMarksByCourse, ICourseAnnouncement, ICourseAssignment, ICourseDetails, ICourseOverview, ICourseTopic, IGetAssignmentMarksByCourse, IGetCourseAnnouncements, IGetCourseAssignments, IGetCourseOverview, IGetCourseTopics, IGetSignedPostUrl, IGetStudentsInCourse, IResponse, ISearchStudentsInCourse, ISignedPostUrl, IStudentsInCourse } from "../interfaces";
import CourseAssessmentsSection from "./courseAssessmentsSection/courseAssessmentsSection";
import { Navigate } from "react-router-dom";



//---------------------------------------
//      INTERFACE/ENUM DEFINITIONS
//---------------------------------------
enum INPUT {
    TOPIC,

    MATERIAL_FILES,
    MATERIAL_TOPIC,

    ASSIGNMENT_FILE,
    ASSIGNMENT_DUE_DATE,
    ASSIGNMENT_MARKS_AVAILABLE,

    STUDENT_SEARCH_NAME,
    STUDENT_SEARCH_SURNAME
}

enum COURSE_SECTION {
    OVERVIEW,
    MATERIALS,
    ASSIGNMENTS,
    STUDENTS
}

interface IState {
    section: COURSE_SECTION,

    uploading: boolean,
    uploadValue: number,

    students: IStudentsInCourse[],

    //--  STUDENT SEARCH INPUT  --
    studentName: string,
    studentSurname: string,
    studentSortValue: number,

    //--  OVERVIEW  --
    courseOverview: ICourseOverview,

    materialTopics: ICourseTopic[],

    assignments: ICourseAssignment[],
    assignmentMarks: IAssignmentMarksByCourse[],

    announcements: ICourseAnnouncement[],
    announcementMessage: string,

    //--  COURSE TOPIC INPUT  --
    topicInput: string,

    //--  FOR UPLOADING COURSE ASSIGNMENTS  --
    addingAssignment: boolean,

    overview_col: string[],
    materials_col: string[],
    assignments_col: string[],
    students_col: string[]
}
interface IProps {
    token: string,
    staffID: string,

    course: ICourseDetails
}
//---------------------------------------
//---------------------------------------



//---------------------------------------
//      COLOR CONSTS
//---------------------------------------

//const INACTIVE: string[] = ["#121E23", "#DDDDFF"];
//const ACTIVE: string[] = ["#344045", "white"];
const INACTIVE: string[] = ["#82332E", "#EEEEEE"];
const ACTIVE: string[] = ["#CB7B3E", "white"];

//---------------------------------------
//---------------------------------------


//---------------------------------------
//      INPUT CONSTS
//---------------------------------------

const ASSIGNMENT_INPUTS = [
    "Marks Available",
    "Due Date"
];

//---------------------------------------
//---------------------------------------



//---------------------------------------
//      CLASS DEFINITION
//---------------------------------------

class CourseSection extends Component<IProps, IState> {

    //--------    CONSTRUCTOR    ------------

    constructor(props: IProps) {
        super(props);

        this.state = {
            section: COURSE_SECTION.OVERVIEW,

            uploading: false,
            uploadValue: 0,

            students: [],

            //--  STUDENT SEARCH INPUT  --
            studentName: "",
            studentSurname: "",
            studentSortValue: 0,

            courseOverview: { Course_Topic_Name: "None available", Course_Assignments: 0 },

            materialTopics: [],

            //--  COURSE TOPIC INPUT  --
            topicInput: "",

            assignments: [],
            assignmentMarks: [],

            announcements: [],
            announcementMessage: "",


            //--  FOR UPLOADING COURSE ASSIGNMENTS  --
            addingAssignment: false,

            overview_col: ACTIVE,
            materials_col: INACTIVE,
            assignments_col: INACTIVE,
            students_col: INACTIVE
        }
    }


    //--------    COMPONENT DID MOUNT    ------------

    componentDidMount() {
        if (this.props.course !== null) {
            this.getCourseOverview();
            this.getAnnouncements();
            this.getCourseTopics();
        }
    }


    //--------    COMPONENT DID UPDATE    ------------

    componentDidUpdate() {
    }

    //--------    GET COURSE OVERVIEW    ------------
    getCourseOverview = async () => {
        let data: IGetCourseOverview = {
            courseID: this.props.course.Course_ID
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_COURSE_OVERVIEW, this.props.token, data);

        if (result.stat === "ok") {
            this.setState({ courseOverview: result.data });
            return;
        }

        this.setState({ courseOverview: { Course_Topic_Name: "None available", Course_Assignments: 0 } });
    }

    //--------    GET COURSE TOPICS    ------------

    getCourseTopics = async () => {
        let data: IGetCourseTopics = {
            courseID: this.props.course.Course_ID
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_COURSE_TOPICS, this.props.token, data);

        if (result.stat === "ok") {
            this.setState({ materialTopics: result.data });
            return;
        }

        this.setState({ materialTopics: [] });
    }


    //----------    GET STUDENTS IN COURSE   ------------

    getStudentsInCourse = async () => {
        let data: IGetStudentsInCourse = {
            courseID: this.props.course.Course_ID
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_STUDENTS_IN_COURSE, this.props.token, data);

        if (result.stat !== "ok") {
            this.setState({ students: [], studentSortValue: 0 });
            return;
        }

        this.setState({ students: result.data, studentSortValue: 0 });
    }


    //----------    SEARCH STUDENTS IN COURSE   ------------

    searchStudentsInCourse = async () => {

        if (this.state.studentName === "" && this.state.studentSurname === "") {
            alert("atleast 1 of the 2 fields must be filled");
            return;
        }

        let data: ISearchStudentsInCourse = {
            courseID: this.props.course.Course_ID,
            name: this.state.studentName,
            surname: this.state.studentSurname
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.SEARCH_STUDENTS_IN_COURSE, this.props.token, data);

        if (result.stat !== "ok") {
            this.setState({ students: [], studentSortValue: 0 });
            return;
        }

        this.setState({ students: result.data, studentSortValue: 0 });
    }


    //----------    SORT STUDENTS IN COURSE   ------------

    sortStudents = async (opt: number) => {
        let sortedStudents: IStudentsInCourse[] = this.state.students.slice();

        let resT = 1;   // asc order
        let resF = -1;

        if (opt === 1) {
            resT = -1;  // desc order
            resF = 1;
        }

        sortedStudents.sort((studentA, studentB) => {

            if (studentA.Student_Surname_Name > studentB.Student_Surname_Name)
                return resT;
            if (studentA.Student_Surname_Name < studentB.Student_Surname_Name)
                return resF;
            return 0;

        });

        this.setState({ studentSortValue: opt, students: sortedStudents });
    }


    //----------    GET COURSE ASSIGNMENTS   ------------

    getAssignments = async () => {
        let data: IGetCourseAssignments = {
            courseID: this.props.course.Course_ID
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_ASSIGNMENTS, this.props.token, data);

        if (result.stat !== "ok") {
            this.setState({ assignments: [] });
        } else {
            this.setState({ assignments: result.data });
        }
    }


    //--------    GET ASSIGNMENT MARKS    ------------

    getAssignmentMarks = async () => {
        let data: IGetAssignmentMarksByCourse = {
            username: this.props.staffID,
            courseID: this.props.course.Course_ID
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_ASSIGNMENT_MARKS, this.props.token, data);

        if (result.stat !== "ok") {
            alert(result.error);
        } else {
            this.setState({ assignmentMarks: result.data });
        }
    }


    //--------    GET ANNOUNCEMENTS    ------------

    getAnnouncements = async () => {
        let data: IGetCourseAnnouncements = {
            courseID: this.props.course.Course_ID
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_COURSE_ANNOUNCEMENTS, this.props.token, data);

        if (result.stat === "ok") {
            this.setState({ announcements: result.data });
        } else {
            this.setState({ announcements: [] })
        }
    }


    //--------    ADD ANNOUNCEMENT    ------------

    addAnnouncement = async () => {
        if (this.state.announcementMessage !== "") {
            let data: IAddCourseAnnouncement = {
                courseID: this.props.course.Course_ID,
                message: this.state.announcementMessage
            }

            let result: IResponse = await Connection.postReq(POST_TYPE.ADD_COURSE_ANNOUNCEMENT, this.props.token, data, {});

            if (result.stat === "ok") {
                this.getAnnouncements();
                this.setState({ announcementMessage: "" });
            } else {
                alert(result.error);
            }
        } else {
            alert("message field must not be empty");
        }
    }

    //--------    ADD COURSE ASSIGNMENT    ------------

    addCourseAssignment = async (inMap: Map<string, string>, file: File): Promise<boolean> => {

        let date = inMap.get(ASSIGNMENT_INPUTS[1]);
        let marks = parseInt(inMap.get(ASSIGNMENT_INPUTS[0]));

        if (date === "") {
            alert("enter a valid date");
            return false;
        }
        if (!(marks > 0) || !(marks <= 100)) {
            alert("enter a valid mark");
            return false;
        }

        if (file !== null) {

            //--      SET STATE TO UPLOADING      --

            this.setState({ uploading: true });

            let getUrlData: IGetSignedPostUrl = {
                originalFileName: file.name
            }

            //--        GET SIGNED POST URL       --

            let result: IResponse = await Connection.getReq(GET_TYPE.GET_SIGNED_POST_URL, this.props.token, getUrlData);

            if (result.stat !== "ok") {
                alert(result.error);
                this.setState({ uploading: false, uploadValue: 0 });
                return false;
            }

            let urlData: ISignedPostUrl = result.data;

            //--       SETUP CONFIG TO MONITOR UPLOAD PROGRESS      --

            let config: AxiosRequestConfig = {
                onUploadProgress: (progressEvent) => {
                    const { loaded, total } = progressEvent;
                    let progress = Math.floor(loaded / total * 100);
                    this.setState({ uploadValue: progress });
                }
            }

            let uploadStatus = await Connection.uploadFile(urlData.url, file, config);


            if (uploadStatus !== 200) {
                alert("upload failed");
                this.setState({ uploading: false, uploadValue: 0 });
                return false;
            }

            //--       SEND ASSIGNMENT DETAILS TO SERVER      --

            let data: IAddCourseAssignment = {
                courseID: this.props.course.Course_ID,
                assignmentPath: urlData.filePath,
                assignmentName: file.name,
                dueDate: new Date(date).toISOString().slice(0, 10),
                marksAvailable: marks
            }

            result = await Connection.postReq(POST_TYPE.ADD_COURSE_ASSIGNMENT, this.props.token, data, {});

            if (result.stat !== "ok") {
                alert(result.error);
                this.setState({ uploading: false, uploadValue: 0 });
                return false;
            }

            alert("Upload successful");

            //--  RESET UPLOAD VALUES  --

            this.setState({ uploading: false, uploadValue: 0 });

            await this.getAssignments();
            this.getCourseOverview();

            return true;

        } else {
            alert("No file has been chosen");
            return false
        }
    }


    //--------    TOGGLE ADDING ASSIGNMENT    ------------

    toggleAddAssignment = () => {
        let addingAssignment = this.state.addingAssignment;
        this.setState({ addingAssignment: !addingAssignment });
    }


    //--------    HANDLE INPUT FUNCTION    ------------

    handleInput = (inType: INPUT, ev: React.ChangeEvent<HTMLInputElement>) => {
        switch (inType) {
            case INPUT.STUDENT_SEARCH_NAME:
                this.setState({ studentName: ev.target.value });
                break;
            case INPUT.STUDENT_SEARCH_SURNAME:
                this.setState({ studentSurname: ev.target.value });
                break;
        }
    }


    //--------    CHANGE SECTION HANDLER    ------------

    changeSection = (sect: COURSE_SECTION) => {
        switch (sect) {
            case COURSE_SECTION.OVERVIEW:
                this.setState({ section: sect, overview_col: ACTIVE, students_col: INACTIVE, assignments_col: INACTIVE, materials_col: INACTIVE }, () => {
                    this.getAnnouncements();
                });
                break;
            case COURSE_SECTION.MATERIALS:
                this.setState({ section: sect, overview_col: INACTIVE, students_col: INACTIVE, assignments_col: INACTIVE, materials_col: ACTIVE });
                break;
            case COURSE_SECTION.ASSIGNMENTS:
                this.setState({ section: sect, overview_col: INACTIVE, students_col: INACTIVE, assignments_col: ACTIVE, materials_col: INACTIVE }, () => {
                    this.getAssignments();
                });
                break;
            case COURSE_SECTION.STUDENTS:
                this.setState({ section: sect, overview_col: INACTIVE, students_col: ACTIVE, assignments_col: INACTIVE, materials_col: INACTIVE, }, () => {
                    this.getStudentsInCourse();
                });
                break;
            default:
                return;
        }
    }


    //--------    RENDER METHOD    ------------

    render() {
        if (this.props.course === null) {
            return <Navigate to="/staff/courses" />;
        }

        return (
            <div id="course-container">

                <div className="center flex-row" style={{ textDecoration: "underline", fontFamily: "sans-serif", width: "200px", marginBottom: "10px", justifyContent: "center", color: "#444" }}>
                    <h1>{this.props.course.Course_Name}</h1>
                </div>

                <div id="course-nav-tabs">
                    <h4 className="course-nav-opts" style={{ backgroundColor: this.state.overview_col[0], color: this.state.overview_col[1] }} onClick={() => this.changeSection(COURSE_SECTION.OVERVIEW)}>Info</h4>
                    <h4 className="course-nav-opts" style={{ backgroundColor: this.state.materials_col[0], color: this.state.materials_col[1] }} onClick={() => this.changeSection(COURSE_SECTION.MATERIALS)}>Materials</h4>
                    <h4 className="course-nav-opts" style={{ backgroundColor: this.state.assignments_col[0], color: this.state.assignments_col[1] }} onClick={() => this.changeSection(COURSE_SECTION.ASSIGNMENTS)}>Tasks</h4>
                    <h4 className="course-nav-opts" style={{ backgroundColor: this.state.students_col[0], color: this.state.students_col[1] }} onClick={() => this.changeSection(COURSE_SECTION.STUDENTS)}>Students</h4>
                </div>

                {

                    //--------    COURSE OVERVIEW    ------------

                    this.state.section === COURSE_SECTION.OVERVIEW &&
                    <div id="course-overview">
                        <div className="course-overview-details">
                            <div id="course-overview-titles">
                                <h2>{this.props.course.Course_Name} :</h2>
                            </div>
                            <div id="course-overview-values">
                                <p id="course-overview-values-desc">{this.props.course.Course_Desc}</p>
                            </div>

                            {
                                //--------    OVERVIEW DETAILS    ------------
                                <div id="course-overview-detailed">
                                    <h3 style={{ gridColumn: 1, margin: 0 }}>Latest Topic: </h3>
                                    <h4 style={{ gridColumn: 2, margin: 0 }} onClick={
                                        () => { this.changeSection(COURSE_SECTION.MATERIALS) }
                                    }>{this.state.courseOverview.Course_Topic_Name}</h4>
                                    <h3 style={{ gridColumn: 1, margin: 0, marginTop: "20px" }}>Assignments Available: </h3>
                                    <h4 style={{ gridColumn: 2, margin: 0, marginTop: "20px" }} onClick={
                                        () => { this.changeSection(COURSE_SECTION.ASSIGNMENTS) }
                                    }>{this.state.courseOverview.Course_Assignments}</h4>
                                </div>
                            }

                        </div>

                        <div id="course-overview-announcements">
                            <h2 id="course-overview-title">Announcements:</h2>
                            {

                                //--------    ADD COURSE ANNOUNCEMENTS    ------------

                                <div id="course-announcement-add-container">
                                    <h4 id="course-announcement-add-title">Add Announcement:</h4>
                                    <textarea id="course-announcement-message" value={this.state.announcementMessage} onChange={(ev) => { this.setState({ announcementMessage: ev.target.value }) }} />
                                    <br></br>
                                    <button id="course-announcement-add" onClick={() => this.addAnnouncement()}>ADD</button>
                                </div>
                            }
                            {

                                //--------    COURSE ANNOUNCEMENTS    ------------

                                this.state.announcements.map((announcement, index) => {
                                    return (
                                        <CourseAnnouncement token={this.props.token} refreshAnnouncements={this.getAnnouncements} key={index} announcement={announcement} />
                                    );
                                })
                            }
                        </div>
                    </div>
                }
                {

                    //--------    COURSE MATERIALS    ------------

                    this.state.section === COURSE_SECTION.MATERIALS &&
                    <div id="course-materials-container">

                        <RefreshButton refresh={this.getCourseTopics} centered={true} />

                        <div>
                            {
                                this.state.materialTopics.map(topic => {
                                    return (
                                        <CourseMaterialCard isSubtopic={false} topic={topic} courseID={this.props.course.Course_ID.toString()} token={this.props.token} staffID={this.props.staffID} />
                                    );
                                })
                            }
                            {
                                this.state.materialTopics.length == 0 &&
                                <EmptyListNotification message={"No topics available."} />
                            }
                        </div>
                    </div>
                }

                {

                    //--------    COURSE ASSIGNMENTS    ------------

                    this.state.section === COURSE_SECTION.ASSIGNMENTS &&
                    <CourseAssessmentsSection token={this.props.token} courseID={this.props.course.Course_ID} refreshCourseOverview={this.getCourseOverview} />
                }

                {

                    //--------    STUDENTS IN COURSE    ------------

                    this.state.section === COURSE_SECTION.STUDENTS &&


                    <div id="course-students-container">

                        <div id="course-students-search-container">
                            <h3>Search for Students</h3>
                            <div id="course-students-search-input-container">
                                <p>Name:</p>
                                <input style={{ width: "20%" }} type="text" value={this.state.studentName} onChange={(ev) => this.handleInput(INPUT.STUDENT_SEARCH_NAME, ev)} />
                                <p>Surname:</p>
                                <input style={{ width: "20%" }} type="text" value={this.state.studentSurname} onChange={(ev) => this.handleInput(INPUT.STUDENT_SEARCH_SURNAME, ev)} />
                            </div>
                            <div id="course-students-search-button-container">
                                <button className="course-students-search" onClick={this.searchStudentsInCourse}>Search</button>
                                <button className="course-students-search-all" onClick={this.getStudentsInCourse}>View All</button>
                            </div>
                        </div>

                        <div id="course-students-sort-container">
                            <select style={{ width: "10vh", margin: "4px" }} value={this.state.studentSortValue} onChange={(ev) => this.sortStudents(parseInt(ev.target.value))}>
                                <option value={0}>A-Z</option>
                                <option value={1}>Z-A</option>
                            </select>
                        </div>

                        <div id="course-students-header-titles">
                            <h3 style={{ gridColumn: 1, textAlign: "center" }}>ID</h3>
                            <h3 style={{ gridColumn: 2, textAlign: "center" }}>NAME</h3>
                            <h3 style={{ gridColumn: 3, textAlign: "center" }}>SURNAME</h3>
                        </div>
                        <br></br>
                        {
                            this.state.students.map((student) => {
                                return (
                                    <StudentCard key={student.Student_ID} token={this.props.token} student={student} courseID={this.props.course.Course_ID.toString()} />
                                );
                            })
                        }
                        {
                            this.state.students.length == 0 &&
                            <EmptyListNotification message={"No students found"} />
                        }
                    </div>

                }
            </div>
        );
    }
}

export default CourseSection;
