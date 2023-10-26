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

import { IGetRootResourceTopicsForStudents, IResourceTopic, IResponse } from "../../interfaces";
import Connection, { GET_TYPE } from "../../connection";
import ResourceTopic from "../resourceTopic/resourceTopic";
import EmptyListNotification from "../../../../staff-front-end/src/components/emptyListNotification/emptyListNotification";


//-----------------------------------------
//        INTERFACE DEFINITIONS
//-----------------------------------------

interface IState {
    rootTopics: IResourceTopic[]
}

interface IProps {
    token: string
}


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
            rootTopics: []
        }
    }


    //----------------------
    //    COMP DID MOUNT
    //----------------------

    componentDidMount() {
        this.getRootResourceTopics();
    }


    //---------------------------------
    //    GET ROOT RESOURCE TOPICS
    //---------------------------------

    getRootResourceTopics = async () => {
        let data: IGetRootResourceTopicsForStudents = {
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_ROOT_RESOURCE_TOPICS_FOR_STUDENT, this.props.token, data);

        if (result.stat !== "ok") {
            this.setState({ rootTopics: [] });
            return;
        }

        this.setState({ rootTopics: result.data });
    }


    //----------------------
    //    RENDER METHOD
    //----------------------

    render() {
        return (
            <div id="resources-section-container">

                {
                    //----   LIST ROOT TOPICS   ----

                    this.state.rootTopics.map(rootTopic => {
                        return (
                            <ResourceTopic topic={rootTopic} token={this.props.token} isRoot={true} maxDepth={2} currentDepth={0} />
                        )
                    })
                }

                {
                    this.state.rootTopics.length === 0 &&
                    <EmptyListNotification message={"No folders found"} />
                }

            </div>
        );
    }
}

export default ResourcesSection;
