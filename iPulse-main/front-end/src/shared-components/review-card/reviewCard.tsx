import { useEffect, useState } from "react";
import { Badge, Button, Table } from "react-bootstrap";
import { Check2, Star, StarFill, StarHalf, Trash, X } from "react-bootstrap-icons";
import { Connection } from "../../connection";
import { IReview } from "../../interfaces/doctor_interfaces";
import { IGlobalContext, ISignedGetRequest, UserType } from "../../interfaces/general_interfaces";
import { errorToast } from "../alert-components/toasts";
import Loading from "../loading-component/loading";
import "./reviewCard.css";

interface IProps {
    context: IGlobalContext,

    review: IReview,

    deleteReview(id: number): Promise<void>
}

const ReviewCard = (props: IProps) => {
    const stars = [1, 2, 3, 4, 5];
    const [loading, setLoading] = useState(false);
    const [isDoctor, setIsDoctor] = useState(false);

    const [profilePicUrl, setProfilePicUrl] = useState("");

    // COMPONENT DID MOUNT
    useEffect(() => {

        // set isDoctor
        if (props.context.userType === UserType.DOCTOR) {
            setIsDoctor(true);
        }
        getProfilePicUrl();
    }, []);

    // GET PROFILE PIC URL
    const getProfilePicUrl = async () => {
        let result = await Connection.getS3GetUrl(props.review.profilePicPath);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true);
            return;
        }
        setProfilePicUrl((result.data as ISignedGetRequest).signedUrl);
    }

    return (
        <div style={{backgroundColor:props.context.theme.primary}} className="rounded shadow hor-center review-card-container">
            {
                // user details
                <div className="fullsize review-card-user vert-flex justify-center">
                    <div>
                        <img className="rounded-circle hor-center" src={(profilePicUrl !== "") ? profilePicUrl : "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"} alt="" />
                        <h5 className="wrap-text hor-center">{props.review.firstName}</h5>
                        <p className="wrap-text hor-center">{props.review.email}</p>
                    </div>
                </div>
            }
            {
                // date
                <div className="review-card-date vert-flex justify-end">
                    <p><b>{(new Date(props.review.reviewDate)).toDateString()}</b> {props.review.reviewDate.substring(11)}</p>
                    {
                        (isDoctor || props.review.userId === props.context.userId) &&
                        <Trash onClick={async () => {
                            setLoading(true);
                            await props.deleteReview(props.review.reviewId);
                            setLoading(false);
                        }} className="icon-sm btn-reject hover" />
                    }
                </div>
            }
            {
                // comment
                <div className="review-card-comment">
                    {
                        loading &&
                        <Loading />
                    }
                    {
                        !loading &&
                        <p>{props.review.comment}</p>
                    }
                </div>
            }
            {
                // stars
                <div className="review-card-stars vert-flex justify-center">
                    {
                        loading &&
                        <Loading />
                    }
                    {
                        !loading &&
                        stars.map((value, index) => {
                            if (props.review.rating < value && props.review.rating > value - 1) {
                                return (
                                    <StarHalf style={{ color: "#FFD700" }} className="icon-sm review-star" />
                                );
                            }
                            if (props.review.rating < value) {
                                return (
                                    <Star style={{ color: "#BBBBBB" }} className="icon-sm review-star" />
                                );
                            }
                            return (
                                <StarFill style={{ color: "#FFD700" }} className="icon-sm review-star" />
                            );
                        })
                    }
                </div>
            }
        </div>
    );
}

export default ReviewCard;