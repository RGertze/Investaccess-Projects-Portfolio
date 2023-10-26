import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { ChatSquareText } from "react-bootstrap-icons";
import { Connection } from "../../connection";
import { IGlobalContext, ISignedGetRequest, IUser } from "../../interfaces/general_interfaces";
import { errorToast } from "../alert-components/toasts";
import "./userCard.css";

interface IProps {
    context: IGlobalContext,
    user: IUser,
    onViewClick(): void
}

const UserCard = (props: IProps) => {

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
        <div style={{ backgroundColor: props.context.theme.primary }} className="shadow-sm rounded hor-center user-card-container">
            <img className="rounded hor-center" src={(profilePicUrl !== "") ? profilePicUrl : "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"} alt="" />

            <div className="user-card-details">
                <h4 style={{ color: props.context.theme.tertiary }}>{props.user.firstName} {props.user.lastName}</h4>
                <p style={{ color: props.context.theme.tertiary }}>{props.user.email} <ChatSquareText onClick={() => props.context.setUserBeingMessaged(props.user)} className="hover btn-link icon-x-sm m-left-30" /></p>
            </div>

            <Button onClick={props.onViewClick} className="hor-center btn-user-card-view" variant="outline-secondary">View</Button>
        </div>
    );
}

export default UserCard;