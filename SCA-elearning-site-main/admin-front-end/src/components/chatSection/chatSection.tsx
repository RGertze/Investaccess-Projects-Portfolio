
//----------------------------------
//      REACT IMPORTS
//----------------------------------

import React, { Component } from "react";

//----------------------------------
//      CSS IMPORTS
//----------------------------------

import "./chatSection.css";

//----------------------------------
//      COMPONENT IMPORTS
//----------------------------------

import ArrowBackSharp from "@material-ui/icons/ArrowBackSharp";
import Close from "@material-ui/icons/Close";
import ChatContactsCard from "../chatContactsCard/chatContactsCard";
import ChatMessagingSection from "../chatMessagingSection/chatMessagingSection";
import { IChatUser } from "../../interfaces";
import { GlobalContext } from "../../contexts/globalContext";


//----------------------------------
//      INTERFACE DEFINITIONS
//----------------------------------
interface IState {
    height: number,

    inMessagingSection: boolean,
    userBeingMessaged: IChatUser
}

interface IProps {
    token: string,
    userID: number,

    toggleChat(): void
}


//----------------------------------
//      CLASS DEFINITION
//----------------------------------

class ChatSection extends Component<IProps, IState> {

    //----------------------------------
    //      CONSTRUCTOR
    //----------------------------------

    constructor(props: IProps) {
        super(props);

        this.state = {
            height: 0,

            inMessagingSection: false,
            userBeingMessaged: null
        }
    }


    //----------------------------------
    //      COMPONENT DID MOUNT
    //----------------------------------

    componentDidMount() {
        this.setHeight();
    }


    //----------------------------------
    //      SET COMP HEIGHT
    //----------------------------------

    setHeight = () => {
        let height = window.innerHeight - 140;
        this.setState({ height: height });
    }


    //----------------------------------
    //      TOGGLE MESSAGING SECTION
    //----------------------------------

    toggleMessagingSect = (userBeingMessaged: IChatUser) => {
        let inMessagingSection = !this.state.inMessagingSection;
        this.setState({ inMessagingSection: inMessagingSection, userBeingMessaged: userBeingMessaged });
    }


    //----------------------------------
    //      RENDER METHOD
    //----------------------------------

    render() {
        return (
            <GlobalContext.Consumer>
                {context => (
                    <div id="chat-section-container" style={{ height: this.state.height }}>

                        {
                            //----   HEADER   ----

                            <div id="chat-section-header" className="grid-3-col">

                                {
                                    this.state.inMessagingSection &&
                                    <div>
                                        <ArrowBackSharp style={{ transform: "scale(1.2)" }} className="chat-header-buttons" onClick={() => this.toggleMessagingSect(null)} />
                                    </div>
                                }

                                <div style={{ gridColumn: 2 }}>
                                    <h3 >Chat</h3>
                                </div>

                                <div style={{ gridColumn: 3 }} >
                                    <Close style={{ transform: "scale(1.2)" }} className="chat-header-buttons" onClick={this.props.toggleChat} />
                                </div>

                            </div>
                        }

                        {
                            //----   LIST CONTACTS   ----

                            !this.state.inMessagingSection &&
                            <div id="chat-section-list-contacts-container" className="flex-column">
                                <ChatContactsCard userID={this.props.userID} title={"Admins"} goToChat={this.toggleMessagingSect} userType={1} token={this.props.token} />
                                <ChatContactsCard userID={this.props.userID} title={"Staff"} goToChat={this.toggleMessagingSect} userType={2} token={this.props.token} />
                                <ChatContactsCard userID={this.props.userID} title={"Students"} goToChat={this.toggleMessagingSect} userType={3} token={this.props.token} />
                            </div>
                        }

                        {
                            //----   MESSAGING SECTION   ----
                            this.state.inMessagingSection &&
                            <ChatMessagingSection context={context} parentHeight={this.state.height} token={this.props.token} userID={this.props.userID} userBeingMessaged={this.state.userBeingMessaged} />
                        }

                    </div >
                )}
            </GlobalContext.Consumer>
        );
    }
}

export default ChatSection;
