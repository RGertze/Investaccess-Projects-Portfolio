
//-----------------------------------------
//        REACT IMPORTS
//-----------------------------------------

import React, { Component } from "react";

//-----------------------------------------
//        CSS IMPORTS
//-----------------------------------------

import "./accountFinancesDocumentCard.css";

//-----------------------------------------
//        COMPONENT IMPORTS
//-----------------------------------------


//-----------------------------------------
//        INTERFACE IMPORTS
//-----------------------------------------

import { IGetAllFiles, IResponse, IParentFile, IGetSignedGetUrl, ISignedGetUrl, IParentFinancialStatement, IGetParentFinancialStatements } from "../../interfaces";
import Connection, { GET_TYPE } from "../../connection";
import EmptyListNotification from "../../../../staff-front-end/src/components/emptyListNotification/emptyListNotification";


//-----------------------------------------
//        INTERFACE DEFINITIONS
//-----------------------------------------

interface IState {
    files: IParentFinancialStatement[]
}

interface IProps {
    token: string,
    parentID: number
}


//-----------------------------------------
//        CONSTS/ENUMS
//-----------------------------------------



//-----------------------------------------
//        CLASS DEFINITION
//-----------------------------------------

class AccountFinancesDocumentsCard extends Component<IProps, IState> {

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
        let data: IGetParentFinancialStatements = {
            parentID: this.props.parentID
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_PARENT_FINANCIAL_STATEMENTS, this.props.token, data);

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
            <div id="parent-statements-container" className="center">
                {
                    //----   TITLE   ----

                    <div id="parent-statements-title" className="flex-row">
                        <h2 className="center">Personal Documents</h2>
                    </div>
                }

                {
                    //----   HEADER   ----

                    <div id="statements-header" className="center statements-table">
                        <h3>Name</h3>
                        <h3>Details</h3>
                        <h3>Date Added</h3>
                    </div>
                }

                {
                    //----   LIST FILES   ----

                    this.state.files.map(file => {
                        return (
                            <div className="center statements-table">
                                <p id="parent-statement-name" className="center" onClick={() => this.saveFile(file.Statement_File_Path, file.Statement_File_Name)}>{file.Statement_File_Name}</p>
                                <p className="center">{file.Statement_Month}</p>
                                <p className="center">{file.Statement_File_Date_Added}</p>
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

export default AccountFinancesDocumentsCard;
