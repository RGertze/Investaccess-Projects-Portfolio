
//-----------------------------------------
//        REACT IMPORTS
//-----------------------------------------

import React, { Component } from "react";

//-----------------------------------------
//        CSS IMPORTS
//-----------------------------------------

import "./resourceTopic.css";

//-----------------------------------------
//        INTERFACE IMPORTS
//-----------------------------------------

import { IAddLink, IAddResourceFile, IAddSubResourceTopic, IAddSuggestion, ICheckAdminResourcePassword, ICourseTaughtShort, IDeleteLink, IDeleteResourceFile, IDeleteResourceTopic, IGetLinksForMaterials, IGetResourceFilesByTopic, IGetSignedGetUrl, IGetSignedPostUrl, IGetSubResourceTopicsForStaff, IGetTaughtCourses, ILink, IResourceFile, IResourceTopic, IResponse, ISignedGetUrl, ISignedPostUrl } from "../../interfaces";
import Connection, { GET_TYPE, POST_TYPE } from "../../connection";
import CreateNewFolderRounded from "@material-ui/icons/CreateNewFolderRounded";
import NoteAddRounded from "@material-ui/icons/NoteAddRounded";
import EmptyListNotification from "../emptyListNotification/emptyListNotification";
import { AxiosRequestConfig } from "axios";
import AddFileCard from "../addFileCard/addFileCard";
import InsertLinkRounded from "@material-ui/icons/InsertLinkRounded";
import { LINK_INPUT } from "../courseMaterialCard";
import DeleteForever from "@material-ui/icons/DeleteForever";


//-----------------------------------------
//        INTERFACE DEFINITIONS
//-----------------------------------------

interface IState {
    toggled: boolean,

    checkingAdminResourcePassword: boolean,
    deleteType: number,
    pathToDelete: string,

    addingSubTopic: boolean,
    addingResourceFile: boolean,
    addingLink: boolean,

    uploading: boolean,
    uploadProgress: number,

    maxDepthReached: boolean,

    coursesTaught: ICourseTaughtShort[],

    subtopics: IResourceTopic[],
    files: IResourceFile[],
    links: ILink[],

    topicNameIn: string,
    courseIDIn: number
}

interface IProps {
    token: string,
    staffID: number,

    isRoot: boolean,
    currentDepth: number,
    maxDepth: number,

    topic: IResourceTopic,

    refreshTopics(): void
}

//-----------------------------------------
//        CONST DEFINITIONS
//-----------------------------------------

const CHECK_ADMIN_RESOURCE_IN = [
    "Admin user ID",
    "Resource Password"
];


//-----------------------------------------
//        CLASS DEFINITION
//-----------------------------------------

class ResourceTopic extends Component<IProps, IState> {

    //----------------------
    //    CONSTRUCTOR
    //----------------------

    constructor(props: IProps) {
        super(props);

        let maxDepthReached = !(this.props.currentDepth < this.props.maxDepth);

        this.state = {
            toggled: false,

            checkingAdminResourcePassword: false,
            deleteType: 0,
            pathToDelete: "",

            addingSubTopic: false,
            addingResourceFile: false,
            addingLink: false,

            uploading: false,
            uploadProgress: 0,

            maxDepthReached: maxDepthReached,

            coursesTaught: [],
            subtopics: [],
            files: [],
            links: [],

            topicNameIn: "",
            courseIDIn: 0
        }
    }


    //----------------------
    //    COMP DID MOUNT
    //----------------------

    componentDidMount() {
        if (this.props.isRoot) {
            this.getTaughtCourses();
        } else {
            this.setState({ courseIDIn: this.props.topic.Course_ID });
        }

        this.getResourceFiles();
        this.getLinks();
    }


    //-----------------------------------------------
    //    TOGGLE CHECKING ADMIN RESOURCE PASSWORD
    //-----------------------------------------------

    toggleCheckingAdminResourcePassword = (deleteType: number, pathToDelete: string) => {
        let toggled = !this.state.checkingAdminResourcePassword;
        this.setState({ checkingAdminResourcePassword: toggled, deleteType: deleteType, pathToDelete: pathToDelete });
    }


    //------------------------------------
    //    CHECK ADMIN RESOURCE PASSWORD
    //------------------------------------

    checkAdminResourcePassword = async (inMap: Map<string, string>, file: File): Promise<boolean> => {
        let userID = inMap.get(CHECK_ADMIN_RESOURCE_IN[0]);
        let pw = inMap.get(CHECK_ADMIN_RESOURCE_IN[1]);

        if (userID === "") {
            alert("enter a user ID");
            return false;
        }
        if (pw === "") {
            alert("enter a password");
            return false;
        }

        let data: ICheckAdminResourcePassword = {
            adminID: parseInt(userID),
            password: pw
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.CHECK_ADMIN_RESOURCE_PASSWORD, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert(result.error);
            return false;
        }

        switch (this.state.deleteType) {
            case 1:
                this.deleteResourceTopic();
                break;
            case 2:
                this.deleteResourceFile(this.state.pathToDelete);
                break;
            case 3:
                this.deleteLink(this.state.pathToDelete);
                break;
        }

        return true;
    }


    //----------------------------
    //    TOGGLE RESOURCE TOPIC
    //----------------------------

    toggleResourceTopic = () => {
        let toggled = !this.state.toggled;

        if (toggled) {
            this.getSubtopicsForStaff();
        }

        this.setState({ toggled: toggled });
    }


    //----------------------------
    //    TOGGLE ADDING SUBTOPIC
    //----------------------------

    toggleAddSubTopic = () => {
        let toggled = !this.state.addingSubTopic;
        this.setState({ addingSubTopic: toggled });
    }


    //----------------------------
    //    TOGGLE ADDING FILE
    //----------------------------

    toggleAddResourceFile = () => {
        let toggled = !this.state.addingResourceFile;
        this.setState({ addingResourceFile: toggled });
    }


    //---------    TOGGLE ADD LINK   -----------

    toggleAddLink = async () => {
        let addingLink = !this.state.addingLink;
        this.setState({ addingLink: addingLink });
    }


    //------------      GET COURSES TAUGHT SHORT     ------------------

    getTaughtCourses = async () => {
        let data: IGetTaughtCourses = {
            staffID: this.props.staffID.toString(),
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_COURSES_TAUGHT, this.props.token, data);

        if (result.stat !== "ok") {
            this.setState({ coursesTaught: [] });
        } else {
            this.setState({ coursesTaught: result.data, courseIDIn: result.data[0].Course_ID });
        }
    }


    //-------------------------------
    //        ADD SUBTOPICS
    //-------------------------------

    addSubTopic = async () => {
        if (this.state.courseIDIn === 0 || this.state.topicNameIn === "") {
            alert("Fill in all fields");
            return;
        }

        let data: IAddSubResourceTopic = {
            courseID: this.state.courseIDIn,
            topicName: this.state.topicNameIn,
            parentTopicID: this.props.topic.Resource_Topic_ID
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.ADD_SUB_RESOURCE_TOPIC, this.props.token, data, {});

        if (result.stat === "ok") {
            this.setState({ addingSubTopic: false, topicNameIn: "", courseIDIn: 0 });
            this.getSubtopicsForStaff();
            alert("subtopic added");
            return;
        }

        alert("failed to add subtopic, try again later");
        alert(result.error);
    }


    //------------------------------------
    //        GET SUBTOPICS FOR STAFF
    //------------------------------------

    getSubtopicsForStaff = async () => {
        let data: IGetSubResourceTopicsForStaff = {
            parentTopicID: this.props.topic.Resource_Topic_ID,
            staffID: this.props.staffID
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_SUB_RESOURCE_TOPICS_FOR_STAFF, this.props.token, data);

        if (result.stat === "ok") {
            this.setState({ subtopics: result.data });
        } else {
            this.setState({ subtopics: [] });
        }

    }


    //--------    ADD RESOURCE FILE    ------------

    addResourceFile = async (inMap: Map<string, string>, file: File): Promise<boolean> => {

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
                this.setState({ uploading: false, uploadProgress: 0 });
                return false;
            }

            let urlData: ISignedPostUrl = result.data;

            //--       SETUP CONFIG TO MONITOR UPLOAD PROGRESS      --

            let config: AxiosRequestConfig = {
                onUploadProgress: (progressEvent) => {
                    const { loaded, total } = progressEvent;
                    let progress = Math.floor(loaded / total * 100);
                    this.setState({ uploadProgress: progress });
                }
            }

            let uploadStatus = await Connection.uploadFile(urlData.url, file, config);


            if (uploadStatus !== 200) {
                alert("upload failed");
                this.setState({ uploading: false, uploadProgress: 0 });
                return false;
            }

            //--       SEND ASSIGNMENT DETAILS TO SERVER      --

            let data: IAddResourceFile = {
                topicID: this.props.topic.Resource_Topic_ID,
                fileName: file.name,
                filePath: urlData.filePath
            }

            result = await Connection.postReq(POST_TYPE.ADD_RESOURCE_FILE, this.props.token, data, {});

            if (result.stat !== "ok") {
                alert(result.error);
                this.setState({ uploading: false, uploadProgress: 0 });
                return false;
            }

            alert("Upload successful");

            //--  RESET UPLOAD VALUES  --

            this.setState({ uploading: false, uploadProgress: 0 });

            this.getResourceFiles();

            return true;

        } else {
            alert("No file has been chosen");
            return false
        }
    }


    //--------    GET RESOURCE FILES    ------------

    getResourceFiles = async () => {
        let data: IGetResourceFilesByTopic = {
            topicID: this.props.topic.Resource_Topic_ID
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_RESOURCE_FILES_BY_TOPIC, this.props.token, data);

        if (result.stat === "ok") {
            this.setState({ files: result.data });
        } else {
            this.setState({ files: [] });
        }
    }


    //----------------------------
    //    SAVE RESOURCE FILE
    //----------------------------

    saveResourceFile = async (file: IResourceFile) => {
        let data: IGetSignedGetUrl = {
            filePath: file.Resource_File_Path
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_SIGNED_GET_URL, this.props.token, data);

        if (result.stat !== "ok") {
            alert("failed to retrieve file");
            return;
        }

        let urlData: ISignedGetUrl = result.data;

        Connection.saveFileS3(urlData.url, file.Resource_File_Name);
    }


    //----------------------------
    //    DELETE RESOURCE FILE
    //----------------------------

    deleteResourceFile = async (filePath: string) => {
        let data: IDeleteResourceFile = {
            filePath: filePath
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.DELETE_RESOURCE_FILE, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert("failed to delete file");
            return;
        }

        this.getResourceFiles();
        alert("file deleted");
    }


    //----------------------------
    //    DELETE RESOURCE TOPIC
    //----------------------------

    deleteResourceTopic = async () => {
        let data: IDeleteResourceTopic = {
            topicID: this.props.topic.Resource_Topic_ID
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.DELETE_RESOURCE_TOPIC, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert("failed to delete topic");
            return;
        }

        this.props.refreshTopics();  //----   MAKE PARENT REFRESH ITS TOPICS   ----
        alert("topic deleted");
    }


    //----------------------------
    //    DELETE RESOURCE LINK
    //----------------------------

    deleteLink = async (linkPath: string) => {
        let data: IDeleteLink = {
            linkPath: linkPath,
            linkType: 2,
            linkTopicID: this.props.topic.Resource_Topic_ID
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.DELETE_LINK, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert("failed to delete link");
            return;
        }

        this.getLinks();
        alert("link deleted");
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
            linkType: 2,
            linkTopicID: this.props.topic.Resource_Topic_ID,
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

        let data: IGetLinksForMaterials = {
            topicID: this.props.topic.Resource_Topic_ID
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_LINKS_BY_TOPIC, this.props.token, data);

        if (result.stat !== "ok") {
            this.setState({ links: [] });
            return;
        }

        this.setState({ links: result.data });

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
            <div id="resource-topic-container" className="center">

                {
                    //----   ADD SUBTOPIC   ----

                    this.state.addingSubTopic &&
                    <div id="add-file-card-overlay">
                        <div id="add-file-card-container" className="flex-column">

                            <h2>Add Subfolder</h2>

                            <div className="form-col add-file-card-str-input">
                                <h4>Topic Name</h4>
                                <input type="text" onChange={ev => this.setState({ topicNameIn: ev.target.value })} />
                            </div>

                            {
                                //----   SUBTOPIC HAS SAME COURSE ID AS PARENT   ----
                                this.props.isRoot &&
                                <div className="form-col add-file-card-str-input">
                                    <h4>Course</h4>
                                    <select onChange={ev => this.setState({ courseIDIn: parseInt(ev.target.value) })}>
                                        {
                                            this.state.coursesTaught.map(course => {
                                                return (
                                                    <option value={course.Course_ID}>{course.Course_Name}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                            }

                            <div id="add-file-card-buttons-container">

                                <div className="flex-row add-file-card-button" onClick={this.addSubTopic}>
                                    <h3 className="center">Submit</h3>
                                </div>
                                <div className="flex-row add-file-card-button" onClick={this.toggleAddSubTopic}>
                                    <h3 className="center">Cancel</h3>
                                </div>

                            </div>

                        </div>
                    </div>
                }

                {
                    //----   ADD RESOURCE FILE   ----

                    this.state.addingResourceFile &&
                    <AddFileCard checkboxInputs={[]} addFile={true} title={"Add Resource File"} cancel={this.toggleAddResourceFile} submit={this.addResourceFile} uploading={this.state.uploading} numberInputs={[]} stringInputs={[]} calendarInputs={[]} uploadProgress={this.state.uploadProgress} />
                }

                {
                    //----   ADD LINK   ----

                    this.state.addingLink &&
                    <AddFileCard checkboxInputs={[]} addFile={false} title={"Add Link"} cancel={this.toggleAddLink} submit={this.addLink} uploading={false} numberInputs={[]} stringInputs={LINK_INPUT} calendarInputs={[]} uploadProgress={0} />
                }

                {
                    //----   HEADER   ----
                    <div id="resource-topic-header" className={`${this.state.maxDepthReached ? "title-col" : "title-2-col"} center`} >
                        <div className="flex-row resource-topic-header-button" onClick={this.toggleResourceTopic}>
                            <h3>{this.props.topic.Resource_Topic_Name}</h3>
                        </div>

                        {
                            !this.state.maxDepthReached &&
                            <div className="flex-row">
                                <CreateNewFolderRounded className="resource-topic-header-button" onClick={this.toggleAddSubTopic} />
                            </div>
                        }
                        <div className="flex-row" style={{ justifyContent: "space-evenly" }}>
                            <NoteAddRounded className="resource-topic-header-button" onClick={this.toggleAddResourceFile} />
                            <InsertLinkRounded className="resource-topic-header-button" style={{ transform: "scale(1.3)" }} onClick={this.toggleAddLink} />
                            <DeleteForever className="resource-topic-header-button" style={{ transform: "scale(1.3)" }} onClick={() => this.toggleCheckingAdminResourcePassword(1, "")} />
                        </div>
                    </div>
                }

                {
                    //----   LIST LINKS   ----

                    this.state.toggled &&
                    <div id="resource-files-list" className="resource-content">
                        <h4>Links</h4>

                        {
                            this.state.links.map(link => {
                                return (
                                    <div className="center title-col resource-file">
                                        <p className="center" onClick={() => this.openLink(link.Link_Path)}>{link.Link_Name}</p>
                                        <DeleteForever className="center resource-topic-header-button" style={{ transform: "scale(1.3)" }} onClick={() => this.toggleCheckingAdminResourcePassword(3, link.Link_Path)} />
                                    </div>
                                )
                            })
                        }

                        {
                            this.state.links.length === 0 &&
                            <EmptyListNotification message={"No links found"} />
                        }

                    </div>
                }

                {
                    //----   LIST FILES   ----

                    this.state.toggled &&
                    <div id="resource-files-list" className="resource-content">
                        <h4>Files</h4>

                        {
                            this.state.files.map(file => {
                                return (
                                    <div className="center title-col resource-file">
                                        <p className="center" onClick={() => this.saveResourceFile(file)}>{file.Resource_File_Name}</p>
                                        <DeleteForever className="center resource-topic-header-button" style={{ transform: "scale(1.3)" }} onClick={() => this.toggleCheckingAdminResourcePassword(2, file.Resource_File_Path)} />
                                    </div>
                                )
                            })
                        }

                        {
                            this.state.files.length === 0 &&
                            <EmptyListNotification message={"No files found"} />
                        }

                    </div>
                }

                {
                    //----   LIST SUBTOPICS   ----

                    (!this.state.maxDepthReached && this.state.toggled) &&
                    <div id="resource-subtopic-container" className="resource-content flex-column">
                        <h4>Subfolders</h4>

                        {
                            this.state.subtopics.map(subtopic => {
                                return (
                                    <ResourceTopic refreshTopics={this.getSubtopicsForStaff} staffID={this.props.staffID} topic={subtopic} token={this.props.token} isRoot={false} currentDepth={this.props.currentDepth + 1} maxDepth={this.props.maxDepth} />
                                )
                            })
                        }

                        {
                            this.state.subtopics.length === 0 &&
                            <EmptyListNotification message={"No folders found"} />
                        }

                    </div>
                }

                {
                    //----   CHECK ADMIN RESOURCE PASSWORD   ----

                    this.state.checkingAdminResourcePassword &&
                    <AddFileCard checkboxInputs={[]} addFile={false} title={"Confirm Delete"} cancel={() => this.setState({ checkingAdminResourcePassword: false })} submit={this.checkAdminResourcePassword} uploading={false} numberInputs={[]} stringInputs={CHECK_ADMIN_RESOURCE_IN} calendarInputs={[]} uploadProgress={0} />
                }

            </div >
        );
    }
}

export default ResourceTopic;
