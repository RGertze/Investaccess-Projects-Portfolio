
//-----------------------------------------
//        REACT IMPORT
//-----------------------------------------

import { AxiosRequestConfig } from "axios";
import React, { Component } from "react";

//-----------------------------------------
//        COMPONENT IMPORT
//-----------------------------------------
import Connection, { GET_TYPE, POST_TYPE } from "../connection";
import ProgressBar from "./progressBar";
import AddRounded from "@material-ui/icons/AddRounded";
import AddFileCard from "../../../staff-front-end/src/components/addFileCard/addFileCard";

//-----------------------------------------
//        INTERFACE IMPORTS
//-----------------------------------------

import { IAddStudentAssignment, IAssignmentPath, ICourseAssignment, IDeleteStudentAssignment, IGetAssignmentPath, IGetLinksForAssignments, IGetSignedGetUrl, IGetSignedPostUrl, IGetStudentAssignmentPaths, ILink, IResponse, ISignedGetUrl, ISignedPostUrl, IStudentAssignmentPaths, IUpdateStudentAssignment } from "../interfaces";
import EmptyListNotification from "../../../staff-front-end/src/components/emptyListNotification/emptyListNotification";


//-----------------------------------------
//        INTERFACE DEFINITIONS
//-----------------------------------------

interface IState {
    file: File,
    toggled: boolean,

    addingFile: boolean,

    links: ILink[],

    uploading: boolean,
    uploadProgress: number,

    uploadedAssignments: IStudentAssignmentPaths[]
}

interface IProps {
    token: string,
    username: string,

    courseID: string,
    assignment: ICourseAssignment
}

//-----------------------------------------
//-----------------------------------------



//-----------------------------------------
//        CLASS DEFINITION
//-----------------------------------------

class CourseAssignmentCard extends Component<IProps, IState> {

    //-------    CONSTRUCTOR     --------------

    constructor(props: IProps) {
        super(props);

        this.state = {
            file: null,
            toggled: false,

            addingFile: false,

            links: [],

            uploading: false,
            uploadProgress: 0,

            uploadedAssignments: []
        }
    }


    //-------    COMP DID MOUNT     --------------

    componentDidMount() {
        this.getLinksForAssignment();
    }


    //-------    HANDLE FILE INPUT     --------------

    handleInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ file: ev.target.files[0] });
    }


    //-------    HANDLE UPLOADED TOGGLE     --------------

    toggleUploadedDropdown = async () => {
        if (!this.state.toggled) {
            this.getAssignments();
            this.setState({ toggled: true });
        } else {
            this.setState({ toggled: false });
        }
    }


    //-------    GET ASSIGNMENTS     --------------

    getAssignments = async () => {
        let data: IGetStudentAssignmentPaths = {
            username: this.props.username,
            assignmentPath: this.props.assignment.Course_Assignment_Path
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_STUDENT_ASSIGNMENT_PATHS, this.props.token, data);

        if (result.stat === "ok") {
            this.setState({ uploadedAssignments: result.data });
        } else {
            this.setState({ uploadedAssignments: [] });
        }
    }


    //-------    TOGGLE ADD FILE     --------------

    toggleAddFile = async () => {
        let addingFile = this.state.addingFile;
        this.setState({ addingFile: !addingFile });
    }


    //-------    STUDENT ASSIGNMENT FILE UPLOAD     --------------

    uploadStudentAssignment = async (inputMap: Map<string, string>, file: File): Promise<boolean> => {
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

            let data: IAddStudentAssignment = {
                studentID: parseInt(this.props.username),
                courseAssignmentPath: this.props.assignment.Course_Assignment_Path,
                assignmentPath: urlData.filePath,
                assignmentName: file.name,
                mark: 0
            }

            //--        SEND FILE DATA TO SERVER      --

            result = await Connection.postReq(POST_TYPE.ADD_STUDENT_ASSIGNMENT, this.props.token, data, config);

            if (result.stat !== "ok") {
                alert("failed to upload file");
                this.setState({ uploading: false, uploadProgress: 0 });
                return false;
            }
            alert("file successfully uploaded");

            this.setState({ uploading: false, uploadProgress: 0 });
            this.getAssignments();
            return true;

        } else {
            alert("no files chosen");
            return false;
        }
    }


    //-------    SAVE STUDENT UPLOADED FILE     --------------

    saveStudentFile = async (filePath: string, fileName: string) => {
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


    //-------    DELETE STUDENT UPLOADED FILE     --------------

    deleteStudentFile = async (filePath: string) => {
        let data: IDeleteStudentAssignment = {
            path: filePath
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.DELETE_STUDENT_ASSIGNMENT, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert(result.error);
            return;
        }
        alert("file successfully deleted");

        this.setState({ toggled: false }, () => this.toggleUploadedDropdown());     //----   RESET UPLOADED ASSIGNMENTS
    }

    //-------    SAVE ASSIGNMENT     --------------

    saveAssignment = async () => {

        let urlData: IGetSignedGetUrl = {
            filePath: this.props.assignment.Course_Assignment_Path
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_SIGNED_GET_URL, this.props.token, urlData);

        if (result.stat !== "ok") {
            alert(result.error);
        } else {
            let data: ISignedGetUrl = result.data;
            await Connection.saveFileS3(data.url, this.props.assignment.Course_Assignment_Name);
        }

    }


    //--------    GET LINKS FOR ASSIGNMENT    ------------

    getLinksForAssignment = async () => {
        let data: IGetLinksForAssignments = {
            assignmentPath: this.props.assignment.Course_Assignment_Path
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



    //-------    RENDER METHOD     --------------

    render() {
        return (
            <div id="course-assignment-card-container">

                <div id="course-assignment-card-title">
                    <h2 id="course-assignment-card-download" onClick={() => { this.saveAssignment() }}>{this.props.assignment.Course_Assignment_Name}</h2>
                </div>

                <h3 id="course-assignment-due-date">Due: {this.props.assignment.Course_Assignment_Due_Date.toString().slice(0, 10)}</h3>
                <h3>Marks available: {this.props.assignment.Course_Assignment_Marks_Available}</h3>

                <div id="course-assignment-links-container" className="center">
                    <h3>Links:</h3>
                    {
                        this.state.links.map(link => {
                            return (
                                <p className="center" onClick={() => this.openLink(link.Link_Path)}>{link.Link_Name}</p>
                            )
                        })
                    }
                    {
                        this.state.links.length === 0 &&
                        <EmptyListNotification message={"No links found"} />
                    }
                </div>

                <div id="course-assignment-card-uploaded">

                    <div id="course-assignment-card-uploaded-title" className="flex-row">
                        <h3 onClick={this.toggleUploadedDropdown}>Uploaded Files {this.state.toggled ? "\u25B2" : "\u25BC"} </h3>

                        <div id="course-assignment-add-button" onClick={this.toggleAddFile}>
                            <AddRounded style={{ transform: "scale(1.6)" }} />
                        </div>
                    </div>

                    {
                        //---------   ADD FILE   -----------

                        this.state.addingFile &&
                        <AddFileCard checkboxInputs={[]} addFile={true} title={"Submit assignment"} uploadProgress={this.state.uploadProgress} uploading={this.state.uploading} cancel={this.toggleAddFile} submit={this.uploadStudentAssignment} numberInputs={[]} stringInputs={[]} calendarInputs={[]} />
                    }

                    {

                        //---------   STUDENT UPLOADED FILES   -----------

                        this.state.toggled &&
                        this.state.uploadedAssignments.map((assignment) => {
                            return (
                                <div id="course-assignment-card-uploaded-values-container">
                                    <h4 id="course-assignment-card-uploaded-path" onClick={() => this.saveStudentFile(assignment.Student_Assignment_File_Path, assignment.Student_Assignment_File_Name)}> {assignment.Student_Assignment_File_Name}</h4>
                                    <div id="course-assignment-card-uploaded-delete" onClick={() => this.deleteStudentFile(assignment.Student_Assignment_File_Path)}><h4>delete</h4></div>
                                </div>
                            );
                        })

                    }

                    {

                        //---------   NO FILES NOTIFICATION   -----------

                        (this.state.toggled && this.state.uploadedAssignments.length === 0) &&
                        <EmptyListNotification message={"No files uploaded"} />
                    }

                </div>
            </div >
        );
    }
}

export default CourseAssignmentCard;
