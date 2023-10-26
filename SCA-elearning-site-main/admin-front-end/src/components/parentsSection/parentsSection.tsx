
//-----------------------------------------
//        REACT IMPORTS
//-----------------------------------------

import React, { Component } from "react";

//-----------------------------------------
//        CSS IMPORTS
//-----------------------------------------

import "./parentsSection.css";

//-----------------------------------------
//        COMPONENT IMPORTS
//-----------------------------------------

import AddRounded from "@material-ui/icons/AddRounded";
import AddCard from "../addCard/addFileCard";
import ParentCard from "../parentCard/parentCard";
import ParentFilesCard, { PARENT_FILE_TYPE } from "../parentFilesCard/parentFilesCard";
import ParentRegistrationCard from "../parentRegistrationCard/parentRegistrationCard";
import TermsAndConditionsCard from "../termsAndConditionsCard/termsAndConditions";

//-----------------------------------------
//        INTERFACE IMPORTS
//-----------------------------------------

import { IAddParent, IAddSuggestion, IGetAllParents, IParent, IResponse } from "../../interfaces";
import Connection, { GET_TYPE, POST_TYPE } from "../../connection";
import EmptyListNotification from "../../../../staff-front-end/src/components/emptyListNotification/emptyListNotification";


//-----------------------------------------
//        INTERFACE DEFINITIONS
//-----------------------------------------

interface IState {
    addingParent: boolean,

    parents: IParent[]
}

interface IProps {
    token: string
}


//-----------------------------------------
//        CONSTS
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

class ParentsSection extends Component<IProps, IState> {

    //----------------------
    //    CONSTRUCTOR
    //----------------------

    constructor(props: IProps) {
        super(props);

        this.state = {
            addingParent: false,
            parents: []
        }
    }


    //-------------------------
    //    COMPONENT DID MOUNT
    //-------------------------

    componentDidMount() {
        this.getParents();
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
        if (mobile.length > 16 || mobile.length < 10) {
            alert("Enter a valid phone number");
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

        this.getParents();
        alert("Parent successfully added");
        return true;
    }


    //---------------------------
    //    GET PARENTS
    //---------------------------

    getParents = async () => {
        let data: IGetAllParents = {}

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_ALL_PARENTS, this.props.token, data);

        if (result.stat !== "ok") {
            this.setState({ parents: [] });
            return;
        }

        this.setState({ parents: result.data });
    }


    //----------------------
    //    RENDER METHOD
    //----------------------

    render() {
        return (
            <div id="parents-section-container">
                {
                    //----   ADD PARENT CARD   ----

                    this.state.addingParent &&
                    <AddCard title={"Add Parent"} cancel={this.toggleAddingParent} submit={this.addParent} addFile={false} uploading={false} uploadProgress={0} numberInputs={[]} stringInputs={PARENT_IN} calendarInputs={[]} checkboxInputs={[]} />
                }

                {
                    //----   TIMETABLES   ----

                    <ParentFilesCard token={this.props.token} fileType={PARENT_FILE_TYPE.TIMETABLE} />
                }
                {
                    //----   CALENDARS   ----

                    <ParentFilesCard token={this.props.token} fileType={PARENT_FILE_TYPE.CALENDAR} />
                }
                {
                    //----   SUPPORT/DONATIONS DOCUMENTS   ----

                    <ParentFilesCard token={this.props.token} fileType={PARENT_FILE_TYPE.SUPPORT} />
                }
                {
                    //----   TERMS AND CONDITIONS   ----

                    <TermsAndConditionsCard token={this.props.token} />
                }
                {
                    //----   PARENT REGISTRATION   ----

                    <ParentRegistrationCard token={this.props.token} refreshParents={this.getParents} />
                }

                {
                    //----   PARENTS TABLE   ----

                    <React.Fragment>
                        <div id="parents-table-title" className="flex-row center">
                            <h2>Parents</h2>
                            <AddRounded className="add-rounded-button" style={{ transform: "scale(1.4)" }} onClick={this.toggleAddingParent} />
                        </div>

                        <div id="parent-table-header" className="parent-table center">
                            <h3>ID</h3>
                            <h3>Name</h3>
                            <h3>Email</h3>
                            <h3>Mobile</h3>
                            <h3>Address</h3>
                            <h3>Language</h3>
                            <h3>Religion</h3>
                        </div>

                        {
                            //----   LIST PARENTS   ----
                            this.state.parents.map(parentDetails => {
                                return (
                                    <ParentCard token={this.props.token} parentDetails={parentDetails} refreshParents={this.getParents} />
                                )
                            })
                        }
                        {
                            this.state.parents.length === 0 &&
                            <EmptyListNotification message={"no parents found"} color={"#FFFFFF"} />
                        }
                    </React.Fragment>
                }

            </div >
        );
    }
}

export default ParentsSection;
