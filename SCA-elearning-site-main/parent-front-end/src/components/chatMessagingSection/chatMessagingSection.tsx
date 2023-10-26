
//----------------------------------
//      REACT IMPORTS
//----------------------------------

import React, { Component } from "react";

//----------------------------------
//      CSS IMPORTS
//----------------------------------

import "./chatMessagingSection.css";

//----------------------------------
//      COMPONENT IMPORTS
//----------------------------------

import Send from "@material-ui/icons/Send";
import { IAddDirectMessage, IChatUser, IDirectMessage, IGetAllMessagesBetweenUsers, IResponse } from "../../interfaces";
import Connection, { GET_TYPE, POST_TYPE, WSConnection, WS_TOPICS } from "../../connection";


//----------------------------------
//      INTERFACE DEFINITIONS
//----------------------------------
interface IState {
    messages: IDirectMessage[],
    inMessage: string,

    messageContainerHeigh: number,
    wsConn: WSConnection
}

interface IProps {
    token: string,
    userID: number,
    userBeingMessaged: IChatUser,

    parentHeight: number
}


//----------------------------------
//      CLASS DEFINITION
//----------------------------------

class ChatMessagingSection extends Component<IProps, IState> {

    //----------------------------------
    //      CONSTRUCTOR
    //----------------------------------

    constructor(props: IProps) {
        super(props);

        this.state = {
            messages: [],
            inMessage: "",

            messageContainerHeigh: 0,
            wsConn: new WSConnection(this.props.token, this.props.userID.toString(), this.appendMsg)
        }
    }


    //----------------------------------
    //      COMPONENT DID MOUNT
    //----------------------------------

    componentDidMount() {
        this.setHeight();
        this.getMessagesBetweenUsers();
        this.state.wsConn.send(WS_TOPICS.INIT, this.props.userID.toString());
    }


    //----------------------------------
    //      SET HEIGHT
    //----------------------------------

    setHeight = () => {
        let msgContainerH = Math.floor((this.props.parentHeight - 50 - 100));
        this.setState({ messageContainerHeigh: msgContainerH });
    }


    //----------------------------------
    //      SCROLL TO BOTTOM
    //----------------------------------

    scrollToBottom = () => {
        let elem = document.getElementById("chat-messaging-section-messages-container");
        elem.scrollTop = elem.scrollHeight;
    }


    //------------------------------------
    //      GET MESSAGES BETWEEN USERS
    //------------------------------------

    getMessagesBetweenUsers = async () => {
        let data: IGetAllMessagesBetweenUsers = {
            userID1: this.props.userID,
            userID2: this.props.userBeingMessaged.userID
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_ALL_MESSAGES_BETWEEN_USERS, this.props.token, data);

        if (result.stat === "ok") {
            this.setState({ messages: result.data });
            this.scrollToBottom();
            return;
        }

        this.setState({ messages: [] });
    }


    //------------------------------------
    //      ADD DIRECT MESSAGE
    //------------------------------------

    addDirectMessage = async () => {

        if (this.state.inMessage !== "") {

            let data: IAddDirectMessage = {
                fromID: this.props.userID,
                toID: this.props.userBeingMessaged.userID,
                message: this.state.inMessage
            }

            console.log(data);

            let result: IResponse = await Connection.postReq(POST_TYPE.ADD_DIRECT_MESSAGE, this.props.token, data, {});

            if (result.stat !== "ok") {
                alert(result.error);
                return;
            }

            this.getMessagesBetweenUsers();
            this.scrollToBottom();
            this.setState({ inMessage: "" });
            return;
        }

        alert("Enter a message!");
    }


    //------------------------------------
    //      APPEND MESSAGE RECEIVED
    //------------------------------------

    appendMsg = async (msg: IDirectMessage) => {
        let messages = this.state.messages.slice();
        messages.push(msg);
        this.setState({ messages: messages });
        this.scrollToBottom();
    }



    //----------------------------------
    //      RENDER METHOD
    //----------------------------------

    render() {
        return (
            <div id="chat-messaging-section-container" className="flex-column">

                {
                    //----   HEADER   ----

                    <div id="chat-messaging-section-header" className="flex-row" >
                        <h3>{this.props.userBeingMessaged.userName}</h3>
                    </div>
                }

                {
                    //----   LIST MESSAGES   ----

                    <div id="chat-messaging-section-messages-container" className="flex-column" style={{ height: this.state.messageContainerHeigh, maxHeight: this.state.messageContainerHeigh }}>
                        {
                            this.state.messages.map((message, index, arr) => {

                                let showDate = false;


                                //----   SHOW DATE IF THIS IS FIRST MESSAGE IN ARR   ----

                                if (index === 0) {
                                    showDate = true;
                                }

                                //----   SHOW DATE IF NOT EQUAL TO PREVIOUS MESSAGE'S DATE   ----

                                if (!showDate && message.Message_Date_Added.substring(0, 10) !== arr[index - 1].Message_Date_Added.substring(0, 10)) {
                                    showDate = true;
                                }

                                return (
                                    <React.Fragment>

                                        {

                                            //----   SHOW DAY MESSAGES WERE SENT ON   ----

                                            showDate &&
                                            <h3>{message.Message_Date_Added.substring(0, 10)}</h3>
                                        }

                                        <div className="chat-message" style={{ marginLeft: `${message.From_User_ID === this.props.userID ? "15%" : "0"}`, marginRight: `${message.From_User_ID !== this.props.userID ? "15%" : "0"}` }}>
                                            <div className="flex-row" style={{ height: "30px", justifyContent: "space-evenly" }}>

                                                <h4>{message.Message_Date_Added.substring(11, 19)}</h4>
                                                {
                                                    message.From_User_ID === this.props.userID &&
                                                    <h4>You</h4>
                                                }
                                            </div>
                                            <p>{message.Message_Content}</p>
                                        </div>
                                    </React.Fragment>
                                );
                            })
                        }
                    </div>
                }

                {
                    //----   SEND MESSAGES   ----
                    < div id="chat-message-box" className="title-col" >
                        <textarea value={this.state.inMessage} onChange={ev => this.setState({ inMessage: ev.target.value })} />
                        <Send onClick={this.addDirectMessage} className="center" id="chat-send-button" />
                    </div>
                }

            </div >
        );
    }
}

export default ChatMessagingSection;
