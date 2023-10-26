
//----------------------------------
//      REACT IMPORTS
//----------------------------------

import React, { Component } from "react";
import Connection, { POST_TYPE, GET_TYPE } from "../../connection";

//----------------------------------
//      COMPONENT IMPORTS
//----------------------------------

import AddRounded from "@material-ui/icons/AddRounded";
import EditRounded from "@material-ui/icons/EditRounded";
import DeleteForever from "@material-ui/icons/DeleteForever";

//----------------------------------
//      CSS IMPORTS
//----------------------------------

import "./courseTopicItemCard.css";


//----------------------------------
//      INTERFACE IMPORTS
//----------------------------------

import { IApproveCourseMaterial, IApproveLink, ICourseMaterial, ICourseTopic, IDeleteCourseMaterial, IDeleteCourseTopic, IDeleteLink, IGetLinksForMaterials, IGetMaterialByTopic, IGetSubtopics, ILink, IResponse } from "../../interfaces";
import AddTopicCard from "../addTopicCard/addTopicCard";


//----------------------------------
//      ENUM DEFINITIONS
//----------------------------------

enum OPTIONS {
    APPROVED = 1,
    UNAPPROVED = 2,
    MARKED_FOR_DELETION = 3
}


//----------------------------------
//      INTERFACE DEFINITIONS
//----------------------------------

interface IState {
    toggled: boolean,
    option: OPTIONS,
    approvedMaterials: ICourseMaterial[],
    unapprovedMaterials: ICourseMaterial[],
    materialsMarkedForDeletion: ICourseMaterial[],

    addingTopic: boolean,
    updatingTopic: boolean,
    subtopics: ICourseTopic[],

    approvedLinks: ILink[],
    unapprovedLinks: ILink[],
    linksMarkedForDeletion: ILink[]
}

interface IProps {
    token: string,
    courseID: number,
    topic: ICourseTopic,

    refreshTopics(): void,

    isSubtopic: boolean,
    parentTopicID: number
}


//----------------------------------
//      CLASS DEFINITION
//----------------------------------

class CourseTopicItemCard extends Component<IProps, IState> {

    //----------------------------------
    //      CONSTRUCTOR
    //----------------------------------

    constructor(props: IProps) {
        super(props);

        this.state = {
            toggled: false,
            option: OPTIONS.UNAPPROVED,
            unapprovedMaterials: [],
            approvedMaterials: [],
            materialsMarkedForDeletion: [],

            addingTopic: false,
            updatingTopic: false,
            subtopics: [],

            approvedLinks: [],
            unapprovedLinks: [],
            linksMarkedForDeletion: []
        }
    }

    //----------------------------------
    //      COMP DID MOUNT
    //----------------------------------

    componentDidMount() {
        if (this.props.isSubtopic) {
            this.getMaterials();
            this.getLinks();
        }
        else {
            this.getSubtopics();
        }
    }


    //----------------------------------
    //      HANDLE TOGGLE
    //----------------------------------

    handleToggle = async () => {
        if (!this.state.toggled) {
            this.setState({ toggled: true });
        } else {
            this.setState({ toggled: false });
        }
    }


    //----------------------------------
    //      TOGGLE ADD TOPIC
    //----------------------------------

    toggleAddTopic = async () => {
        let updatingTopic = this.state.updatingTopic;
        if (this.state.updatingTopic) {
            updatingTopic = !updatingTopic;
        }

        let addingTopic = !this.state.addingTopic;
        this.setState({ addingTopic: addingTopic, updatingTopic: updatingTopic });
    }


    //----------------------------------
    //      GET SUBTOPICS
    //----------------------------------

    getSubtopics = async () => {
        let data: IGetSubtopics = {
            parentTopicID: this.props.topic.Course_Topic_ID
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_SUBTOPICS, this.props.token, data);

        if (result.stat === "ok") {
            this.setState({ subtopics: result.data });
            return;
        }

        this.setState({ subtopics: [] });
    }


    //----------------------------------
    //      DELETE TOPIC
    //----------------------------------

    deleteTopic = async () => {

        let data: IDeleteCourseTopic = {
            topicID: this.props.topic.Course_Topic_ID
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.DELETE_COURSE_TOPIC, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert("failed to delete topic");
            return;
        }

        this.props.refreshTopics();
    }


    //----------------------------------
    //      GET MATERIALS
    //----------------------------------

    getMaterials = async () => {

        let data: IGetMaterialByTopic = {
            courseID: this.props.courseID,
            topicID: this.props.topic.Course_Topic_ID
        }

        let result: IResponse;

        //---    CHOOSE APPROPRIATE MATERIALS TO GET    ---

        switch (this.state.option) {
            case OPTIONS.APPROVED:
                result = await Connection.getReq(GET_TYPE.GET_MATERIALS_APPROVED, this.props.token, data);
                break;
            case OPTIONS.UNAPPROVED:
                result = await Connection.getReq(GET_TYPE.GET_MATERIALS_UNAPPROVED, this.props.token, data);
                break;
            case OPTIONS.MARKED_FOR_DELETION:
                result = await Connection.getReq(GET_TYPE.GET_MATERIALS_MARKED_FOR_DELETION, this.props.token, data);
                break;
        }

        if (result.stat !== "ok") {
            if (this.state.option == OPTIONS.APPROVED) {
                this.setState({ approvedMaterials: [] });
            } else if (this.state.option == OPTIONS.UNAPPROVED) {
                this.setState({ unapprovedMaterials: [] });
            } else {
                this.setState({ materialsMarkedForDeletion: [] });
            }
            return;
        }

        if (this.state.option == OPTIONS.APPROVED) {
            this.setState({ approvedMaterials: result.data });
        } else if (this.state.option == OPTIONS.UNAPPROVED) {
            this.setState({ unapprovedMaterials: result.data });
        } else {
            this.setState({ materialsMarkedForDeletion: result.data });
        }

    }


    //----------------------------------
    //      APPROVE MATERIAL
    //----------------------------------

    approveMaterial = async (material: ICourseMaterial) => {
        let data: IApproveCourseMaterial = {
            materialPath: material.Course_Material_Path
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.APPROVE_MATERIAL, this.props.token, data, {});

        if (result.stat == "ok") {
            this.getMaterials();
            return;
        }

        alert("approval failed: " + result.error);
    }


    //----------------------------------
    //      REJECT MATERIAL
    //----------------------------------

    rejectMaterial = async (material: ICourseMaterial) => {
        let data: IDeleteCourseMaterial = {
            path: material.Course_Material_Path
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.REJECT_MATERIAL, this.props.token, data, {});

        if (result.stat == "ok") {
            this.getMaterials();
            return;
        }

        alert("rejection failed: " + result.error);
    }




    //----------------------------------
    //      GET LINKS
    //----------------------------------

    getLinks = async () => {

        let data: IGetLinksForMaterials = {
            topicID: this.props.topic.Course_Topic_ID
        }

        let result: IResponse;

        //---    CHOOSE APPROPRIATE MATERIALS TO GET    ---

        switch (this.state.option) {
            case OPTIONS.APPROVED:
                result = await Connection.getReq(GET_TYPE.GET_APPROVED_LINKS_BY_TOPIC, this.props.token, data);
                break;
            case OPTIONS.UNAPPROVED:
                result = await Connection.getReq(GET_TYPE.GET_UNAPPROVED_LINKS_BY_TOPIC, this.props.token, data);
                break;
            case OPTIONS.MARKED_FOR_DELETION:
                result = await Connection.getReq(GET_TYPE.GET_LINKS_MARKED_FOR_DELETION, this.props.token, data);
                break;
        }

        if (result.stat !== "ok") {
            if (this.state.option == OPTIONS.APPROVED) {
                this.setState({ approvedLinks: [] });
            } else if (this.state.option == OPTIONS.UNAPPROVED) {
                this.setState({ unapprovedLinks: [] });
            } else {
                this.setState({ linksMarkedForDeletion: [] });
            }
            return;
        }

        if (this.state.option == OPTIONS.APPROVED) {
            this.setState({ approvedLinks: result.data });
        } else if (this.state.option == OPTIONS.UNAPPROVED) {
            this.setState({ unapprovedLinks: result.data });
        } else {
            this.setState({ linksMarkedForDeletion: result.data });
        }

    }


    //----------------------------------
    //      OPEN LINK
    //----------------------------------

    openLink = (url: string) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }


    //----------------------------------
    //      APPROVE LINK
    //----------------------------------

    approveLink = async (linkPath: string) => {
        let data: IApproveLink = {
            linkPath: linkPath,
            linkType: 1,
            linkTopicID: this.props.topic.Course_Topic_ID
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.APPROVE_LINK, this.props.token, data, {});

        if (result.stat == "ok") {
            this.getLinks();
            return;
        }

        alert("approval failed: " + result.error);
    }


    //----------------------------------
    //      REJECT LINK
    //----------------------------------

    rejectLink = async (linkPath: string) => {
        let data: IDeleteLink = {
            linkPath: linkPath,
            linkType: 1,
            linkTopicID: this.props.topic.Course_Topic_ID
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.DELETE_LINK, this.props.token, data, {});

        if (result.stat == "ok") {
            this.getLinks();
            return;
        }

        alert("rejection failed: " + result.error);
    }



    //----------------------------------
    //      RENDER METHOD
    //----------------------------------

    render() {
        return (
            <div id="course-topic-item" style={{ backgroundColor: `${this.props.isSubtopic ? "#232E34" : "#344045"}` }}>

                {
                    //----------------------------------
                    //      ADD TOPIC OVERLAY
                    //----------------------------------
                    (this.state.addingTopic && !this.state.updatingTopic) &&
                    <AddTopicCard title={"Add Subtopic"} isUpdating={false} valueToUpdate={null} token={this.props.token} courseID={this.props.courseID} addSubtopic={true} parentTopicId={this.props.topic.Course_Topic_ID} cancel={this.toggleAddTopic} refreshTopics={this.getSubtopics} />
                }

                {
                    //----------------------------------
                    //      UPDATE TOPIC OVERLAY
                    //----------------------------------
                    (this.state.addingTopic && this.state.updatingTopic) &&
                    <AddTopicCard title={"Update Subtopic"} isUpdating={true} valueToUpdate={this.props.topic} token={this.props.token} courseID={this.props.courseID} addSubtopic={true} parentTopicId={this.props.topic.Course_Topic_ID} cancel={this.toggleAddTopic} refreshTopics={this.props.refreshTopics} />
                }

                <div id="course-topic-title" className={`${this.props.isSubtopic ? "title-2-col" : "title-3-col"}`}>
                    <h4 className="flex-row" onClick={this.handleToggle}>{this.props.topic.Course_Topic_Name}</h4>

                    {
                        //----   EDIT BUTTON   ----
                        <div className="flex-row add-rounded-button center" style={{ width: "30px", height: "30px" }} onClick={() => {
                            this.toggleAddTopic();
                            this.setState({ updatingTopic: true });
                        }}>
                            <EditRounded />
                        </div>
                    }

                    {
                        //----   ADD BUTTON   ----
                        !this.props.isSubtopic &&
                        <div className="flex-row add-rounded-button center" style={{ width: "30px", height: "30px" }} onClick={this.toggleAddTopic}>
                            <AddRounded />
                        </div>
                    }

                    {
                        //----   DELETE BUTTON   ----
                        <div className="flex-row add-rounded-button center" style={{ width: "30px", height: "30px" }} onClick={this.deleteTopic}>
                            <DeleteForever />
                        </div>
                    }
                </div>

                {
                    (this.state.toggled && !this.props.isSubtopic) &&
                    <h3>Subtopics:</h3>
                }

                {
                    //----------------------------------
                    //      LIST SUBTOPICS
                    //----------------------------------

                    (this.state.toggled && !this.props.isSubtopic) &&
                    this.state.subtopics.map(subTopic => {
                        return (
                            <CourseTopicItemCard isSubtopic={true} topic={subTopic} token={this.props.token} courseID={this.props.courseID} refreshTopics={this.getSubtopics} parentTopicID={this.props.topic.Course_Topic_ID} />
                        )
                    })
                }

                {
                    //--------------------------------------
                    //      DISPLAY NO SUBTOPICS MESSAGE
                    //--------------------------------------

                    (this.state.toggled && !this.props.isSubtopic && this.state.subtopics.length === 0) &&
                    <h3>No subtopics found!</h3>

                }

                {
                    //----------------------------------
                    //      HEADER
                    //----------------------------------

                    (this.state.toggled && this.props.isSubtopic) &&
                    <h3>Materials</h3>
                }

                {
                    //----------------------------------
                    //      OPTION TABS
                    //----------------------------------

                    (this.state.toggled && this.props.isSubtopic) &&
                    <div id="course-material-options">

                        <div className="course-material-option approved" onClick={() => { this.setState({ option: OPTIONS.APPROVED }, () => { this.getMaterials(); this.getLinks(); }) }}>

                            <h4 style={{ borderBottom: this.state.option == OPTIONS.APPROVED ? "2px solid white" : "none" }}>
                                Approved
                            </h4>
                        </div>

                        <div className="divisor"></div>

                        <div className="course-material-option unapproved" onClick={() => { this.setState({ option: OPTIONS.UNAPPROVED }, () => { this.getMaterials(); this.getLinks(); }) }}>
                            <h4 style={{ borderBottom: this.state.option == OPTIONS.UNAPPROVED ? "2px solid white" : "none" }}>
                                Unapproved
                            </h4>
                        </div>

                        <div className="divisor"></div>

                        <div className="course-material-option marked-for-deletion" onClick={() => { this.setState({ option: OPTIONS.MARKED_FOR_DELETION }, () => { this.getMaterials(); this.getLinks(); }) }}>
                            <h4 style={{ borderBottom: this.state.option == OPTIONS.MARKED_FOR_DELETION ? "2px solid white" : "none" }}>
                                Marked for deletion
                            </h4>
                        </div>

                    </div>
                }

                {
                    //----------------------------------
                    //     UNAPPROVED MATERIALS
                    //----------------------------------

                    (this.state.toggled && this.state.option == OPTIONS.UNAPPROVED && this.props.isSubtopic) &&
                    this.state.unapprovedMaterials.map((material) => {
                        return (
                            <div className="course-material-unapproved">
                                <h3>{material.Course_Material_Name}</h3>
                                <div style={{ backgroundColor: "#39FF14" }} onClick={() => this.approveMaterial(material)}><p>Approve</p></div>
                                <div style={{ backgroundColor: "#EE4B2B" }} onClick={() => this.rejectMaterial(material)}><p>Reject</p></div>
                            </div>
                        );
                    })

                }

                {

                    //----------------------------------
                    //     APPROVED MATERIALS
                    //----------------------------------

                    (this.state.toggled && this.state.option == OPTIONS.APPROVED && this.props.isSubtopic) &&
                    this.state.approvedMaterials.map((material) => {
                        return (
                            <div className="course-material-approved">
                                <h3>{material.Course_Material_Name}</h3>
                            </div>
                        );
                    })
                }

                {
                    //---------------------------------------
                    //     MATERIALS MARKED FOR DELETION
                    //---------------------------------------

                    (this.state.toggled && this.state.option == OPTIONS.MARKED_FOR_DELETION && this.props.isSubtopic) &&
                    this.state.materialsMarkedForDeletion.map((material) => {
                        return (
                            <div className="course-material-unapproved">
                                <h3>{material.Course_Material_Name}</h3>
                                <div className="center" style={{ backgroundColor: "#EE4B2B", gridColumn: "2/4", width: "100px" }} onClick={() => this.rejectMaterial(material)}><p>delete</p></div>
                            </div>
                        );
                    })

                }

                {
                    //----------------------------------
                    //     UNAPPROVED LINKS
                    //----------------------------------

                    (this.state.toggled && this.state.option == OPTIONS.UNAPPROVED && this.props.isSubtopic) &&
                    this.state.unapprovedLinks.map((link) => {
                        return (
                            <div className="course-material-unapproved">
                                <h3 onClick={() => this.openLink(link.Link_Path)}>{link.Link_Name}</h3>
                                <div style={{ backgroundColor: "#39FF14" }} onClick={() => this.approveLink(link.Link_Path)}><p>Approve</p></div>
                                <div style={{ backgroundColor: "#EE4B2B" }} onClick={() => this.rejectLink(link.Link_Path)}><p>Reject</p></div>
                            </div>
                        );
                    })

                }

                {

                    //----------------------------------
                    //     APPROVED MATERIALS
                    //----------------------------------

                    (this.state.toggled && this.state.option == OPTIONS.APPROVED && this.props.isSubtopic) &&
                    this.state.approvedLinks.map((link) => {
                        return (
                            <div className="course-material-approved">
                                <h3 onClick={() => this.openLink(link.Link_Path)}>{link.Link_Name}</h3>
                            </div>
                        );
                    })
                }

                {
                    //---------------------------------------
                    //     MATERIALS MARKED FOR DELETION
                    //---------------------------------------

                    (this.state.toggled && this.state.option == OPTIONS.MARKED_FOR_DELETION && this.props.isSubtopic) &&
                    this.state.linksMarkedForDeletion.map((link) => {
                        return (
                            <div className="course-material-unapproved">
                                <h3 onClick={() => this.openLink(link.Link_Path)}>{link.Link_Name}</h3>
                                <div className="center" style={{ backgroundColor: "#EE4B2B", gridColumn: "2/4", width: "100px" }} onClick={() => this.rejectLink(link.Link_Path)}><p>delete</p></div>
                            </div>
                        );
                    })

                }
            </div>
        );
    }
}

export default CourseTopicItemCard;
