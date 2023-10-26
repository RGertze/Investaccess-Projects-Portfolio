
//-----------------------------------------
//        REACT IMPORTS
//-----------------------------------------

import React, { Component } from "react";

//-----------------------------------------
//        CSS IMPORTS
//-----------------------------------------

import "./parentRegistrationCard.css";

//-----------------------------------------
//        COMPONENT IMPORTS
//-----------------------------------------

import AddCard from "../addCard/addFileCard";
import EmptyListNotification from "../../../../staff-front-end/src/components/emptyListNotification/emptyListNotification";
import DeleteForever from "@material-ui/icons/DeleteForever";
import DoneRounded from "@material-ui/icons/DoneRounded";

//-----------------------------------------
//        INTERFACE IMPORTS
//-----------------------------------------

import { IAddParent, IDeleteParentRegistrationRequest, IGetParentRegistrationRequests, IParent, IResponse } from "../../interfaces";
import Connection, { GET_TYPE, POST_TYPE } from "../../connection";
import { AxiosRequestConfig } from "axios";


//-----------------------------------------
//        INTERFACE DEFINITIONS
//-----------------------------------------

interface IState {
    toggled: boolean,

    addingParent: boolean,
    parentToAdd: Map<string, string>,

    parents: IParent[]
}

interface IProps {
    token: string,
    refreshParents(): void
}


//-----------------------------------------
//        CONSTS/ENUMS
//-----------------------------------------

const PARENT_IN = [
    "ID Number",
    "Name",
    "Surname",
    "Email Address",
    "Mobile Number",
    "Home Address",
    "Home Language",
    "Religion",
    "Password"
];


//-----------------------------------------
//        CLASS DEFINITION
//-----------------------------------------

class ParentRegistrationCard extends Component<IProps, IState> {

    //----------------------
    //    CONSTRUCTOR
    //----------------------

    constructor(props: IProps) {
        super(props);

        this.state = {
            toggled: false,

            addingParent: false,
            parentToAdd: null,

            parents: []
        }
    }


    //----------------------
    //    COMP DID MOUNT
    //----------------------

    componentDidMount() {
    }


    //----------------------
    //    HANDLE TOGGLE
    //----------------------

    handleToggle = () => {
        let toggled = !this.state.toggled;
        if (toggled) {
            this.getParentRegReqs();
        }
        this.setState({ toggled: toggled });
    }


    //---------------------------
    //    TOGGLE ADDING PARENT
    //---------------------------

    toggleAddingParent = () => {
        let addingParent = !this.state.addingParent;
        this.setState({ addingParent: addingParent });
    }


    //---------------------------
    //    ADD PARENT
    //---------------------------

    addParent = async (inMap: Map<string, string>, file: File): Promise<boolean> => {
        let idNum = inMap.get(PARENT_IN[0]).trim().replace(/ +/g, "");
        let isNum = /^\d+$/.test(idNum);
        let pword = inMap.get(PARENT_IN[8]).trim();
        let name = inMap.get(PARENT_IN[1]).trim();
        let surname = inMap.get(PARENT_IN[2]).trim();
        let email = inMap.get(PARENT_IN[3]).trim();
        let mobile = inMap.get(PARENT_IN[4]).trim();
        let address = inMap.get(PARENT_IN[5]).trim();
        let language = inMap.get(PARENT_IN[6]).trim();
        let religion = inMap.get(PARENT_IN[7]).trim();

        if (idNum.length !== 11 || !isNum) {
            alert("Invalid ID number entered. ID numbers must be 11 digits long and contain only numbers");
            return false;
        }
        if (name === "") {
            alert("Please enter a name");
            return false
        }
        if (surname === "") {
            alert("Please enter a surname");
            return false
        }
        if (email === "") {
            alert("Please enter an email address");
            return false
        }
        if (address === "") {
            alert("Please enter a home address");
            return false
        }
        if (language === "") {
            alert("Please enter a language");
            return false
        }
        if (religion === "") {
            alert("Please enter a religion or enter 'None'");
            return false
        }
        if (mobile === "") {
            alert("Enter a mobile number");
            return false;
        }

        let data: IAddParent = {
            idNum: idNum,
            pword: pword,
            pName: name,
            pSurname: surname,
            pEmail: email,
            pMobile: mobile,
            pAddr: address,
            pHomeLang: language,
            pReligion: religion
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.ADD_PARENT, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert("failed to add parent: " + result.error);
            return false;
        }

        this.props.refreshParents();
        this.getParentRegReqs();
        alert("Parent successfully added");
        return true;
    }


    //---------------------------
    //    GET PARENT REG REQS
    //---------------------------

    getParentRegReqs = async () => {
        let data: IGetParentRegistrationRequests = {}

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_PARENT_REGISTRATION_REQUESTS, this.props.token, data);

        if (result.stat !== "ok") {
            this.setState({ parents: [] });
            return;
        }

        this.setState({ parents: result.data });
    }


    //------------------------------
    //    DELETE PARENT REG REQ
    //------------------------------

    deleteParentRegReq = async (idNum: string) => {

        let data: IDeleteParentRegistrationRequest = {
            idNum: idNum
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.DELETE_PARENT_REGISTRATION_REQUEST, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert("Failed to delete registration record: " + result.error);
            return;
        }

        this.getParentRegReqs();
        alert("successfully deleted registration record!");
    }


    //----------------------
    //    RENDER METHOD
    //----------------------

    render() {
        return (
            <div id="parent-registration-container" className="center">
                {
                    //----   TITLE   ----

                    <div id="parent-registration-title" className="center title-col" >
                        <div className="flex-row" style={{ gridColumn: "1/3" }} onClick={this.handleToggle}>
                            <h2 className="center">Parent Registration {this.state.toggled ? "\u25B2" : "\u25BC"}</h2>
                        </div>
                    </div>
                }

                {
                    //----   ADD FILE CARD   ----

                    this.state.addingParent &&
                    <AddCard title={"Confirm Registration"} cancel={this.toggleAddingParent} submit={this.addParent} addFile={false} uploading={false} numberInputs={[]} stringInputs={PARENT_IN} calendarInputs={[]} checkboxInputs={[]} uploadProgress={0} defaultValues={this.state.parentToAdd} />
                }

                {
                    //----   HEADER   ----

                    this.state.toggled &&
                    <div id="registration-header" className="center registration-table">
                        <h3>ID Number</h3>
                        <h3>Name</h3>
                    </div>
                }

                {
                    //----   LIST FILES   ----

                    this.state.toggled &&
                    this.state.parents.map(parentDetails => {
                        return (
                            <div className="center registration-table">
                                <p className="center" onClick={() => { }}>{parentDetails.Parent_ID_Number}</p>
                                <p className="center">{parentDetails.Parent_Name} {parentDetails.Parent_Surname}</p>
                                <DoneRounded className="approve-tick center" style={{ transform: "scale(1.3)" }} onClick={() => {
                                    let defValues = new Map([
                                        [PARENT_IN[0], parentDetails.Parent_ID_Number],
                                        [PARENT_IN[1], parentDetails.Parent_Name],
                                        [PARENT_IN[2], parentDetails.Parent_Surname],
                                        [PARENT_IN[3], parentDetails.Parent_Email],
                                        [PARENT_IN[4], parentDetails.Parent_Mobile],
                                        [PARENT_IN[5], parentDetails.Parent_Address],
                                        [PARENT_IN[6], parentDetails.Parent_Home_Language],
                                        [PARENT_IN[7], parentDetails.Parent_Religion],
                                        [PARENT_IN[8], parentDetails.Parent_Password]
                                    ]);

                                    this.setState({ parentToAdd: defValues }, () => this.toggleAddingParent())
                                }} />
                                <DeleteForever className="parent-delete-button center" style={{ transform: "scale(1.3)" }} onClick={() => this.deleteParentRegReq(parentDetails.Parent_ID_Number)} />
                            </div>
                        )
                    })
                }

                {
                    //----   EMPTY LIST NOTIF   ----

                    (this.state.toggled && this.state.parents.length === 0) &&
                    <EmptyListNotification message={"No registration requests found"} color={"#FFFFFF"} />
                }

            </div >
        );
    }
}

export default ParentRegistrationCard;
