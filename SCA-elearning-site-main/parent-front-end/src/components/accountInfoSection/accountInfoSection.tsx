
//-----------------------------------------
//        REACT IMPORTS
//-----------------------------------------

import React, { Component } from "react";
import Connection, { GET_TYPE, POST_TYPE } from "../../connection";

//-----------------------------------------
//        CSS IMPORTS
//-----------------------------------------

import "./accountInfoSection.css";

//-----------------------------------------
//        INTERFACE/ENUM IMPORTS
//-----------------------------------------

import { IGetParentDetails, IParent, IResponse, IUpdateParent } from "../../interfaces";
import EditRounded from "@material-ui/icons/EditRounded";
import AddCard from "../addCard/addFileCard";

//-----------------------------------------
//        INTERFACE DEFINITIONS
//-----------------------------------------

interface IState {
    parentDetails: IParent,
    editingParent: boolean,
    editValues: Map<string, string>
}

interface IProps {
    token: string,
    parentID: number
}

//-----------------------------------------
//        CONST/ENUM DEFINITIONS
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

class AccountInfoSection extends Component<IProps, IState> {

    //---------------------------
    //    CONSTRUCTOR
    //---------------------------

    constructor(props: IProps) {
        super(props);

        this.state = {
            parentDetails: null,
            editingParent: false,
            editValues: null
        }
    }


    //---------------------------
    //    COMP DID MOUNT
    //---------------------------

    componentDidMount() {
        this.getParentDetails();
    }


    //----------------------------
    //    TOGGLE EDITING PARENT
    //----------------------------

    toggleEditingParent = () => {
        let editingParent = !this.state.editingParent;
        this.setState({ editingParent: editingParent });
    }


    //---------------------------
    //    GET PARENT DETAILS
    //---------------------------

    getParentDetails = async () => {
        let data: IGetParentDetails = {
            parentID: this.props.parentID
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_PARENT_DETAILS, this.props.token, data);

        if (result.stat !== "ok") {
            this.setState({ parentDetails: null });
            return;
        }

        this.setState({ parentDetails: result.data }, () => {

            //----   SET DEFAULT VALUES FOR EDITING   ----

            let defMap: Map<string, string> = new Map([
                [PARENT_IN[0], this.state.parentDetails.Parent_ID_Number],
                [PARENT_IN[1], this.state.parentDetails.Parent_Name],
                [PARENT_IN[2], this.state.parentDetails.Parent_Surname],
                [PARENT_IN[3], this.state.parentDetails.Parent_Email],
                [PARENT_IN[4], this.state.parentDetails.Parent_Mobile],
                [PARENT_IN[5], this.state.parentDetails.Parent_Address],
                [PARENT_IN[6], this.state.parentDetails.Parent_Home_Language],
                [PARENT_IN[7], this.state.parentDetails.Parent_Religion]
            ]);

            this.setState({ editValues: defMap });

        });

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

        this.getParentDetails();
        alert("details successfully updated");
        return true;
    }


    //---------------------------
    //    RENDER METHOD
    //---------------------------

    render() {
        return (
            <div id="account-info-container">

                <div id="personal-info-title-container" className="center flex-row">
                    <h1 id="personal-info-title" className="center">Personal info</h1>

                    {
                        //this.state.parentDetails &&
                        //<EditRounded className="edit-button" style={{ transform: "scale(1.4)" }} onClick={this.toggleEditingParent} />
                    }
                </div>

                <div id="account-personal-info" className="center">
                    <div className="form-col">
                        <div className="personal-info-name">
                            <h3>ID Number:</h3>
                        </div>
                        <p className="center">{this.state.parentDetails ? this.state.parentDetails.Parent_ID_Number : ""}</p>
                    </div>
                    <div className="form-col">
                        <div className="personal-info-name">
                            <h3>Name:</h3>
                        </div>
                        <p className="center">{this.state.parentDetails ? this.state.parentDetails.Parent_Name : ""}</p>
                    </div>
                    <div className="form-col">
                        <div className="personal-info-name">
                            <h3>Surname:</h3>
                        </div>
                        <p className="center">{this.state.parentDetails ? this.state.parentDetails.Parent_Surname : ""}</p>
                    </div>
                    <div className="form-col">
                        <div className="personal-info-name">
                            <h3>Email:</h3>
                        </div>
                        <p className="center">{this.state.parentDetails ? this.state.parentDetails.Parent_Email : ""}</p>
                    </div>
                    <div className="form-col">
                        <div className="personal-info-name">
                            <h3>Mobile:</h3>
                        </div>
                        <p className="center">{this.state.parentDetails ? this.state.parentDetails.Parent_Mobile : ""}</p>
                    </div>
                    <div className="form-col">
                        <div className="personal-info-name">
                            <h3>Address:</h3>
                        </div>
                        <p className="center">{this.state.parentDetails ? this.state.parentDetails.Parent_Address : ""}</p>
                    </div>
                    <div className="form-col">
                        <div className="personal-info-name">
                            <h3>Language:</h3>
                        </div>
                        <p className="center">{this.state.parentDetails ? this.state.parentDetails.Parent_Home_Language : ""}</p>
                    </div>
                    <div className="form-col">
                        <div className="personal-info-name">
                            <h3>Religion:</h3>
                        </div>
                        <p className="center">{this.state.parentDetails ? this.state.parentDetails.Parent_Religion : ""}</p>
                    </div>
                </div>

                {
                    //----   EDIT CARD   ----

                    this.state.editingParent &&
                    <AddCard title={"Edit details"} cancel={this.toggleEditingParent} submit={this.editParent} addFile={false} uploading={false} uploadProgress={0} numberInputs={[]} calendarInputs={[]} checkboxInputs={[]} stringInputs={PARENT_IN} defaultValues={this.state.editValues} />
                }
            </div>
        );
    }
}

export default AccountInfoSection;
