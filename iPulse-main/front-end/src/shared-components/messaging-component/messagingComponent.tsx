import { HubConnection } from "@microsoft/signalr";
import { useEffect, useLayoutEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { ArrowLeft, Send } from "react-bootstrap-icons";
import { Connection, GET_ENDPOINT, HUB, POST_ENDPOINT, WsConnection } from "../../connection";
import { IDirectMessage } from "../../interfaces/direct_message_interfaces";
import { DIRECT_MESSAGE_METHOD } from "../../interfaces/general_enums";
import { IGlobalContext, ISignedGetRequest, IUser } from "../../interfaces/general_interfaces";
import { errorToast } from "../alert-components/toasts";
import Loading from "../loading-component/loading";
import "./messagingComponent.css";


interface IProps {
    context: IGlobalContext,
    toUser: IUser,
    back(): void
}


const MessagingComponent = (props: IProps) => {

    const [ws, setWs] = useState<HubConnection>();

    const [messageInput, setMessageInput] = useState("");
    const [loading, setLoading] = useState(false);

    const [messages, setMessages] = useState<IDirectMessage[]>([]);
    const [newMessageRecv, setNewMessageRecv] = useState<any>();


    const [profilePicUrl, setProfilePicUrl] = useState("");

    // COMPONENT DID MOUNT
    useEffect(() => {
        setupWsConnection();
        getProfilePicUrl();
        getMessagesBetweenUsers();
    }, []);

    // ON MESSAGES CHANGED
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // ON NEW MESSAGE CHANGED
    useEffect(() => {
        if (newMessageRecv)
            appendNewMessageReceived(newMessageRecv);
    }, [newMessageRecv]);


    // COMPONENT WILL UNMOUNT
    useLayoutEffect(() => {
        return disconnectWs();
    }, []);

    //----   DISCONNECT WS   ----
    const disconnectWs = () => {
        if (ws) {
            ws.off(DIRECT_MESSAGE_METHOD.CLIENT_DIRECT_MESSAGE_RECEIVED);
            ws.stop();
        }
    }

    //----   SETUP WS CONNECTION   ----
    const setupWsConnection = async () => {
        const conn = WsConnection.buildWs(HUB.DIRECT_MESSAGE_HUB);

        try {
            await conn.start();
            conn.on(DIRECT_MESSAGE_METHOD.CLIENT_DIRECT_MESSAGE_RECEIVED, data => {
                setNewMessageRecv(data);
            });
            setWs(conn);
        } catch (ex: any) {
            console.log(ex);
            errorToast(ex, true, 2000);
        }
    }

    //----   APPEND NEW MESSAGE RECEIVED   ----
    const appendNewMessageReceived = (msg: IDirectMessage) => {
        const newMessages = [...messages, msg];
        setMessages(newMessages);
    }

    //----   GET PROFILE PIC URL   ----
    const getProfilePicUrl = async () => {
        let result = await Connection.getS3GetUrl(props.toUser.profilePicPath);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true);
            return;
        }
        setProfilePicUrl((result.data as ISignedGetRequest).signedUrl);
    }

    //----   GET MESSAGES BETWEEN USERS   ----
    const getMessagesBetweenUsers = async () => {
        setLoading(true);
        let url = `?user1Id=${props.context.userId}&user2Id=${props.toUser.userId}`;
        let result = await Connection.getRequest(GET_ENDPOINT.GET_MESSAGES_BETWEEN_USERS + url, "");
        setLoading(false);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true);
            return;
        }
        setMessages(result.data);
    }

    //----   SEND MESSAGE   ----
    const sendMessage = async () => {
        if (messageInput === "") {
            errorToast("Enter a messsage");
            return;
        }

        setLoading(true);

        let data = {
            fromId: props.context.userId,
            toId: props.toUser.userId,
            content: messageInput
        }

        let result = await Connection.postRequest(POST_ENDPOINT.ADD_DIRECT_MESSAGE, data, {});
        setLoading(false);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 1800);
            return;
        }

        setMessageInput("");

        getMessagesBetweenUsers();
    }

    //----   SCROLL TO BOTTOM   ----
    const scrollToBottom = () => {
        let elem = document.getElementById("message-content-pane");
        if (elem !== null)
            elem.scrollTop = elem.scrollHeight;
    }

    return (
        <div className="full-size messaging-container">

            {
                // HEADER
                <div className="messaging-header">
                    <ArrowLeft onClick={() => { disconnectWs(); props.back() }} className="icon-sm hor-center hover" />
                    <img className="rounded hor-center" src={(profilePicUrl !== "") ? profilePicUrl : "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"} alt="" />
                    <h5>{props.toUser.firstName} {props.toUser.lastName}</h5>
                </div>
            }

            {
                // MESSAGES
                <div id="message-content-pane" className="full-size rounded messaging-content">
                    {
                        messages.map((msg, index) => {
                            let showDate = false;
                            let d1 = msg.dateSent.substring(0, 10);
                            if (index - 1 >= 0) {
                                let d2 = messages[index - 1].dateSent.substring(0, 10);
                                if (d1 !== d2) {
                                    showDate = true;
                                }
                            } else if (messages.length === 1 || index === 0) {
                                showDate = true;
                            }

                            return (
                                <>
                                    {
                                        showDate &&
                                        <h4>{(new Date(d1).toDateString())}</h4>
                                    }
                                    <div className={`rounded direct-message ${(msg.fromId === props.context.userId) ? "dm-right" : ""}`} key={index}>
                                        <div className="vert-flex direct-message-header">
                                            <p>{msg.dateSent.substring(11)}</p>
                                            {
                                                msg.fromId === props.context.userId &&
                                                <p>Me</p>
                                            }
                                        </div>
                                        <p className="message">{msg.content}</p>
                                    </div>
                                </>
                            );
                        })
                    }
                    {
                        (!loading && messages.length === 0) &&
                        <h5>No Messages</h5>
                    }
                    {
                        loading &&
                        <Loading />
                    }
                </div>
            }

            {
                // FOOTER
                <div className="full-size rounded messaging-footer">
                    <Form className="hor-center messaging-input">
                        <Form.Group className="full-size">
                            <Form.Control className="full-size" onChange={ev => setMessageInput(ev.target.value)} as="textarea" rows={3} placeholder="type message" value={messageInput} />
                        </Form.Group>
                    </Form>
                    <Send onClick={() => sendMessage()} className="hover btn-approve icon-sm hor-center" />
                </div>
            }

        </div>
    );
}

export default MessagingComponent;
