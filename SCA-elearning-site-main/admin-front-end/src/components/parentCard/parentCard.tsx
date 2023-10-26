
//-----------------------------------------
//        REACT IMPORTS
//-----------------------------------------

import React, { Component } from "react";

//-----------------------------------------
//        CSS IMPORTS
//-----------------------------------------

import "./parentCard.css";

//-----------------------------------------
//        COMPONENT IMPORTS
//-----------------------------------------

import AddRounded from "@material-ui/icons/AddRounded";
import AddCard from "../addCard/addFileCard";
import EditRounded from "@material-ui/icons/EditRounded";
import DeleteForever from "@material-ui/icons/DeleteForever";
import ParentFinancesCard from "../parentFinancesCard/parentFinancesCard";
import ParentStudentsCard from "../parentStudentsCard/parentStudentsCard";

//-----------------------------------------
//        INTERFACE IMPORTS
//-----------------------------------------

import { IAddParent, IAddSuggestion, IDeleteParent, IParent, IResponse, IUpdateParent } from "../../interfaces";
import Connection, { POST_TYPE } from "../../connection";
import ChangePasswordCard from "../changePasswordCard/changePasswordCard";


//-----------------------------------------
//        INTERFACE DEFINITIONS
//-----------------------------------------

interface IState {
    toggled: boolean,
    editingParent: boolean,
    editValues: Map<string, string>,

    infoScrollRef: React.RefObject<HTMLDivElement>,

    changingPassword: boolean
}

interface IProps {
    token: string,
    parentDetails: IParent,
    refreshParents(): void
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
    "Religion"
];


//-----------------------------------------
//        CLASS DEFINITION
//-----------------------------------------

class ParentCard extends Component<IProps, IState> {

    //----------------------
    //    CONSTRUCTOR
    //----------------------

    constructor(props: IProps) {
        super(props);

        this.state = {
            toggled: false,
            editingParent: false,

            editValues: new Map([
                [PARENT_IN[0], this.props.parentDetails.Parent_ID_Number],
                [PARENT_IN[1], this.props.parentDetails.Parent_Name],
                [PARENT_IN[2], this.props.parentDetails.Parent_Surname],
                [PARENT_IN[3], this.props.parentDetails.Parent_Email],
                [PARENT_IN[4], this.props.parentDetails.Parent_Mobile],
                [PARENT_IN[5], this.props.parentDetails.Parent_Address],
                [PARENT_IN[6], this.props.parentDetails.Parent_Home_Language],
                [PARENT_IN[7], this.props.parentDetails.Parent_Religion]
            ]),

            infoScrollRef: React.createRef(),
            changingPassword: false
        }
    }


    //----------------------
    //    HANDLE TOGGLE
    //----------------------

    handleToggle = () => {
        let toggled = !this.state.toggled;
        this.setState({ toggled: toggled });
    }


    //----------------------------------
    //      HANDLE SCROLL
    //---------------------------------

    handleScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
        //-------------------------------------------------
        //      SET HEADER SCROLL POS TO INFO SCROLL POS
        //-------------------------------------------------
        document.getElementById('parent-table-header').scrollLeft = this.state.infoScrollRef.current.scrollLeft;
    }


    //----------------------------
    //    TOGGLE EDITING PARENT
    //----------------------------

    toggleEditingParent = () => {
        let editingParent = !this.state.editingParent;
        this.setState({ editingParent: editingParent });
    }


    //---------------------------
    //    EDIT PARENT
    //---------------------------

    editParent = async (inMap: Map<string, string>, file: File): Promise<boolean> => {
        let idNum = inMap.get(PARENT_IN[0]).trim().replace(/ +/g, "");
        let isNum = /^\d+$/.test(idNum);
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
            alert("Please enter a mobile number");
            return false
        }

        let data: IUpdateParent = {
            idNum: idNum,
            pName: name,
            pSurname: surname,
            pEmail: email,
            pMobile: mobile,
            pAddr: address,
            pHomeLang: language,
            pReligion: religion
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.UPDATE_PARENT, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert("failed to update parent details: " + result.error);
            return false;
        }

        this.props.refreshParents();
        alert("details successfully updated");
        return true;
    }


    //--------------------------------------
    //      SET CHANGING PASSWORD STATE
    //--------------------------------------

    setChangingPassword = (value: boolean) => {
        this.setState({ changingPassword: value });
    }


    //---------------------------
    //    DELETE PARENT
    //---------------------------

    deleteParent = async () => {
        let data: IDeleteParent = {
            idNum: this.props.parentDetails.Parent_ID_Number
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.DELETE_PARENT, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert("Failed to delete parent: " + result.error);
            return;
        }

        this.handleToggle();
        this.props.refreshParents();
        alert("Successfully deleted parent");
    }


    //----------------------
    //    RENDER METHOD
    //----------------------

    render() {
        return (
            <div id="parent-card-container" className="center">

                {
                    //----   PARENT DETAILS   ----

                    <div ref={this.state.infoScrollRef} onScroll={ev => this.handleScroll(ev)} id="parent-card-details" className="parent-table center" onClick={this.handleToggle}>
                        <p className="center">{this.props.parentDetails.Parent_ID_Number}</p>
                        <p id="parent-name" className="center">{this.props.parentDetails.Parent_Name} {this.props.parentDetails.Parent_Surname}</p>
                        <p className="center">{this.props.parentDetails.Parent_Email}</p>
                        <p className="center">{this.props.parentDetails.Parent_Mobile}</p>
                        <p className="center">{this.props.parentDetails.Parent_Address}</p>
                        <p className="center">{this.props.parentDetails.Parent_Home_Language}</p>
                        <p className="center">{this.props.parentDetails.Parent_Religion}</p>
                    </div>
                }

                {
                    //----   PARENT USER ID   ----

                    this.state.toggled &&
                    <div className="parent-user-id flex-row center">
                        <h3>User ID: </h3>
                        <p>{this.props.parentDetails.Parent_ID}</p>
                    </div>
                }

                {
                    //----   EDIT/DELETE BUTTONS   ----

                    this.state.toggled &&
                    <div id="parent-buttons-container" className="center flex-row">
                        <EditRounded className="parent-edit-button" style={{ transform: "scale(1.3)" }} onClick={this.toggleEditingParent} />

                        <DeleteForever className="parent-delete-button" style={{ transform: "scale(1.3)" }} onClick={this.deleteParent} />

                        <div id="parent-update-password-button" style={{ gridColumn: 3 }} onClick={() => this.setState({ changingPassword: true })}>
                            <p>Change Password</p>
                        </div>
                    </div>
                }

                {
                    //----   CHANGE PASSWORD   ----

                    this.state.changingPassword &&
                    <ChangePasswordCard token={this.props.token} userType={4} userID={this.props.parentDetails.Parent_ID} setChangingPassword={this.setChangingPassword} />
                }

                {
                    //----   FINANCES CARD   ----

                    this.state.toggled &&
                    <ParentFinancesCard token={this.props.token} parentID={this.props.parentDetails.Parent_ID} />
                }

                {
                    //----   PARENT STUDENTS CARD   ----

                    this.state.toggled &&
                    <ParentStudentsCard parentID={this.props.parentDetails.Parent_ID} parentIDNum={this.props.parentDetails.Parent_ID_Number} token={this.props.token} />
                }

                {
                    //----   EDIT PARENT CARD   ----

                    this.state.editingParent &&
                    <AddCard title={"Edit Parent Details"} cancel={this.toggleEditingParent} submit={this.editParent} addFile={false} uploading={false} numberInputs={[]} stringInputs={PARENT_IN} calendarInputs={[]} checkboxInputs={[]} uploadProgress={0} defaultValues={this.state.editValues} />
                }

            </div >
        );
    }
}

export default ParentCard;
