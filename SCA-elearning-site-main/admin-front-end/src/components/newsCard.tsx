
//----------------------------------
//      REACT IMPORTS
//----------------------------------

import React, { Component } from "react";

//----------------------------------
//      COMPONENT IMPORTS
//----------------------------------


//----------------------------------
//      INTERFACE IMPORTS
//----------------------------------

import { IDeleteNewsEvent, IGetSignedGetUrl, INewsEvent, IResponse, ISignedGetUrl } from "../interfaces";
import Connection, { GET_TYPE, POST_TYPE } from "../connection";


//----------------------------------
//      INTERFACE DEFINITIONS
//----------------------------------

interface IState {
    imgUrl: string
}

interface IProps {
    token: string,
    newsEvent: INewsEvent,
    refreshNews(): void
}


//----------------------------------
//      CLASS DEFINITION
//----------------------------------

class NewsCard extends Component<IProps, IState> {

    //----------------------------------
    //      CONSTRUCTOR
    //----------------------------------

    constructor(props: IProps) {
        super(props);

        this.state = {
            imgUrl: ""
        }
    }


    //----------------------------------
    //      COMPONENT DID MOUNT
    //----------------------------------

    componentDidMount() {
        this.getImgUrl();
    }


    //----------------------------------
    //      GET IMG URL
    //----------------------------------

    getImgUrl = async () => {
        let getUrlData: IGetSignedGetUrl = {
            filePath: this.props.newsEvent.News_Events_Img_Path
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_SIGNED_GET_URL, this.props.token, getUrlData);

        if (result.stat !== "ok") {
            return;
        }

        let urlData: ISignedGetUrl = result.data;

        this.setState({ imgUrl: urlData.url });
    }


    //----------------------------------
    //      DELETE NEWS EVENT
    //----------------------------------

    deleteNewsEvent = async () => {
        let data: IDeleteNewsEvent = {
            newsImgPath: this.props.newsEvent.News_Events_Img_Path
        }

        let result: IResponse = await Connection.postReq(POST_TYPE.DELETE_NEWS_EVENT, this.props.token, data, {});

        if (result.stat !== "ok") {
            alert("failed to delete news event: " + result.error);
            return;
        }

        this.props.refreshNews();
    }


    //----------------------------------
    //      RENDER METHOD
    //----------------------------------

    render() {
        return (
            <div id="news-card-container">
                <div className="title-col center" id="news-card-header-container">
                    <h2 id="news-card-title" className="center">{this.props.newsEvent.News_Events_Title}</h2>

                    <div id="news-card-delete" className="flex-row center" onClick={this.deleteNewsEvent}>
                        <h3>delete</h3>
                    </div>

                </div>
                <p id="news-card-content">
                    <div>
                        <img id="news-card-img" src={this.state.imgUrl} />
                    </div>
                    {this.props.newsEvent.News_Events_Content}
                </p>
            </div >
        );
    }
}

export default NewsCard;
