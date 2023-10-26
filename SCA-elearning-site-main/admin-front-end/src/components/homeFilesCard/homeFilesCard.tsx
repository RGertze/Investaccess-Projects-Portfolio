//-----------------------------------------
//        REACT IMPORTS
//-----------------------------------------

import React, { Component } from "react";

//-----------------------------------------
//        CSS IMPORTS
//-----------------------------------------

import "./homeFilesCard.css";

//-----------------------------------------
//        COMPONENT IMPORTS
//-----------------------------------------

import { IAddHomeFile, IAddLink, IDeleteHomeFile, IDeleteLink, IGetHomeFilesBySection, IGetHomeSectionLinks, IGetSignedGetUrl, IGetSignedPostUrl, IHomeFile, ILink, IResponse, ISignedGetUrl, ISignedPostUrl } from "../../interfaces";
import Connection, { GET_TYPE, POST_TYPE } from "../../connection";
import EmptyListNotification from "../../../../staff-front-end/src/components/emptyListNotification/emptyListNotification";
import NoteAddRounded from "@material-ui/icons/NoteAddRounded";
import DeleteForever from "@material-ui/icons/DeleteForever";
import InsertLinkRounded from "@material-ui/icons/InsertLinkRounded";
import ProgressBar from "../progressBar";
import { AxiosRequestConfig } from "axios";
import AddCard from "../addCard/addFileCard";


//-----------------------------------------
//        INTERFACE DEFINITIONS
//-----------------------------------------

interface IState {
    files: IHomeFile[],
    links: ILink[],

    addingFile: boolean,
    addingLink: boolean,
    inFile: File,
    uploading: boolean,
    uploadProgress: number
}

interface IProps {
    sectionName: string,
    token: string,

    gridCol: number,

    linkType: number
}

export const LINK_INPUT = [
    "Link",
    "Name for link"
];


//-----------------------------------------
//        CLASS DEFINITION
//-----------------------------------------

class HomeFilesCard extends Component<IProps, IState> {

    //----------------------
    //    CONSTRUCTOR
    //----------------------

    constructor(props: IProps) {
        super(props);

        this.state = {
            files: [],
            links: [],
            addingFile: false,
            addingLink: false,
            inFile: null,
            uploading: false,
            uploadProgress: 0
        }
    }


    //--------------------------
    //    COMPONENT DID MOUNT
    //--------------------------

    componentDidMount() {
        this.getFiles();
        this.getLinks();
    }


    //----------------------------
    //    TOGGLE ADD FILE
    //----------------------------

    toggleAddFile = () => {
        let addingFile = !this.state.addingFile;
        this.setState({ addingFile: addingFile });
    }


    //---------    TOGGLE ADD LINK   -----------

    toggleAddLink = async () => {
        let addingLink = !this.state.addingLink;
        this.setState({ addingLink: addingLink });
    }


    //----------------------------
    //    GET FILES FOR SECTION
    //----------------------------

    getFiles = async () => {
        let data: IGetHomeFilesBySection = {
            section: this.props.sectionName
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_HOME_FILES_BY_SECTION, this.props.token, data);

        if (result.stat === "ok") {
            this.setState({ files: result.data });
            return;
        }

        this.setState({ files: [] });
    }


    //----------------------------
    //    ADD HOME FILE
    //----------------------------

    addHomeFile = async () => {
        if (!this.state.inFile) {
            alert("no file chosen");
            return;
        }

        this.setState({ uploading: true });

        //------   GET SIGNED POST URL   ------

        let getUrlData: IGetSignedPostUrl = {
            originalFileName: this.state.inFile.name
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_SIGNED_POST_URL, this.props.token, getUrlData);

        if (result.stat !== "ok") {
            alert("failed to upload file");
            this.setState({ uploading: false, uploadProgress: 0 });
            return;
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

        let uploadStatus = await Connection.uploadFile(signedUrl.url, this.state.inFile, config);

        if (uploadStatus !== 200) {
            alert("failed to upload file");
            this.setState({ uploading: false, uploadProgress: 0 });
            return;
        }

        //---------------------------------------


        //------   SEND FILE DATA TO SERVER   ------

        let data: IAddHomeFile = {
            fileName: this.state.inFile.name,
            filePath: signedUrl.filePath,
            fileSection: this.props.sectionName
        }

        result = await Connection.postReq(POST_TYPE.ADD_HOME_FILE, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert("failed to upload file");
            this.setState({ uploading: false, uploadProgress: 0 });
            return;
        }

        //---------------------------------------

        alert("file successfully uploaded");
        this.setState({ uploading: false, uploadProgress: 0, inFile: null, addingFile: false });
        this.getFiles();

    }


    //----------------------------
    //    DELETE HOME FILE
    //----------------------------

    deleteHomeFile = async (filePath: string) => {
        let data: IDeleteHomeFile = {
            filePath: filePath
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.DELETE_HOME_FILE, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert("falied to delete file");
            return;
        }

        this.getFiles();
    }


    //----------------------------
    //    SAVE HOME FILE
    //----------------------------

    saveHomeFile = async (file: IHomeFile) => {
        let data: IGetSignedGetUrl = {
            filePath: file.Home_File_Path
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_SIGNED_HOME_FILE_URL, this.props.token, data);

        if (result.stat !== "ok") {
            alert("failed to retrieve file");
            return;
        }

        let urlData: ISignedGetUrl = result.data;

        Connection.saveFileS3(urlData.url, file.Home_File_Name);
    }


    //----------------------------------
    //      ADD LINK
    //----------------------------------

    addLink = async (inputArray: Map<string, string>, file: File): Promise<boolean> => {
        let linkPath = inputArray.get(LINK_INPUT[0]);
        let linkName = inputArray.get(LINK_INPUT[1]);

        if (linkPath === "") {
            alert("enter a link");
            return false;
        }
        if (linkName === "") {
            alert("enter a name for the link");
            return false;
        }

        let data: IAddLink = {
            linkPath: linkPath,
            linkName: linkName,
            linkType: this.props.linkType,
            linkTopicID: 0,
            linkAssignmentPath: ""
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.ADD_LINK, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert("failed to add link: " + result.error);
            return false;
        }

        this.getLinks();
        alert("successfully added link");
        return true;
    }


    //----------------------------------
    //      GET LINKS
    //----------------------------------

    getLinks = async () => {

        let data: IGetHomeSectionLinks = {
            linkType: this.props.linkType
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_HOME_SECTION_LINKS, this.props.token, data);

        if (result.stat !== "ok") {
            this.setState({ links: [] });
            return;
        }

        this.setState({ links: result.data });

    }


    //----------------------------------
    //      DELETE LINKS
    //----------------------------------

    deleteLink = async (linkPath: string) => {
        let data: IDeleteLink = {
            linkPath: linkPath,
            linkType: this.props.linkType,
            linkTopicID: 0
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.DELETE_LINK, this.props.token, data, {});

        if (result.stat == "ok") {
            this.getLinks();
            return;
        }

        alert("failed to delete link: " + result.error);
    }


    //----------------------------------
    //      OPEN LINK
    //----------------------------------

    openLink = (url: string) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }


    //----------------------
    //    RENDER METHOD
    //----------------------

    render() {
        return (
            <div id="home-files-container" style={{ gridColumn: this.props.gridCol }} className="center">
                {
                    //----   ADD FILE SECTION   ----
                    this.state.addingFile &&
                    <div className="add-card-overlay">
                        <div id="add-home-file-container" className="flex-column center">
                            <h1>Add file for {this.props.sectionName}</h1>
                            <input type="file" onChange={ev => this.setState({ inFile: ev.target.files[0] })} />
                            <div className="flex-row" style={{ justifyContent: "space-evenly" }}>
                                <button onClick={this.addHomeFile}>Submit</button>
                                <button onClick={this.toggleAddFile}>Cancel</button>
                            </div>
                            {
                                this.state.uploading &&
                                <ProgressBar now={this.state.uploadProgress} />
                            }
                        </div>
                    </div>
                }

                {
                    //----   ADD LINK   ----

                    this.state.addingLink &&
                    <AddCard uploadProgress={0} uploading={false} title={"Add link"} submit={this.addLink} cancel={this.toggleAddLink} addFile={false} numberInputs={[]} stringInputs={LINK_INPUT} calendarInputs={[]} checkboxInputs={[]} />
                }

                <div id="home-files-header">
                    <h3 className="center">{this.props.sectionName}</h3>
                    <div className="flex-row">
                        <NoteAddRounded className="center" onClick={this.toggleAddFile} />
                    </div>
                    <div className="flex-row">
                        <InsertLinkRounded className="center" onClick={this.toggleAddLink} />
                    </div>
                </div>

                <div id="home-files-list" className="center flex-column">
                    {
                        //----   LIST FILES   ----

                        this.state.files.map(file => {
                            return (
                                <div id="home-file" className="title-col center">
                                    <p onClick={() => this.saveHomeFile(file)}>{file.Home_File_Name}</p>
                                    <div className="flex-row home-file-delete-button" onClick={() => this.deleteHomeFile(file.Home_File_Path)}>
                                        <DeleteForever />
                                    </div>
                                </div>
                            )
                        })
                    }

                    {
                        //----   LIST LINKS   ----

                        this.state.links.map(link => {
                            return (
                                <div id="home-file" className="title-col center">
                                    <p onClick={() => this.openLink(link.Link_Path)}>{link.Link_Name}</p>
                                    <div className="flex-row home-file-delete-button" onClick={() => this.deleteLink(link.Link_Path)}>
                                        <DeleteForever />
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                {
                    (this.state.files.length === 0 && this.state.links.length === 0) &&
                    <EmptyListNotification message={"No items found"} color={"#FFFFFF"} />
                }
            </div>
        );
    }
}

export default HomeFilesCard;
