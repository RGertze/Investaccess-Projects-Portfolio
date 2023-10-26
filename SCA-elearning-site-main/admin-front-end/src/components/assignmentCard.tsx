
//#######################################
//      REACT IMPORTS
//#######################################

import React, { Component } from "react";

//#######################################
//      CONNECTION IMPORTS
//#######################################

import Connection, { GET_TYPE, POST_TYPE } from "../connection";

//#######################################
//      INTERFACE/ENUM IMPORTS
//#######################################

import { IAssignmentMark, ICourseAssignment, IGetAssignmentMark, IGetSignedGetUrl, IResponse, ISignedGetUrl, IStudentsInCourse, IUpdateStudentAssignmentMark } from "../interfaces";


//#######################################
//      INTERFACE DEFINITIONS
//#######################################

interface IState {
    mark: string,
    updatedMark: string
}

interface IProps {
    token: string,

    studentID: number,
    assignment: ICourseAssignment
}

//#######################################
//#######################################



//#######################################
//      CLASS DEFINITION
//#######################################

class AssignmentCard extends Component<IProps, IState> {

    //#######################################
    //      CONSTRUCTOR
    //#######################################

    constructor(props: IProps) {
        super(props);

        this.state = {
            mark: "0.00",
            updatedMark: ""
        }
    }

    //#######################################
    //      COMPONENT DID MOUNT
    //#######################################

    componentDidMount() {
        this.getMark();
    }


    //#######################################
    //      MARK INPUT HANDLING
    //#######################################

    handleMarkInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ updatedMark: ev.target.value });
    }


    //#######################################
    //      GET MARK
    //#######################################

    getMark = async () => {
        let data: IGetAssignmentMark = {
            username: this.props.studentID.toString(),
            assignmentPath: this.props.assignment.Course_Assignment_Path
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_ASSIGNMENT_MARK, this.props.token, data);

        if (result.stat !== "ok") {
            return;
        }

        let mark: IAssignmentMark = result.data;

        this.setState({ mark: mark.Assignment_Mark.toString() });
    }


    //#######################################
    //      UPDATE MARK
    //#######################################

    updateMark = async () => {

        if (this.state.updatedMark !== "") {

            let data: IUpdateStudentAssignmentMark = {
                username: this.props.studentID.toString(),
                courseAssignmentPath: this.props.assignment.Course_Assignment_Path,
                mark: parseFloat(this.state.updatedMark)
            }

            let result: IResponse = await Connection.postReq(POST_TYPE.UPDATE_STUDENT_ASSIGNMENT_MARK, this.props.token, data, {});

            if (result.stat !== "ok") {
                alert(result.error);
                return;
            }

            alert("Successfully updated mark");
            this.setState({ updatedMark: "", mark: data.mark.toString() });

        } else {
            alert("No mark was entered");
        }
    }


    //#######################################
    //      RENDER METHOD
    //#######################################

    render() {
        return (
            <div id="assignment-card-container">
                <p style={{ gridColumn: 1 }}>{this.props.assignment.Course_Assignment_Name}</p>
                <p style={{ gridColumn: 2 }}>{this.props.assignment.Course_Assignment_Marks_Available}</p>
                <p style={{ gridColumn: 3 }}>{this.state.mark}</p>
                <div id="assignment-card-mark-update">
                    <input style={{ width: "30%" }} type="number" value={this.state.updatedMark} onChange={(ev) => this.handleMarkInput(ev)} />
                    <button style={{ width: "fit-content" }} onClick={this.updateMark}>Update</button>
                </div>
            </div>
        );
    }
}

export default AssignmentCard;
