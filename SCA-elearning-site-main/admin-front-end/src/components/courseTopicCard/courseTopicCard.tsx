
//----------------------------------
//      REACT IMPORTS
//----------------------------------

import React, { Component } from "react";
import Connection, { POST_TYPE, GET_TYPE } from "../../connection";

//----------------------------------
//      COMPONENT IMPORTS
//----------------------------------

import CourseTopicItemCard from "../courseTopicItemCard/courseTopicItemCard";
import AddRounded from "@material-ui/icons/AddRounded";

//----------------------------------
//      CSS IMPORTS
//----------------------------------

import "./courseTopicCard.css";


//----------------------------------
//      INTERFACE IMPORTS
//----------------------------------

import { IAddCourseTopic, ICourseDetails, ICourseTopic, IGetCourseTopics, IResponse } from "../../interfaces";
import AddTopicCard from "../addTopicCard/addTopicCard";


//----------------------------------
//      INTERFACE DEFINITIONS
//----------------------------------

interface IState {
    toggled: boolean,
    addingTopic: boolean,

    topicName: string,
    topics: ICourseTopic[]
}

interface IProps {
    token: string,
    course: ICourseDetails
}


//----------------------------------
//      CLASS DEFINITION
//----------------------------------

class CourseTopicCard extends Component<IProps, IState> {

    //----------------------------------
    //      CONSTRUCTOR
    //----------------------------------

    constructor(props: IProps) {
        super(props);

        this.state = {
            toggled: false,
            addingTopic: false,

            topicName: "",
            topics: []
        }
    }

    //----------------------------------
    //      COMP DID MOUNT
    //----------------------------------

    componentDidMount() {
        this.getCourseTopics();
    }


    //----------------------------------
    //      TOGGLE ADD TOPIC
    //----------------------------------

    toggleAddTopic = async () => {
        let addingTopic = !this.state.addingTopic;
        this.setState({ addingTopic: addingTopic });
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
    //      GET COURSE TOPICS
    //----------------------------------

    getCourseTopics = async () => {
        let data: IGetCourseTopics = {
            courseID: this.props.course.Course_ID
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_COURSE_TOPICS, this.props.token, data);

        if (result.stat === "ok") {
            this.setState({ topics: result.data });
            return;
        }

        this.setState({ topics: [] });
    }


    //----------------------------------
    //      RENDER METHOD
    //----------------------------------

    render() {
        return (
            <div id="course-topic-card-container">

                {
                    //----------------------------------
                    //      ADD TOPIC OVERLAY
                    //----------------------------------
                    this.state.addingTopic &&
                    <AddTopicCard title={"Add Topic"} isUpdating={false} valueToUpdate={null} token={this.props.token} courseID={this.props.course.Course_ID} addSubtopic={false} parentTopicId={0} cancel={this.toggleAddTopic} refreshTopics={this.getCourseTopics} />
                }

                <div id="course-topic-card-heading" onClick={this.handleToggle}>
                    <h3>Topics {this.state.toggled ? "\u25B2" : "\u25BC"}</h3>
                </div>


                {
                    //----------------------------------
                    //      DISPLAY TOPICS
                    //----------------------------------

                    this.state.toggled &&
                    <div id="course-topics-list">

                        <div className="flex-row add-rounded-button center" style={{ width: "30px", height: "30px", marginBottom: "10px" }} onClick={this.toggleAddTopic}>
                            <AddRounded style={{ transform: "scale(1.5)" }} />
                        </div>

                        {
                            this.state.topics.map((topic) => {
                                return (
                                    <CourseTopicItemCard isSubtopic={false} token={this.props.token} courseID={this.props.course.Course_ID} topic={topic} refreshTopics={this.getCourseTopics} parentTopicID={0} />
                                );
                            })
                        }
                    </div>
                }
            </div>
        );
    }
}

export default CourseTopicCard;
