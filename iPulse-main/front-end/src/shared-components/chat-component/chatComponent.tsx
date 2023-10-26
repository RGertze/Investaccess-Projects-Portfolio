
import { useEffect, useState } from "react";
import { Offcanvas } from "react-bootstrap";
import { Connection, GET_ENDPOINT } from "../../connection";
import { IChatUser } from "../../interfaces/direct_message_interfaces";
import { IGlobalContext, IResponse, IUser, UserType } from "../../interfaces/general_interfaces";
import { errorToast } from "../alert-components/toasts";
import ChatUserComponent from "../chat-user-component/chatUserComponent";
import Loading from "../loading-component/loading";
import MessagingComponent from "../messaging-component/messagingComponent";
import "./chatComponent.css";

interface IProps {
    context: IGlobalContext
}

const ChatComponent = (props: IProps) => {

    const [messaging, setMessaging] = useState(false);
    const [usersToMessage, setUsersToMessage] = useState<IChatUser[]>([]);
    const [userBeingMessaged, setUserBeingMessaged] = useState<IUser>({
        email: "",
        firstName: "",
        lastName: "",
        profilePicPath: "",
        userId: 0,
        profilePicUrl: ""
    });

    //----   ON SHOW CHAT CHANGED    ----
    useEffect(() => {
        // set newMessage to false
        props.context.setNewMessage(false);

        getUsersBeingMessaged();

        // if user passed in, immediately go to messaging section
        if (props.context.userBeingMessaged.userId !== 0) {
            setUserBeingMessaged(props.context.userBeingMessaged);
            setMessaging(true);
        }
    }, [props.context.showChat]);


    //----   GET USERS BEING MESSAGED    ----
    const getUsersBeingMessaged = async () => {
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_USERS_BEING_MESSAGED + props.context.userId, "");
        if (result.errorMessage.length > 0) {
            console.log(result.errorMessage);
            errorToast(result.errorMessage, true);
            return;
        }
        console.log(result.data);
        setUsersToMessage(result.data);
    }

    //----   GET PATIENT DOCTORS    ----
    const getPatientDoctors = async () => {
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_ALL_A_PATIENTS_DOCTORS + props.context.userId, "");
        if (result.errorMessage.length > 0) {
            console.log(result.errorMessage);
            errorToast(result.errorMessage, true);
            return;
        }
        setUsersToMessage(result.data);
    }

    //----   GET DOCTOR PATIENTS    ----
    const getDoctorPatients = async () => {
        let qry = `?doctorId=${props.context.userId}`;
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_ALL_A_DOCTORS_PATIENTS + qry, "");
        if (result.errorMessage.length > 0) {
            console.log(result.errorMessage);
            errorToast(result.errorMessage, true);
            return;
        }
        setUsersToMessage(result.data);
    }

    return (
        <Offcanvas show={props.context.showChat} onHide={() => {
            if (props.context.userBeingMessaged.userId !== 0) {
                props.context.clearUserBeingMessaged();
            }
            props.context.setShowChat(false);
        }} placement={"end"}>

            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Chat</Offcanvas.Title>
            </Offcanvas.Header>

            <Offcanvas.Body>
                {
                    (!messaging && usersToMessage.length === 0) &&
                    <Loading />
                }
                {
                    !messaging &&
                    usersToMessage.map((u, index) => {
                        return (
                            <ChatUserComponent onClick={() => { setUserBeingMessaged(u); setMessaging(true); }} context={props.context} user={u} key={index} />
                        )
                    })
                }
                {
                    messaging &&
                    <MessagingComponent back={() => {
                        setMessaging(false);
                        setUserBeingMessaged({
                            email: "",
                            firstName: "",
                            lastName: "",
                            profilePicPath: "",
                            userId: 0,
                            profilePicUrl: ""
                        });
                        getUsersBeingMessaged();
                    }} context={props.context} toUser={userBeingMessaged} />
                }
            </Offcanvas.Body>

        </Offcanvas>
    );
}

export default ChatComponent;