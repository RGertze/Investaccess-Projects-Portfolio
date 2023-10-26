
//-----------------------------------------
//        REACT IMPORTS
//-----------------------------------------

import React, { Component } from "react";

//-----------------------------------------
//        CSS IMPORTS
//-----------------------------------------

import "./termsAndConditionsCard.css";

//-----------------------------------------
//        COMPONENT IMPORTS
//-----------------------------------------

import Connection, { GET_TYPE, POST_TYPE } from "../../connection";
import { IAddTermsAndConditionsAccepted, IGetSignedGetUrl, IResponse, ISignedGetUrl, ITermsAndConditionsFile } from "../../interfaces";


//-----------------------------------------
//        ENUM DEFINITIONS
//-----------------------------------------



//-----------------------------------------
//        INTERFACE DEFINITIONS
//-----------------------------------------

interface IState {
    files: ITermsAndConditionsFile[],
    termsAgreedTo: boolean
}

interface IProps {
    token: string,
    parentID: number,
    closePopup(): void
}

//-----------------------------------------
//        CLASS DEFINITION
//-----------------------------------------

class TermsAndConditionsCard extends Component<IProps, IState> {

    //-----------------------------------------
    //        CONSTRUCTOR
    //-----------------------------------------

    constructor(props: IProps) {
        super(props);

        this.state = {
            files: [],
            termsAgreedTo: false
        }
    }


    //---------------------------
    //    COMP DID MOUNT
    //---------------------------

    componentDidMount() {
        this.getAllFiles();
    }


    //---------------------------
    //    GET ALL FILES
    //---------------------------

    getAllFiles = async () => {
        let data = {}

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_TERMS_AND_CONDITIONS_FILES, this.props.token, data);

        if (result.stat !== "ok") {
            this.setState({ files: [] });
            return;
        }

        this.setState({ files: result.data });
    }


    //----------------------------
    //    SAVE FILE
    //----------------------------

    saveFile = async (filePath: string, fileName: string) => {
        let data: IGetSignedGetUrl = {
            filePath: filePath
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_SIGNED_GET_URL, this.props.token, data);

        if (result.stat !== "ok") {
            alert("failed to retrieve file");
            return;
        }

        let urlData: ISignedGetUrl = result.data;

        Connection.saveFileS3(urlData.url, fileName);
    }


    //--------------------------------------------
    //      ADD TERMS AND CONDITIONS ACCEPTED
    //--------------------------------------------

    addTermsAndConditionsAccepted = async () => {
        if (this.state.termsAgreedTo) {
            let data: IAddTermsAndConditionsAccepted = {
                parentID: this.props.parentID
            }

            let result: IResponse = await Connection.postReq(POST_TYPE.ADD_TERMS_AND_CONDITIONS_ACCEPTED, this.props.token, data, {});

            if (result.stat !== "ok") {
                alert("failed to accept terms and conditions: " + result.error);
                return;
            }

            alert("terms and conditions accepted");
            this.props.closePopup();
            return;
        }

        alert("Please tick the box, indicating that you have read and agreed to the terms");
    }


    //-----------------------------------------
    //        RENDER METHOD
    //-----------------------------------------

    render() {
        return (
            <div id="add-file-card-overlay">
                <div id="add-file-card-container" className="flex-column">
                    <h2 id="terms-conditions-title">Terms And Conditions:</h2>
                    <div>
                        {
                            this.state.files.map(file => {
                                return (
                                    <p className="terms-conditions" onClick={() => this.saveFile(file.File_Path, file.File_Name)}>{file.File_Name}</p>
                                )
                            })
                        }
                    </div>

                    <div id="terms-conditions-checkbox" className="center flex-row">
                        <input type="checkbox" onChange={ev => this.setState({ termsAgreedTo: ev.target.checked })} />
                        <h4>I have read the terms and conditions outlined above and accept them.</h4>
                    </div>

                    <button onClick={this.addTermsAndConditionsAccepted}>Submit</button>
                </div>
            </div>
        );
    }
}

export default TermsAndConditionsCard;
