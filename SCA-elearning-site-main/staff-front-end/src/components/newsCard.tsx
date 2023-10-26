
//##################################
//      REACT IMPORTS
//##################################

import React, { Component } from "react";

//##################################
//      COMPONENT IMPORTS
//##################################


//##################################
//      INTERFACE IMPORTS
//##################################

import { IGetSignedGetUrl, INewsEvent, IResponse, ISignedGetUrl } from "../interfaces";
import Connection, { GET_TYPE } from "../connection";


//##################################
//      INTERFACE DEFINITIONS
//##################################

interface IState {
    imgUrl: string
}

interface IProps {
    token: string,
    newsEvent: INewsEvent
}


//##################################
//      CLASS DEFINITION
//##################################

class NewsCard extends Component<IProps, IState> {

    //##################################
    //      CONSTRUCTOR
    //##################################

    constructor(props: IProps) {
        super(props);

        this.state = {
            imgUrl: ""
        }
    }


    //##################################
    //      COMPONENT DID MOUNT
    //##################################

    componentDidMount() {
        this.getImgUrl();
    }


    //##################################
    //      GET IMG URL
    //##################################

    getImgUrl = async () => {
        let getUrlData: IGetSignedGetUrl = {
            filePath: this.props.newsEvent.News_Events_Img_Path
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_SIGNED_NEWS_IMG_URL, this.props.token, getUrlData);

        if (result.stat !== "ok") {
            return;
        }

        let urlData: ISignedGetUrl = result.data;

        this.setState({ imgUrl: urlData.url });
    }


    //##################################
    //      RENDER METHOD
    //##################################

    render() {
        return (
            <div id="news-card-container">
                <h2 id="news-card-title">{this.props.newsEvent.News_Events_Title}</h2>
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
