import { useEffect, useState } from "react";
import { Badge, Button } from "react-bootstrap";
import { Dot } from "react-bootstrap-icons";
import { Connection } from "../../connection";
import { IChatUser } from "../../interfaces/direct_message_interfaces";
import { IGlobalContext, ISignedGetRequest, IUser } from "../../interfaces/general_interfaces";
import { errorToast } from "../alert-components/toasts";
import "./chatUserComponent.css";


interface IProps {
    context: IGlobalContext,
    user: IChatUser,
    onClick(): void
}


const ChatUserComponent = (props: IProps) => {
    const [profilePicUrl, setProfilePicUrl] = useState("");

    // COMPONENT DID MOUNT
    useEffect(() => {
        console.log(props.user);
        getProfilePicUrl();
    }, []);

    // GET PROFILE PIC URL
    const getProfilePicUrl = async () => {
        let result = await Connection.getS3GetUrl(props.user.profilePicPath);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true);
            return;
        }
        setProfilePicUrl((result.data as ISignedGetRequest).signedUrl);
    }

    return (
        <div onClick={() => props.onClick()} className="rounded shadow-sm hor-center chat-user-container">
            <img className="rounded hor-center" src={(profilePicUrl !== "") ? profilePicUrl : "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"} alt="" />
            <div className="chat-user-details">
                <h4>{props.user.firstName} {props.user.lastName}</h4>
                <p>{props.user.email}</p>
            </div>
            {
                (props.user.unseen > 0) &&
                <Badge className="btn-approve hor-center icon-m unseen-badge" bg="success">{props.user.unseen}</Badge>
            }
        </div>
    );
}

export default ChatUserComponent;