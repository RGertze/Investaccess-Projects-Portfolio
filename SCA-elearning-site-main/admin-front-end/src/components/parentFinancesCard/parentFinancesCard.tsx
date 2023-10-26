
//-----------------------------------------
//        REACT IMPORTS
//-----------------------------------------

import React, { Component } from "react";

//-----------------------------------------
//        CSS IMPORTS
//-----------------------------------------

import "./parentFinancesCard.css";

//-----------------------------------------
//        COMPONENT IMPORTS
//-----------------------------------------

import AddRounded from "@material-ui/icons/AddRounded";
import AddCard from "../addCard/addFileCard";

//-----------------------------------------
//        INTERFACE IMPORTS
//-----------------------------------------

import { IAddFileForParents, IAddParent, IAddSuggestion, IDeleteParent, IGetAllFiles, IGetSignedPostUrl, IParent, IResponse, ISignedPostUrl, IParentFile, IUpdateParent, IGetSignedGetUrl, ISignedGetUrl, IDeleteFileForParents, IParentFinancialStatement, IGetParentFinancialStatements, IAddParentFinancialStatement, IGetParentFinances, IParentFinances, IUpdateParentFinancesBalance, IUpdateParentFinancesNextPaymentDate, IDeleteFile } from "../../interfaces";
import Connection, { GET_TYPE, POST_TYPE } from "../../connection";
import EditRounded from "@material-ui/icons/EditRounded";
import DeleteForever from "@material-ui/icons/DeleteForever";
import { AxiosRequestConfig } from "axios";
import EmptyListNotification from "../../../../staff-front-end/src/components/emptyListNotification/emptyListNotification";


//-----------------------------------------
//        INTERFACE DEFINITIONS
//-----------------------------------------

interface IState {
    toggled: boolean,

    addingFile: boolean,
    editingBalance: boolean,
    editingPaymentDate: boolean,
    uploading: boolean,
    uploadProgress: number,

    files: IParentFinancialStatement[],
    financeDetails: IParentFinances
}

interface IProps {
    token: string,
    parentID: number
}


//-----------------------------------------
//        CONSTS/ENUMS
//-----------------------------------------

const STATEMENT_IN = [
    "Month For"
];

const EDIT_BALANCE_IN = [
    "Balance"
];

const EDIT_PAYMENT_DUE_IN = [
    "Due Date"
];


//-----------------------------------------
//        CLASS DEFINITION
//-----------------------------------------

class ParentFinancesCard extends Component<IProps, IState> {

    //----------------------
    //    CONSTRUCTOR
    //----------------------

    constructor(props: IProps) {
        super(props);

        this.state = {
            toggled: false,
            addingFile: false,
            editingPaymentDate: false,
            editingBalance: false,
            uploading: false,
            uploadProgress: 0,
            files: [],
            financeDetails: null
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
            this.getFiles();
            this.getFinanceDetails();
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


    //-----------------------------
    //    TOGGLE EDITING BALANCE
    //-----------------------------

    toggleEditingBalance = () => {
        let editingBalance = !this.state.editingBalance;
        this.setState({ editingBalance: editingBalance });
    }


    //---------------------------------
    //    TOGGLE EDITING PAYMENT DUE
    //---------------------------------

    toggleEditingPaymentDue = () => {
        let editingPaymentDate = !this.state.editingPaymentDate;
        this.setState({ editingPaymentDate: editingPaymentDate });
    }


    //---------------------------
    //    ADD FILE
    //---------------------------

    addFile = async (inMap: Map<string, string>, file: File): Promise<boolean> => {
        if (!file) {
            alert("no file chosen");
            return false;
        }

        let month = inMap.get(STATEMENT_IN[0]);

        if (month === "") {
            alert("Enter a month!");
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

        let data: IAddParentFinancialStatement = {
            fileName: file.name,
            filePath: signedUrl.filePath,
            parentID: this.props.parentID,
            statementMonth: month
        }

        result = await Connection.postReq(POST_TYPE.ADD_PARENT_FINANCIAL_STATEMENT, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert("failed to upload file: " + result.error);
            this.setState({ uploading: false, uploadProgress: 0 });
            return false;
        }

        //---------------------------------------

        this.getFiles();
        alert("file successfully uploaded");
        this.setState({ uploading: false, uploadProgress: 0 });
        return true;
    }


    //-------------------------------
    //    UPDATE FINANCES BALANCE
    //-------------------------------

    updateFinancesBalance = async (inMap: Map<string, string>, file: File): Promise<boolean> => {
        let balance = parseFloat(inMap.get(EDIT_BALANCE_IN[0]));

        if (balance < 0) {
            alert("Enter a valid balance!");
            return false;
        }


        let data: IUpdateParentFinancesBalance = {
            parentID: this.props.parentID,
            balance: balance
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.UPDATE_PARENT_FINANCES_BALANCE, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert("failed to update balance: " + result.error);
            return false;
        }

        this.getFinanceDetails();
        alert("successfully updated balance");
        return true;
    }


    //----------------------------------
    //    UPDATE FINANCES PAYMENT DATE
    //----------------------------------

    updateFinancesNextPaymentDue = async (inMap: Map<string, string>, file: File): Promise<boolean> => {
        let nextDate = inMap.get(EDIT_PAYMENT_DUE_IN[0]);

        if (nextDate === "") {
            alert("Enter a date!");
            return false;
        }


        let data: IUpdateParentFinancesNextPaymentDate = {
            parentID: this.props.parentID,
            nextDate: nextDate
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.UPDATE_PARENT_FINANCES_NEXT_PAYMENT_DATE, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert("failed to update payment date: " + result.error);
            return false;
        }

        this.getFinanceDetails();
        alert("successfully updated payment date");
        return true;
    }


    //---------------------------
    //    GET FILES
    //---------------------------

    getFiles = async () => {
        let data: IGetParentFinancialStatements = {
            parentID: this.props.parentID
        }

        let result: IResponse;

        result = await Connection.getReq(GET_TYPE.GET_PARENT_FINANCIAL_STATEMENTS, this.props.token, data);

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
        let conf = confirm("Are you sure you want to delete this file?");

        if (conf) {
            let data: IDeleteFile = {
                filePath: filePath
            }

            let result: IResponse = await Connection.postReq(POST_TYPE.DELETE_PARENT_FINANCIAL_STATEMENT, this.props.token, data, {});

            if (result.stat !== "ok") {
                alert(result.error);
                return;
            }

            this.getFiles();
        }
    }


    //---------------------------
    //    GET FINANCE DETAILS
    //---------------------------

    getFinanceDetails = async () => {
        let data: IGetParentFinances = {
            parentID: this.props.parentID
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_PARENT_FINANCES, this.props.token, data);

        if (result.stat !== "ok") {
            this.setState({ financeDetails: null });
            return;
        }

        this.setState({ financeDetails: result.data[0] });

    }


    //----------------------
    //    RENDER METHOD
    //----------------------

    render() {
        return (
            <div id="parent-files-container" className="center">
                {
                    //----   TITLE   ----

                    <div id="parent-files-title" className="center title-col" >
                        <div className="flex-row" onClick={this.handleToggle}>
                            <h2 className="center">Finances {this.state.toggled ? "\u25B2" : "\u25BC"}</h2>
                        </div>
                        <AddRounded className="center add-rounded-button" style={{ transform: "scale(1.4)" }} onClick={this.toggleAddingFile} />
                    </div>
                }

                {
                    //----   ADD FILE CARD   ----

                    this.state.addingFile &&
                    <AddCard title={"Add Financial Statement"} cancel={this.toggleAddingFile} submit={this.addFile} addFile={true} uploading={this.state.uploading} numberInputs={[]} stringInputs={STATEMENT_IN} calendarInputs={[]} checkboxInputs={[]} uploadProgress={this.state.uploadProgress} />
                }

                {
                    //----   EDIT BALANCE   ----

                    this.state.editingBalance &&
                    <AddCard title={"Edit Balance"} cancel={this.toggleEditingBalance} submit={this.updateFinancesBalance} addFile={false} uploading={false} numberInputs={EDIT_BALANCE_IN} stringInputs={[]} calendarInputs={[]} checkboxInputs={[]} uploadProgress={0} />
                }

                {
                    //----   EDIT PAYMENT DATE   ----

                    this.state.editingPaymentDate &&
                    <AddCard title={"Edit Payment Date"} cancel={this.toggleEditingPaymentDue} submit={this.updateFinancesNextPaymentDue} addFile={false} uploading={false} numberInputs={[]} stringInputs={[]} calendarInputs={EDIT_PAYMENT_DUE_IN} checkboxInputs={[]} uploadProgress={0} />
                }

                {
                    //----   DISPLAY FINANCE DETAILS   ----

                    this.state.toggled &&
                    <div id="finance-details" className="center">
                        <div className="title-col center">
                            <h4>Arrears:   N$ {this.state.financeDetails ? this.state.financeDetails.Current_Balance : "0"}</h4>
                            <EditRounded className="center add-rounded-button" onClick={this.toggleEditingBalance} />
                        </div>
                        <div className="title-col center">
                            <h4>Next Payment Due:  {this.state.financeDetails ? this.state.financeDetails.Next_Payment_Due : ""}</h4>
                            <EditRounded className="center add-rounded-button" onClick={this.toggleEditingPaymentDue} />
                        </div>
                    </div>
                }

                {
                    //----   FINCANCIAL STATEMENTS HEADER   ----

                    this.state.toggled &&
                    <div id="files-header" className="center statement-files-table">
                        <h3>Name</h3>
                        <h3>Month</h3>
                        <h3>Date Added</h3>
                    </div>
                }

                {
                    //----   LIST FILES   ----

                    this.state.toggled &&
                    this.state.files.map(file => {
                        return (
                            <div className="center statement-files-table">
                                <p id="parent-file-name" className="center" onClick={() => this.saveFile(file.Statement_File_Path, file.Statement_File_Name)}>{file.Statement_File_Name}</p>
                                <p className="center">{file.Statement_Month}</p>
                                <p className="center">{file.Statement_File_Date_Added}</p>
                                <DeleteForever className="parent-delete-button center" style={{ transform: "scale(1.3)" }} onClick={() => this.deleteFile(file.Statement_File_Path)} />
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

export default ParentFinancesCard;
