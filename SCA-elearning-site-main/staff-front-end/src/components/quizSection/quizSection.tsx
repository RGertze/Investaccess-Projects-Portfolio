
//-----------------------------------------
//        REACT IMPORTS
//-----------------------------------------

import React, { Component } from "react";

//-----------------------------------------
//        CSS IMPORTS
//-----------------------------------------

import "./quizSection.css";

//-----------------------------------------
//        COMPONENT IMPORTS
//-----------------------------------------

import Close from "@material-ui/icons/Close";
import AddRounded from "@material-ui/icons/AddRounded";


//-----------------------------------------
//        INTERFACE IMPORTS
//-----------------------------------------

import { IAddQuizQuestion, IDeleteQuizQuestion, IGetQuizQuestions, IQuiz, IQuizQuestion, IResponse } from "../../interfaces";
import Connection, { GET_TYPE, POST_TYPE } from "../../connection";
import QuizQuestionCard from "../quizQuestionCard/quizQuestionCard";


//-----------------------------------------
//        INTERFACE DEFINITIONS
//-----------------------------------------

interface IState {
    height: number,
    width: number,

    addingQuestion: boolean,

    inQuestion: string,
    inQuestionType: number,
    inQuestionMarksAvail: number,

    questions: IQuizQuestion[]
}

interface IProps {
    token: string,
    quiz: IQuiz,
    toggleViewingQuiz(): void
}

//-----------------------------------------
//        CLASS DEFINITION
//-----------------------------------------

class QuizSection extends Component<IProps, IState> {

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

            addingQuestion: false,
            inQuestion: "",
            inQuestionType: 1,
            inQuestionMarksAvail: 0,

            questions: []
        }
    }


    //---------------------------
    //    COMPONENT DID MOUNT
    //---------------------------

    componentDidMount() {
        this.getQuestions();
    }


    //------------------------------
    //    TOGGLE ADDING QUESTION
    //------------------------------

    toggleAddQuestion = () => {
        let addingQuestion = !this.state.addingQuestion;
        this.setState({ addingQuestion: addingQuestion });
    }


    //----------------------
    //    ADD QUESTION
    //----------------------

    addQuestion = async () => {
        if (this.state.inQuestion === "") {
            alert("Please enter a question");
            return;
        }
        if (this.state.inQuestionMarksAvail < 1) {
            alert("Marks available should be atleast 1");
            return;
        }

        let data: IAddQuizQuestion = {
            quizID: this.props.quiz.Quiz_ID,
            qType: this.state.inQuestionType,
            value: this.state.inQuestion,
            marksAvailable: this.state.inQuestionMarksAvail
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.ADD_QUIZ_QUESTION, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert("failed to add question: " + result.error);
            return;
        }

        alert("Question added");
        this.getQuestions();
        this.setState({ addingQuestion: false, inQuestion: "", inQuestionMarksAvail: 0, inQuestionType: 1 });
    }


    //----------------------
    //    DELETE QUESTION
    //----------------------

    deleteQuestion = async (questionID: number) => {

        let data: IDeleteQuizQuestion = {
            questionID: questionID
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.DELETE_QUIZ_QUESTION, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert("failed to delete question: " + result.error);
            return;
        }

        alert("Question deleted");
        this.getQuestions();
    }


    //----------------------
    //    GET QUESTIONS
    //----------------------

    getQuestions = async () => {

        let data: IGetQuizQuestions = {
            quizID: this.props.quiz.Quiz_ID
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_QUIZ_QUESTIONS, this.props.token, data);

        if (result.stat !== "ok") {
            this.setState({ questions: [] });
            return;
        }

        this.setState({ questions: result.data });
    }


    //----------------------
    //    RENDER METHOD
    //----------------------

    render() {
        return (
            <div id="quiz-container" className="center" style={{ width: this.state.width, height: this.state.height }}>

                <div id="quiz-header" className="center title-col">
                    <h2>{this.props.quiz.Quiz_Name}</h2>

                    <Close style={{ transform: "scale(1.4)" }} className="chat-header-buttons center" onClick={this.props.toggleViewingQuiz} />
                </div>

                <div id="quiz-questions-container" className="center">
                    <div className="flex-row center" id="quiz-questions-header">
                        <h2>Questions:</h2>
                        <AddRounded className="table-title-add-button" style={{ transform: "scale(1.5)", color: "white" }} onClick={this.toggleAddQuestion} />
                    </div>

                    <div id="quiz-questions">
                        {
                            //----   LIST QUESTIONS   ----

                            this.state.questions.map(question => {
                                return (
                                    <QuizQuestionCard token={this.props.token} question={question} deleteQuestion={this.deleteQuestion} />
                                )
                            })
                        }
                    </div>
                </div>


                {
                    //----   ADDING QUESTION   ----

                    this.state.addingQuestion &&
                    <div id="add-file-card-overlay">
                        <div id="add-file-card-container" className="flex-column">
                            <h2>Add Question</h2>

                            <div className="form-col add-file-card-str-input">
                                <h4>question: </h4>
                                <input type="text" onChange={ev => {
                                    this.setState({ inQuestion: ev.target.value });
                                }} />
                            </div>

                            <div className="form-col add-file-card-str-input">
                                <h4>marks available: </h4>
                                <input type="number" onChange={ev => {
                                    this.setState({ inQuestionMarksAvail: parseInt(ev.target.value) });
                                }} />
                            </div>

                            <div className="form-col add-file-card-str-input">
                                <h4>type: </h4>
                                <select value={this.state.inQuestionType} onChange={ev => {
                                    this.setState({ inQuestionType: parseInt(ev.target.value) });
                                }} >
                                    <option value={1}>Multiple Choice</option>
                                    <option value={2}>Single Word</option>
                                    <option value={3}>Paragraph/Structured</option>
                                </select>
                            </div>

                            {
                                //----   BUTTONS   ----

                                <div id="add-file-card-buttons-container">

                                    <div className="flex-row add-file-card-button" onClick={async () => { this.addQuestion() }}>
                                        <h3 className="center">Submit</h3>
                                    </div>
                                    <div className="flex-row add-file-card-button" onClick={this.toggleAddQuestion}>
                                        <h3 className="center">Cancel</h3>
                                    </div>

                                </div>
                            }

                        </div>
                    </div>
                }

            </div >
        );
    }
}

export default QuizSection;
