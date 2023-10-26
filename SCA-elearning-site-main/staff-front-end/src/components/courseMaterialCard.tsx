
//---------    REACT IMPORTS   -----------

import React, { Component } from "react";
import Connection, { GET_TYPE, POST_TYPE } from "../connection";


//---------    COMPONENT IMPORTS   -----------

import NoteAddRounded from "@material-ui/icons/NoteAddRounded";
import InsertLinkRounded from "@material-ui/icons/InsertLinkRounded";
import AddFileCard from "./addFileCard/addFileCard";
import EmptyListNotification from "./emptyListNotification/emptyListNotification";


//---------    INTERFACE IMPORTS   -----------

import { IAddCourseMaterial, IAddLink, ICourseMaterial, ICourseTopic, IGetLinksForMaterials, IGetMaterialByTopic, IGetMaterialPath, IGetSignedGetUrl, IGetSignedPostUrl, IGetSubtopics, ILink, IMarkLinkForDeletion, IMarkMaterialForDeletion, IMaterialPath, IResponse, ISignedGetUrl, ISignedPostUrl, IUnmarkLinkForDeletion, IUnmarkMaterialForDeletion } from "../interfaces"
import { AxiosRequestConfig } from "axios";
import { DeleteForever } from "@mui/icons-material";
import { CloseRounded } from "@material-ui/icons";


//--------------------------------------
//        ENUM DEFINITIONS
//--------------------------------------

enum OPTIONS {
    APPROVED = 1,
    UNAPPROVED = 2,
    MARKED_FOR_DELETION = 3
}


//--------------------------------------
//        INTERFACE DEFINITIONS
//--------------------------------------

interface IState {
    collapsed: boolean,

    addingMaterial: boolean,
    addingLink: boolean,
    uploading: boolean,
    uploadValue: number,
    option: OPTIONS,

    approvedMaterials: ICourseMaterial[],
    unapprovedMaterials: ICourseMaterial[],
    materialsMarkedForDeletion: ICourseMaterial[],

    subtopics: ICourseTopic[],

    approvedLinks: ILink[],
    unapprovedLinks: ILink[],
    linksMarkedForDeletion: ILink[]
}

interface IProps {
    token: string,
    staffID: string,

    courseID: string,
    isSubtopic: boolean,
    topic: ICourseTopic
}


//--------------------------------------
//        CONSTS
//--------------------------------------

export const LINK_INPUT = [
    "Link",
    "Name for link"
];


//--------------------------------------
//        CLASS DEFINITIONS
//--------------------------------------

class CourseMaterialCard extends Component<IProps, IState> {

    //---------    CONSTRUCTOR   -----------

    constructor(props: IProps) {
        super(props);

        this.state = {
            collapsed: true,
            addingMaterial: false,
            addingLink: false,
            uploading: false,
            uploadValue: 0,
            option: OPTIONS.APPROVED,
            approvedMaterials: [],
            unapprovedMaterials: [],
            materialsMarkedForDeletion: [],
            subtopics: [],
            approvedLinks: [],
            unapprovedLinks: [],
            linksMarkedForDeletion: []
        }
    }


    //---------    TOGGLE COLLAPSE FUNC   -----------

    toggleCollapse = async () => {

        //---    GET COURSE MATERIALS    ---

        if (this.state.collapsed && this.props.isSubtopic) {
            this.getMaterials();
            this.getLinks();
        } else if (this.state.collapsed && !this.props.isSubtopic) {
            this.getSubtopics();
        }

        let collapsed = !this.state.collapsed;
        this.setState({ collapsed: collapsed });
    }


    //---------    TOGGLE ADD FILE   -----------

    toggleAddFile = async () => {
        let addingMaterial = !this.state.addingMaterial;
        this.setState({ addingMaterial: addingMaterial });
    }


    //---------    TOGGLE ADD LINK   -----------

    toggleAddLink = async () => {
        let addingLink = !this.state.addingLink;
        this.setState({ addingLink: addingLink });
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
    //      ADD MATERIAL
    //----------------------------------
    addMaterial = async (inputArray: Map<string, string>, file: File): Promise<boolean> => {

        if (file !== null) {

            //--        SET UPLOADING TO TRUE       --

            this.setState({ uploading: true });


            let getUrlData: IGetSignedPostUrl = {
                originalFileName: file.name
            }

            //--        GET SIGNED POST URL       --

            let result: IResponse = await Connection.getReq(GET_TYPE.GET_SIGNED_POST_URL, this.props.token, getUrlData);

            if (result.stat !== "ok") {
                alert(result.error);
                this.setState({ uploadValue: 0, uploading: false });
                return false;
            }

            let urlData: ISignedPostUrl = result.data;

            //--       SETUP CONFIG TO MONITOR UPLOAD PROGRESS      --

            let config: AxiosRequestConfig = {
                onUploadProgress: (progressEvent) => {
                    const { loaded, total } = progressEvent;
                    let progress = Math.floor(loaded / total * 100);
                    this.setState({ uploadValue: progress });
                }
            }

            let uploadStatus = await Connection.uploadFile(urlData.url, file, config);


            if (uploadStatus !== 200) {
                alert("upload failed");
                this.setState({ uploadValue: 0, uploading: false });
                return false;
            }

            //--       SEND ASSIGNMENT DETAILS TO SERVER      --

            let data: IAddCourseMaterial = {
                courseID: parseInt(this.props.courseID),
                materialPath: urlData.filePath,
                materialName: file.name,
                courseTopicID: this.props.topic.Course_Topic_ID
            }

            result = await Connection.postReq(POST_TYPE.ADD_COURSE_MATERIAL, this.props.token, data, {});

            if (result.stat !== "ok") {
                alert("Upload failed");
                this.setState({ uploadValue: 0, uploading: false });
                return false;
            }

            alert("successfully submitted material for approval");

            //--  RESET UPLOAD VALUES  --

            this.setState({ uploadValue: 0, uploading: false });
            return true;
        } else {
            alert("No file chosen");
            return false
        }
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
            linkType: 1,
            linkTopicID: this.props.topic.Course_Topic_ID,
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
    //      GET MATERIALS
    //----------------------------------

    getMaterials = async () => {

        let data: IGetMaterialByTopic = {
            courseID: parseInt(this.props.courseID),
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


    //---------    SAVE FILE FUNC   -----------

    saveFile = async (materialPath: string, materialName: string) => {

        let urlData: IGetSignedGetUrl = {
            filePath: materialPath
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_SIGNED_GET_URL, this.props.token, urlData);

        if (result.stat !== "ok") {
            alert(result.error);
        } else {
            let data: ISignedGetUrl = result.data;
            await Connection.saveFileS3(data.url, materialName);
        }
    }


    //-------------------------------------
    //      MARK MATERIAL FOR DELETION
    //-------------------------------------

    markMaterialForDeletion = async (materialPath: string) => {
        let data: IMarkMaterialForDeletion = {
            materialPath: materialPath,
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.MARK_MATERIAL_FOR_DELETION, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert("failed to mark for deletion: " + result.error);
            return;
        }

        this.getMaterials();
    }


    //-------------------------------------
    //      UNMARK MATERIAL FOR DELETION
    //-------------------------------------

    unmarkMaterialForDeletion = async (materialPath: string) => {
        let data: IUnmarkMaterialForDeletion = {
            materialPath: materialPath
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.UNMARK_MATERIAL_FOR_DELETION, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert("failed to unmark for deletion: " + result.error);
            return;
        }

        this.getMaterials();
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


    //-------------------------------------
    //      MARK LINK FOR DELETION
    //-------------------------------------

    markLinkForDeletion = async (linkPath: string) => {
        let data: IMarkLinkForDeletion = {
            linkPath: linkPath,
            linkType: 1,
            linkTopicID: this.props.topic.Course_Topic_ID
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.MARK_LINK_FOR_DELETION, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert("failed to mark for deletion: " + result.error);
            return;
        }

        this.getLinks();
    }


    //-------------------------------------
    //      UNMARK LINK FOR DELETION
    //-------------------------------------

    unmarkLinkForDeletion = async (linkPath: string) => {
        let data: IUnmarkLinkForDeletion = {
            linkPath: linkPath,
            linkType: 1,
            linkTopicID: this.props.topic.Course_Topic_ID
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.UNMARK_LINK_FOR_DELETION, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert("failed to unmark for deletion: " + result.error);
            return;
        }

        this.getLinks();
    }



    //---------    RENDER FUNC    -----------

    render() {
        return (
            <div id="course-material-card-container" style={{ paddingBottom: `${this.state.collapsed ? "0px" : "10px"}` }}>

                <div id="course-material-card-toggle" className={`${this.props.isSubtopic ? "title-col" : "flex-row"}`} style={{ backgroundColor: `${this.props.isSubtopic ? "#CB7B3E" : "#C0552B"}` }}>

                    <div className="flex-row" id="material-card-title" onClick={this.toggleCollapse}>
                        <h2 className="center">{this.props.topic.Course_Topic_Name}</h2>
                    </div>

                    {
                        this.props.isSubtopic &&
                        <div id="material-add-buttons" className="center flex-row" >
                            <InsertLinkRounded id="material-add-button" style={{ transform: "scale(1.3)" }} onClick={this.toggleAddLink} />
                            <NoteAddRounded id="material-add-button" style={{ transform: "scale(1.3)" }} onClick={this.toggleAddFile} />
                        </div>
                    }

                </div>

                {
                    //----   LIST SUBTOPICS   ----
                    (!this.state.collapsed && !this.props.isSubtopic) &&
                    this.state.subtopics.map(subtopic => {
                        return (
                            <CourseMaterialCard isSubtopic={true} topic={subtopic} token={this.props.token} staffID={this.props.staffID} courseID={this.props.courseID} />
                        )
                    })
                }

                {
                    (!this.state.collapsed && !this.props.isSubtopic && this.state.subtopics.length === 0) &&
                    <EmptyListNotification message={"no subtopics found"} />
                }

                {
                    //----   ADD MATERIAL   ----

                    this.state.addingMaterial &&
                    <AddFileCard checkboxInputs={[]} addFile={true} title={"Add material"} cancel={this.toggleAddFile} submit={this.addMaterial} uploading={this.state.uploading} numberInputs={[]} stringInputs={[]} calendarInputs={[]} uploadProgress={this.state.uploadValue} />
                }

                {
                    //----   ADD LINK   ----

                    this.state.addingLink &&
                    <AddFileCard checkboxInputs={[]} addFile={false} title={"Add Link"} cancel={this.toggleAddLink} submit={this.addLink} uploading={false} numberInputs={[]} stringInputs={LINK_INPUT} calendarInputs={[]} uploadProgress={0} />
                }

                {

                    //----------------------------------
                    //      OPTION TABS
                    //----------------------------------

                    (!this.state.collapsed && this.props.isSubtopic) &&
                    <div id="course-material-options">

                        <div className="course-material-option approved" onClick={() => { this.setState({ option: OPTIONS.APPROVED }, () => { this.getMaterials(); this.getLinks(); }) }}>

                            <h4 style={{ borderBottom: this.state.option == OPTIONS.APPROVED ? "3px solid #41B3A3" : "none" }}>
                                Approved
                            </h4>
                        </div>

                        <div className="divisor"></div>

                        <div className="course-material-option unapproved" onClick={() => { this.setState({ option: OPTIONS.UNAPPROVED }, () => { this.getMaterials(); this.getLinks(); }) }}>
                            <h4 style={{ borderBottom: this.state.option == OPTIONS.UNAPPROVED ? "3px solid #41B3A3" : "none" }}>
                                Unapproved
                            </h4>
                        </div>

                        <div className="divisor"></div>

                        <div className="course-material-option marked-for-deletion" onClick={() => { this.setState({ option: OPTIONS.MARKED_FOR_DELETION }, () => { this.getMaterials(); this.getLinks(); }) }}>
                            <h4 style={{ borderBottom: this.state.option == OPTIONS.MARKED_FOR_DELETION ? "3px solid #41B3A3" : "none" }}>
                                Marked for deletion
                            </h4>
                        </div>

                    </div>

                }

                {

                    //----------------------------------
                    //      APPROVED MATERIALS
                    //----------------------------------

                    (!this.state.collapsed && this.state.option == OPTIONS.APPROVED && this.props.isSubtopic) &&
                    this.state.approvedMaterials.map((material) => {
                        return (
                            <div key={material.Course_Material_Name}>
                                <div className="title-col center course-material-link-container">
                                    <h4 id="course-material-link" style={{ gridColumn: 1 }} onClick={() => { this.saveFile(material.Course_Material_Path, material.Course_Material_Name) }}>
                                        {material.Course_Material_Name}
                                    </h4>

                                    <DeleteForever id="course-material-delete" className="center" onClick={() => this.markMaterialForDeletion(material.Course_Material_Path)} />

                                    {
                                        //<div id="course-material-delete" className="flex-row" onClick={() => this.markMaterialForDeletion(material.Course_Material_Path)}><p>mark for deletion</p></div>
                                    }
                                </div>
                            </div>
                        );
                    })
                }

                {

                    //----------------------------------
                    //      UNAPPROVED MATERIALS
                    //----------------------------------

                    (!this.state.collapsed && this.state.option == OPTIONS.UNAPPROVED && this.props.isSubtopic) &&
                    this.state.unapprovedMaterials.map((material) => {
                        return (
                            <div key={material.Course_Material_Name}>
                                <div className="title-col center course-material-link-container">
                                    <h4 id="course-material-link" style={{ gridColumn: 1 }} onClick={() => { this.saveFile(material.Course_Material_Path, material.Course_Material_Name) }}>
                                        {material.Course_Material_Name}
                                    </h4>


                                    <DeleteForever id="course-material-delete" className="center" onClick={() => this.markMaterialForDeletion(material.Course_Material_Path)} />

                                    {
                                        //<div id="course-material-delete" className="flex-row" onClick={() => this.markMaterialForDeletion(material.Course_Material_Path)}><p>mark for deletion</p></div>
                                    }
                                </div>
                            </div>
                        );
                    })
                }

                {

                    //--------------------------------------
                    //      MATERIALS MARKED FOR DELETION
                    //--------------------------------------

                    (!this.state.collapsed && this.state.option == OPTIONS.MARKED_FOR_DELETION && this.props.isSubtopic) &&
                    this.state.materialsMarkedForDeletion.map((material) => {
                        return (
                            <div key={material.Course_Material_Name}>
                                <div className="title-col center course-material-link-container">
                                    <h4 id="course-material-link" onClick={() => { this.saveFile(material.Course_Material_Path, material.Course_Material_Name) }}>{material.Course_Material_Name}</h4>

                                    <CloseRounded id="course-material-delete" className="center" onClick={() => this.unmarkMaterialForDeletion(material.Course_Material_Path)} />
                                    {
                                        //<div id="course-material-delete" className="flex-row" onClick={() => this.unmarkMaterialForDeletion(material.Course_Material_Path)}><p>cancel deletion</p></div>
                                    }
                                </div>
                            </div>
                        );
                    })
                }

                {

                    //----------------------------------
                    //      APPROVED LINKS
                    //----------------------------------

                    (!this.state.collapsed && this.state.option == OPTIONS.APPROVED && this.props.isSubtopic) &&
                    this.state.approvedLinks.map((link) => {
                        return (
                            <div key={link.Link_Path}>
                                <div className="title-col center course-material-link-container">
                                    <h4 id="course-material-link" style={{ gridColumn: 1 }} onClick={() => this.openLink(link.Link_Path)}>
                                        {link.Link_Name}
                                    </h4>

                                    <DeleteForever id="course-material-delete" className="center" onClick={() => this.markLinkForDeletion(link.Link_Path)} />

                                    {
                                        //<div id="course-material-delete" className="flex-row" onClick={() => this.markLinkForDeletion(link.Link_Path)}><p>mark for deletion</p></div>
                                    }
                                </div>
                            </div>
                        );
                    })
                }

                {

                    //----------------------------------
                    //      UNAPPROVED MATERIALS
                    //----------------------------------

                    (!this.state.collapsed && this.state.option == OPTIONS.UNAPPROVED && this.props.isSubtopic) &&
                    this.state.unapprovedLinks.map((link) => {
                        return (
                            <div key={link.Link_Path}>
                                <div className="title-col center course-material-link-container">
                                    <h4 id="course-material-link" style={{ gridColumn: 1 }} onClick={() => this.openLink(link.Link_Path)}>
                                        {link.Link_Name}
                                    </h4>

                                    <DeleteForever id="course-material-delete" className="center" onClick={() => this.markLinkForDeletion(link.Link_Path)} />

                                    {
                                        //<div id="course-material-delete" className="flex-row" onClick={() => this.markLinkForDeletion(link.Link_Path)}><p>mark for deletion</p></div>
                                    }
                                </div>
                            </div>
                        );
                    })
                }

                {

                    //--------------------------------------
                    //      MATERIALS MARKED FOR DELETION
                    //--------------------------------------

                    (!this.state.collapsed && this.state.option == OPTIONS.MARKED_FOR_DELETION && this.props.isSubtopic) &&
                    this.state.linksMarkedForDeletion.map((link) => {
                        return (
                            <div key={link.Link_Path}>
                                <div className="title-col center course-material-link-container">
                                    <h4 id="course-material-link" onClick={() => this.openLink(link.Link_Path)}>{link.Link_Name}</h4>

                                    <CloseRounded id="course-material-delete" className="center" onClick={() => this.unmarkLinkForDeletion(link.Link_Path)} />

                                    {
                                        //<div id="course-material-delete" className="flex-row" onClick={() => this.unmarkLinkForDeletion(link.Link_Path)}><p>cancel deletion</p></div>
                                    }
                                </div>
                            </div>
                        );
                    })
                }
            </div >
        );
    }

}

export default CourseMaterialCard;

//--------------------------------------
//--------------------------------------
