
//-----------------------------------------
//        REACT IMPORTS
//-----------------------------------------

import React, { Component } from "react";

//-----------------------------------------
//        CSS IMPORTS
//-----------------------------------------

import "./termsAndConditions.css";

//-----------------------------------------
//        COMPONENT IMPORTS
//-----------------------------------------

import AddRounded from "@material-ui/icons/AddRounded";
import AddCard from "../addCard/addFileCard";

//-----------------------------------------
//        INTERFACE IMPORTS
//-----------------------------------------

import { IGetAllFiles, IGetSignedPostUrl, IResponse, ISignedPostUrl, IGetSignedGetUrl, ISignedGetUrl, ITermsAndConditionsFile, IAddTermsAndConditionsFile, IDeleteFile } from "../../interfaces";
import Connection, { GET_TYPE, POST_TYPE } from "../../connection";
import DeleteForever from "@material-ui/icons/DeleteForever";
import { AxiosRequestConfig } from "axios";
import EmptyListNotification from "../../../../staff-front-end/src/components/emptyListNotification/emptyListNotification";


//-----------------------------------------
//        INTERFACE DEFINITIONS
//-----------------------------------------

interface IState {
    toggled: boolean,

    addingFile: boolean,
    uploading: boolean,
    uploadProgress: number,

    files: ITermsAndConditionsFile[]
}

interface IProps {
    token: string
}


//-----------------------------------------
//        CONSTS/ENUMS
//-----------------------------------------




//-----------------------------------------
//        CLASS DEFINITION
//-----------------------------------------

class TermsAndConditionsCard extends Component<IProps, IState> {

    //----------------------
    //    CONSTRUCTOR
    //----------------------

    constructor(props: IProps) {
        super(props);

        this.state = {
            toggled: false,
            addingFile: false,
            uploading: false,
            uploadProgress: 0,
            files: []
        }
    }


    //----------------------
    //    COMP DID MOUNT
    //----------------------

    componentDidMount() {
    }


    //----------------------
    //    HANDLE TOGGLE
    //----------------------

    handleToggle = () => {
        let toggled = !this.state.toggled;

        if (toggled) {
            this.getAllFiles();
        }

        this.setState({ toggled: toggled });
    }


    //-------------------------
    //    TOGGLE ADDING FILE
    //-------------------------

    toggleAddingFile = () => {
        let addingFile = !this.state.addingFile;
        this.setState({ addingFile: addingFile });
    }


    //---------------------------
    //    ADD FILE
    //---------------------------

    addFile = async (inMap: Map<string, string>, file: File): Promise<boolean> => {
        if (!file) {
            alert("no file chosen");
            return false;
        }

        this.setState({ uploading: true });

        //------   GET SIGNED POST URL   ------

        let getUrlData: IGetSignedPostUrl = {
            originalFileName: file.name
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_SIGNED_POST_URL, this.props.token, getUrlData);

        if (result.stat !== "ok") {
            alert("failed to upload file");
            this.setState({ uploading: false, uploadProgress: 0 });
            return false;
        }

        let signedUrl: ISignedPostUrl = result.data;

        //---------------------------------------


        //------   UPLOAD FILE TO S3   ------

        let config: AxiosRequestConfig = {      //  -->  TRACKS UPLOAD PROGRESS
            onUploadProgress: (progressEvent) => {
                const { loaded, total } = progressEvent;
                let progress = Math.floor(loaded / total * 100);
                this.setState({ uploadProgress: progress });
            }
        }

        let uploadStatus = await Connection.uploadFile(signedUrl.url, file, config);

        if (uploadStatus !== 200) {
            alert("failed to upload file");
            this.setState({ uploading: false, uploadProgress: 0 });
            return false;
        }

        //---------------------------------------


        //------   SEND FILE DATA TO SERVER   ------

        let data: IAddTermsAndConditionsFile = {
            fileName: file.name,
            filePath: signedUrl.filePath
        }

        result = await Connection.postReq(POST_TYPE.ADD_TERMS_AND_CONDITIONS_FILE, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert("failed to upload file");
            this.setState({ uploading: false, uploadProgress: 0 });
            return false;
        }

        //---------------------------------------

        this.getAllFiles();
        alert("file successfully uploaded");
        this.setState({ uploading: false, uploadProgress: 0 });
        return true;
    }


    //---------------------------
    //    GET ALL FILES
    //---------------------------

    getAllFiles = async () => {
        let data: IGetAllFiles = {}

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_TERMS_AND_CONDITIONS_FILES, this.props.token, data);

        if (result.stat !== "ok") {
            this.setState({ files: [] });
            return;
        }

        this.setState({ files: result.data });
    }


    //----------------------------
    //    SAVE FILE
    //----------------------------

    saveFile = async (filePath: string, fileName: string) => {
        let data: IGetSignedGetUrl = {
            filePath: filePath
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_SIGNED_GET_URL, this.props.token, data);

        if (result.stat !== "ok") {
            alert("failed to retrieve file");
            return;
        }

        let urlData: ISignedGetUrl = result.data;

        Connection.saveFileS3(urlData.url, fileName);
    }


    //---------------------------
    //    DELETE FILE
    //---------------------------

    deleteFile = async (filePath: string) => {
        let data: IDeleteFile = {
            filePath: filePath
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.DELETE_TERMS_AND_CONDITIONS_FILE, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert("failed to delete file: " + result.error);
            return;
        }

        this.getAllFiles();
        alert("successfully deleted file");
    }


    //----------------------
    //    RENDER METHOD
    //----------------------

    render() {
        return (
            <div id="terms-conditions-container" className="center">
                {
                    //----   TITLE   ----

                    <div id="terms-conditions-title" className="center title-col" >
                        <div className="flex-row" onClick={this.handleToggle}>
                            <h2 className="center">Terms And Conditions {this.state.toggled ? "\u25B2" : "\u25BC"}</h2>
                        </div>
                        <AddRounded className="center add-rounded-button" style={{ transform: "scale(1.4)" }} onClick={this.toggleAddingFile} />
                    </div>
                }

                {
                    //----   ADD FILE CARD   ----

                    this.state.addingFile &&
                    <AddCard title={"Add File"} cancel={this.toggleAddingFile} submit={this.addFile} addFile={true} uploading={this.state.uploading} numberInputs={[]} stringInputs={[]} calendarInputs={[]} checkboxInputs={[]} uploadProgress={this.state.uploadProgress} />
                }

                {
                    //----   HEADER   ----

                    this.state.toggled &&
                    <div id="terms-conditions-header" className="center terms-conditions-table">
                        <h3>Name</h3>
                    </div>
                }

                {
                    //----   LIST FILES   ----

                    this.state.toggled &&
                    this.state.files.map(file => {
                        return (
                            <div className="center terms-conditions-table">
                                <p id="parent-file-name" className="center" onClick={() => this.saveFile(file.File_Path, file.File_Name)}>{file.File_Name}</p>
                                <DeleteForever className="parent-delete-button center" style={{ transform: "scale(1.3)" }} onClick={() => this.deleteFile(file.File_Path)} />
                            </div>
                        )
                    })
                }

                {
                    //----   EMPTY LIST NOTIF   ----

                    (this.state.toggled && this.state.files.length === 0) &&
                    <EmptyListNotification message={"No files found"} color={"#FFFFFF"} />
                }

            </div >
        );
    }
}

export default TermsAndConditionsCard;
