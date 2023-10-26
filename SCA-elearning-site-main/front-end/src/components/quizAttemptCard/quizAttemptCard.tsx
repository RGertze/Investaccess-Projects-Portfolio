
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
import AddRounded from "@material-ui/icons/AddRounded";
import CircularProgress from "@material-ui/core/CircularProgress";
import DeleteForever from "@material-ui/icons/DeleteForever";


//-----------------------------------------
//        INTERFACE IMPORTS
//-----------------------------------------

import { IAddStudentQuizFile, IAddStudentQuizStructuredAnswer, IAddStudentQuizUnstructuredAnswer, IDeleteStudentQuizFile, IEndStudentQuizAttempt, IGetQuizAnswers, IGetQuizQuestions, IGetSignedGetUrl, IGetSignedPostUrl, IGetStudentQuizFiles, IGetStudentQuizStructuredAnswer, IGetStudentQuizUnstructuredAnswers, IQuiz, IQuizAnswer, IQuizQuestion, IResponse, ISignedGetUrl, ISignedPostUrl, IStudentQuizFile, IStudentQuizStructuredAnswer, IStudentQuizUnstructuredAnswer } from "../../interfaces";
import Connection, { GET_TYPE, POST_TYPE } from "../../connection";
import EmptyListNotification from "../../../../staff-front-end/src/components/emptyListNotification/emptyListNotification";
import { AxiosRequestConfig } from "axios";
import AddFileCard from "../../../../staff-front-end/src/components/addFileCard/addFileCard";


//-----------------------------------------
//        INTERFACE DEFINITIONS
//-----------------------------------------

interface IState {
    height: number,
    width: number,

    loading: boolean,
    loadingAnswers: boolean,

    uploading: boolean,
    uploadProgress: number,
    addingFile: boolean,

    questions: IQuizQuestion[],
    currentQuestionIndex: number,

    answers: IQuizAnswer[],
    answerFiles: IStudentQuizFile[],
    studentUnStructAns: IStudentQuizUnstructuredAnswer[],

    multiChoiceAns: number[],
    structuredAns: string
}

interface IProps {
    token: string,
    studentID: number,
    attemptNumber: number,
    quiz: IQuiz,
    closeQuiz(): void
}

//-----------------------------------------
//        CONSTS/ENUMS
//-----------------------------------------

enum QUESTION_TYPES {
    MULTI_CHOICE = 1,
    SINGLE_WORD = 2,
    STRUCTURED = 3
}


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

            uploading: false,
            uploadProgress: 0,
            addingFile: false,

            questions: [],
            currentQuestionIndex: 0,

            answers: [],
            answerFiles: [],
            studentUnStructAns: [],

            multiChoiceAns: [],
            structuredAns: ""
        }
    }


    //---------------------------
    //    COMPONENT DID MOUNT
    //---------------------------

    componentDidMount() {
        this.getQuestions();
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


    //----------------------
    //    SAVE ANSWERS
    //----------------------

    saveAnswers = async (): Promise<boolean> => {
        let currentQuestion: IQuizQuestion = this.state.questions[this.state.currentQuestionIndex];

        if (currentQuestion.Quiz_Question_Type === QUESTION_TYPES.MULTI_CHOICE) {
            return await this.addQuizUnstructuredAnswer();
        }
        if (currentQuestion.Quiz_Question_Type === QUESTION_TYPES.STRUCTURED || currentQuestion.Quiz_Question_Type === QUESTION_TYPES.SINGLE_WORD) {
            return await this.addQuizStructuredAnswer();
        }

        return true;
    }


    //------------------------------------
    //    ADD QUIZ UNSTRUCTURED ANSWER
    //------------------------------------

    addQuizUnstructuredAnswer = async (): Promise<boolean> => {
        let data: IAddStudentQuizUnstructuredAnswer[] = [];

        if (this.state.multiChoiceAns.length > 0) {
            this.state.multiChoiceAns.forEach(ans => {
                data.push({
                    quizID: this.props.quiz.Quiz_ID,
                    questID: this.state.questions[this.state.currentQuestionIndex].Quiz_Question_ID,
                    ansID: ans,
                    studentID: this.props.studentID,
                    attemptNum: this.props.attemptNumber
                });
            });

            let result: IResponse = await Connection.postReq(POST_TYPE.ADD_STUDENT_QUIZ_UNSTRUCTURED_ANSWER, this.props.token, data, {});

            if (result.stat !== "ok") {
                alert("Failed to save answer, please check connection and try again before continuing");
                return false;
            }

            this.setState({ multiChoiceAns: [] });
            return true;
        }

        return true;
    }


    //------------------------------------
    //    ADD QUIZ STRUCTURED ANSWER
    //------------------------------------

    addQuizStructuredAnswer = async (): Promise<boolean> => {
        if (this.state.structuredAns !== "") {
            let data: IAddStudentQuizStructuredAnswer = {
                quizID: this.props.quiz.Quiz_ID,
                questID: this.state.questions[this.state.currentQuestionIndex].Quiz_Question_ID,
                studentID: this.props.studentID,
                attemptNum: this.props.attemptNumber,
                ans: this.state.structuredAns
            }

            //console.log(data);

            let result: IResponse = await Connection.postReq(POST_TYPE.ADD_STUDENT_QUIZ_STRUCTURED_ANSWER, this.props.token, data, {});

            if (result.stat !== "ok") {
                alert("Failed to save answer, please check connection and try again before continuing: " + result.error);
                return false;
            }

            //this.setState({ structuredAns: "" });  
            /*
             *
             *   structuredAns IS SET TO "" EACH TIME A STRUCTURED/SINGLE_WORD QUESTION IS VIEWED AND ITS STUDENT ANSWERS RETRIEVED
             *
             * */
            return true;
        }
        alert("Enter an answer");
        return false;
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
        this.setState({ structuredAns: "", loadingAnswers: true });

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

        this.setState({ structuredAns: recvData.Student_Quiz_Structured_Answer_Value, loadingAnswers: false });
        return;
    }



    //-------    TOGGLE ADD FILE     --------------

    toggleAddFile = async () => {
        let addingFile = this.state.addingFile;
        this.setState({ addingFile: !addingFile });
    }


    //-------    UPLOAD STUDENT QUIZ FILE     --------------

    uploadStudentQuizFile = async (inputMap: Map<string, string>, file: File): Promise<boolean> => {
        if (file) {

            this.setState({ uploading: true });

            let getUrlData: IGetSignedPostUrl = {
                originalFileName: file.name
            }

            //--        GET SIGNED URL      --

            let result: IResponse = await Connection.getReq(GET_TYPE.GET_SIGNED_POST_URL, this.props.token, getUrlData);

            if (result.stat !== "ok") {
                alert(result.error);
                return false;
            }

            let urlData: ISignedPostUrl = result.data;

            //--        SETUP CONFIG TO MONITOR UPLOAD PROGRESS      --

            let config: AxiosRequestConfig = {
                onUploadProgress: (progressEvent) => {
                    const { loaded, total } = progressEvent;
                    let progress = Math.floor(loaded / total * 100);
                    this.setState({ uploadProgress: progress });
                }
            }

            //--        UPLOAD FILE TO S3      --

            let uploadStatus = await Connection.uploadFile(urlData.url, file, config);

            if (uploadStatus !== 200) {
                alert("upload failed");
                return false;
            }

            let data: IAddStudentQuizFile = {
                filePath: urlData.filePath,
                studentID: this.props.studentID,
                quizID: this.props.quiz.Quiz_ID,
                questID: this.state.questions[this.state.currentQuestionIndex].Quiz_Question_ID,
                attemptNum: this.props.attemptNumber,
                fileName: file.name
            }

            //--        SEND FILE DATA TO SERVER      --

            result = await Connection.postReq(POST_TYPE.ADD_STUDENT_QUIZ_FILE, this.props.token, data, config);

            if (result.stat !== "ok") {
                alert("failed to upload file");
                this.setState({ uploading: false, uploadProgress: 0 });
                return false;
            }

            alert("file successfully uploaded");

            this.getStudentQuizFiles();

            this.setState({ uploading: false, uploadProgress: 0 });
            return true;

        } else {
            alert("no files chosen");
            return false;
        }
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


    //------------------------------------
    //    DELETE STUDENT QUIZ FILE
    //------------------------------------

    deleteStudentQuizFile = async (studentQuizFile: IStudentQuizFile) => {
        let data: IDeleteStudentQuizFile = {
            filePath: studentQuizFile.Student_Quiz_File_Path
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.DELETE_STUDENT_QUIZ_FILE, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert("failed to delete file: " + result.error);
            return;
        }

        this.getStudentQuizFiles();
        alert("successfully deleted file");
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


    //------------------------------------
    //    END STUDENT QUIZ ATTEMPT
    //------------------------------------

    endStudentQuizAttempt = async () => {
        this.setState({ loadingAnswers: true });

        let data: IEndStudentQuizAttempt = {
            attemptNum: this.props.attemptNumber,
            quizID: this.props.quiz.Quiz_ID,
            studentID: this.props.studentID
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.END_STUDENT_QUIZ_ATTEMPT, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert("failed to end quiz: " + result.error);
            this.setState({ loadingAnswers: false });
            return;
        }

        this.setState({ loadingAnswers: false });
        alert("Quiz successfully ended");
        this.props.closeQuiz();
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
                                                <input className="center" type="checkbox" value={answer.Quiz_Answer_ID} checked={this.state.multiChoiceAns.includes(answer.Quiz_Answer_ID)} onChange={ev => {
                                                    let id = parseInt(ev.target.value);
                                                    let index = NaN;
                                                    let arr = this.state.multiChoiceAns.slice();

                                                    //----   SEARCH FOR VALUE   ---- 
                                                    for (let i = 0; i < arr.length; i++) {
                                                        if (arr[i] === id) {
                                                            index = i;
                                                        }
                                                    }

                                                    //----   IF VALUE NOT FOUND, PUSH VALUE, ELSE, REMOVE VALUE   ---- 
                                                    if (isNaN(index)) {
                                                        arr.push(id);
                                                    } else {
                                                        arr.splice(index, 1);
                                                    }

                                                    console.log(arr);
                                                    this.setState({ multiChoiceAns: arr });

                                                }} />
                                            }

                                            {
                                                currentQuestion.Quiz_Question_Has_Multiple_Answers.data[0] === 0 &&
                                                <input className="center" name="quizAnswer" type="radio" value={answer.Quiz_Answer_ID} checked={this.state.multiChoiceAns.includes(answer.Quiz_Answer_ID)} onChange={ev => {
                                                    console.log(ev.target.value);

                                                    let ansID: number[] = [parseInt(ev.target.value)];
                                                    this.setState({ multiChoiceAns: ansID }, () => console.log(this.state.multiChoiceAns));
                                                }} />
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
                            <input type="text" className="center" value={this.state.structuredAns} onChange={ev => this.setState({ structuredAns: ev.target.value })} style={{ gridColumn: "1/4", width: "70%" }} />
                        </div>
                    }

                    {
                        //----   STRUCTURED   ----

                        (currentQuestion !== null && currentQuestion.Quiz_Question_Type === QUESTION_TYPES.STRUCTURED) &&
                        <div className="question-structured-answer center flex-column" style={{ marginTop: "20px" }}>
                            <textarea className="center" value={this.state.structuredAns} onChange={ev => this.setState({ structuredAns: ev.target.value })} />

                            <div id="quiz-answer-upload-container">
                                <div id="quiz-answer-upload-header" className="flex-row">
                                    <h3>Upload Files: </h3>
                                    <AddRounded className="add-rounded-btn" style={{ transform: "scale(1.3)" }} onClick={this.toggleAddFile} />
                                </div>

                                {
                                    this.state.addingFile &&
                                    <AddFileCard checkboxInputs={[]} addFile={true} title={"Upload File"} uploadProgress={this.state.uploadProgress} uploading={this.state.uploading} cancel={this.toggleAddFile} submit={this.uploadStudentQuizFile} numberInputs={[]} stringInputs={[]} calendarInputs={[]} />
                                }

                                <div className="flex-column">
                                    {
                                        this.state.answerFiles.map(ansFile => {
                                            return (
                                                <div className="title-col student-quiz-file">
                                                    <p onClick={() => this.saveStudentQuizFile(ansFile)}>{ansFile.Student_Quiz_File_Name}</p>
                                                    <DeleteForever className="center student-quiz-file-delete" onClick={() => this.deleteStudentQuizFile(ansFile)} />
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
                        <div className="quiz-attempt-button flex-row center" onClick={async () => {
                            let answerSaved = await this.saveAnswers();
                            if (answerSaved) {
                                this.navQuestions(-1);
                            }
                        }}>
                            <h3>prev</h3>
                        </div>
                    }

                    <h3 style={{ gridColumn: 2 }}>{this.state.currentQuestionIndex + 1}/{this.state.questions.length}</h3>

                    <div className="quiz-attempt-button flex-row center" style={{ gridColumn: 3 }} onClick={async () => {
                        let answerSaved = await this.saveAnswers();
                        if (answerSaved) {
                            if (this.state.currentQuestionIndex === (this.state.questions.length - 1)) {
                                this.endStudentQuizAttempt();
                            } else {
                                this.navQuestions(1);
                            }
                        }
                    }}>
                        <h3>{this.state.currentQuestionIndex < (this.state.questions.length - 1) ? "Next" : "Finish"}</h3>
                    </div>

                </div>

                <div id="quiz-attempt-question-numbers-container" className="flex-row center">
                    {
                        Array.from({ length: this.state.questions.length }, (x, i) => i + 1).map(qNum => {
                            return (
                                <div className="quiz-attempt-question-number" onClick={async () => {
                                    let answerSaved = await this.saveAnswers();
                                    if (answerSaved) {
                                        this.jumpToQuestion(qNum);
                                    }
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
