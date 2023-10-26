
//---------------------------------------
//      REACT IMPORTS
//---------------------------------------

import React, { Component } from "react";

//---------------------------------------
//      INTERFACE/ENUM IMPORTS
//---------------------------------------

import Connection, { GET_TYPE, POST_TYPE } from "../connection";
import { IAssessmentMark, ICourseAssignment, IGetAssessmentMarksByCourse, IGetCourseAssignments, IGetQuizzesByCourse, IQuiz, IResponse, IStudentsInCourse, IUpdateStudentAssessmentMark } from "../interfaces";
import StudentAssignmentCard from "./studentAssignmentCard";
import StudentQuizCard from "./studentQuizCard/studentQuizCard";
import EditRounded from "@material-ui/icons/EditRounded";
import AddFileCard from "./addFileCard/addFileCard";
import EmptyListNotification from "./emptyListNotification/emptyListNotification";


//---------------------------------------
//      INTERFACE DEFINITIONS
//---------------------------------------

interface IState {
    toggled: boolean,
    viewingQuiz: boolean,
    quizBeingViewed: IQuiz,
    updatingAssessment: boolean,
    assessmentToUpdate: number,
    assignments: ICourseAssignment[],
    assessmentMarks: IAssessmentMark[],
    quizzes: IQuiz[]
}

interface IProps {
    token: string,

    courseID: string,

    student: IStudentsInCourse
}

//---------------------------------------
//---------------------------------------


//---------------------------------------
//      INPUT CONSTS
//---------------------------------------

const UPDATE_ASSESSMENT_MARK = [
    "New Mark"
];


//---------------------------------------
//      CLASS DEFINITION
//---------------------------------------

class StudentCard extends Component<IProps, IState> {

    //---------------------------------------
    //      CONSTRUCTOR
    //---------------------------------------

    constructor(props: IProps) {
        super(props);

        this.state = {
            toggled: false,
            viewingQuiz: false,
            quizBeingViewed: null,
            updatingAssessment: false,
            assessmentToUpdate: 0,
            assignments: [],
            assessmentMarks: [],
            quizzes: []
        }
    }

    //---------------------------------------
    //      TOGGLE HANDLING
    //---------------------------------------

    handleToggle = async () => {
        if (!this.state.toggled) {
            let data: IGetCourseAssignments = {
                courseID: parseInt(this.props.courseID)
            }

            let result: IResponse = await Connection.getReq(GET_TYPE.GET_ASSIGNMENTS, this.props.token, data);

            if (result.stat === "ok") {
                this.setState({ assignments: result.data });
            }

            this.setState({ toggled: true });

            this.getAssessmentMarks();
            this.getQuizzesByCourse();

            return;
        }

        this.setState({ toggled: false });
    }


    //---------------------------------------
    //      TOGGLE UPDATE ASSESSMENT
    //---------------------------------------

    toggleUpdatingAssessment = (assessmentID: number = 0) => {
        let updatingAssessment = !this.state.updatingAssessment;
        this.setState({ updatingAssessment: updatingAssessment, assessmentToUpdate: assessmentID });
    }


    //---------------------------------------
    //          TOGGLE VIEW QUIZ
    //---------------------------------------

    toggleViewingQuiz = (quizToView: IQuiz) => {
        let viewingQuiz = !this.state.viewingQuiz;
        this.setState({ viewingQuiz: viewingQuiz, quizBeingViewed: quizToView });
    }


    //--------    GET ASSESSMENT MARKS    ------------

    getAssessmentMarks = async () => {
        let data: IGetAssessmentMarksByCourse = {
            username: this.props.student.Student_ID.toString(),
            courseID: parseInt(this.props.courseID)
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_ASSESSMENT_MARKS, this.props.token, data);

        if (result.stat !== "ok") {
            this.setState({ assessmentMarks: [] });
        } else {
            this.setState({ assessmentMarks: result.data });
        }
    }


    //--------    UPDATE ASSESSMENT MARK    ------------

    updateAssessmentMark = async (inMap: Map<string, string>, file: File): Promise<boolean> => {

        let mark = parseInt(inMap.get(UPDATE_ASSESSMENT_MARK[0]));

        if (mark > 0 && mark < 101) {

            let data: IUpdateStudentAssessmentMark = {
                username: this.props.student.Student_ID.toString(),
                assessmentID: this.state.assessmentToUpdate,
                mark: mark
            }

            let result: IResponse = await Connection.postReq(POST_TYPE.UPDATE_ASSESSMENT_MARK, this.props.token, data, {});

            if (result.stat !== "ok") {
                alert("failed to update mark, try again later");
                return false
            } else {
                alert("Successfully updated mark");
                this.getAssessmentMarks();
                return true;
            }

        }

        alert("invalid mark entered");
        return false;
    }

    //--------    GET QUIZZES BY COURSE    ------------

    getQuizzesByCourse = async () => {
        let data: IGetQuizzesByCourse = {
            courseID: parseInt(this.props.courseID)
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_QUIZZES_BY_COURSE, this.props.token, data);

        if (result.stat !== "ok") {
            this.setState({ quizzes: [] });
        } else {
            this.setState({ quizzes: result.data });
        }
    }


    //---------------------------------------
    //      RENDER METHOD
    //---------------------------------------

    render() {
        return (
            <div id="student-card-container">
                <div id="student-card-header" onClick={this.handleToggle}>
                    <h3 id="student-card-id" className="student-card-head-values">{this.props.student.Student_ID}</h3>
                    <p id="student-card-name" className="student-card-head-values">{this.props.student.Student_First_Name}</p>
                    <p id="student-card-surname" className="student-card-head-values">{this.props.student.Student_Surname_Name}</p>
                </div>

                {
                    this.state.toggled &&
                    <React.Fragment>

                        <h3 className="student-title">Assessment Marks:</h3>
                        <div id="student-assessment-header" className="student-assessment-table center">
                            <h3>Name</h3>
                            <h3>Mark</h3>
                        </div>

                        {
                            //----   LIST ASSESSMENT MARKS   ----
                            this.state.assessmentMarks.map(assessmentMark => {
                                return (
                                    <div className="student-assessment-table center">
                                        <h3>{assessmentMark.Course_Assessment_Name}</h3>
                                        <h3>{assessmentMark.Assessment_Mark}</h3>
                                        <EditRounded className="center edit-button" onClick={() => this.toggleUpdatingAssessment(assessmentMark.Course_Assessment_ID)} />
                                    </div>
                                )
                            })
                        }

                        {
                            this.state.assessmentMarks.length === 0 &&
                            <EmptyListNotification message={"no assessments available"} />
                        }

                        {
                            this.state.updatingAssessment &&
                            <AddFileCard checkboxInputs={[]} uploading={false} title={"Update Assessment Mark"} cancel={this.toggleUpdatingAssessment} submit={this.updateAssessmentMark} addFile={false} uploadProgress={0} numberInputs={[UPDATE_ASSESSMENT_MARK[0]]} stringInputs={[]} calendarInputs={[]} />
                        }

                    </React.Fragment>
                }

                <br></br>

                {
                    //----   ASSIGNMENTS   ----

                    this.state.toggled &&
                    <React.Fragment>

                        <h3 className="student-title">Task Marks:</h3>
                        <div id="student-assessment-header" className="student-assessment-table center">
                            <h3>Name</h3>
                            <h3>Mark</h3>
                        </div>

                        {
                            this.state.assignments.map((assignment) => {
                                return (
                                    <StudentAssignmentCard assignment={assignment} student={this.props.student} token={this.props.token} />
                                );
                            })
                        }

                        {
                            this.state.assignments.length === 0 &&
                            <EmptyListNotification message={"no assignments available"} />
                        }
                    </React.Fragment>
                }

                {
                    //----   QUIZZES   ----

                    this.state.toggled &&
                    <React.Fragment>

                        <h3 className="student-title">Quizzes:</h3>
                        <div id="student-assessment-header" className="student-assessment-table center">
                            <h3 style={{ gridColumn: "1/4" }}>Name</h3>
                        </div>

                        {
                            this.state.quizzes.map((quiz) => {
                                return (
                                    <div className="student-assessment-table student-quiz-table center">
                                        <h4 style={{ gridColumn: "1/4" }} className="center" onClick={() => {
                                            this.toggleViewingQuiz(quiz);
                                        }}>{quiz.Quiz_Name}</h4>
                                    </div>
                                )
                            })
                        }

                        {
                            this.state.quizzes.length === 0 &&
                            <EmptyListNotification message={"no quizzes available"} />
                        }

                        {
                            this.state.viewingQuiz &&
                            <StudentQuizCard quiz={this.state.quizBeingViewed} toggleViewingQuiz={this.toggleViewingQuiz} token={this.props.token} studentID={this.props.student.Student_ID} />
                        }
                    </React.Fragment>
                }


            </div>
        );
    }
}

export default StudentCard;
