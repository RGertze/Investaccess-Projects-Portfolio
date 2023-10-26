//-----------------------------------------
//        REACT IMPORTS
//-----------------------------------------

import React, { Component } from "react";

//-----------------------------------------
//        CSS IMPORTS
//-----------------------------------------

import "./resourcesSection.css";

//-----------------------------------------
//        COMPONENT IMPORTS
//-----------------------------------------

import { IAddRootResourceTopic, IGetRootResourceTopicsForStaff, IResourceTopic, IResponse } from "../../interfaces";
import Connection, { GET_TYPE, POST_TYPE } from "../../connection";
import CreateNewFolderRounded from "@material-ui/icons/CreateNewFolderRounded";
import AddFileCard from "../addFileCard/addFileCard";
import ResourceTopic from "../resourceTopic/resourceTopic";
import EmptyListNotification from "../emptyListNotification/emptyListNotification";


//-----------------------------------------
//        INTERFACE DEFINITIONS
//-----------------------------------------

interface IState {
    addingRootTopic: boolean,
    rootTopics: IResourceTopic[]
}

interface IProps {
    token: string,
    staffID: number
}

//-----------------------------------------
//        INPUT CONSTS
//-----------------------------------------

const ROOT_TOPIC_INPUT = [
    "Topic Name",
    "Visible to Students"
];


//-----------------------------------------
//        CLASS DEFINITION
//-----------------------------------------

class ResourcesSection extends Component<IProps, IState> {

    //----------------------
    //    CONSTRUCTOR
    //----------------------

    constructor(props: IProps) {
        super(props);

        this.state = {
            addingRootTopic: false,
            rootTopics: []
        }
    }


    //----------------------
    //    COMP DID MOUNT
    //----------------------

    componentDidMount() {
        this.getRootResourceTopics();
    }


    //-------------------------
    //    TOGGLE ROOT TOPIC
    //-------------------------

    toggleAddRootTopic = () => {
        let addingRootTopic = !this.state.addingRootTopic;
        this.setState({ addingRootTopic: addingRootTopic });
    }


    //---------------------------------
    //    GET ROOT RESOURCE TOPICS
    //---------------------------------

    getRootResourceTopics = async () => {
        let data: IGetRootResourceTopicsForStaff = {
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_ROOT_RESOURCE_TOPICS_FOR_STAFF, this.props.token, data);

        if (result.stat !== "ok") {
            this.setState({ rootTopics: [] });
            return;
        }

        this.setState({ rootTopics: result.data });
    }


    //---------------------------------
    //    ADD ROOT RESOURCE TOPIC
    //---------------------------------

    addResourceTopic = async (inputArray: Map<string, string>, file: File): Promise<boolean> => {
        let topicName = inputArray.get(ROOT_TOPIC_INPUT[0]);
        let visibleToStudents = parseInt(inputArray.get(ROOT_TOPIC_INPUT[1]));

        if (topicName === "") {
            alert("fill in all fields");
            return false;
        }

        let data: IAddRootResourceTopic = {
            topicName: topicName,
            visibleToStudents: visibleToStudents
        }

        console.log(data);

        let result: IResponse = await Connection.postReq(POST_TYPE.ADD_ROOT_RESOURCE_TOPIC, this.props.token, data, {});

        if (result.stat === "ok") {
            this.getRootResourceTopics();
            alert("Added topic");
            return true;
        }

        alert(result.error);
        return false
    }


    //----------------------
    //    RENDER METHOD
    //----------------------

    render() {
        return (
            <div id="resources-section-container">

                <div className="center flex-row" style={{ justifyContent: "center", marginBottom: "25px" }}>
                    <CreateNewFolderRounded className="chat-header-buttons" style={{ transform: "scale(1.5)", color: "#333" }} onClick={this.toggleAddRootTopic} />
                </div>

                {
                    //----   LIST ROOT TOPICS   ----

                    this.state.rootTopics.map(rootTopic => {
                        return (
                            <ResourceTopic refreshTopics={this.getRootResourceTopics} staffID={this.props.staffID} topic={rootTopic} token={this.props.token} isRoot={true} maxDepth={2} currentDepth={0} />
                        )
                    })
                }

                {
                    this.state.rootTopics.length === 0 &&
                    <EmptyListNotification message={"No folders found"} />
                }

                {
                    //----   ADD ROOT TOPIC   ----

                    this.state.addingRootTopic &&
                    <AddFileCard checkboxInputs={[ROOT_TOPIC_INPUT[1]]} addFile={false} title={"Add Folder"} cancel={this.toggleAddRootTopic} submit={this.addResourceTopic} uploading={false} numberInputs={[]} stringInputs={[ROOT_TOPIC_INPUT[0]]} calendarInputs={[]} uploadProgress={0} />
                }

            </div>
        );
    }
}

export default ResourcesSection;
