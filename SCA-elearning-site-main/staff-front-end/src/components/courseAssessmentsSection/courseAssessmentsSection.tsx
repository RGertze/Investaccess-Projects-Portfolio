
//----------------------------------
//      REACT IMPORTS
//----------------------------------

import React, { Component } from "react";

//----------------------------------
//      CSS IMPORTS
//----------------------------------

import "./courseAssessmentsSection.css";

//----------------------------------
//      COMPONENT IMPORTS
//----------------------------------

import { AxiosRequestConfig } from "axios";
import Connection, { GET_TYPE, POST_TYPE } from "../../connection";
import { IAddCourseAssessment, IAddCourseAssignment, IAddLink, IAddQuiz, ICourseAssessment, ICourseAssignment, IDeleteAssignmentLink, IDeleteCourseAssessment, IDeleteCourseAssignment, IDeleteQuiz, IGetCourseAssessments, IGetCourseAssignments, IGetLinksForAssignments, IGetQuizzesByCourse, IGetSignedGetUrl, IGetSignedPostUrl, ILink, IQuiz, IResponse, ISignedGetUrl, ISignedPostUrl, IUpdateQuiz } from "../../interfaces";
import AddFileCard from "../addFileCard/addFileCard";
import AddRounded from "@material-ui/icons/AddRounded";
import DeleteForever from "@material-ui/icons/DeleteForever";
import EmptyListNotification from "../emptyListNotification/emptyListNotification";
import QuizSection from "../quizSection/quizSection";
import InsertLinkRounded from "@material-ui/icons/InsertLinkRounded";
import EditRounded from "@material-ui/icons/EditRounded";

//----------------------------------
//      INTERFACE DEFINITIONS
//----------------------------------

interface IState {
    addingAssignment: boolean,
    addingAssessment: boolean,
    addingQuiz: boolean,
    addingAssignmentLink: boolean,
    editingQuiz: boolean,
    uploading: boolean,
    uploadValue: number,

    quizEditValues: Map<string, string>,
    quizToEditID: number,

    assessments: ICourseAssessment[],
    assignments: ICourseAssignment[],
    quizzes: IQuiz[],
    links: ILink[],

    taskPathForLinks: string,
    linkPathIn: string,
    linkNameIn: string,

    quizBeingViewed: IQuiz,
    viewingQuiz: boolean

}

interface IProps {
    token: string,
    courseID: number,

    refreshCourseOverview(): Promise<void>
}

//---------------------------------------
//      INPUT CONSTS
//---------------------------------------

const ASSIGNMENT_INPUTS = [
    "Marks Available",
    "Due Date"
];

const ASSESSMENT_INPUTS = [
    "Name",
    "Marks Available",
    "Contr. To Total"
];

const QUIZ_INPUTS = [
    "Name",
    "Attempts Allowed",
    "Opening Time",
    "Closing Time",
    "Duration (min)"
];


//----------------------------------
//      CLASS DEFINITION
//----------------------------------

class CourseAssessmentsSection extends Component<IProps, IState> {

    //----------------------------------
    //      CONSTRUCTOR
    //----------------------------------

    constructor(props: IProps) {
        super(props);

        this.state = {
            addingAssignment: false,
            addingAssessment: false,
            addingQuiz: false,
            addingAssignmentLink: false,
            editingQuiz: false,
            uploading: false,
            uploadValue: 0,

            quizEditValues: null,
            quizToEditID: 0,

            assessments: [],
            assignments: [],
            quizzes: [],
            links: [],

            taskPathForLinks: "",
            linkPathIn: "",
            linkNameIn: "",

            quizBeingViewed: null,
            viewingQuiz: false
        }
    }


    //----------------------------------
    //      COMPONENT DID MOUNT
    //----------------------------------
    componentDidMount() {
        this.getAssessments();
        this.getAssignments();
        this.getQuizzesByCourse();
    }


    //--------    TOGGLE ADDING ASSIGNMENT    ------------

    toggleAddAssignment = () => {
        let addingAssignment = this.state.addingAssignment;
        this.setState({ addingAssignment: !addingAssignment });
    }


    //--------    TOGGLE ADDING ASSESSMENT    ------------

    toggleAddAssessment = () => {
        let addingAssessment = this.state.addingAssessment;
        this.setState({ addingAssessment: !addingAssessment });
    }


    //--------    TOGGLE ADDING ASSIGNMENT LINK    ------------

    toggleAddAssignmentLink = (assignmentPath: string) => {
        let addingAssignmentLink = this.state.addingAssignmentLink;
        this.setState({ addingAssignmentLink: !addingAssignmentLink, taskPathForLinks: assignmentPath }, () => {
            if (this.state.addingAssignmentLink) {
                this.getLinksForAssignment();
            }
        });
    }

    //--------    TOGGLE ADDING QUIZ    ------------

    toggleAddQuiz = () => {
        let addingQuiz = this.state.addingQuiz;
        this.setState({ addingQuiz: !addingQuiz });
    }

    //--------    TOGGLE EDITING QUIZ    ------------

    toggleEditingQuiz = () => {
        let editingQuiz = this.state.editingQuiz;
        this.setState({ editingQuiz: !editingQuiz });
    }

    //--------    TOGGLE VIEW QUIZ    ------------

    toggleViewQuiz = () => {
        let viewQuiz = !this.state.viewingQuiz;
        this.setState({ viewingQuiz: viewQuiz });
    }


    //----------    GET COURSE ASSIGNMENTS   ------------

    getAssignments = async () => {
        let data: IGetCourseAssignments = {
            courseID: this.props.courseID
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_ASSIGNMENTS, this.props.token, data);

        if (result.stat !== "ok") {
            this.setState({ assignments: [] });
        } else {
            this.setState({ assignments: result.data });
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
                courseID: this.props.courseID,
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
            this.props.refreshCourseOverview();

            return true;

        } else {
            alert("No file has been chosen");
            return false
        }
    }


    //-------    SAVE FILE     --------------

    saveFile = async (filePath: string, fileName: string) => {

        let urlData: IGetSignedGetUrl = {
            filePath: filePath
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_SIGNED_GET_URL, this.props.token, urlData);

        if (result.stat !== "ok") {
            alert(result.error);
        } else {
            let data: ISignedGetUrl = result.data;
            await Connection.saveFileS3(data.url, fileName);
        }

    }


    //-------    DELETE ASSIGNMENT     --------------

    deleteAssignment = async (filePath: string) => {
        let data: IDeleteCourseAssignment = {
            path: filePath
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.DELETE_COURSE_ASSIGNMENT, this.props.token, data, {});

        console.log(data.path);

        if (result.stat !== "ok") {
            alert(result.error);
            return;
        }

        alert("successfully deleted assignment");
        this.getAssignments();
    }


    //----------    GET COURSE ASSESSMENTS   ------------

    getAssessments = async () => {
        let data: IGetCourseAssessments = {
            courseID: this.props.courseID
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_COURSE_ASSESSMENTS, this.props.token, data);

        if (result.stat !== "ok") {
            this.setState({ assessments: [] });
        } else {
            this.setState({ assessments: result.data });
        }
    }


    //--------    ADD COURSE ASSESSMENT    ------------

    addCourseAssessment = async (inMap: Map<string, string>, file: File): Promise<boolean> => {

        let name = inMap.get(ASSESSMENT_INPUTS[0]);
        let marks = parseInt(inMap.get(ASSESSMENT_INPUTS[1]));
        let contribToTotal = parseInt(inMap.get(ASSESSMENT_INPUTS[2]));

        if (name === "") {
            alert("enter a valid name");
            return false;
        }
        if (!(marks > 0) || !(marks < 101)) {
            alert("enter a valid mark");
            return false;
        }

        if (!(contribToTotal > 0) || !(contribToTotal < 101)) {
            alert("enter a valid contribution");
            return false;
        }


        let data: IAddCourseAssessment = {
            courseID: this.props.courseID,
            assessmentName: name,
            marksAvailable: marks,
            contributionToTotal: contribToTotal
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.ADD_COURSE_ASSESSMENT, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert(result.error);
            this.setState({ uploading: false, uploadValue: 0 });
            return false;
        }

        alert("successfully added assessment");
        this.getAssessments();
        this.toggleAddAssessment();
    }


    //-------    DELETE ASSESSMENT     --------------

    deleteAssessment = async (assessmentID: number) => {
        let data: IDeleteCourseAssessment = {
            assessmentID: assessmentID
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.DELETE_COURSE_ASSESSMENT, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert(result.error);
            return;
        }

        alert("successfully deleted assessment");
        this.getAssessments();
    }

    //--------    GET QUIZZES BY COURSE    ------------

    getQuizzesByCourse = async () => {
        let data: IGetQuizzesByCourse = {
            courseID: this.props.courseID
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_QUIZZES_BY_COURSE, this.props.token, data);

        if (result.stat !== "ok") {
            this.setState({ quizzes: [] });
        } else {
            this.setState({ quizzes: result.data });
        }
    }

    //--------    ADD QUIZ    ------------

    addQuiz = async (inMap: Map<string, string>, file: File): Promise<boolean> => {

        let name = inMap.get(QUIZ_INPUTS[0]);
        let numOfAttempts = parseInt(inMap.get(QUIZ_INPUTS[1]));
        let openingTime = inMap.get(QUIZ_INPUTS[2]);
        let closingTime = inMap.get(QUIZ_INPUTS[3]);
        let duration = parseInt(inMap.get(QUIZ_INPUTS[4]));

        if (name === "" || undefined) {
            alert("enter a name");
            return false;
        }
        if (numOfAttempts < 1) {
            alert("number of attempts should be atleast 1");
            return false;
        }
        if (openingTime === "" || undefined) {
            alert("enter an opening time");
            return false;
        }
        if (closingTime === "" || undefined) {
            alert("enter an closing time");
            return false;
        }
        if (duration < 5) {
            alert("duration should be atleast 5min");
            return false;
        }

        let data: IAddQuiz = {
            courseID: this.props.courseID,
            name: name,
            duration: duration,
            openTime: openingTime,
            closeTime: closingTime,
            attemptsAllowed: numOfAttempts
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.ADD_QUIZ, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert("Failed to add quiz, try again later." + result.error);
            return false
        }

        alert("Successfully added quiz");
        this.getQuizzesByCourse();
        return true;
    }

    //--------    EDIT QUIZ    ------------

    editQuiz = async (inMap: Map<string, string>, file: File): Promise<boolean> => {

        let name = inMap.get(QUIZ_INPUTS[0]);
        let numOfAttempts = parseInt(inMap.get(QUIZ_INPUTS[1]));
        let openingTime = inMap.get(QUIZ_INPUTS[2]);
        let closingTime = inMap.get(QUIZ_INPUTS[3]);
        let duration = parseInt(inMap.get(QUIZ_INPUTS[4]));

        if (name === "" || undefined) {
            alert("enter a name");
            return false;
        }
        if (numOfAttempts < 1) {
            alert("number of attempts should be atleast 1");
            return false;
        }
        if (openingTime === "" || undefined) {
            alert("enter an opening time");
            return false;
        }
        if (closingTime === "" || undefined) {
            alert("enter an closing time");
            return false;
        }
        if (duration < 5) {
            alert("duration should be atleast 5min");
            return false;
        }

        let data: IUpdateQuiz = {
            quizID: this.state.quizToEditID,
            name: name,
            duration: duration,
            openTime: openingTime,
            closeTime: closingTime,
            attemptsAllowed: numOfAttempts
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.UPDATE_QUIZ, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert("Failed to update quiz: " + result.error);
            return false
        }

        alert("Successfully updated quiz");
        this.getQuizzesByCourse();
        return true;
    }

    //--------    DELETE QUIZ    ------------

    deleteQuiz = async (quizID: number) => {

        let data: IDeleteQuiz = {
            quizID: quizID
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.DELETE_QUIZ, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert("Failed to delete quiz, try again later." + result.error);
            return;
        }

        alert("Successfully deleted quiz");
        this.getQuizzesByCourse();
    }


    //----------------------------------
    //      ADD LINK
    //----------------------------------
    addLink = async () => {

        if (this.state.linkPathIn === "") {
            alert("enter a link");
            return;
        }
        if (this.state.linkNameIn === "") {
            alert("enter a name for the link");
            return;
        }

        let data: IAddLink = {
            linkPath: this.state.linkPathIn,
            linkName: this.state.linkNameIn,
            linkType: 3,
            linkTopicID: 0,
            linkAssignmentPath: this.state.taskPathForLinks
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.ADD_LINK, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert("failed to add link: " + result.error);
            return;
        }

        this.getLinksForAssignment();
        this.setState({ linkNameIn: "", linkPathIn: "" });
        alert("successfully added link");
        return;
    }


    //--------    DELETE LINK    ------------

    deleteLink = async (linkPath: string) => {

        let data: IDeleteAssignmentLink = {
            linkPath: linkPath,
            assignmentPath: this.state.taskPathForLinks
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.DELETE_ASSIGNMENT_LINK, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert("Failed to delete link: " + result.error);
            return;
        }

        alert("Successfully deleted link");
        this.getLinksForAssignment();
    }


    //--------    GET LINKS FOR ASSIGNMENT    ------------

    getLinksForAssignment = async () => {
        let data: IGetLinksForAssignments = {
            assignmentPath: this.state.taskPathForLinks
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_COURSE_ASSIGNMENT_LINKS, this.props.token, data);

        if (result.stat !== "ok") {
            this.setState({ links: [] });
        } else {
            this.setState({ links: result.data });
        }
    }



    //----------------------------------
    //      OPEN LINK
    //----------------------------------

    openLink = (url: string) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }



    //----------------------------------
    //      RENDER METHOD
    //----------------------------------

    render() {
        return (
            <div id="course-assessments-container" className="center">
                {
                    //----   VIEW TASK LINKS   ----

                    this.state.addingAssignmentLink &&
                    <div id="add-file-card-overlay">
                        <div id="add-file-card-container" className="flex-column">

                            <h2>Links</h2>

                            {
                                this.state.links.map(link => {
                                    return (
                                        <div className="center title-col assignment-link-container">
                                            <p onClick={() => this.openLink(link.Link_Path)}>{link.Link_Name}</p>
                                            <DeleteForever id="task-table-delete-button" style={{ transform: "scale(1.3)" }} onClick={() => this.deleteLink(link.Link_Path)} className="center" />
                                        </div>
                                    )
                                })
                            }
                            {
                                this.state.links.length === 0 &&
                                <EmptyListNotification message={"No links found"} />
                            }

                            <h2>Add Link</h2>

                            <div className="form-col add-file-card-str-input">
                                <h4>Link:</h4>
                                <input type="text" value={this.state.linkPathIn} onChange={ev => {
                                    this.setState({ linkPathIn: ev.target.value })
                                }} />
                            </div>

                            <div className="form-col add-file-card-str-input">
                                <h4>Link Name:</h4>
                                <input type="text" value={this.state.linkNameIn} onChange={ev => {
                                    this.setState({ linkNameIn: ev.target.value })
                                }} />
                            </div>

                            {
                                //----   BUTTONS   ----

                                <div id="add-file-card-buttons-container">

                                    <div className="flex-row add-file-card-button" onClick={this.addLink}>
                                        <h3 className="center">Submit</h3>
                                    </div>
                                    <div className="flex-row add-file-card-button" onClick={() => this.toggleAddAssignmentLink("")}>
                                        <h3 className="center">Close</h3>
                                    </div>

                                </div>
                            }
                        </div>
                    </div>

                }

                {
                    //----------------------------------
                    //      ASSESSMENTS TABLE
                    //----------------------------------
                    <div className="table-container center">

                        <div className="table-title flex-row center">
                            <h2>Assessments</h2>
                            <AddRounded className="table-title-add-button" style={{ transform: "scale(1.3)" }} onClick={this.toggleAddAssessment} />
                        </div>

                        <div className="table-header center task-table">
                            <h4 className="center">Name</h4>
                            <h4 className="center">Marks Available</h4>
                            <h4 className="center">Contr. To Total</h4>
                        </div>

                        {
                            //----   LIST ASSESSMENTS   ----
                            this.state.assessments.map(assessment => {
                                return (
                                    <div className="task-table-content center task-table">
                                        <p className="center">{assessment.Course_Assessment_Name}</p>
                                        <p className="center">{assessment.Course_Assessment_Marks_Available}</p>
                                        <p className="center">{assessment.Course_Assessment_Contribution}%</p>
                                        <DeleteForever id="task-table-delete-button" style={{ transform: "scale(1.3)" }} onClick={() => { this.deleteAssessment(assessment.Course_Assessment_ID) }} className="center" />
                                    </div>
                                )
                            })

                        }

                        {
                            this.state.assessments.length === 0 &&
                            <EmptyListNotification message={"no assessments available"} />
                        }
                    </div>
                }
                {
                    //----------------------------------
                    //      TASKS TABLE
                    //----------------------------------
                    <div className="table-container center">

                        <div className="table-title flex-row center">
                            <h2>Tasks</h2>
                            <AddRounded className="table-title-add-button" style={{ transform: "scale(1.3)" }} onClick={this.toggleAddAssignment} />
                        </div>

                        <div className="table-header center task-table">
                            <h4 className="center">Name</h4>
                            <h4 className="center">Marks Available</h4>
                            <h4 className="center">Due Date</h4>
                        </div>

                        {
                            //----   LIST TASKS   ----
                            this.state.assignments.map(assignment => {
                                return (
                                    <div className="task-table-content center task-table">
                                        <p className="task-name center" onClick={() => this.saveFile(assignment.Course_Assignment_Path, assignment.Course_Assignment_Name)}>{assignment.Course_Assignment_Name}</p>
                                        <p className="center">{assignment.Course_Assignment_Marks_Available}</p>
                                        <p className="center">{assignment.Course_Assignment_Due_Date.toString().slice(0, 10)}</p>
                                        <DeleteForever id="task-table-delete-button" style={{ transform: "scale(1.3)" }} onClick={() => this.deleteAssignment(assignment.Course_Assignment_Path)} className="center" />
                                        <InsertLinkRounded className="table-title-add-button" style={{ transform: "scale(1.3)" }} onClick={() => this.toggleAddAssignmentLink(assignment.Course_Assignment_Path)} />
                                    </div>
                                )
                            })

                        }
                        {
                            this.state.assignments.length === 0 &&
                            <EmptyListNotification message={"no tasks available"} />
                        }
                    </div>
                }

                {
                    //----------------------------------
                    //      QUIZZES TABLE
                    //----------------------------------

                    <div className="table-container center">

                        <div className="table-title flex-row center">
                            <h2>Quizzes</h2>
                            <AddRounded className="table-title-add-button" style={{ transform: "scale(1.3)" }} onClick={this.toggleAddQuiz} />
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
                                            this.toggleViewQuiz();
                                            this.setState({ quizBeingViewed: quiz });
                                        }}>{quiz.Quiz_Name}</p>
                                        <p className="quiz-time center">{quiz.Quiz_Opening_Time.slice(0, 10)} <b>{quiz.Quiz_Opening_Time.slice(11, 16)}</b></p>
                                        <p className="quiz-time center">{quiz.Quiz_Closing_Time.slice(0, 10)} <b>{quiz.Quiz_Closing_Time.slice(11, 16)}</b></p>
                                        <p className="center">{quiz.Quiz_Duration}</p>
                                        <p className="center">{quiz.Quiz_Marks_Available}</p>

                                        <EditRounded className="center edit-button quiz-buttons" onClick={() => {
                                            let oTime = quiz.Quiz_Opening_Time;
                                            oTime = oTime.substring(0, 10) + "T" + oTime.substring(11, 16);
                                            let cTime = quiz.Quiz_Closing_Time;
                                            cTime = cTime.substring(0, 10) + "T" + cTime.substring(11, 16);
                                            console.log(oTime, " : ", cTime);

                                            let data = new Map([
                                                [QUIZ_INPUTS[0], quiz.Quiz_Name],
                                                [QUIZ_INPUTS[1], quiz.Quiz_Attempts_Allowed.toString()],
                                                [QUIZ_INPUTS[2], oTime],
                                                [QUIZ_INPUTS[3], cTime],
                                                [QUIZ_INPUTS[4], quiz.Quiz_Duration.toString()]
                                            ]);

                                            console.log(data);

                                            this.setState({ quizEditValues: data, quizToEditID: quiz.Quiz_ID }, () => this.toggleEditingQuiz());
                                        }} />
                                        <DeleteForever id="task-table-delete-button" onClick={() => this.deleteQuiz(quiz.Quiz_ID)} className="center quiz-buttons" />
                                    </div>
                                )
                            })

                        }
                        {
                            this.state.quizzes.length === 0 &&
                            <EmptyListNotification message={"no quizzes available"} />
                        }

                    </div>
                }

                {
                    //----    VIEW QUIZ    ----

                    this.state.viewingQuiz &&
                    <QuizSection token={this.props.token} quiz={this.state.quizBeingViewed} toggleViewingQuiz={this.toggleViewQuiz} />
                }

                {
                    //----    ADD COURSE ASSIGNMENTS    ----

                    this.state.addingAssignment &&
                    <AddFileCard checkboxInputs={[]} addFile={true} title={"Add Assignment"} cancel={this.toggleAddAssignment} submit={this.addCourseAssignment} uploading={this.state.uploading} numberInputs={[ASSIGNMENT_INPUTS[0]]} stringInputs={[]} calendarInputs={[ASSIGNMENT_INPUTS[1]]} uploadProgress={this.state.uploadValue} />
                }

                {
                    //----    ADD COURSE ASSESSMENTS    ----

                    this.state.addingAssessment &&
                    <AddFileCard checkboxInputs={[]} addFile={false} title={"Add Assessment"} cancel={this.toggleAddAssessment} submit={this.addCourseAssessment} uploading={this.state.uploading} numberInputs={[ASSESSMENT_INPUTS[1], ASSESSMENT_INPUTS[2]]} stringInputs={[ASSESSMENT_INPUTS[0]]} calendarInputs={[]} uploadProgress={this.state.uploadValue} />
                }

                {
                    //----    ADD QUIZ    ----

                    this.state.addingQuiz &&
                    <AddFileCard checkboxInputs={[]} addFile={false} title={"Add Quiz"} cancel={this.toggleAddQuiz} submit={this.addQuiz} uploading={false} numberInputs={[QUIZ_INPUTS[1], QUIZ_INPUTS[4]]} stringInputs={[QUIZ_INPUTS[0]]} calendarInputs={[]} datetimeInputs={[QUIZ_INPUTS[2], QUIZ_INPUTS[3]]} uploadProgress={0} />
                }

                {
                    //----    EDIT QUIZ    ----

                    this.state.editingQuiz &&
                    <AddFileCard checkboxInputs={[]} addFile={false} title={"Edit Quiz"} cancel={this.toggleEditingQuiz} submit={this.editQuiz} uploading={false} numberInputs={[QUIZ_INPUTS[1], QUIZ_INPUTS[4]]} stringInputs={[QUIZ_INPUTS[0]]} calendarInputs={[]} datetimeInputs={[QUIZ_INPUTS[2], QUIZ_INPUTS[3]]} uploadProgress={0} defaultValues={this.state.quizEditValues} />
                }



            </div >
        );
    }
}

export default CourseAssessmentsSection;
