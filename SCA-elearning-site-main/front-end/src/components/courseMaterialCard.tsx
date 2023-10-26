
//---------    REACT IMPORTS   -----------

import React, { Component } from "react";
import EmptyListNotification from "../../../staff-front-end/src/components/emptyListNotification/emptyListNotification";
import Connection, { GET_TYPE } from "../connection";

//---------    INTERFACE IMPORTS   -----------

import { ICourseMaterial, ICourseTopic, IGetLinksForMaterials, IGetMaterialByTopic, IGetMaterialPath, IGetSignedGetUrl, IGetSubtopics, ILink, IMaterialPath, IResponse, ISignedGetUrl } from "../interfaces"



//--------------------------------------
//        INTERFACE DEFINITIONS
//--------------------------------------

interface IState {
    collapsed: boolean,
    materials: ICourseMaterial[],
    links: ILink[],

    subtopics: ICourseTopic[]

}

interface IProps {
    token: string,
    username: string,

    courseID: string,
    topic: ICourseTopic,

    isSubtopic: boolean
}

//--------------------------------------
//--------------------------------------



//--------------------------------------
//        CLASS DEFINITIONS
//--------------------------------------

class CourseMaterialCard extends Component<IProps, IState> {

    //---------    CONSTRUCTOR   -----------

    constructor(props: IProps) {
        super(props);

        this.state = {
            collapsed: true,
            materials: [],

            subtopics: [],
            links: []
        }
    }


    //---------    TOGGLE COLLAPSE FUNC   -----------

    toggleCollapse = async () => {
        if (this.props.isSubtopic) {
            let materials: ICourseMaterial[] = [];

            //---  GET COURSE MATERIALS  ---
            if (this.state.materials.length === 0 && this.state.collapsed) {
                let data: IGetMaterialByTopic = {
                    courseID: parseInt(this.props.courseID),
                    topicID: this.props.topic.Course_Topic_ID
                }

                let result: IResponse = await Connection.getReq(GET_TYPE.GET_MATERIALS, this.props.token, data);

                if (result.stat !== "ok") {
                    materials = [];
                } else {
                    materials = result.data;
                }
            }

            let collapsed = !this.state.collapsed;
            this.getLinks();
            this.setState({ collapsed: collapsed, materials: materials });
        } else {
            this.getSubtopics();
            let collapsed = !this.state.collapsed;
            this.setState({ collapsed: collapsed });
        }
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


    //----------------------------------
    //      GET LINKS
    //----------------------------------

    getLinks = async () => {

        let data: IGetLinksForMaterials = {
            topicID: this.props.topic.Course_Topic_ID
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_APPROVED_LINKS_BY_TOPIC, this.props.token, data);

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


    //---------    RENDER FUNC    -----------

    render() {
        return (
            <div id="course-material-card-container" style={{ paddingBottom: `${this.state.collapsed ? "0px" : "10px"}` }} >
                <div id="course-material-card-toggle" onClick={this.toggleCollapse} style={{ backgroundColor: `${this.props.isSubtopic ? "#CB7B3E" : "#C0552B"}` }}>
                    <h2>{this.props.topic.Course_Topic_Name}</h2>
                </div>

                {
                    !this.state.collapsed &&
                    this.state.links.map((links) => {
                        return (
                            <div key={links.Link_Path}>
                                <h4 id="course-material-link" className="center" onClick={() => { this.openLink(links.Link_Path) }}>{links.Link_Name}</h4>
                            </div>
                        );
                    })
                }

                {
                    !this.state.collapsed &&
                    this.state.materials.map((material) => {
                        return (
                            <div key={material.Course_Material_Name}>
                                <h4 id="course-material-link" className="center" onClick={() => { this.saveFile(material.Course_Material_Path, material.Course_Material_Name) }}>{material.Course_Material_Name}</h4>
                            </div>
                        );
                    })
                }

                {
                    (this.state.materials.length === 0 && this.state.links.length === 0 && !this.state.collapsed && this.props.isSubtopic) &&
                    <EmptyListNotification message={"No materials available"} />
                }

                {
                    //---------    LIST SUBTOPICS    -----------
                    (!this.state.collapsed && !this.props.isSubtopic) &&
                    this.state.subtopics.map(subtopic => {
                        return (
                            <CourseMaterialCard isSubtopic={true} topic={subtopic} token={this.props.token} courseID={this.props.courseID} username={this.props.username} />
                        )
                    })
                }

                {
                    (this.state.subtopics.length === 0 && !this.state.collapsed && !this.props.isSubtopic) &&
                    <EmptyListNotification message={"No subtopics available"} />
                }

            </div>
        );
    }

}

export default CourseMaterialCard;

//--------------------------------------
//--------------------------------------
