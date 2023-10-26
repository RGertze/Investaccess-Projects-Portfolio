
//---------------------------------------
//      REACT IMPORTS
//---------------------------------------

import React, { Component } from "react";


//---------------------------------------
//      COMPONENT IMPORTS
//---------------------------------------

import CourseAnnouncement from "./courseAnnouncement";
import CourseMaterialCard from "./courseMaterialCard";
import CourseAssignmentCard from "./courseAssignmentCard";
import CourseMarksCard from "./courseMarksCard";
import EmptyListNotification from "../../../staff-front-end/src/components/emptyListNotification/emptyListNotification";
import RefreshButton from "./refreshButton/resfreshButton";

//---------------------------------------
//      INTERFACE/ENUM IMPORTS
//---------------------------------------

import { IAssessmentMark, IAssignmentMarksByCourse, ICourseAnnouncement, ICourseAssignment, ICourseDetails, ICourseOverview, ICourseTopic, IGetAssessmentMarksByCourse, IGetAssignmentMarksByCourse, IGetCourseAnnouncements, IGetCourseAssignments, IGetCourseOverview, IGetCourseTopics, IGetQuizzesByCourse, IQuiz, IResponse } from "../interfaces";
import Connection, { GET_TYPE } from "../connection";
import StudentQuizCard from "./studentQuizCard/studentQuizCard";
import { Navigate } from "react-router-dom";



//---------------------------------------
//      INTERFACE/ENUM DEFINITIONS
//---------------------------------------
enum INPUT {
    MATERIAL_FILES,
    MATERIAL_WEEK,
    ASSIGNMENT_FILE
}

enum COURSE_SECTION {
    OVERVIEW = 0,
    MATERIALS = 1,
    ASSIGNMENTS = 2,
    MARKS = 3
}

interface IState {
    section: COURSE_SECTION,

    uploading: boolean,
    uploadValue: number,

    //--  OVERVIEW  --
    courseOverview: ICourseOverview,

    topics: ICourseTopic[],

    assignments: ICourseAssignment[],
    quizzes: IQuiz[],

    viewingQuiz: boolean,
    quizToView: IQuiz,

    assignmentMarks: IAssignmentMarksByCourse[],
    assessmentMarks: IAssessmentMark[],

    announcements: ICourseAnnouncement[],
    announcementMessage: string,

    //--  FOR UPLOADING COURSE MATERIALS  --
    materialFiles: FileList,
    materialWeek: number,

    //--  FOR UPLOADING COURSE ASSIGNMENTS  --
    assignmentFile: File,

    overview_col: string[],
    materials_col: string[],
    assignments_col: string[],
    marks_col: string[]
}
interface IProps {
    token: string,
    username: string,

    isStaff: boolean,

    course: ICourseDetails
}
//---------------------------------------
//---------------------------------------



//---------------------------------------
//      COLOR CONSTS
//---------------------------------------

const INACTIVE: string[] = ["#82332E", "#EEEEEE"];
const ACTIVE: string[] = ["#CB7B3E", "white"];
//const INACTIVE: string[] = ["#121E23", "#DDDDFF"];
//const ACTIVE: string[] = ["#344045", "white"];

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

            courseOverview: { Course_Topic_Name: "None available", Course_Assignments: 0 },

            topics: [],

            assignments: [],
            quizzes: [],

            viewingQuiz: false,
            quizToView: null,

            assignmentMarks: [],
            assessmentMarks: [],

            announcements: [],
            announcementMessage: "",

            materialFiles: null,
            materialWeek: 0,

            assignmentFile: null,

            overview_col: ACTIVE,
            materials_col: INACTIVE,
            assignments_col: INACTIVE,
            marks_col: INACTIVE
        }
    }


    //--------    COMPONENT DID MOUNT    ------------

    componentDidMount() {
        if (this.props.course !== null) {
            this.getCourseOverview();
            this.getAnnouncements();
            this.getCourseTopics();
            this.getAssessmentMarks();
        }
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
            this.setState({ topics: result.data });
            return;
        }
        this.setState({ topics: [] });
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

    //--------    GET QUIZZES BY COURSE    ------------

    getQuizzesByCourse = async () => {
        let data: IGetQuizzesByCourse = {
            courseID: this.props.course.Course_ID
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_QUIZZES_BY_COURSE, this.props.token, data);

        if (result.stat !== "ok") {
            this.setState({ quizzes: [] });
        } else {
            this.setState({ quizzes: result.data });
        }
    }

    //--------    GET ASSIGNMENT MARKS    ------------

    getAssignmentMarks = async () => {
        let data: IGetAssignmentMarksByCourse = {
            username: this.props.username,
            courseID: this.props.course.Course_ID
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_ASSIGNMENT_MARKS, this.props.token, data);

        if (result.stat !== "ok") {
            this.setState({ assignmentMarks: [] });
        } else {
            this.setState({ assignmentMarks: result.data });
        }
    }


    //--------    GET ASSESSMENT MARKS    ------------

    getAssessmentMarks = async () => {
        let data: IGetAssessmentMarksByCourse = {
            username: this.props.username,
            courseID: this.props.course.Course_ID
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_ASSESSMENT_MARKS, this.props.token, data);

        if (result.stat !== "ok") {
            this.setState({ assessmentMarks: [] });
        } else {
            this.setState({ assessmentMarks: result.data });
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
        }
    }


    //--------    HANDLE INPUT FUNCTION    ------------

    handleInput = (inType: INPUT, ev: React.ChangeEvent<HTMLInputElement>) => {
        switch (inType) {
            case INPUT.MATERIAL_FILES:
                this.setState({ materialFiles: ev.target.files });
                break;
            case INPUT.MATERIAL_WEEK:
                this.setState({ materialWeek: parseInt(ev.target.value) });
                break;
            case INPUT.ASSIGNMENT_FILE:
                this.setState({ assignmentFile: ev.target.files[0] });
                break;
        }
    }


    //--------    CHANGE SECTION HANDLER    ------------

    changeSection = (sect: COURSE_SECTION) => {
        switch (sect) {
            case COURSE_SECTION.OVERVIEW:
                this.setState({ section: sect, overview_col: ACTIVE, marks_col: INACTIVE, assignments_col: INACTIVE, materials_col: INACTIVE }, () => {
                    this.getAnnouncements();
                });
                break;
            case COURSE_SECTION.MATERIALS:
                this.setState({ section: sect, overview_col: INACTIVE, marks_col: INACTIVE, assignments_col: INACTIVE, materials_col: ACTIVE }, () => {
                    this.getCourseTopics();
                });
                break;
            case COURSE_SECTION.ASSIGNMENTS:
                this.setState({ section: sect, overview_col: INACTIVE, marks_col: INACTIVE, assignments_col: ACTIVE, materials_col: INACTIVE }, () => {
                    this.getAssignments();
                    this.getQuizzesByCourse();
                });
                break;
            case COURSE_SECTION.MARKS:
                this.setState({ section: sect, overview_col: INACTIVE, marks_col: ACTIVE, assignments_col: INACTIVE, materials_col: INACTIVE }, () => {
                    this.getAssignmentMarks();
                    this.getAssessmentMarks();
                });
                break;
            default:
                return;
        }
    }


    //--------    RENDER METHOD    ------------

    render() {
        if (this.props.course === null) {
            return <Navigate to="/student/courses" />;
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
                    <h4 className="course-nav-opts" style={{ backgroundColor: this.state.marks_col[0], color: this.state.marks_col[1] }} onClick={() => this.changeSection(COURSE_SECTION.MARKS)}>Marks</h4>
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
                            <RefreshButton refresh={this.getAnnouncements} centered={true} />
                            {

                                //--------    COURSE ANNOUNCEMENTS    ------------

                                this.state.announcements.map((announcement, index) => {
                                    return (
                                        <CourseAnnouncement key={index} announcement={announcement} />
                                    );
                                })
                            }
                            {
                                this.state.announcements.length === 0 &&
                                <EmptyListNotification message={"No announcements available"} />
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
                                this.state.topics.map(topic => {
                                    return (
                                        <CourseMaterialCard topic={topic} courseID={this.props.course.Course_ID.toString()} token={this.props.token} username={this.props.username} isSubtopic={false} />
                                    );
                                })
                            }
                            {
                                this.state.topics.length === 0 &&
                                <EmptyListNotification message={"No materials available"} />
                            }
                        </div>
                    </div>
                }

                {

                    //--------    COURSE ASSIGNMENTS AND QUIZZES    ------------

                    this.state.section === COURSE_SECTION.ASSIGNMENTS &&
                    <div id="course-assignments-container">
                        <RefreshButton refresh={() => {
                            this.getAssignments();
                            this.getQuizzesByCourse();
                        }} centered={true} />

                        <h2 className="task-title">Assignments:</h2>
                        {
                            this.state.assignments.map((assignment) => {
                                return (
                                    <CourseAssignmentCard key={assignment.Course_Assignment_Path} assignment={assignment} courseID={this.props.course.Course_ID.toString()} token={this.props.token} username={this.props.username} />
                                )
                            })
                        }

                        {
                            this.state.assignments.length === 0 &&
                            <EmptyListNotification message={"No assignments available"} />
                        }

                        {
                            //----------------------------------
                            //      QUIZZES TABLE
                            //----------------------------------

                            <div className="table-container center">

                                <div className="table-title flex-row center">
                                    <h2>Quizzes</h2>
                                </div>

                                <div className="table-header center quiz-table">
                                    <h4 className="center">Name</h4>
                                    <h4 className="center">Opens</h4>
                                    <h4 className="center">Closes</h4>
                                    <h4 className="center">Duration</h4>
                                    <h4 className="center">Marks Avail.</h4>
                                </div>

                                {
                                    //----   LIST QUIZZES   ----
                                    this.state.quizzes.map(quiz => {
                                        return (
                                            <div className="task-table-content center quiz-table">
                                                <p className="task-name center" onClick={() => {
                                                    this.setState({ quizToView: quiz, viewingQuiz: true });
                                                }}>{quiz.Quiz_Name}</p>
                                                <p className="quiz-time center">{quiz.Quiz_Opening_Time.slice(0, 10)} <b>{quiz.Quiz_Opening_Time.slice(11, 16)}</b></p>
                                                <p className="quiz-time center">{quiz.Quiz_Closing_Time.slice(0, 10)} <b>{quiz.Quiz_Closing_Time.slice(11, 16)}</b></p>
                                                <p className="center">{quiz.Quiz_Duration}</p>
                                                <p className="center">{quiz.Quiz_Marks_Available}</p>
                                            </div>
                                        )
                                    })

                                }
                                {
                                    this.state.quizzes.length === 0 &&
                                    <EmptyListNotification message={"no quizzes available"} />
                                }

                                {
                                    //----   VIEW QUIZ   ----

                                    this.state.viewingQuiz &&
                                    <StudentQuizCard closeQuiz={() => this.setState({ viewingQuiz: false, quizToView: null })} studentID={parseInt(this.props.username)} quiz={this.state.quizToView} token={this.props.token} />
                                }

                            </div>
                        }
                    </div>
                }

                {

                    //--------    COURSE MARKS    ------------

                    this.state.section === COURSE_SECTION.MARKS &&
                    <div id="course-marks-container">

                        <h2 className="center marks-title">Assessment Marks:</h2>
                        <div id="assessment-header" className="assessment-marks-table center">
                            <h3>Name</h3>
                            <h3>Contr.</h3>
                            <h3>Marks Available</h3>
                            <h3>Marks Obtained</h3>
                        </div>

                        {
                            this.state.assessmentMarks.map(assessment => {
                                return (
                                    <div className="assessment-marks-table assessment-marks center">
                                        <p>{assessment.Course_Assessment_Name}</p>
                                        <p>{assessment.Course_Assessment_Contribution}%</p>
                                        <p>{assessment.Course_Assessment_Marks_Available}</p>
                                        <p>{assessment.Assessment_Mark}</p>
                                    </div>
                                )
                            })
                        }
                        {
                            this.state.assessmentMarks.length === 0 &&
                            <EmptyListNotification message={"no assessments found"} />
                        }

                        <br></br>
                        <br></br>

                        <h2 className="center marks-title">Task Marks:</h2>
                        <div id="course-marks-header-container">
                            <h3 className="course-marks-header-values" style={{ gridColumn: 1 }}>Task Name</h3>
                            <h3 className="course-marks-header-values" style={{ gridColumn: 2 }}>Marks Available</h3>
                            <h3 className="course-marks-header-values" style={{ gridColumn: 3 }}>Marks Obtained</h3>
                        </div>

                        {this.state.assignmentMarks.map((mark, index) => {
                            return (
                                <CourseMarksCard key={index} mark={mark} />
                            );
                        })}

                        {
                            this.state.assignmentMarks.length === 0 &&
                            <EmptyListNotification message={"No tasks available"} />
                        }
                    </div>
                }
            </div>
        );
    }
}

export default CourseSection;
