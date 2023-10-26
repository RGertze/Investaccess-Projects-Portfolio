
//-----------------------------------------
//        REACT IMPORTS
//-----------------------------------------

import React, { Component } from "react";

//-----------------------------------------
//        CSS IMPORTS
//-----------------------------------------

import "./accountDocumentCard.css";

//-----------------------------------------
//        COMPONENT IMPORTS
//-----------------------------------------


//-----------------------------------------
//        INTERFACE IMPORTS
//-----------------------------------------

import { IGetAllFiles, IResponse, IParentFile, IGetSignedGetUrl, ISignedGetUrl } from "../../interfaces";
import Connection, { GET_TYPE } from "../../connection";
import EmptyListNotification from "../../../../staff-front-end/src/components/emptyListNotification/emptyListNotification";


//-----------------------------------------
//        INTERFACE DEFINITIONS
//-----------------------------------------

interface IState {
    files: IParentFile[]
}

interface IProps {
    token: string,
    fileType: PARENT_FILE_TYPE
}


//-----------------------------------------
//        CONSTS/ENUMS
//-----------------------------------------

export enum PARENT_FILE_TYPE {
    TIMETABLE = 1,
    CALENDAR = 2,
    SUPPORT = 3
}


//-----------------------------------------
//        CLASS DEFINITION
//-----------------------------------------

class AccountDocumentsCard extends Component<IProps, IState> {

    //----------------------
    //    CONSTRUCTOR
    //----------------------

    constructor(props: IProps) {
        super(props);

        this.state = {
            files: []
        }
    }


    //----------------------
    //    COMP DID MOUNT
    //----------------------

    componentDidMount() {
        this.getAllFiles();
    }


    //---------------------------
    //    GET ALL FILES
    //---------------------------

    getAllFiles = async () => {
        let data: IGetAllFiles = {}

        let result: IResponse;

        switch (this.props.fileType) {
            case PARENT_FILE_TYPE.TIMETABLE:
                result = await Connection.getReq(GET_TYPE.GET_ALL_TIMETABLES, this.props.token, data);
                break;
            case PARENT_FILE_TYPE.CALENDAR:
                result = await Connection.getReq(GET_TYPE.GET_ALL_CALENDARS, this.props.token, data);
                break;
            case PARENT_FILE_TYPE.SUPPORT:
                result = await Connection.getReq(GET_TYPE.GET_ALL_SUPPORT_DOCUMENTS, this.props.token, data);
                break;
        }

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


    //----------------------
    //    RENDER METHOD
    //----------------------

    render() {
        return (
            <div id="parent-files-container" className="center">
                {
                    //----   TITLE   ----

                    <div id="parent-files-title" className="flex-row">
                        <h2 className="center">{this.props.fileType === 1 && 'Timetables'} {this.props.fileType === 2 && 'Calendars'} {this.props.fileType === 3 && 'Support Documents'}</h2>
                    </div>
                }

                {
                    //----   HEADER   ----

                    <div id="files-header" className="center files-table">
                        <h3>Name</h3>
                        <h3>Date Added</h3>
                    </div>
                }

                {
                    //----   LIST FILES   ----

                    this.state.files.map(file => {
                        return (
                            <div className="center files-table">
                                <p id="parent-file-name" className="center" onClick={() => this.saveFile(file.File_Path, file.File_Name)}>{file.File_Name}</p>
                                <p className="center">{file.File_Date_Added}</p>
                            </div>
                        )
                    })
                }

                {
                    //----   EMPTY LIST NOTIF   ----

                    this.state.files.length === 0 &&
                    <EmptyListNotification message={"No files found"} />
                }

            </div >
        );
    }
}

export default AccountDocumentsCard;
