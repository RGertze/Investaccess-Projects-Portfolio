import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Connection, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { IResponse, IUser } from "../../interfaces/general_interfaces";
import { errorToast, successToast } from "../alert-components/toasts";
import Loading from "../loading-component/loading";
import "./userPic.css";

interface IProps {
    profilePicPath: string
}

let UserPic = (props: IProps) => {

    const [loading, setLoading] = useState(false);
    const [picUrl, setPicUrl] = useState("");


    useEffect(() => {
        getProfilePicUrl();
    }, [props.profilePicPath]);

    //----   GET PIC URL   ---- 
    const getProfilePicUrl = async () => {
        if (props.profilePicPath !== "") {
            let data = {
                filePath: props.profilePicPath
            }

            // get signed get url
            let result = await Connection.postRequest(POST_ENDPOINT.GET_SIGNED_GET_URL, data, {});
            if (result.errorMessage.length > 0) {
                console.log(result.errorMessage);
                return;
            }

            setPicUrl(result.data.signedUrl);
        }
    }

    return (
        <div className="rounded full-size vert-flex justify-center user-pic-container">
            {
                !loading &&
                <img className="rounded-circle " src={picUrl !== "" ? picUrl : "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"} />
            }
            {
                loading &&
                <Loading color="blue" small={true} />
            }
        </div>
    );
}

export default UserPic;