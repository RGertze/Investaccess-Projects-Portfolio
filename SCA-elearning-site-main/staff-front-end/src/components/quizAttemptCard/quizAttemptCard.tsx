
//-----------------------------------------
//        REACT IMPORTS
//-----------------------------------------

import React, { Component } from "react";

//-----------------------------------------
//        CSS IMPORTS
//-----------------------------------------

import "./quizAttemptCard.css";

//-----------------------------------------
//        COMPONENT IMPORTS
//-----------------------------------------

import Close from "@material-ui/icons/Close";
import CircularProgress from "@material-ui/core/CircularProgress";
import DoneRounded from "@material-ui/icons/DoneRounded";


//-----------------------------------------
//        INTERFACE IMPORTS
//-----------------------------------------

import { IGetQuizAnswers, IGetQuizQuestions, IGetSignedGetUrl, IGetStudentQuizFiles, IGetStudentQuizStructuredAnswer, IGetStudentQuizUnstructuredAnswers, IMarkStudentQuiz, IQuiz, IQuizAnswer, IQuizQuestion, IResponse, ISignedGetUrl, IStudentQuizFile, IStudentQuizStructuredAnswer, IStudentQuizUnstructuredAnswer, IUpdateStudentQuizStructuredAnswerMark } from "../../interfaces";
import Connection, { GET_TYPE, POST_TYPE } from "../../connection";
import EmptyListNotification from "../../../../staff-front-end/src/components/emptyListNotification/emptyListNotification";
import EditRounded from "@material-ui/icons/EditRounded";
import AddFileCard from "../addFileCard/addFileCard";


//-----------------------------------------
//        INTERFACE DEFINITIONS
//-----------------------------------------

interface IState {
    height: number,
    width: number,

    loading: boolean,
    loadingAnswers: boolean,

    editingStructuredMark: boolean,

    questions: IQuizQuestion[],
    currentQuestionIndex: number,

    answers: IQuizAnswer[],
    answerFiles: IStudentQuizFile[],
    studentUnStructAns: IStudentQuizUnstructuredAnswer[],

    multiChoiceAns: number[],
    structuredAns: string,
    structuredAnsMark: number
}

interface IProps {
    token: string,
    studentID: number,
    attemptNumber: number,
    quiz: IQuiz,
    toggleViewingQuiz(quiz: IQuiz): void
}

//-----------------------------------------
//        CONSTS/ENUMS
//-----------------------------------------

enum QUESTION_TYPES {
    MULTI_CHOICE = 1,
    SINGLE_WORD = 2,
    STRUCTURED = 3
}

const STRUCTURED_MARK_IN = [
    "Mark"
];


//-----------------------------------------
//        CLASS DEFINITION
//-----------------------------------------

class QuizAttemptCard extends Component<IProps, IState> {

    //----------------------
    //    CONSTRUCTOR
    //----------------------

    constructor(props: IProps) {
        super(props);

        let width = window.innerWidth - 100;
        let height = window.innerHeight - 160;

        this.state = {
            width: width,
            height: height,

            loading: false,
            loadingAnswers: false,

            editingStructuredMark: false,

            questions: [],
            currentQuestionIndex: 0,

            answers: [],
            answerFiles: [],
            studentUnStructAns: [],

            multiChoiceAns: [],
            structuredAns: "",
            structuredAnsMark: 0
        }
    }


    //---------------------------
    //    COMPONENT DID MOUNT
    //---------------------------

    componentDidMount() {
        this.getQuestions();
    }


    //----------------------
    //    TOGGLE EDIT MARK
    //----------------------

    toggleEditMark = () => {
        let editingStructuredMark = !this.state.editingStructuredMark;
        this.setState({ editingStructuredMark: editingStructuredMark });
    }


    //----------------------
    //    GET QUESTIONS
    //----------------------

    getQuestions = async () => {

        this.setState({ loading: true });

        let data: IGetQuizQuestions = {
            quizID: this.props.quiz.Quiz_ID
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_QUIZ_QUESTIONS, this.props.token, data);

        if (result.stat !== "ok") {
            this.setState({ questions: [], loading: false });
            return;
        }

        this.setState({ questions: result.data, loading: false, currentQuestionIndex: 0 }, () => this.handlerAnswerRetrieval(0));
    }


    //---------------------------------------
    //    HANDLE ANSWER RETRIEVAL
    //---------------------------------------

    handlerAnswerRetrieval = async (currIndex: number) => {
        switch (this.state.questions[currIndex].Quiz_Question_Type) {

            case QUESTION_TYPES.MULTI_CHOICE:
                await this.getAnswers();
                this.getStudentUnstructuredAnswers();
                break;

            case QUESTION_TYPES.SINGLE_WORD:
                this.getStudentStructuredAnswer();
                break;

            case QUESTION_TYPES.STRUCTURED:
                this.getStudentStructuredAnswer();
                this.getStudentQuizFiles();
                break;
        }
    }


    //----------------------
    //    NAV QUESTIONS
    //----------------------

    navQuestions = (increment: number) => {
        let currIndex = this.state.currentQuestionIndex + increment;

        if (currIndex < 0) {
            alert("You have reached the beginning of the quiz!");
            return;
        }

        if (currIndex >= this.state.questions.length) {
            alert("You have reached the end of the quiz!");
            return;
        }

        this.setState({ currentQuestionIndex: currIndex }, () => this.handlerAnswerRetrieval(currIndex));
    }


    //----------------------
    //    JUMP TO QUESTION
    //----------------------

    jumpToQuestion = (questionNumber: number) => {

        // decrease questionNumber by 1 since indices start at 0
        questionNumber -= 1;

        if (questionNumber < 0 || questionNumber >= this.state.questions.length) {
            return;
        }

        this.setState({ currentQuestionIndex: questionNumber }, () => this.handlerAnswerRetrieval(questionNumber));
    }


    //----------------------
    //    GET ANSWERS
    //----------------------

    getAnswers = async () => {
        this.setState({ answers: [], loadingAnswers: true });

        let data: IGetQuizAnswers = {
            quizQuestionID: this.state.questions[this.state.currentQuestionIndex].Quiz_Question_ID
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_QUIZ_ANSWERS, this.props.token, data);

        if (result.stat !== "ok") {
            this.setState({ answers: [], loadingAnswers: false });
            return;
        }

        this.setState({ answers: result.data, loadingAnswers: false });
    }


    //--------------------------------------
    //    GET STUDENT UNSTRUCTURED ANSWERS
    //--------------------------------------

    getStudentUnstructuredAnswers = async () => {
        this.setState({ loadingAnswers: true });

        let data: IGetStudentQuizUnstructuredAnswers = {
            quizID: this.props.quiz.Quiz_ID,
            questID: this.state.questions[this.state.currentQuestionIndex].Quiz_Question_ID,
            studentID: this.props.studentID,
            attemptNum: this.props.attemptNumber
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_STUDENT_QUIZ_UNSTRUCTURED_ANSWERS, this.props.token, data);

        if (result.stat !== "ok") {
            this.setState({ studentUnStructAns: [], loadingAnswers: false });
            return;
        }

        this.setState({ studentUnStructAns: result.data, loadingAnswers: false }, () => this.setStudentUnstructuredAnswers());
    }


    //--------------------------------------
    //    SET STUDENT UNSTRUCTURED ANSWERS
    //--------------------------------------

    setStudentUnstructuredAnswers = () => {
        let arr: number[] = [];
        this.state.studentUnStructAns.forEach(ans => {
            arr.push(ans.Quiz_Answer_ID);
        });

        this.setState({ multiChoiceAns: arr });
    }


    //------------------------------------
    //    GET STUDENT STRUCTURED ANSWER
    //------------------------------------

    getStudentStructuredAnswer = async () => {
        this.setState({ structuredAns: "", structuredAnsMark: 0, loadingAnswers: true });

        let data: IGetStudentQuizStructuredAnswer = {
            quizID: this.props.quiz.Quiz_ID,
            questID: this.state.questions[this.state.currentQuestionIndex].Quiz_Question_ID,
            studentID: this.props.studentID,
            attemptNum: this.props.attemptNumber
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_STUDENT_QUIZ_STRUCTURED_ANSWER, this.props.token, data);

        if (result.stat !== "ok") {
            this.setState({ loadingAnswers: false });
            //alert(result.error);
            return;
        }

        let recvData: IStudentQuizStructuredAnswer = result.data[0];

        this.setState({ structuredAns: recvData.Student_Quiz_Structured_Answer_Value, structuredAnsMark: recvData.Student_Quiz_Structured_Answer_Mark, loadingAnswers: false });
        return;
    }


    //------------------------------------
    //    GET STUDENT QUIZ FILES
    //------------------------------------

    getStudentQuizFiles = async () => {
        let data: IGetStudentQuizFiles = {
            studentID: this.props.studentID,
            quizID: this.props.quiz.Quiz_ID,
            attemptNum: this.props.attemptNumber,
            questID: this.state.questions[this.state.currentQuestionIndex].Quiz_Question_ID
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_STUDENT_QUIZ_FILES, this.props.token, data);

        if (result.stat !== "ok") {
            this.setState({ answerFiles: [] });
            return;
        }

        this.setState({ answerFiles: result.data });
    }


    //-------    SAVE STUDENT QUIZ FILE     --------------

    saveStudentQuizFile = async (studentQuizFile: IStudentQuizFile) => {

        let urlData: IGetSignedGetUrl = {
            filePath: studentQuizFile.Student_Quiz_File_Path
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_SIGNED_GET_URL, this.props.token, urlData);

        if (result.stat !== "ok") {
            alert(result.error);
        } else {
            let data: ISignedGetUrl = result.data;
            await Connection.saveFileS3(data.url, studentQuizFile.Student_Quiz_File_Name);
        }

    }


    //--------------------------------------------------
    //    UPDATE STUDENT QUIZ STRUCTURED ANSWER MARK
    //--------------------------------------------------

    updateStudentQuizStructuredAnswerMark = async (inMap: Map<string, string>, file: File): Promise<boolean> => {
        let mark: number = parseInt(inMap.get(STRUCTURED_MARK_IN[0]));

        if (isNaN(mark) || mark < 0 || mark > this.state.questions[this.state.currentQuestionIndex].Quiz_Question_Marks_Available) {
            alert("Enter a valid mark");
            return false;
        }

        let data: IUpdateStudentQuizStructuredAnswerMark = {
            mark: mark,
            questID: this.state.questions[this.state.currentQuestionIndex].Quiz_Question_ID,
            attemptNum: this.props.attemptNumber,
            quizID: this.props.quiz.Quiz_ID,
            studentID: this.props.studentID
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.UPDATE_STUDENT_QUIZ_STRUCTURED_ANSWER_MARK, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert("failed to edit mark: " + result.error);
            return false;
        }

        this.getStudentStructuredAnswer();
        alert("successfully edited mark");
        return true;
    }


    //--------------------------------------------------
    //          MARK STUDENT QUIZ
    //--------------------------------------------------

    markStudentQuiz = async () => {
        this.setState({ loadingAnswers: true });

        let data: IMarkStudentQuiz = {
            studentID: this.props.studentID,
            quizID: this.props.quiz.Quiz_ID,
            attemptNum: this.props.attemptNumber
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.MARK_STUDENT_QUIZ, this.props.token, data, {});

        this.setState({ loadingAnswers: false });

        if (result.stat !== "ok") {
            alert("failed to calculate final marks: " + result.error);
            return;
        }

        alert("Successfully calculated and saved quiz marks");
        this.props.toggleViewingQuiz(null);
    }



    //----------------------
    //    RENDER METHOD
    //----------------------

    render() {
        let currentQuestion: IQuizQuestion = null;
        if (this.state.questions.length > 0) {
            currentQuestion = this.state.questions[this.state.currentQuestionIndex];
        }

        return (
            <div id="quiz-attempt-container" className="center flex-column" >
                <div id="quiz-attempt-header" className="flex-row">

                    {
                        //----   DISPLAY QUESTION   ----

                        (!this.state.loading && this.state.questions.length > 0) &&
                        <h3>Question {currentQuestion.Quiz_Question_Number}:  {currentQuestion.Quiz_Question_Value}   ( {currentQuestion.Quiz_Question_Marks_Available} Marks )</h3>
                    }

                    {
                        //----   DISPLAY WHEN NO QUESTIONS ARE AVAILABLE   ----

                        (!this.state.loading && this.state.questions.length === 0) &&
                        <h3>No Questions Found!</h3>
                    }

                    {
                        this.state.loading &&
                        <CircularProgress className="center" style={{ width: "20px", height: "20px" }} />
                    }

                </div>

                <div id="quiz-attempt-answers-container">

                    {
                        //----   MULTIPLE CHOICE   ----

                        (currentQuestion !== null && currentQuestion.Quiz_Question_Type === QUESTION_TYPES.MULTI_CHOICE) &&
                        <div id="question-answers-container" className="center">

                            {
                                this.state.answers.map((answer, index) => {
                                    return (
                                        <div className="question-answer center">
                                            <h4>{currentQuestion.Quiz_Question_Type === QUESTION_TYPES.MULTI_CHOICE ? `(${String.fromCharCode(index + 97)})` : ``} </h4>
                                            <div className="flex-row">
                                                <h4> {answer.Quiz_Answer_Value}</h4>
                                            </div>

                                            {
                                                currentQuestion.Quiz_Question_Has_Multiple_Answers.data[0] === 1 &&
                                                <input className="center" type="checkbox" value={answer.Quiz_Answer_ID} checked={this.state.multiChoiceAns.includes(answer.Quiz_Answer_ID)} disabled={true} />
                                            }

                                            {
                                                currentQuestion.Quiz_Question_Has_Multiple_Answers.data[0] === 0 &&
                                                <input className="center" name="quizAnswer" type="radio" value={answer.Quiz_Answer_ID} checked={this.state.multiChoiceAns.includes(answer.Quiz_Answer_ID)} disabled={true} />
                                            }

                                            {
                                                (answer.Quiz_Answer_Is_Correct.data[0] === 0) &&
                                                <Close style={{ transform: "scale(1.4)", color: "red" }} className="center" />
                                            }

                                            {
                                                (answer.Quiz_Answer_Is_Correct.data[0] === 1) &&
                                                <DoneRounded style={{ transform: "scale(1.4)", color: "green" }} className="center" />
                                            }

                                        </div>
                                    )
                                })
                            }

                            {
                                (this.state.answers.length === 0 && !this.state.loadingAnswers) &&
                                <EmptyListNotification message={"No answers found"} />
                            }
                        </div>
                    }

                    {
                        //----   SINGLE WORD   ----

                        (currentQuestion !== null && currentQuestion.Quiz_Question_Type === QUESTION_TYPES.SINGLE_WORD) &&
                        <div className="question-answer center" style={{ marginTop: "20px", height: "60px" }}>
                            <input type="text" className="center" value={this.state.structuredAns} onChange={ev => this.setState({ structuredAns: ev.target.value })} style={{ gridColumn: "1/4", width: "70%" }} disabled={true} />
                        </div>
                    }

                    {
                        //----   STRUCTURED   ----

                        (currentQuestion !== null && currentQuestion.Quiz_Question_Type === QUESTION_TYPES.STRUCTURED) &&
                        <div className="question-structured-answer center flex-column" style={{ marginTop: "20px" }}>
                            <textarea className="center" value={this.state.structuredAns} disabled={true} />

                            <div id="quiz-answer-upload-container">
                                <div id="quiz-answer-upload-header" className="flex-row">
                                    <h3>Uploaded Files: </h3>
                                </div>

                                <div className="flex-column">
                                    {
                                        this.state.answerFiles.map(ansFile => {
                                            return (
                                                <div className="flex-row student-quiz-file">
                                                    <p className="center" onClick={() => this.saveStudentQuizFile(ansFile)}>{ansFile.Student_Quiz_File_Name}</p>
                                                </div>
                                            )
                                        })
                                    }

                                    {
                                        this.state.answerFiles.length === 0 &&
                                        <EmptyListNotification message={"No files uploaded"} />
                                    }
                                </div>
                            </div>

                            <div id="quiz-answer-mark" className="center flex-row">
                                <h4>Mark: {this.state.structuredAnsMark}/{currentQuestion.Quiz_Question_Marks_Available}</h4>
                                <EditRounded id="quiz-answer-mark-edit" style={{ transform: "scale(1.2)" }} onClick={this.toggleEditMark} />

                                {
                                    this.state.editingStructuredMark &&

                                    <AddFileCard checkboxInputs={[]} addFile={false} title={"Edit Mark"} cancel={this.toggleEditMark} submit={this.updateStudentQuizStructuredAnswerMark} uploading={false} numberInputs={[STRUCTURED_MARK_IN[0]]} stringInputs={[]} calendarInputs={[]} uploadProgress={0} />
                                }
                            </div>
                        </div>
                    }

                    {
                        this.state.loadingAnswers &&
                        <div className="center flex-row" style={{ width: "90%" }}>
                            <CircularProgress className="center" style={{ width: "30px", height: "30px" }} />
                        </div>
                    }

                </div>

                <div id="quiz-attempt-buttons-container">

                    {
                        this.state.currentQuestionIndex > 0 &&
                        <div className="quiz-attempt-button flex-row center" onClick={() => {
                            this.navQuestions(-1);
                        }}>
                            <h3>prev</h3>
                        </div>
                    }

                    <h3 style={{ gridColumn: 2 }}>{this.state.currentQuestionIndex + 1}/{this.state.questions.length}</h3>

                    <div className="quiz-attempt-button flex-row center" style={{ gridColumn: 3 }} onClick={() => {
                        if (this.state.currentQuestionIndex === (this.state.questions.length - 1)) {
                            this.markStudentQuiz();
                        } else {
                            this.navQuestions(1);
                        }
                    }}>
                        {
                            this.state.currentQuestionIndex === (this.state.questions.length - 1) &&
                            <h3>Finish</h3>
                        }
                        {
                            this.state.currentQuestionIndex < (this.state.questions.length - 1) &&
                            <h3>Next</h3>
                        }
                    </div>

                </div>

                <div id="quiz-attempt-question-numbers-container" className="flex-row center">
                    {
                        Array.from({ length: this.state.questions.length }, (x, i) => i + 1).map(qNum => {
                            return (
                                <div className="quiz-attempt-question-number" onClick={() => {
                                    this.jumpToQuestion(qNum);
                                }}>
                                    <h3 style={{ textDecoration: (qNum == this.state.currentQuestionIndex + 1) ? "underline" : "none" }}>{qNum}</h3>
                                </div>
                            )
                        })
                    }
                </div>
            </div >
        );
    }
}

export default QuizAttemptCard;
