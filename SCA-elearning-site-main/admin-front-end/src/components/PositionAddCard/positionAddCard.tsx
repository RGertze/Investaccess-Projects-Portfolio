
//----------------------------------
//      REACT IMPORTS
//----------------------------------

import React, { Component } from "react";
import Connection, { POST_TYPE, GET_TYPE } from "../../connection";

//----------------------------------
//      COMPONENT IMPORTS
//----------------------------------


//----------------------------------
//      CSS IMPORTS
//----------------------------------

import "./positionAddCard.css";


//----------------------------------
//      INTERFACE IMPORTS
//----------------------------------

import { IAddCourseTopic, IAddPosition, ICourseDetails, ICourseTopic, IGetCourseTopics, IResponse } from "../../interfaces";


//----------------------------------
//      INTERFACE DEFINITIONS
//----------------------------------

interface IState {
    toggled: boolean,

    posNameIn: string,
    posDescIn: string,
    posLevelIn: number
}

interface IProps {
    token: string,
    refreshPositions(): void
}


//----------------------------------
//      CLASS DEFINITION
//----------------------------------

class PositionAddCard extends Component<IProps, IState> {

    //----------------------------------
    //      CONSTRUCTOR
    //----------------------------------

    constructor(props: IProps) {
        super(props);

        this.state = {
            toggled: false,
            posNameIn: "",
            posDescIn: "",
            posLevelIn: 0
        }
    }

    //----------------------------------
    //      COMP DID MOUNT
    //----------------------------------

    componentDidMount() {
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
    //      VALIDATE INPUT
    //----------------------------------

    validateInput = (): boolean => {
        if (this.state.posNameIn === "") {
            alert("fill in a position name");
            return false;
        }
        if (this.state.posDescIn === "") {
            alert("fill in a position description");
            return false;
        }
        if (this.state.posLevelIn < 0 || this.state.posLevelIn > 7) {
            alert("fill in a valide grade");
            return false;
        }
        return true;
    }


    //----------------------------------
    //      CLEAR INPUT
    //----------------------------------

    clearInput = () => {
        this.setState({
            posNameIn: "",
            posDescIn: "",
            posLevelIn: 0
        });
    }


    //----------------------------------
    //      ADD POSITION
    //----------------------------------

    addPosition = async () => {
        if (this.validateInput) {
            let data: IAddPosition = {
                posName: this.state.posNameIn,
                posDesc: this.state.posDescIn,
                posLevel: this.state.posLevelIn
            }

            let result: IResponse = await Connection.postReq(POST_TYPE.ADD_POSITION, this.props.token, data, {});

            if (result.stat === "ok") {
                alert("successfully added position");
                this.clearInput();
                this.props.refreshPositions();
                return;
            }

            alert("failed to add position");
        }
    }


    //----------------------------------
    //      RENDER METHOD
    //----------------------------------

    render() {
        return (
            <div id="student-add-card-container">
                <div id={this.state.toggled ? "student-add-card-title" : "student-add-card-title-untoggled"} onClick={this.handleToggle}><h3>Add New Position {this.state.toggled ? "\u25B2" : "\u25BC"}</h3></div>
                {this.state.toggled &&
                    <div id="student-add-card-content-container">
                        <div className="student-add-card-input-element">
                            <label >Name:</label>
                            <input value={this.state.posNameIn} type="text" onChange={(ev) => this.setState({ posNameIn: ev.target.value })} />
                        </div>
                        <div className="student-add-card-input-element">
                            <label >Description:</label>
                            <input value={this.state.posDescIn} type="text" onChange={(ev) => this.setState({ posDescIn: ev.target.value })} />
                        </div>
                        <div className="student-add-card-input-element">
                            <label >Grade:</label>
                            <input value={this.state.posLevelIn} type="number" onChange={(ev) => this.setState({ posLevelIn: parseInt(ev.target.value) })} />
                        </div>

                        <div id="student-add-card-button-container">
                            <button className="student-add-card-button" onClick={() => {
                                this.addPosition();
                            }}>Add</button>
                            <button className="student-add-card-button" onClick={() => {
                                this.clearInput();
                            }}>Clear</button>
                        </div>

                    </div>
                }
            </div>
        );
    }
}

export default PositionAddCard;
