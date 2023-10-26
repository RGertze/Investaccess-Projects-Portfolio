
//##################################
//      REACT IMPORTS
//##################################

import React, { Component, Fragment } from "react";

//##################################
//      COMPONENT IMPORTS
//##################################

import ProgressBar from "./progressBar";
import ReportCard from "./reportCard";

//##################################
//      PDF IMPORTS (ASYNC)
//##################################
const { pdf } = await import("@react-pdf/renderer");
const ReportDocument = (await import("./reportDocument")).default;


//##################################
//      INTERFACE IMPORTS
//##################################

import { IAddStudentReport, IGetCourseMarks, IGetSignedPostUrl, IGetStudentReports, IResponse, ISignedPostUrl, IStudentAll, IStudentReportCard } from "../interfaces";
import Connection, { GET_TYPE, POST_TYPE } from "../connection";
import { AxiosRequestConfig } from "axios";


//##################################
//      ENUM DEFINITIONS
//##################################

enum INPUT {
    TERM,
    YEAR
}


//##################################
//      INTERFACE DEFINITIONS
//##################################

interface IState {
    toggled: boolean,

    // ADD REPORT INPUTS
    file: File,
    term: number,
    year: number,
    uploading: boolean,
    uploadProgress: number,

    // STUDENT REPORTS
    reports: IStudentReportCard[]
}

interface IProps {
    token: string,
    student: IStudentAll
}


//##################################
//      CLASS DEFINITION
//##################################

class StudentReportCard extends Component<IProps, IState> {

    //##################################
    //      CONSTRUCTOR
    //##################################

    constructor(props: IProps) {
        super(props);

        this.state = {
            toggled: false,

            // ADD REPORT INPUTS
            file: null,
            term: 0,
            year: 0,
            uploading: false,
            uploadProgress: 0,

            // STUDENT REPORTS
            reports: []
        }
    }


    //##################################
    //      TOGGLE
    //##################################

    handleToggle = async () => {
        if (!this.state.toggled) {
            this.setState({ toggled: true })
            this.getReports();
        } else {
            this.setState({ toggled: false })
        }
    }


    //##################################
    //      INPUT HANDLER
    //##################################

    handleInput = (inType: INPUT, ev: React.ChangeEvent<HTMLInputElement>) => {
        switch (inType) {
            case INPUT.TERM:
                let term = parseInt(ev.target.value);
                if (term > 0) {
                    this.setState({ term: term });
                } else {
                    this.setState({ term: 0 });
                }
                break;
            case INPUT.YEAR:
                let year = parseInt(ev.target.value);
                if (year > 0) {
                    this.setState({ year: year });
                } else {
                    this.setState({ year: 0 });
                }
                break;
            default:
                return;
        }
    }


    //##################################
    //      GET STUDENT REPORTS
    //##################################

    getReports = async () => {
        let data: IGetStudentReports = {
            studentID: this.props.student.Student_ID
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_STUDENT_REPORTS, this.props.token, data);

        if (result.stat === "ok") {
            this.setState({ reports: result.data });
            return;
        }

        this.setState({ reports: [] });
    }


    //##################################
    //      GENERATE REPORT
    //##################################

    generateReport = async () => {
        if (this.state.year < 0 || this.state.year > 2099) {
            alert("invalid year entered!");
            return;
        }
        if (this.state.term < 0 || this.state.term > 4) {
            alert("invalid term entered!");
            return;
        }

        //##################################
        //      GET MARKS
        //##################################

        let data: IGetCourseMarks = { username: this.props.student.Student_ID.toString() }
        let result: IResponse = await Connection.getReq(GET_TYPE.GET_COURSE_MARKS, this.props.token, data);
        if (result.stat !== "ok") {
            alert("Failed to generate report: " + result.error);
            return;
        }

        //##################################
        //      CREATE PDF AND GET BLOB
        //##################################

        const blob = await pdf(ReportDocument({ term: this.state.term, year: this.state.year, student: this.props.student, courseMarks: result.data })).toBlob();

        //##################################
        //      CREATE FILE FROM BLOB 
        //##################################

        let file: File = new File([blob], `${this.state.year}_${this.state.term}_${this.props.student.Student_First_Name}_${this.props.student.Student_Surname_Name}`);

        //##################################
        //      SET STATE FILE AND UPLOAD 
        //##################################

        this.setState({ file: file }, () => {
            this.addReportCard();
        });
    }

    //##################################
    //##################################


    //##################################
    //      ADD REPORT CARD
    //##################################

    addReportCard = async () => {
        if (this.state.year < 0 || this.state.year > 2099) {
            alert("invalid date entered!");
            return;
        }

        if (this.state.term < 0 || this.state.term > 4) {
            alert("invalid term entered!");
            return;
        }

        if (!this.state.file) {
            alert("no file chosen!");
            return;
        }

        this.setState({ uploading: true });

        //######   GET SIGNED POST URL   ######
        let getUrlData: IGetSignedPostUrl = {
            originalFileName: this.state.file.name
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_SIGNED_POST_URL, this.props.token, getUrlData);

        if (result.stat !== "ok") {
            alert("failed to upload report");
            this.setState({ uploading: false });
            return;
        }

        let signedUrl: ISignedPostUrl = result.data;
        //#######################################


        //######   UPLOAD FILE TO S3   ######
        let config: AxiosRequestConfig = {      //  -->  TRACKS UPLOAD PROGRESS
            onUploadProgress: (progressEvent) => {
                const { loaded, total } = progressEvent;
                let progress = Math.floor(loaded / total * 100);
                this.setState({ uploadProgress: progress });
            }
        }

        let uploadStatus = await Connection.uploadFile(signedUrl.url, this.state.file, config);

        if (uploadStatus !== 200) {
            alert("failed to upload report");
            this.setState({ uploading: false, uploadProgress: 0 });
            return;
        }
        //#######################################


        //######   SEND FILE DATA TO SERVER   ######
        let data: IAddStudentReport = {
            reportPath: signedUrl.filePath,
            studentID: this.props.student.Student_ID,
            reportName: this.state.file.name,
            term: this.state.term,
            year: this.state.year
        }

        result = await Connection.postReq(POST_TYPE.ADD_STUDENT_REPORT, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert("failed to upload report");
            this.setState({ uploading: false, uploadProgress: 0 });
            return;
        }
        //#######################################

        alert("report successfully uploaded");
        this.setState({ uploading: false, uploadProgress: 0, file: null, year: 0, term: 0 });
        this.getReports();
    }

    //##################################
    //##################################


    //##################################
    //      RENDER METHOD
    //##################################

    render() {
        return (
            <div id="student-report-card-container">
                <div id="student-report-card-title" onClick={this.handleToggle}><h3>Reports {this.state.toggled ? "\u25B2" : "\u25BC"}</h3></div>

                {
                    this.state.toggled &&
                    <Fragment>

                        <div id="student-report-card-add-container">

                            <h3>Upload Report card</h3>

                            <div className="student-report-card-add-input">
                                <p>Term</p>
                                <input value={this.state.term.toString()} type="number" style={{ width: "40%" }} onChange={(ev) => this.handleInput(INPUT.TERM, ev)} />
                            </div>

                            <div className="student-report-card-add-input">
                                <p>Year</p>
                                <input value={this.state.year.toString()} type="number" style={{ width: "40%" }} onChange={(ev) => this.handleInput(INPUT.YEAR, ev)} />
                            </div>

                            <div id="student-report-card-generate-button" onClick={this.generateReport}>
                                <h4>Generate & Upload</h4>
                            </div>

                            {
                                this.state.uploading &&
                                <ProgressBar now={this.state.uploadProgress} />
                            }
                        </div>

                        <div id="report-card-header">
                            <h4 style={{ gridColumn: 1 }}>File Name</h4>
                            <h4 style={{ gridColumn: 2 }}>Term</h4>
                            <h4 style={{ gridColumn: 3 }}>Year</h4>
                        </div>

                        {
                            //####     DISPLAY REPORTS    ####
                            this.state.reports.map((report) => {
                                return (
                                    <ReportCard key={report.Student_Report_Path} token={this.props.token} report={report} />
                                );
                            })
                        }

                        {
                            //####     DISPLAY ERROR MESSAGE    ####
                            this.state.reports.length === 0 &&
                            <h3 style={{ color: "white", textAlign: "center" }}>No reports found!</h3>
                        }
                    </Fragment>
                }

            </div>
        );
    }
}

export default StudentReportCard;
