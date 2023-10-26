
//----------------------------------
//      REACT IMPORTS
//----------------------------------

import React, { Component } from "react";

//----------------------------------
//      COMPONENT IMPORTS
//----------------------------------

import NewsAddCard from "./newsAddCard";
import NewsCard from "./newsCard";

//----------------------------------
//      INTERFACE IMPORTS
//----------------------------------

import { IGetNewsEvents, INewsEvent, IResponse } from "../interfaces";
import Connection, { GET_TYPE } from "../connection";


//----------------------------------
//      INTERFACE DEFINITIONS
//----------------------------------

interface IState {
    news: INewsEvent[]
}

interface IProps {
    token: string
}


//----------------------------------
//      CLASS DEFINITION
//----------------------------------

class NewsSection extends Component<IProps, IState> {

    //----------------------------------
    //      CONSTRUCTOR
    //----------------------------------

    constructor(props: IProps) {
        super(props);

        this.state = {
            news: []
        }
    }


    //----------------------------------
    //      COMPONENT DID MOUNT
    //----------------------------------

    componentDidMount() {
        this.getNews();
    }


    //----------------------------------
    //      GET NEWS
    //----------------------------------

    getNews = async () => {
        let data: IGetNewsEvents = {}

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_NEWS_EVENTS, this.props.token, data);

        if (result.stat === "ok") {
            this.setState({ news: [] }, () => this.setState({ news: result.data }));
        } else {
            this.setState({ news: [] });
        }
    }


    //----------------------------------
    //      RENDER METHOD
    //----------------------------------

    render() {
        return (
            <div id="news-section-container">
                <NewsAddCard token={this.props.token} refreshNews={this.getNews} />
                {
                    this.state.news.map(_news => {
                        return (
                            <NewsCard token={this.props.token} newsEvent={_news} refreshNews={this.getNews} />
                        );
                    })
                }

                {
                    this.state.news.length === 0 &&
                    <h3 style={{ color: "white", textAlign: "center", fontFamily: "sans-serif" }}>No News available</h3>

                }
            </div >
        );
    }
}

export default NewsSection;
