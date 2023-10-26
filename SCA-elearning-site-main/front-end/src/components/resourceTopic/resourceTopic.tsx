
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

import { IGetLinksForMaterials, IGetResourceFilesByTopic, IGetSignedGetUrl, IGetSubResourceTopicsForStudents, ILink, IResourceFile, IResourceTopic, IResponse, ISignedGetUrl } from "../../interfaces";
import Connection, { GET_TYPE } from "../../connection";
import EmptyListNotification from "../../../../staff-front-end/src/components/emptyListNotification/emptyListNotification";


//-----------------------------------------
//        INTERFACE DEFINITIONS
//-----------------------------------------

interface IState {
    toggled: boolean,

    maxDepthReached: boolean,

    subtopics: IResourceTopic[],
    files: IResourceFile[],
    links: ILink[],

    topicNameIn: string,
    courseIDIn: number
}

interface IProps {
    token: string,

    isRoot: boolean,
    currentDepth: number,
    maxDepth: number,

    topic: IResourceTopic
}


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

            maxDepthReached: maxDepthReached,

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
        this.getResourceFiles();
        this.getLinks();
    }


    //----------------------------
    //    TOGGLE RESOURCE TOPIC
    //----------------------------

    toggleResourceTopic = () => {
        let toggled = !this.state.toggled;

        if (toggled) {
            this.getSubtopicsForStudents();
        }

        this.setState({ toggled: toggled });
    }


    //------------------------------------
    //        GET SUBTOPICS FOR STAFF
    //------------------------------------

    getSubtopicsForStudents = async () => {
        let data: IGetSubResourceTopicsForStudents = {
            parentTopicID: this.props.topic.Resource_Topic_ID
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_SUB_RESOURCE_TOPICS_FOR_STUDENT, this.props.token, data);

        if (result.stat === "ok") {
            this.setState({ subtopics: result.data });
        } else {
            this.setState({ subtopics: [] });
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
                    //----   HEADER   ----
                    <div id="resource-topic-header" className={`flex-row center resource-topic-header-button`} onClick={this.toggleResourceTopic}>
                        <h3>{this.props.topic.Resource_Topic_Name}</h3>
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
                                    <p className="center" onClick={() => this.openLink(link.Link_Path)}>{link.Link_Name}</p>
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
                                    <p className="center" onClick={() => this.saveResourceFile(file)}>{file.Resource_File_Name}</p>
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
                                    <ResourceTopic topic={subtopic} token={this.props.token} isRoot={false} currentDepth={this.props.currentDepth + 1} maxDepth={this.props.maxDepth} />
                                )
                            })
                        }

                        {
                            this.state.subtopics.length === 0 &&
                            <EmptyListNotification message={"No folders found"} />
                        }

                    </div>
                }

            </div >
        );
    }
}

export default ResourceTopic;
