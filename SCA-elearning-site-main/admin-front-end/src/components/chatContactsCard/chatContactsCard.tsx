
//----------------------------------
//      REACT IMPORTS
//----------------------------------

import React, { Component } from "react";
import { IChatUser, IGetUsersToMessage, IResponse } from "../../interfaces";

//----------------------------------
//      CSS IMPORTS
//----------------------------------

import "./chatContactsCard.css";

//----------------------------------
//      COMPONENT IMPORTS
//----------------------------------

import CircularProgress from "@material-ui/core/CircularProgress";
import EmptyListNotification from "../../../../staff-front-end/src/components/emptyListNotification/emptyListNotification";
import Connection, { GET_TYPE } from "../../connection";


//----------------------------------
//      INTERFACE DEFINITIONS
//----------------------------------

interface IState {
    toggled: boolean,
    loading: boolean,
    users: IChatUser[]
}

interface IProps {
    token: string,
    title: string,
    userType: number,
    userID: number,
    goToChat: (userBeingMessaged: IChatUser) => void
}


//----------------------------------
//      CLASS DEFINITION
//----------------------------------

class ChatContactsCard extends Component<IProps, IState> {

    //----------------------------------
    //      CONSTRUCTOR
    //----------------------------------

    constructor(props: IProps) {
        super(props);

        this.state = {
            toggled: false,
            loading: false,
            users: []
        }
    }


    //----------------------------------
    //      COMP DID MOUNT
    //----------------------------------

    componentDidMount() {
        if (this.props.userType > 1) {
            this.handleToggle();
        }
    }


    //----------------------------------
    //      HANDLE TOGGLE
    //----------------------------------

    handleToggle = () => {
        if (!this.state.toggled) {
            this.getChatUsers();
        }

        let toggled = !this.state.toggled;
        this.setState({ toggled: toggled });
    }


    //----------------------------------
    //      HANDLE TOGGLE
    //----------------------------------

    getChatUsers = async () => {
        this.setState({ loading: true });

        let data: IGetUsersToMessage = {
            userID: this.props.userID,
            userType: this.props.userType
        }

        let result: IResponse = await Connection.getReq(GET_TYPE.GET_USERS_TO_MESSAGE, this.props.token, data);

        if (result.stat === "ok") {
            this.setState({ users: result.data, loading: false });
            return;
        }

        this.setState({ users: [], loading: false });
    }


    //----------------------------------
    //      RENDER METHOD
    //----------------------------------

    render() {
        return (
            <div id="chat-contacts-card-container" className="flex-column">

                {
                    //----   HEADER   ----
                    <div id="chat-contacts-card-header" className="flex-row" onClick={this.handleToggle}>
                        <h2 >{this.props.title} {this.state.toggled ? "\u25B2" : "\u25BC"}</h2>
                    </div>
                }

                {

                    this.state.toggled &&
                    <div id="chat-contacts-card-list" className="flex-column">

                        {
                            //----   PROGRESS ICON   ----

                            this.state.loading &&
                            <CircularProgress style={{ width: "20px", height: "20px", marginTop: "5px", marginBottom: "10px" }} />
                        }

                        {
                            //----   LIST CONTACTS   ----

                            !this.state.loading &&
                            this.state.users.map(user => {
                                return (
                                    <h4 className="chat-contact" onClick={() => this.props.goToChat(user)}>
                                        {user.userName} {user.newMessages === 1 ? "*" : ""}
                                    </h4>
                                );
                            })
                        }

                        {
                            //----   NO RECORDS FOUND NOTIF   ----

                            (!this.state.loading && this.state.users.length === 0) &&
                            <EmptyListNotification message={"No users found"} />
                        }
                    </div>
                }

            </div >
        );
    }
}

export default ChatContactsCard;
