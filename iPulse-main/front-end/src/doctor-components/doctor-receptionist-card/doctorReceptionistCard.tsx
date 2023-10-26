import { useEffect, useState } from "react";
import { Card, Table } from "react-bootstrap";
import { Pencil, Trash, Trash3Fill } from "react-bootstrap-icons";
import { Connection, DELETE_ENDPOINT, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { IDoctorWorkHistory } from "../../interfaces/doctor_interfaces";
import { IResponse } from "../../interfaces/general_interfaces";
import { IReceptionist } from "../../interfaces/receptionist_interfaces";
import { errorToast, successToast } from "../../shared-components/alert-components/toasts";
import Loading from "../../shared-components/loading-component/loading";
import "./doctorReceptionistCard.css";

interface IProps {
    receptionist: IReceptionist,

    refreshReceptionists(): Promise<void>
}

let DoctorReceptionistCard = (props: IProps) => {

    const [loading, setLoading] = useState(false);
    const [profilePicUrl, setProfilePicUrl] = useState("");

    // COMPONENT DID MOUNT
    useEffect(() => {
        getProfilePicUrl();
    }, []);

    // GET PROFILE PIC URL
    const getProfilePicUrl = async () => {
        let data = {
            filePath: props.receptionist.profilePicPath
        }

        // get signed get url
        let result = await Connection.postRequest(POST_ENDPOINT.GET_SIGNED_GET_URL, data, {});
        if (result.errorMessage.length > 0) {
            errorToast("Failed to get profile pic url: " + result.errorMessage, true);
            return;
        }

        setProfilePicUrl(result.data.signedUrl);
    }

    // DELETE RECEPTIONIST
    const deleteReceptionist = async () => {
        setLoading(true);

        const result: IResponse = await Connection.delRequest(DELETE_ENDPOINT.DELETE_RECEPTIONIST + props.receptionist.userId);
        setLoading(false);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true);
            return;
        }
        successToast("Deleted receptionist!", true, 1500);

        props.refreshReceptionists();
    }

    return (
        <Card className="this-scrollbar doctor-receptionist-card">
            <Card.Header>
                <div className="icons-container vert-flex">
                    <Trash onClick={deleteReceptionist} className="hover icon-sm btn-reject m-left-30" />
                </div>
                <img className="rounded-circle " src={profilePicUrl !== "" ? profilePicUrl : "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"} />
            </Card.Header>
            <Card.Body>
                <Card.Subtitle>
                    <h5>{props.receptionist.email}</h5>
                    <p>{props.receptionist.firstName} {props.receptionist.lastName}</p>
                </Card.Subtitle>
                {
                    loading &&
                    <Loading />
                }
            </Card.Body>
        </Card>
    );
}

export default DoctorReceptionistCard;