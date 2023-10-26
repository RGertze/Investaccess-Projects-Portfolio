
//-----------------------------------------
//        REACT IMPORTS
//-----------------------------------------

import React, { Component } from "react";

//-----------------------------------------
//        CSS IMPORTS
//-----------------------------------------

import "./registrationSection.css";

//-----------------------------------------
//        COMPONENT IMPORTS
//-----------------------------------------

import { SECTION } from "../base";
import { IAddParentRegistrationRequest, IResponse } from "../../interfaces";
import Connection, { POST_TYPE } from "../../connection";

//-----------------------------------------
//        INTERFACE DEFINITIONS
//-----------------------------------------

interface IState {
    idNum: string,
    name: string,
    surname: string,
    email: string,
    mobile: string,
    address: string,
    language: string,
    religion: string,
    childInfo: string,
    password: string,
    confPassword: string
}

interface IProps {
    changeSection(sect: SECTION): void
}

class RegistrationSection extends Component<IProps, IState> {

    // --------------------------------------
    //      CONSTRUCTOR
    // --------------------------------------

    constructor(props: IProps) {
        super(props);

        this.state = {
            idNum: "",
            name: "",
            surname: "",
            email: "",
            mobile: "",
            address: "",
            language: "",
            religion: "",
            childInfo: "",
            password: "",
            confPassword: ""
        }
    }

    // --------------------------------------
    //      COMP DID MOUNT
    // --------------------------------------

    componentDidUpdate() {
        //console.log(this.state);
    }


    // --------------------------------------
    //      HANDLE KEY PRESSES
    // --------------------------------------

    onKeyPressHandler = (ev: React.KeyboardEvent<HTMLInputElement>) => {
        if (ev.key === "Enter") {
            //this.props.login(this.state.username, this.state.password);
        }
    }


    // --------------------------------------
    //          VALIDATE INPUT
    // --------------------------------------

    validateInput = (): boolean => {
        let idNum = this.state.idNum.trim().replace(/ +/g, "");
        let isNum = /^\d+$/.test(idNum);

        if (idNum.length !== 11 || !isNum) {
            alert("enter a valid ID number");
            return false;
        }
        if (this.state.name === "") {
            alert("enter a name");
            return false;
        }
        if (this.state.surname === "") {
            alert("enter a surname");
            return false;
        }
        if (this.state.email === "") {
            alert("enter a email");
            return false;
        }
        if (this.state.mobile === "") {
            alert("enter a mobile number");
            return false;
        }
        if (this.state.address === "") {
            alert("enter a address");
            return false;
        }
        if (this.state.language === "") {
            alert("enter a language");
            return false;
        }
        if (this.state.religion === "") {
            alert("enter a religion");
            return false;
        }
        if (this.state.childInfo === "") {
            alert("enter child details");
            return false;
        }
        if (this.state.password === "") {
            alert("enter a password");
            return false;
        }
        if (this.state.password !== this.state.confPassword) {
            alert("passwords do not match");
            return false;
        }

        return true;
    }


    // --------------------------------------
    //     ADD PARENT REGISTRATION REQUEST
    // --------------------------------------

    addParentRegistrationRequest = async () => {
        if (this.validateInput()) {
            let idNum = this.state.idNum.trim().replace(/ +/g, "");
            let data: IAddParentRegistrationRequest = {
                idNum: idNum,
                pName: this.state.name,
                pSurname: this.state.surname,
                pEmail: this.state.email,
                pMobile: this.state.mobile,
                pAddr: this.state.address,
                pHomeLang: this.state.language,
                pReligion: this.state.religion,
                pChildInfo: this.state.childInfo,
                pword: this.state.password
            }

            let result: IResponse = await Connection.postReq(POST_TYPE.ADD_PARENT_REGISTRATION_REQUEST, "", data, {});

            if (result.stat !== "ok") {
                alert("failed to add registration request: " + result.error);
                return;
            }

            alert("successfully added registration request");
            this.setState({
                idNum: "",
                name: "",
                surname: "",
                email: "",
                mobile: "",
                address: "",
                language: "",
                religion: "",
                childInfo: "",
                password: "",
                confPassword: ""
            });
        }
    }


    // --------------------------------------
    //      RENDER METHOD
    // --------------------------------------

    render() {
        return (
            <div id="registration-container">
                <div id="registration-form" className="center">

                    <div className="form-col registration-input center">
                        <h2>ID Number:</h2>
                        <input value={this.state.idNum} type="text" onChange={ev => this.setState({ idNum: ev.target.value })} />
                    </div>
                    <div className="form-col registration-input center">
                        <h2>Name:</h2>
                        <input value={this.state.name} type="text" onChange={ev => this.setState({ name: ev.target.value })} />
                    </div>
                    <div className="form-col registration-input center">
                        <h2>Surname:</h2>
                        <input value={this.state.surname} type="text" onChange={ev => this.setState({ surname: ev.target.value })} />
                    </div>
                    <div className="form-col registration-input center">
                        <h2>Email:</h2>
                        <input value={this.state.email} type="text" onChange={ev => this.setState({ email: ev.target.value })} />
                    </div>
                    <div className="form-col registration-input center">
                        <h2>Mobile Number:</h2>
                        <input value={this.state.mobile} type="text" onChange={ev => this.setState({ mobile: ev.target.value })} />
                    </div>
                    <div className="form-col registration-input center">
                        <h2>Address:</h2>
                        <input value={this.state.address} type="text" onChange={ev => this.setState({ address: ev.target.value })} />
                    </div>
                    <div className="form-col registration-input center">
                        <h2>Language:</h2>
                        <input value={this.state.language} type="text" onChange={ev => this.setState({ language: ev.target.value })} />
                    </div>
                    <div className="form-col registration-input center">
                        <h2>Religion:</h2>
                        <input value={this.state.religion} type="text" onChange={ev => this.setState({ religion: ev.target.value })} />
                    </div>
                    <div className="form-col registration-input center">
                        <h2>Children Names and Surnames:</h2>
                        <textarea value={this.state.childInfo} onChange={ev => this.setState({ childInfo: ev.target.value })} />
                    </div>
                    <div className="form-col registration-input center">
                        <h2>Password:</h2>
                        <input value={this.state.password} type="text" onChange={ev => this.setState({ password: ev.target.value })} />
                    </div>
                    <div className="form-col registration-input center">
                        <h2>Confirm Password:</h2>
                        <input value={this.state.confPassword} type="text" onChange={ev => this.setState({ confPassword: ev.target.value })} />
                    </div>

                    <div id="login-submit" onClick={this.addParentRegistrationRequest}>
                        <h3>Submit</h3>
                    </div>
                </div>
                <h4 style={{
                    width: "fit-content"
                }} className="center link-button" onClick={() => this.props.changeSection(SECTION.LOGIN)}>
                    Login
                </h4>
            </div>
        );
    }
}

export default RegistrationSection;
