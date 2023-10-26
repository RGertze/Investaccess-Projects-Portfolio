
//----------------------------------
//      REACT IMPORTS
//----------------------------------

import React, { Component } from "react";
import Connection, { POST_TYPE, GET_TYPE } from "../../connection";

//----------------------------------
//      COMPONENT IMPORTS
//----------------------------------
import CircularProgress from "@material-ui/core/CircularProgress";

//----------------------------------
//      CSS IMPORTS
//----------------------------------

import "./addTopicCard.css";


//----------------------------------
//      INTERFACE IMPORTS
//----------------------------------

import { IAddCourseTopic, IAddPosition, IAddSubtopic, ICourseDetails, ICourseTopic, IGetCourseTopics, IResponse, IUpdateCourseTopic } from "../../interfaces";


//----------------------------------
//      INTERFACE DEFINITIONS
//----------------------------------

interface IState {
    toggled: boolean,
    loading: boolean,

    topicNameIn: string,
}

interface IProps {
    title: string,
    addSubtopic: boolean,

    isUpdating: boolean,
    valueToUpdate: ICourseTopic,

    token: string,
    courseID: number,
    parentTopicId: number,
    cancel(): void,
    refreshTopics(): void
}


//----------------------------------
//      CLASS DEFINITION
//----------------------------------

class AddTopicCard extends Component<IProps, IState> {

    //----------------------------------
    //      CONSTRUCTOR
    //----------------------------------

    constructor(props: IProps) {
        super(props);

        this.state = {
            toggled: false,
            loading: false,
            topicNameIn: `${this.props.isUpdating ? this.props.valueToUpdate.Course_Topic_Name : ""}`
        }
    }


    //----------------------------------
    //      ADD COURSE TOPIC
    //----------------------------------

    addCourseTopic = async () => {
        if (this.state.topicNameIn === "") {
            alert("please enter a topic name");
            return;
        }

        this.setState({ loading: true });

        let data: IAddCourseTopic = {
            courseID: this.props.courseID,
            topicName: this.state.topicNameIn
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.ADD_COURSE_TOPIC, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert(result.error);
            this.setState({ loading: false });
            return;
        }

        alert("successfully added topic");
        this.props.refreshTopics();
        this.props.cancel();
    }


    //----------------------------------
    //      ADD SUBTOPIC
    //----------------------------------

    addSubtopic = async () => {
        if (this.state.topicNameIn === "") {
            alert("please enter a topic name");
            return;
        }

        this.setState({ loading: true });

        let data: IAddSubtopic = {
            parentTopicID: this.props.parentTopicId,
            topicName: this.state.topicNameIn
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.ADD_SUBTOPIC, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert(result.error);
            this.setState({ loading: false });
            return;
        }

        alert("successfully added subtopic");
        this.props.refreshTopics();
        this.props.cancel();
    }


    //----------------------------------
    //      UPDATE TOPIC
    //----------------------------------

    updateTopic = async () => {
        if (this.state.topicNameIn === "") {
            alert("please enter a topic name");
            return;
        }

        this.setState({ loading: true });

        let data: IUpdateCourseTopic = {
            topicID: this.props.valueToUpdate.Course_Topic_ID,
            topicName: this.state.topicNameIn
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.UPDATE_TOPIC, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert(result.error);
            this.setState({ loading: false });
            return;
        }

        alert("successfully updated subtopic");
        this.props.refreshTopics();
        this.props.cancel();
    }


    //----------------------------------
    //      RENDER METHOD
    //----------------------------------

    render() {
        return (
            <div className="add-card-overlay">
                <div id="course-topics-add-container">
                    <h3>{this.props.title}:</h3>
                    <div id="course-topics-add-input">
                        <p>Name: </p>
                        <input value={this.state.topicNameIn} style={{ width: "40%" }} type="text" onChange={ev => this.setState({ topicNameIn: ev.target.value })} />
                        <button onClick={() => {
                            if (this.props.isUpdating) {
                                this.updateTopic();
                            } else {
                                if (this.props.addSubtopic) {
                                    this.addSubtopic();
                                } else {
                                    this.addCourseTopic();
                                }
                            }
                        }}>{`${this.props.isUpdating ? "Update" : "Add"}`}</button>

                        <button onClick={this.props.cancel}>Cancel</button>
                    </div>

                    {
                        this.state.loading &&
                        <div className="center" style={{ width: "50px", color: "white" }} >
                            <CircularProgress size={30} color={"inherit"} />
                        </div>
                    }

                </div>

            </div>
        );
    }
}

export default AddTopicCard;
