
//-----------------------------------------
//        REACT IMPORTS
//-----------------------------------------

import React, { Component } from "react";

//-----------------------------------------
//        CSS IMPORTS
//-----------------------------------------

import "./quizQuestionCard.css";

//-----------------------------------------
//        COMPONENT IMPORTS
//-----------------------------------------

import Close from "@material-ui/icons/Close";
import AddRounded from "@material-ui/icons/AddRounded";
import DeleteForever from "@material-ui/icons/DeleteForever";
import DoneRounded from "@material-ui/icons/DoneRounded";


//-----------------------------------------
//        INTERFACE IMPORTS
//-----------------------------------------

import { IAddQuizAnswer, IAddQuizQuestion, IDeleteQuizAnswer, IGetQuizAnswers, IQuiz, IQuizAnswer, IQuizQuestion, IResponse } from "../../interfaces";
import Connection, { GET_TYPE, POST_TYPE } from "../../connection";
import AddFileCard from "../addFileCard/addFileCard";
import EmptyListNotification from "../emptyListNotification/emptyListNotification";


//-----------------------------------------
//        INTERFACE DEFINITIONS
//-----------------------------------------

interface IState {
    toggled: boolean,

    addingAnswer: boolean,
    answers: IQuizAnswer[]
}

interface IProps {
    token: string,
    question: IQuizQuestion,
    deleteQuestion(questionID: number): Promise<void>
}

//-----------------------------------------
//        CONST DEFINITIONS
//-----------------------------------------

enum QUESTION_TYPES {
    MULTI_CHOICE = 1,
    SINGLE_WORD = 2,
    STRUCTURED = 3
}

const QUIZ_ANSWER_INPUTS = [
    "answer",
    "is correct?"
];


//-----------------------------------------
//        CLASS DEFINITION
//-----------------------------------------

class QuizQuestionCard extends Component<IProps, IState> {

    //----------------------
    //    CONSTRUCTOR
    //----------------------

    constructor(props: IProps) {
        super(props);


        this.state = {
            toggled: false,

            addingAnswer: false,
            answers: []
        }
    }


    //--------------------------
    //    COMPONENT DID MOUNT
    //--------------------------

    componentDidMount() {
        this.getAnswers();
    }


    //--------------------------
    //    TOGGLE
    //--------------------------

    toggle = () => {
        if (this.props.question.Quiz_Question_Type !== QUESTION_TYPES.STRUCTURED) {
            let toggled = !this.state.toggled;

            if (toggled) {
                this.getAnswers();
            }

            this.setState({ toggled: toggled });
        }
    }



    //------------------------------
    //    TOGGLE ADDING ANSWER
    //------------------------------

    toggleAddAnswer = () => {
        let addingAnswer = !this.state.addingAnswer;
        this.setState({ addingAnswer: addingAnswer });
    }


    //----------------------
    //    ADD ANSWER
    //----------------------

    addAnswer = async (inMap: Map<string, string>, file: File): Promise<boolean> => {
        let value = inMap.get(QUIZ_ANSWER_INPUTS[0]);
        let isCorrect = parseInt(inMap.get(QUIZ_ANSWER_INPUTS[1]));

        if (value === "") {
            alert("Enter an answer");
            return false;
        }

        let data: IAddQuizAnswer = {
            quizQuestionID: this.props.question.Quiz_Question_ID,
            value: value,
            isCorrect: isNaN(isCorrect) ? 1 : isCorrect   // FOR SINGLE WORD ANSWERS, isCorrect WILL BE NaN AND 1 IS SET AS DEFAULT
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.ADD_QUIZ_ANSWER, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert("failed to add answer: " + result.error);
            return false;
        }

        alert("successfully added answer");
        this.getAnswers();
        return true;
    }


    //----------------------
    //    DELETE ANSWER
    //----------------------

    deleteAnswer = async (answerID: number) => {
        let data: IDeleteQuizAnswer = {
            answerID: answerID
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.DELETE_QUIZ_ANSWER, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert("failed to delete answer: " + result.error);
            return;
        }

        alert("successfully deleted answer");
        this.getAnswers();
    }


    //----------------------
    //    GET ANSWERS
    //----------------------

    getAnswers = async () => {
        let data: IGetQuizAnswers = {
            quizQuestionID: this.props.question.Quiz_Question_ID
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_QUIZ_ANSWERS, this.props.token, data);

        if (result.stat !== "ok") {
            this.setState({ answers: [] });
            return;
        }

        this.setState({ answers: result.data });
    }


    //----------------------
    //    RENDER METHOD
    //----------------------

    render() {

        let headerClassName = (this.props.question.Quiz_Question_Type !== QUESTION_TYPES.STRUCTURED) ? "center title-2-col quiz-question-header-hover" : "center title-2-col";

        return (
            <div id="quiz-question-container" className="center flex-column">

                <div id="quiz-question-header" className={headerClassName}>
                    <div className="flex-row" onClick={this.toggle}>
                        <h4 >{this.props.question.Quiz_Question_Number}. {this.props.question.Quiz_Question_Value}  ({this.props.question.Quiz_Question_Marks_Available} marks)</h4>
                    </div>

                    {
                        this.props.question.Quiz_Question_Type !== QUESTION_TYPES.STRUCTURED &&
                        <AddRounded className="table-title-add-button center" style={{ transform: "scale(1.3)", color: "white" }} onClick={this.toggleAddAnswer} />
                    }
                    {
                        <DeleteForever id="task-table-delete-button" style={{ transform: "scale(1.3)" }} onClick={() => this.props.deleteQuestion(this.props.question.Quiz_Question_ID)} className="center" />
                    }
                </div>

                {
                    this.state.toggled &&
                    <div id="question-answers-container" className="center">

                        {
                            this.state.answers.map((answer, index) => {
                                return (
                                    <div className="question-answer center">
                                        <h4>{this.props.question.Quiz_Question_Type === QUESTION_TYPES.MULTI_CHOICE ? `(${String.fromCharCode(index + 97)})` : ``} </h4>
                                        <div className="flex-row">
                                            <h4> {answer.Quiz_Answer_Value}</h4>
                                        </div>

                                        {
                                            (answer.Quiz_Answer_Is_Correct.data[0] === 0 && this.props.question.Quiz_Question_Type === QUESTION_TYPES.MULTI_CHOICE) &&
                                            <Close style={{ transform: "scale(1.4)", color: "red" }} className="center" />
                                        }

                                        {
                                            (answer.Quiz_Answer_Is_Correct.data[0] === 1 && this.props.question.Quiz_Question_Type === QUESTION_TYPES.MULTI_CHOICE) &&
                                            <DoneRounded style={{ transform: "scale(1.4)", color: "green" }} className="center" />
                                        }

                                        <DeleteForever id="task-table-delete-button" style={{ transform: "scale(1.3)" }} onClick={() => this.deleteAnswer(answer.Quiz_Answer_ID)} className="center" />

                                    </div>
                                )
                            })
                        }

                        {
                            this.state.answers.length === 0 &&
                            <EmptyListNotification message={"No answers found"} />
                        }
                    </div>
                }

                {
                    //----   ADD QUIZ ANSWER   ----

                    this.state.addingAnswer &&
                    <AddFileCard checkboxInputs={(this.props.question.Quiz_Question_Type === QUESTION_TYPES.MULTI_CHOICE) ? [QUIZ_ANSWER_INPUTS[1]] : []} addFile={false} title={"Add Answer"} cancel={this.toggleAddAnswer} submit={this.addAnswer} uploading={false} numberInputs={[]} stringInputs={[QUIZ_ANSWER_INPUTS[0]]} calendarInputs={[]} uploadProgress={0} />
                }

            </div >
        );
    }
}

export default QuizQuestionCard;
