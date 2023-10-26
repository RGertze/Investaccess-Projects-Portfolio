
//##################################
//      REACT IMPORTS
//##################################

import React, { Component } from "react";

//##################################
//      COMPONENT IMPORTS
//##################################

import ProgressBar from "./progressBar";


//##################################
//      INTERFACE IMPORTS
//##################################

import { IAddNewsEvent, IGetSignedPostUrl, IResponse, ISignedPostUrl } from "../interfaces";
import Connection, { GET_TYPE, POST_TYPE } from "../connection";
import { AxiosRequestConfig } from "axios";


//##################################
//      ENUM DEFINITIONS
//##################################

enum INPUT {
    TITE,
    CONTENT,
    IMG
}


//##################################
//      INTERFACE DEFINITIONS
//##################################

interface IState {
    toggled: boolean,

    uploading: boolean,
    uploadProgress: number,

    titleInput: string,
    contentInput: string,
    imgInput: File
}

interface IProps {
    token: string,
    refreshNews(): any
}


//##################################
//      CLASS DEFINITION
//##################################

class NewsAddCard extends Component<IProps, IState> {

    //##################################
    //      CONSTRUCTOR
    //##################################

    constructor(props: IProps) {
        super(props);

        this.state = {
            toggled: false,

            uploading: false,
            uploadProgress: 0,

            titleInput: "",
            contentInput: "",
            imgInput: null
        }
    }


    //##################################
    //      COMPONENT DID MOUNT
    //##################################

    componentDidMount() {
    }


    //##################################
    //      TOGGLE
    //##################################

    handleToggle = async () => {
        if (!this.state.toggled) {
            this.setState({ toggled: true })
        } else {
            this.setState({ toggled: false })
        }
    }


    //##################################
    //      INPUT HANDLER
    //##################################

    handleInput = (inType: INPUT, ev: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        switch (inType) {
            case INPUT.TITE:
                this.setState({ titleInput: ev.target.value });
                break;
            case INPUT.CONTENT:
                this.setState({ contentInput: ev.target.value });
                break;
            default:
                return;
        }
    }


    //##################################
    //      ADD NEWS
    //##################################

    addNews = async () => {
        if (this.state.titleInput === "") {
            alert("Enter a Title!");
            return;
        }

        if (this.state.contentInput === "") {
            alert("No content entered!");
            return;
        }

        if (!this.state.imgInput) {
            alert("no img chosen!");
            return;
        }

        this.setState({ uploading: true });

        //######   GET SIGNED POST URL   ######
        let getUrlData: IGetSignedPostUrl = {
            originalFileName: this.state.imgInput.name
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_SIGNED_POST_URL, this.props.token, getUrlData);

        if (result.stat !== "ok") {
            alert("failed to upload img");
            this.setState({ uploading: false });
            return;
        }

        let signedUrl: ISignedPostUrl = result.data;
        //#######################################


        //######   UPLOAD FILE TO S3   ######
        let config: AxiosRequestConfig = {      //  -->  TRACKS UPLOAD PROGRESS
            onUploadProgress: (progressEvent) => {
                const { loaded, total } = progressEvent;
                let progress = Math.floor(loaded / total * 100);
                this.setState({ uploadProgress: progress });
            }
        }

        let uploadStatus = await Connection.uploadFile(signedUrl.url, this.state.imgInput, config);

        if (uploadStatus !== 200) {
            alert("failed to upload img");
            this.setState({ uploading: false, uploadProgress: 0 });
            return;
        }
        //#######################################


        //######   SEND FILE DATA TO SERVER   ######
        let data: IAddNewsEvent = {
            title: this.state.titleInput,
            content: this.state.contentInput,
            imgPath: signedUrl.filePath
        }

        result = await Connection.postReq(POST_TYPE.ADD_NEWS_EVENT, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert("failed to upload news");
            this.setState({ uploading: false, uploadProgress: 0 });
            return;
        }
        //#######################################

        alert("report successfully uploaded");
        this.setState({ uploading: false, uploadProgress: 0, imgInput: null, titleInput: "", contentInput: "" });
        this.props.refreshNews();
    }


    //##################################
    //      RENDER METHOD
    //##################################

    render() {
        return (
            <div id="news-add-card-container">
                <div id="news-add-card-title" onClick={this.handleToggle}><h3>Add News/Event {this.state.toggled ? "\u25B2" : "\u25BC"}</h3></div>
                {
                    this.state.toggled &&
                    <div id="news-add-card-input-container">

                        <p>Title:</p>
                        <input value={this.state.titleInput} type="text" style={{ width: "40%" }} onChange={(ev) => this.handleInput(INPUT.TITE, ev)} />

                        <p>Content:</p>
                        <textarea id="news-add-card-text-input" rows={10} cols={50} value={this.state.contentInput} onChange={(ev) => this.handleInput(INPUT.CONTENT, ev)} />

                        <p>Image:</p>
                        <input id="new-add-card-input-file" type="file" name="news-image" onChange={(ev) => this.setState({ imgInput: ev.target.files[0] })} />

                        {
                            this.state.uploading &&
                            <ProgressBar now={this.state.uploadProgress} />
                        }

                        <button style={{ width: "20%", marginTop: "10px", marginBottom: "20px" }} onClick={this.addNews}>Add</button>

                    </div>
                }
            </div>
        );
    }
}

export default NewsAddCard;
