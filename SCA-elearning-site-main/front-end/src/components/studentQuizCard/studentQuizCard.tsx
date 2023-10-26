
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

import { IAddStudentQuiz, IGetStudentQuizAttempts, IQuiz, IResponse, IStudentQuiz } from "../../interfaces";
import Connection, { GET_TYPE, POST_TYPE } from "../../connection";
import EmptyListNotification from "../../../../staff-front-end/src/components/emptyListNotification/emptyListNotification";


//-----------------------------------------
//        INTERFACE DEFINITIONS
//-----------------------------------------

interface IState {
    height: number,
    width: number,

    quizAttempts: IStudentQuiz[],
    attemptInProgress: boolean,

    quizAttemptNumber: number
}

interface IProps {
    token: string,
    studentID: number,
    quiz: IQuiz,
    closeQuiz(): void
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
            attemptInProgress: false,
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

    toggleAttemptQuiz = () => {
        let attemptInProgress = !this.state.attemptInProgress;
        this.setState({ attemptInProgress: attemptInProgress });
    }


    //------------------------------
    //    FIND ATTEMPT IN PROGRESS
    //------------------------------

    findAttemptInProgress = (): number => {
        if (this.state.quizAttempts.length === 0) {
            return NaN;
        }

        for (let i = 0; i < this.state.quizAttempts.length; i++) {
            if (this.state.quizAttempts[i].In_Progress === 1) {
                return this.state.quizAttempts[i].Student_Quiz_Attempt_Number;
            }
        }

        return NaN;
    }


    //------------------------------
    //    ADD QUIZ ATTEMPT
    //------------------------------

    addQuizAttempt = async () => {
        let data: IAddStudentQuiz = {
            studentID: this.props.studentID,
            quizID: this.props.quiz.Quiz_ID
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.ADD_STUDENT_QUIZ, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert("Failed to start attempt, try again later: " + result.error);
            return;
        }

        this.setState({ quizAttemptNumber: (this.state.quizAttempts.length + 1) }, () => this.toggleAttemptQuiz());
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

        this.setState({ quizAttempts: result.data }, () => {
            let attNum = this.findAttemptInProgress();
            this.setState({ quizAttemptNumber: attNum });
        });
    }


    //----------------------
    //    RENDER METHOD
    //----------------------

    render() {
        return (
            <div id="quiz-container" className="center flex-column" style={{ width: this.state.width, height: this.state.height }}>

                <div id="quiz-header" className="center title-col">
                    <h2 className="center">{this.props.quiz.Quiz_Name}</h2>
                    <Close className="quiz-close-button" onClick={this.props.closeQuiz} style={{ transform: "scale(1.4)" }} />
                </div>

                {
                    !this.state.attemptInProgress &&
                    <div id="quiz-start-new-button" className="center flex-row" onClick={() => {
                        if (isNaN(this.state.quizAttemptNumber)) {
                            this.addQuizAttempt();
                        } else {
                            this.toggleAttemptQuiz();
                        }

                    }}>
                        {
                            isNaN(this.state.quizAttemptNumber) &&
                            <h4>Start New Attempt</h4>
                        }

                        {
                            !isNaN(this.state.quizAttemptNumber) &&
                            <h4>Continue Last Attempt</h4>
                        }

                        <AddRounded />
                    </div>
                }

                {
                    this.state.attemptInProgress &&
                    <QuizAttemptCard closeQuiz={this.props.closeQuiz} studentID={this.props.studentID} quiz={this.props.quiz} token={this.props.token} attemptNumber={this.state.quizAttemptNumber} />
                }

                {
                    //----   SHOW ATTEMPTS   ----

                    !this.state.attemptInProgress &&
                    <div id="quiz-prev-attempts-container" className="center">

                        <div id="quiz-prev-attempts-title" className="flex-row">
                            <h2 className="center">Previous Attempts</h2>
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
                                            <p>{attempt.Student_Quiz_Attempt_Number}</p>
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
