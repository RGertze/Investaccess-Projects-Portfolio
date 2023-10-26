
//-----------------------------------------
//        REACT IMPORTS
//-----------------------------------------

import React, { Component } from "react";

//-----------------------------------------
//        CSS IMPORTS
//-----------------------------------------

import "./studentQuizCard.css";

//-----------------------------------------
//        COMPONENT IMPORTS
//-----------------------------------------

import Close from "@material-ui/icons/Close";
import AddRounded from "@material-ui/icons/AddRounded";
import QuizAttemptCard from "../quizAttemptCard/quizAttemptCard";


//-----------------------------------------
//        INTERFACE IMPORTS
//-----------------------------------------

import { IGetStudentQuizAttempts, IQuiz, IResponse, IStudentQuiz } from "../../interfaces";
import Connection, { GET_TYPE, POST_TYPE } from "../../connection";
import EmptyListNotification from "../emptyListNotification/emptyListNotification";


//-----------------------------------------
//        INTERFACE DEFINITIONS
//-----------------------------------------

interface IState {
    height: number,
    width: number,

    quizAttempts: IStudentQuiz[],
    attemptBeingViewed: boolean,

    quizAttemptNumber: number
}

interface IProps {
    token: string,
    studentID: number,
    quiz: IQuiz,

    toggleViewingQuiz(quiz: IQuiz): void
}

//-----------------------------------------
//        CLASS DEFINITION
//-----------------------------------------

class StudentQuizCard extends Component<IProps, IState> {

    //----------------------
    //    CONSTRUCTOR
    //----------------------

    constructor(props: IProps) {
        super(props);

        let width: number = 0;
        let height: number = 0;
        if (window.innerWidth > 600) {
            width = window.innerWidth - 100;
            height = window.innerHeight - 160;
        } else {
            width = window.innerWidth - 4;   //----   MINUS 2 TO FIT BORDER   ----
            height = window.innerHeight - 120;
        }

        this.state = {
            width: width,
            height: height,

            quizAttempts: [],
            attemptBeingViewed: false,
            quizAttemptNumber: NaN
        }
    }


    //---------------------------
    //    COMPONENT DID MOUNT
    //---------------------------

    componentDidMount() {
        this.getQuizAttempts();
    }


    //------------------------------
    //    TOGGLE ATTEMPTING QUIZ
    //------------------------------

    toggleViewQuiz = () => {
        let attemptBeingViewed = !this.state.attemptBeingViewed;
        this.setState({ attemptBeingViewed: attemptBeingViewed });
    }


    //------------------------------
    //    GET QUIZ ATTEMPTS
    //------------------------------

    getQuizAttempts = async () => {
        let data: IGetStudentQuizAttempts = {
            studentID: this.props.studentID,
            quizID: this.props.quiz.Quiz_ID
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_STUDENT_QUIZ_ATTEMPTS, this.props.token, data);

        if (result.stat !== "ok") {
            this.setState({ quizAttempts: [] });
            return;
        }

        this.setState({ quizAttempts: result.data });
    }


    //----------------------
    //    RENDER METHOD
    //----------------------

    render() {
        return (
            <div id="quiz-container" className="center flex-column" style={{ width: this.state.width, height: this.state.height }}>

                <div id="quiz-header" className="center title-col">
                    <h2>{this.props.quiz.Quiz_Name}</h2>

                    <Close style={{ transform: "scale(1.4)" }} className="chat-header-buttons center" onClick={() => this.props.toggleViewingQuiz(null)} />
                </div>


                {
                    this.state.attemptBeingViewed &&
                    <QuizAttemptCard toggleViewingQuiz={this.props.toggleViewingQuiz} studentID={this.props.studentID} quiz={this.props.quiz} token={this.props.token} attemptNumber={this.state.quizAttemptNumber} />
                }

                {
                    //----   SHOW ATTEMPTS   ----

                    !this.state.attemptBeingViewed &&
                    <div id="quiz-prev-attempts-container" className="center">

                        <div id="quiz-prev-attempts-title" className="flex-row">
                            <h2 className="center">Attempts</h2>
                        </div>

                        <div>
                            <div id="quiz-prev-attempts-header" className="quiz-prev-attempts-table center">
                                <h3>Attempt Nr.</h3>
                                <h3>End Time</h3>
                                <h3>Mark Obtained</h3>
                                <h3>In Progress</h3>
                            </div>

                            {
                                this.state.quizAttempts.map(attempt => {
                                    return (
                                        <div id="" className="quiz-prev-attempts-table center">
                                            <p id="quiz-prev-attempt-name" onClick={() => {
                                                this.setState({ quizAttemptNumber: attempt.Student_Quiz_Attempt_Number }, () => this.toggleViewQuiz());
                                            }}>{attempt.Student_Quiz_Attempt_Number}</p>
                                            <p>{(attempt.Student_Quiz_End_Time !== null) ? `${attempt.Student_Quiz_End_Time.slice(0, 10)} ${attempt.Student_Quiz_End_Time.slice(11, 16)}` : ""}</p>
                                            <p>{attempt.Student_Quiz_Mark_Obtained}</p>
                                            <p>{(attempt.In_Progress === 1) ? "yes" : "no"}</p>
                                        </div>
                                    )
                                })
                            }

                            {
                                this.state.quizAttempts.length === 0 &&
                                <EmptyListNotification message={"No attempts found"} />
                            }

                        </div>

                    </div>
                }

            </div >
        );
    }
}

export default StudentQuizCard;
