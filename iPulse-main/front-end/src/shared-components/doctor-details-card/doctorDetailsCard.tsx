import { useEffect, useState } from "react";
import { Button, Tab, Table, Tabs } from "react-bootstrap";
import { ChatSquareText } from "react-bootstrap-icons";
import { Connection, DELETE_ENDPOINT, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { IDoctorEducation, IDoctorProfile, IDoctorWorkHistory, IReview } from "../../interfaces/doctor_interfaces";
import { IGlobalContext, IResponse, ISignedGetRequest, IUser } from "../../interfaces/general_interfaces";
import AddEditComponent from "../add-edit-component/AddEditComponent";
import { errorToast, successToast } from "../alert-components/toasts";
import Loading from "../loading-component/loading";
import ReviewCard from "../review-card/reviewCard";
import "./doctorDetailsCard.css";


interface INewReview {
    Comment: string,
    Rating_Between_1_And_5: number
}

interface IProps {
    context: IGlobalContext,
    doctorId: number
}

const DoctorDetailsCard = (props: IProps) => {

    // TAB VARIABLES
    const [tabKey, setTabKey] = useState('profile');

    // LOADING VARIABLES
    const [loadingUser, setLoadingUser] = useState(false);
    const [loadingDetails, setLoadingDetails] = useState(false);

    // USER VARIABLES
    const [profilePicUrl, setProfilePicUrl] = useState("");
    const [user, setUser] = useState<IUser>({ userId: 0, email: "", firstName: "", lastName: "", profilePicPath: "" });
    const [profile, setProfile] = useState<IDoctorProfile>();
    const [workHistory, setWorkHistory] = useState<IDoctorWorkHistory[]>([]);
    const [education, setEducation] = useState<IDoctorEducation[]>([]);

    // REVIEW VARIABLES
    const [addingReview, setAddingReview] = useState(false);
    const [reviews, setReviews] = useState<IReview[]>([]);


    // COMPONENT DID MOUNT
    useEffect(() => {
        getUserDetails();
        getProfile();
    }, []);

    // ON TAB CHANGE
    useEffect(() => {
        if (tabKey === "work-history") {
            getWorkHistory();
        }
        if (tabKey === "education") {
            getEducation();
        }
        if (tabKey === "reviews") {
            getReviews();
        }
    }, [tabKey]);

    // ON USER CHANGE
    useEffect(() => {
        getProfilePicUrl();
    }, [user]);

    // GET USER DETAILS
    const getUserDetails = async () => {
        setLoadingUser(true);
        let result = await Connection.getRequest(GET_ENDPOINT.GET_USER + props.doctorId, "");
        setLoadingUser(false);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true);
            return;
        }
        setUser(result.data);
    }

    // GET PROFILE
    const getProfile = async () => {
        setLoadingDetails(true);
        let result = await Connection.getRequest(GET_ENDPOINT.GET_DOCTOR_PROFILE + props.doctorId, "");
        setLoadingDetails(false);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true);
            return;
        }
        setProfile(result.data);
    }

    // GET PROFILE PIC URL
    const getProfilePicUrl = async () => {
        let result = await Connection.getS3GetUrl(user.profilePicPath);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true);
            return;
        }
        setProfilePicUrl((result.data as ISignedGetRequest).signedUrl);
    }

    // GET WORK HISTORY
    const getWorkHistory = async () => {
        setLoadingDetails(true);
        let result = await Connection.getRequest(GET_ENDPOINT.GET_ALL_DOCTOR_WORK_HISTORY + props.doctorId, "");
        setLoadingDetails(false);
        if (result.errorMessage.length > 0) {
            console.log(result.errorMessage);
            errorToast("Failed to get work history: " + result.errorMessage, true);
            return;
        }
        setWorkHistory(result.data);
    }

    // GET EDUCATION
    const getEducation = async () => {
        setLoadingDetails(true);

        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_ALL_DOCTOR_EDUCATION + props.doctorId, "");
        setLoadingDetails(false);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true);
            return;
        }
        setEducation(result.data);
    }

    // GET REVIEWS
    const getReviews = async () => {
        setLoadingDetails(true);

        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_DOCTOR_REVIEWS + props.doctorId, "");
        setLoadingDetails(false);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true);
            return;
        }
        setReviews(result.data);
    }

    // ADD REVIEW
    const addReview = async (data: any): Promise<boolean> => {
        if (!validateNewReview(data)) {
            return false;
        }

        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.ADD_DOCTOR_REVIEW, {
            doctorId: props.doctorId,
            patientId: props.context.userId,
            comment: (data as INewReview).Comment,
            rating: (data as INewReview).Rating_Between_1_And_5
        }, {});
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }
        setAddingReview(false);
        getReviews();
        successToast("Added review", true, 1500);
        return true;
    }

    // VALIDATE NEW REVIEW
    const validateNewReview = (data: INewReview): boolean => {
        if (!data.Comment || data.Comment === "") {
            errorToast("Enter a comment");
            return false;
        }
        if (!data.Rating_Between_1_And_5 || data.Rating_Between_1_And_5 > 5 || data.Rating_Between_1_And_5 < 1) {
            errorToast("Enter a valid rating between 1 and 5");
            return false;
        }
        return true;
    }

    // DELETE REVIEW
    const deleteReview = async (id: number) => {
        let result: IResponse = await Connection.delRequest(DELETE_ENDPOINT.DELETE_DOCTOR_REVIEW + id);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true);
            return;
        }

        successToast("Review deleted", true, 1500);
        getReviews();
    }

    return (
        <div className="full-size doctor-details-container">
            {   // user details
                <div className="vert-flex details-user">
                    <div className="hor-center">
                        {
                            profilePicUrl.length > 0 &&
                            <img className="rounded-circle" src={profilePicUrl !== "" ? profilePicUrl : "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"} />
                        }
                        <h4>{user.firstName} {user.lastName}</h4>
                        <p>{user.email} <ChatSquareText onClick={() => props.context.setUserBeingMessaged(user)} className="hover btn-link icon-sm m-left-30" /></p>
                    </div>
                </div>
            }
            {   // profile details

                <div style={{ backgroundColor: props.context.theme.primary, padding: "10px" }} className="rounded details-tabs">
                    <Tabs activeKey={tabKey} onSelect={(e) => setTabKey(e ? e : "profile")}>
                        <Tab className="profile-tab" eventKey="profile" title="Profile">
                            <Table size="sm">
                                <tbody>
                                    <tr>
                                        <td>Practice Number:</td>
                                        <td>{profile?.practiceNumber}</td>
                                    </tr>
                                    <tr>
                                        <td>Practice Name:</td>
                                        <td>{profile?.practiceName}</td>
                                    </tr>
                                    <tr>
                                        <td>Specialty Name:</td>
                                        <td>{profile?.specialtyName}</td>
                                    </tr>
                                    <tr>
                                        <td>Appointment Price:</td>
                                        <td>{profile?.appointmentPrice}</td>
                                    </tr>
                                    <tr>
                                        <td>Nationality:</td>
                                        <td>{profile?.nationality}</td>
                                    </tr>
                                    <tr>
                                        <td>Practice Address:</td>
                                        <td>{profile?.practiceAddress}</td>
                                    </tr>
                                    <tr>
                                        <td>Practice City:</td>
                                        <td>{profile?.practiceCity}</td>
                                    </tr>
                                    <tr>
                                        <td>Practice Country:</td>
                                        <td>{profile?.practiceCountry}</td>
                                    </tr>
                                    <tr>
                                        <td>Practice WebAddress:</td>
                                        <td>{profile?.practiceWebAddress}</td>
                                    </tr>
                                    <tr>
                                        <td>Secondary Cellphone:</td>
                                        <td>{profile?.secondaryCellphone}</td>
                                    </tr>
                                    <tr>
                                        <td>Secondary Email:</td>
                                        <td>{profile?.secondaryEmail}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Tab>

                        <Tab className="work-history-tab" eventKey="work-history" title="Work History">
                            <Table size="sm">
                                <thead>
                                    <tr>
                                        <td><b>Company</b></td>
                                        <td><b>Role</b></td>
                                        <td><b>Start Date</b></td>
                                        <td><b>End Date</b></td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        workHistory.map((wh, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{wh.companyName}</td>
                                                    <td>{wh.role}</td>
                                                    <td>{wh.startDate}</td>
                                                    <td>{wh.endDate}</td>
                                                </tr>
                                            );
                                        })
                                    }
                                    {
                                        workHistory.length === 0 &&
                                        <tr><td colSpan={4}>Nothing to show!</td></tr>
                                    }
                                </tbody>
                            </Table>
                        </Tab>

                        <Tab className="work-history-tab" eventKey="education" title="Education">
                            <Table size="sm">
                                <thead>
                                    <tr>
                                        <th><b>Institute</b></th>
                                        <th><b>Qualification</b></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        education.map((edu, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{edu.instituteName}</td>
                                                    <td>{edu.qualificationName}</td>
                                                </tr>
                                            );
                                        })
                                    }
                                    {
                                        education.length === 0 &&
                                        <tr><td colSpan={4}>Nothing to show!</td></tr>
                                    }
                                </tbody>
                            </Table>
                        </Tab>


                        <Tab className="reviews-tab" eventKey="reviews" title="Reviews">
                            <Button onClick={() => setAddingReview(true)} variant="success">Add New</Button>

                            {
                                reviews.map((review, index) => {
                                    return (
                                        <ReviewCard context={props.context} review={review} deleteReview={deleteReview} />
                                    );
                                })
                            }

                            {
                                addingReview &&
                                <AddEditComponent
                                    cancel={() => setAddingReview(false)}
                                    submit={addReview}
                                    data={{ Comment: "", Rating_Between_1_And_5: 0 }}
                                    title={"Add a review"}
                                />
                            }

                            {
                                loadingDetails &&
                                <Loading />
                            }
                        </Tab>

                    </Tabs>
                </div>
            }
        </div>
    );
}

export default DoctorDetailsCard;