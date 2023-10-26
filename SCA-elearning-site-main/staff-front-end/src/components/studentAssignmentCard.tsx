
//---------------------------------------
//      REACT IMPORTS
//---------------------------------------

import EditRounded from "@material-ui/icons/EditRounded";
import React, { Component } from "react";

//---------------------------------------
//      CONNECTION IMPORTS
//---------------------------------------

import Connection, { GET_TYPE, POST_TYPE } from "../connection";

//---------------------------------------
//      INTERFACE/ENUM IMPORTS
//---------------------------------------

import { IAssignmentMark, ICourseAssignment, IGetAssignmentMark, IGetSignedGetUrl, IGetStudentAssignmentPaths, IResponse, ISignedGetUrl, IStudentAssignmentPaths, IStudentsInCourse, IUpdateStudentAssignmentMark } from "../interfaces";
import AddFileCard from "./addFileCard/addFileCard";
import EmptyListNotification from "./emptyListNotification/emptyListNotification";


//---------------------------------------
//      INTERFACE DEFINITIONS
//---------------------------------------

interface IState {
    toggled: boolean,
    updatingMark: boolean,

    uploadedFiles: IStudentAssignmentPaths[],

    mark: string
}

interface IProps {
    token: string,

    student: IStudentsInCourse,
    assignment: ICourseAssignment
}

//---------------------------------------
//---------------------------------------


//---------------------------------------
//      INPUT CONSTS
//---------------------------------------

const UPDATE_MARK_INPUT = [
    "New mark"
];


//---------------------------------------
//      CLASS DEFINITION
//---------------------------------------

class StudentAssignmentCard extends Component<IProps, IState> {

    //---------------------------------------
    //      CONSTRUCTOR
    //---------------------------------------

    constructor(props: IProps) {
        super(props);

        this.state = {
            toggled: false,
            updatingMark: false,
            uploadedFiles: [],
            mark: "0.00"
        }
    }

    //---------------------------------------
    //      COMPONENT DID MOUNT
    //---------------------------------------

    componentDidMount() {
        this.getMark();
    }


    //---------------------------------------
    //      TOGGLE HANDLING
    //---------------------------------------

    handleToggle = async () => {
        if (!this.state.toggled) {

            await this.getStudentFiles();
            this.setState({ toggled: true });

            return;
        }
        this.setState({ toggled: false });
    }


    //---------------------------------------
    //      TOGGLE UPDATE MARK
    //---------------------------------------

    toggleUpdatingMark = () => {
        let updatingMark = !this.state.updatingMark;
        this.setState({ updatingMark: updatingMark });
    }


    //---------------------------------------
    //      GET MARK
    //---------------------------------------

    getMark = async () => {
        let data: IGetAssignmentMark = {
            username: this.props.student.Student_ID.toString(),
            assignmentPath: this.props.assignment.Course_Assignment_Path
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_ASSIGNMENT_MARK, this.props.token, data);

        if (result.stat !== "ok") {
            return;
        }

        let mark: IAssignmentMark = result.data;

        this.setState({ mark: mark.Assignment_Mark.toString() });
    }


    //---------------------------------------
    //      UPDATE MARK
    //---------------------------------------

    updateMark = async (inMap: Map<string, string>, file: File): Promise<boolean> => {

        let mark = parseInt(inMap.get(UPDATE_MARK_INPUT[0]));

        if (mark > 0 && mark < 101) {

            let data: IUpdateStudentAssignmentMark = {
                username: this.props.student.Student_ID.toString(),
                courseAssignmentPath: this.props.assignment.Course_Assignment_Path,
                mark: mark
            }

            let result: IResponse = await Connection.postReq(POST_TYPE.UPDATE_ASSIGNMENT_MARK, this.props.token, data, {});

            if (result.stat !== "ok") {
                alert(result.error);
                return false;
            }

            this.getMark();
            alert("Successfully updated mark");
            return true;
        } else {
            alert("No mark was entered");
            return false;
        }
    }


    //---------------------------------------
    //      SAVE FILE
    //---------------------------------------

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

    //---------------------------------------
    //      GET STUDENT UPLOADED FILES
    //---------------------------------------

    getStudentFiles = async () => {
        let data: IGetStudentAssignmentPaths = {
            username: this.props.student.Student_ID.toString(),
            assignmentPath: this.props.assignment.Course_Assignment_Path
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_STUDENT_ASSIGNMENT_PATHS, this.props.token, data);

        if (result.stat !== "ok") {
            this.setState({ uploadedFiles: [] });
            return;
        }

        this.setState({ uploadedFiles: result.data });
    }


    //---------------------------------------
    //      RENDER METHOD
    //---------------------------------------

    render() {
        return (
            <div id="student-assignment-card-container">

                {
                    this.state.updatingMark &&
                    <AddFileCard checkboxInputs={[]} uploading={false} title={"Update Assessment Mark"} cancel={this.toggleUpdatingMark} submit={this.updateMark} addFile={false} uploadProgress={0} numberInputs={[UPDATE_MARK_INPUT[0]]} stringInputs={[]} calendarInputs={[]} />
                }

                <div id="student-assignment-card-header">
                    <div id="student-assignment-card-toggle" onClick={this.handleToggle} className="flex-row">
                        <p className="student-assignment-card-header-values">{this.props.assignment.Course_Assignment_Name}</p>
                    </div>
                    <p className="student-assignment-card-header-values">{this.state.mark}</p>

                    <EditRounded className="center edit-button" onClick={this.toggleUpdatingMark} />

                </div>
                {
                    this.state.toggled &&
                    <div id="student-card-assignments-container">
                        {
                            this.state.uploadedFiles.map((file) => {
                                return (
                                    <h3 key={file.Student_Assignment_File_Path} className="student-card-assignments-uploaded" onClick={() => { this.saveFile(file.Student_Assignment_File_Path, file.Student_Assignment_File_Name) }}>{file.Student_Assignment_File_Name}</h3>
                                );
                            })
                        }
                    </div>
                }

                {
                    (this.state.toggled && this.state.uploadedFiles.length === 0) &&
                    <EmptyListNotification message={"Student has made no submissions"} />
                }
            </div>
        );
    }
}

export default StudentAssignmentCard;
