
//##################################
//      REACT IMPORTS
//##################################

import React, { Component } from "react";

//##################################
//      COMPONENT IMPORTS
//##################################

import NewsCard from "./newsCard";

//##################################
//      INTERFACE IMPORTS
//##################################

import { IGetNewsEvents, INewsEvent, IResponse } from "../interfaces";
import Connection, { GET_TYPE } from "../connection";


//##################################
//      INTERFACE DEFINITIONS
//##################################

interface IState {
    news: INewsEvent[]
}

interface IProps {
    token: string
}


//##################################
//      CLASS DEFINITION
//##################################

class NewsSection extends Component<IProps, IState> {

    //##################################
    //      CONSTRUCTOR
    //##################################

    constructor(props: IProps) {
        super(props);

        this.state = {
            news: []
        }
    }


    //##################################
    //      COMPONENT DID MOUNT
    //##################################

    componentDidMount() {
        this.getNews();
    }


    //##################################
    //      GET NEWS
    //##################################

    getNews = async () => {
        let data: IGetNewsEvents = {}

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_NEWS_EVENTS, this.props.token, data);

        if (result.stat === "ok") {
            this.setState({ news: result.data });
        }
    }


    //##################################
    //      RENDER METHOD
    //##################################

    render() {
        return (
            <div id="news-section-container">
                <h1 id="news-section-title">News And Events</h1>
                {
                    this.state.news.map(_news => {
                        return (
                            <NewsCard token={this.props.token} newsEvent={_news} />
                        );
                    })
                }
            </div >
        );
    }
}

export default NewsSection;
