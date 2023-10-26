import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { Book, Cash, ChatSquare, ChatSquareFill, ChatSquareText, GeoAlt, Star, StarFill, StarHalf } from "react-bootstrap-icons";
import stethoscopeImg from "../../assets/images/stethoscope-icon.webp";
import { Connection } from "../../connection";
import { IDoctorAll } from "../../interfaces/doctor_interfaces";
import { IGlobalContext, ISignedGetRequest } from "../../interfaces/general_interfaces";
import { errorToast } from "../alert-components/toasts";
import "./doctorCard.css";

interface IProps {
    context: IGlobalContext,
    doctor: IDoctorAll,

    viewDoctor(): void
}

const DoctorCard = (props: IProps) => {

    const stars = [1, 2, 3, 4, 5];

    const [profilePicUrl, setProfilePicUrl] = useState("");

    // COMPONENT DID MOUNT
    useEffect(() => {
        getProfilePicUrl();
    }, []);

    // GET PROFILE PIC URL
    const getProfilePicUrl = async () => {
        let result = await Connection.getS3GetUrl(props.doctor.profilePicPath);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true);
            return;
        }
        setProfilePicUrl((result.data as ISignedGetRequest).signedUrl);
    }

    return (
        <div style={{ backgroundColor: props.context.theme.primary }} className="rounded  shadow-sm vert-flex hor-center doctor-card-container">
            {
                // doctor details
                <div className="doctor-card-user-details-container">
                    <img className="rounded hor-center" src={(profilePicUrl !== "") ? profilePicUrl : "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"} alt="" />
                    <div className="doctor-card-user-details">
                        <h4>Dr {props.doctor.firstName} {props.doctor.lastName}</h4>
                        <p>{props.doctor.email} <ChatSquareText onClick={() => props.context.setUserBeingMessaged(props.doctor)} className="hover btn-link icon-x-sm m-left-30" /></p>
                        <div className="vert-flex">
                            <Book className="icon-x-sm" />
                            <h6>{props.doctor.education}</h6>
                        </div>
                        <div className="doctor-card-rating vert-flex">
                            {
                                // rating
                                stars.map((value, index) => {
                                    if (props.doctor.rating < value && props.doctor.rating > value - 1) {
                                        return (
                                            <StarHalf style={{ color: "#FFD700" }} className="icon-x-sm review-star" />
                                        );
                                    }
                                    if (props.doctor.rating < value) {
                                        return (
                                            <Star style={{ color: "#BBBBBB" }} className="icon-x-sm review-star" />
                                        );
                                    }
                                    return (
                                        <StarFill style={{ color: "#FFD700" }} className="icon-x-sm review-star" />
                                    );
                                })
                            }
                            <p>{props.doctor.rating} ({props.doctor.numberOfReviews})</p>
                        </div>
                        <div className="doctor-specialty vert-flex">
                            <img className="" style={{ width: "25px", height: "auto" }} src={stethoscopeImg} alt="" />
                            <p>{props.doctor.specialtyName}</p>
                        </div>
                    </div>
                </div>
            }

            {
                // other details
                <div className="doctor-card-other-details-container">
                    <Table borderless className="hor-center other-details-table">
                        <tbody>
                            <tr >
                                <td width="20%"><GeoAlt className="icon-sm" /></td>
                                <td className="other-details-value">{props.doctor.location}</td>
                            </tr>
                            <tr>
                                <td><Cash className="icon-sm" /></td>
                                <td className="other-details-value">${props.doctor.appointmentPrice}</td>
                            </tr>
                        </tbody>
                    </Table>
                    <Button onClick={() => props.viewDoctor()} variant="outline-primary" className="other-details-btn">View Profile</Button>
                </div>
            }
        </div >
    );
}

export default DoctorCard;