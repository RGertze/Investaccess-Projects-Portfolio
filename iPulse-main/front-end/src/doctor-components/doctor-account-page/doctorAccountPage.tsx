import { ReactNode, useEffect, useState } from "react";
import { Button, Col, Form, Row, Tab, Tabs } from "react-bootstrap";
import { Connection, DELETE_ENDPOINT, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { IDoctorProfile, IDoctorSpecialty, IReview, IUpdateDoctorProfile } from "../../interfaces/doctor_interfaces";
import { IGlobalContext, IResponse } from "../../interfaces/general_interfaces";
import { errorToast, successToast } from "../../shared-components/alert-components/toasts";
import Loading from "../../shared-components/loading-component/loading";
import ReviewCard from "../../shared-components/review-card/reviewCard";
import UserAccountPage from "../../shared-components/user-account-page/userAccountPage";
import DoctorEducationPage from "../doctor-education-page/doctorEducationPage";
import DoctorReceptionistsPage from "../doctor-receptionists-page/doctorReceptionistsPage";
import DoctorWorkHistoryPage from "../doctor-work-history-page/doctorWorkHistoryPage";
import "./doctorAccountPage.css";

interface IProps {
    context: IGlobalContext,
    children?: ReactNode
}

let DoctorAccountPage = (props: IProps) => {
    const [doctorProfile, setDoctorProfile] = useState<IDoctorProfile>({
        // values used in form
        specialtyId: 0,
        specialtyName: "",
        nationality: "",
        appointmentPrice: 0,
        businessHours: "",

        practiceName: "",
        practiceNumber: "",
        practiceCity: "",
        practiceCountry: "",
        practiceWebAddress: "",
        practiceAddress: "",
        secondaryCellphone: "",
        secondaryEmail: ""
    });

    const [specialties, setSpecialties] = useState<IDoctorSpecialty[]>([]);
    const [reviews, setReviews] = useState<IReview[]>([]);

    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);

    const [tabKey, initTabKey] = useState('profile');

    // COMPONENT DID MOUNT
    useEffect(() => {
        const init = async () => {
            await getDoctorSpecialties();
            await getUserProfileDetails();
        }
        init();
    }, []);

    // ON TAB KEY CHANGE
    useEffect(() => {
        if (tabKey === "reviews") {
            getDoctorReviews();
        }
    }, [tabKey]);

    // GET ALL DOCTOR SPECIALTIES
    const getDoctorSpecialties = async () => {
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_ALL_DOCTOR_SPECIALTY_TYPES, "");
        if (result.errorMessage.length === 0) {
            setSpecialties(result.data);
        }
    }

    // GET DOCTOR PROFILE  
    const getUserProfileDetails = async () => {
        setLoading(true);
        let result = await Connection.getRequest(GET_ENDPOINT.GET_DOCTOR_PROFILE + props.context.userId, "");
        setLoading(false);
        if (result.errorMessage.length > 0) {
            console.log(result.errorMessage);
            errorToast("Failed to get profile: ", true);
            return;
        }
        setLoading(false);
        setDoctorProfile(result.data);
    }

    // GET ALL DOCTOR REVIEWS
    const getDoctorReviews = async () => {
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_DOCTOR_REVIEWS + props.context.userId, "");
        if (result.errorMessage.length > 0) {
            errorToast("Failed to load reviews: " + result.errorMessage, true);
        }
        setReviews(result.data);
    }

    // DELETE REVIEW
    const deleteReview = async (id: number) => {
        let result: IResponse = await Connection.delRequest(DELETE_ENDPOINT.DELETE_DOCTOR_REVIEW + id);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true);
            return;
        }

        successToast("Review deleted", true, 1500);
        getDoctorReviews();
    }

    // UPDATE DOCTOR PROFILE 
    const updateProfileDetails = async () => {
        setLoading(true);

        if (!validateUserDetails()) {
            setLoading(false);
            return;
        }

        let data: IUpdateDoctorProfile = {
            userId: props.context.userId,
            specialtyId: doctorProfile.specialtyId ?? 0,
            nationality: doctorProfile.nationality ?? "",
            practiceNumber: doctorProfile.practiceNumber ?? "",
            practiceName: doctorProfile.practiceName ?? "",
            practiceAddress: doctorProfile.practiceAddress ?? "",
            practiceCity: doctorProfile.practiceCity ?? "",
            practiceCountry: doctorProfile.practiceCountry ?? "",
            practiceWebAddress: doctorProfile.practiceWebAddress ?? "",
            businessHours: doctorProfile.businessHours ?? "",
            appointmentPrice: doctorProfile.appointmentPrice ?? 0,
            secondaryCellphone: doctorProfile.secondaryCellphone ?? "",
            secondaryEmail: doctorProfile.secondaryEmail ?? ""
        }

        let result = await Connection.postRequest(POST_ENDPOINT.UPDATE_DOCTOR_PROFILE, data, {});
        setLoading(false);

        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true);
            return;
        }

        setEditing(false);
        alert("Profile updated");
        successToast("Profile updated", true);
        getUserProfileDetails();
    }

    // VALIDATE USER DETAILS 
    const validateUserDetails = (): boolean => {
        if (doctorProfile.specialtyId === 0) {
            errorToast("Choose a specialty!", true);
            return false;
        }
        if (doctorProfile.nationality === "") {
            errorToast("Enter a nationality!", true);
            return false;
        }
        if (doctorProfile.appointmentPrice === 0) {
            errorToast("Enter a valid appointment price!", true);
            return false;
        }
        if (doctorProfile.practiceName === "") {
            errorToast("Enter a practice name!", true);
            return false;
        }
        if (doctorProfile.practiceNumber === "") {
            errorToast("Enter a practice number!", true);
            return false;
        }

        return true;
    }

    return (
        <>
            <UserAccountPage context={props.context}>
                <Tabs activeKey={tabKey} onSelect={(e) => initTabKey(e ? e : "profile")}>
                    <Tab className="doctor-profile-tab" eventKey="profile" title="Profile">
                        <Form>
                            <Row>
                                <Form.Group as={Col} className="mb-3" controlId="formMedicalScheme">
                                    <Form.Label>Specialty</Form.Label>
                                    <Form.Select disabled={!editing} onChange={(e) => setDoctorProfile({ ...doctorProfile, specialtyId: parseInt(e.target.value) })} value={doctorProfile.specialtyId}>
                                        <option value={0}></option>
                                        {
                                            specialties.map((specialty) => {
                                                return (
                                                    <option value={specialty.specialtyId}>{specialty.specialtyName}</option>
                                                );
                                            })
                                        }
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group as={Col} className="mb-3" controlId="formNationality">
                                    <Form.Label>Nationality</Form.Label>
                                    <Form.Control disabled={!editing} onChange={(e) => setDoctorProfile({ ...doctorProfile, nationality: e.target.value })} type="text" value={doctorProfile.nationality} />
                                </Form.Group>
                            </Row>

                            <Row>
                                <Form.Group as={Col} className="mb-3" controlId="formPatientId">
                                    <Form.Label>Appointment Price</Form.Label>
                                    <Form.Control disabled={!editing} onChange={(e) => setDoctorProfile({ ...doctorProfile, appointmentPrice: parseFloat(e.target.value) })} type="number" step="0.01" value={doctorProfile.appointmentPrice} />
                                </Form.Group>

                                <Form.Group as={Col} className="mb-3" controlId="formMemberNumber">
                                    <Form.Label>Business Hours</Form.Label>
                                    <Form.Control disabled={!editing} onChange={(e) => setDoctorProfile({ ...doctorProfile, businessHours: e.target.value })} type="text" value={doctorProfile.businessHours} />
                                </Form.Group>
                            </Row>

                            <Row>
                                <Form.Group as={Col} className="mb-3" controlId="formResidentialAddress">
                                    <Form.Label>Practice Name</Form.Label>
                                    <Form.Control disabled={!editing} onChange={(e) => setDoctorProfile({ ...doctorProfile, practiceName: e.target.value })} type="text" value={doctorProfile.practiceName} />
                                </Form.Group>
                                <Form.Group as={Col} className="mb-3" controlId="formPostalAddress">
                                    <Form.Label>Practice Number</Form.Label>
                                    <Form.Control disabled={!editing} onChange={(e) => setDoctorProfile({ ...doctorProfile, practiceNumber: e.target.value })} type="text" value={doctorProfile.practiceNumber} />
                                </Form.Group>
                            </Row>

                            <Row>
                                <Form.Group as={Col} className="mb-3" controlId="formResidentialAddress">
                                    <Form.Label>Practice City</Form.Label>
                                    <Form.Control disabled={!editing} onChange={(e) => setDoctorProfile({ ...doctorProfile, practiceCity: e.target.value })} type="text" value={doctorProfile.practiceCity} />
                                </Form.Group>
                                <Form.Group as={Col} className="mb-3" controlId="formPostalAddress">
                                    <Form.Label>Practice Country</Form.Label>
                                    <Form.Control disabled={!editing} onChange={(e) => setDoctorProfile({ ...doctorProfile, practiceCountry: e.target.value })} type="text" value={doctorProfile.practiceCountry} />
                                </Form.Group>
                            </Row>

                            <Row>
                                <Form.Group as={Col} className="mb-3" controlId="formResidentialAddress">
                                    <Form.Label>Practice Web Address</Form.Label>
                                    <Form.Control disabled={!editing} onChange={(e) => setDoctorProfile({ ...doctorProfile, practiceWebAddress: e.target.value })} type="text" value={doctorProfile.practiceWebAddress} />
                                </Form.Group>
                                <Form.Group as={Col} className="mb-3" controlId="formPostalAddress">
                                    <Form.Label>Practice Address</Form.Label>
                                    <Form.Control disabled={!editing} onChange={(e) => setDoctorProfile({ ...doctorProfile, practiceAddress: e.target.value })} type="text" value={doctorProfile.practiceAddress} />
                                </Form.Group>
                            </Row>

                            <Row>
                                <Form.Group as={Col} className="mb-3" controlId="formResidentialAddress">
                                    <Form.Label>Secondary Cellphone</Form.Label>
                                    <Form.Control disabled={!editing} onChange={(e) => setDoctorProfile({ ...doctorProfile, secondaryCellphone: e.target.value })} type="text" value={doctorProfile.secondaryCellphone} />
                                </Form.Group>
                                <Form.Group as={Col} className="mb-3" controlId="formPostalAddress">
                                    <Form.Label>Secondary Email</Form.Label>
                                    <Form.Control disabled={!editing} onChange={(e) => setDoctorProfile({ ...doctorProfile, secondaryEmail: e.target.value })} type="text" value={doctorProfile.secondaryEmail} />
                                </Form.Group>
                            </Row>

                            {
                                loading &&
                                <Loading />
                            }

                            <Row>
                                <Form.Group as={Col} className="mb-3" controlId="formEdit">
                                    <Button variant={editing ? "outline-primary" : "primary"} className="user-account-form-btn" onClick={() => {
                                        editing ? setEditing(false) : setEditing(true);
                                    }}>{editing ? "Cancel" : "Edit"}</Button>
                                </Form.Group>

                                {
                                    editing &&
                                    <Form.Group as={Col} className="mb-3" controlId="formEdit">
                                        <Button variant="success" className="user-account-form-btn" onClick={() => {
                                            updateProfileDetails();
                                        }}>Submit</Button>
                                    </Form.Group>
                                }
                            </Row>
                        </Form>
                    </Tab>
                    <Tab eventKey="workHistory" title="Work History">
                        <DoctorWorkHistoryPage context={props.context} />
                    </Tab>
                    <Tab eventKey="education" title="Education">
                        <DoctorEducationPage context={props.context} />
                    </Tab>
                    <Tab eventKey="reviews" title="Reviews">
                        <div className="doctor-reviews-tab vert-flex">
                            {
                                reviews.map((review, index) => {
                                    return (
                                        <ReviewCard context={props.context} review={review} deleteReview={deleteReview} />
                                    );
                                })
                            }
                            {
                                loading &&
                                <Loading />
                            }
                        </div>
                    </Tab>
                    <Tab eventKey="receptionists" title="Receptionists">
                        <DoctorReceptionistsPage context={props.context} />
                    </Tab>
                </Tabs>
            </UserAccountPage>
        </>
    );
}


export default DoctorAccountPage;