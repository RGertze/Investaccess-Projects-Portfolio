import { Close, Menu, RadioButtonChecked } from "@mui/icons-material";
import { useState } from "react";
import { Collapse } from "react-bootstrap";
import { IGlobalContext } from "../../../interfaces/general_interfaces";
import { IParentProfile } from "../../../interfaces/parent_interfaces";
import { IParentRegistrationStatus, PARENT_REGISTRATION_STAGE } from "../../../interfaces/registration_interfaces";
import { AlertComponent } from "../../../shared-components/alert-component/alertComponent";
import "./navBar.css";

interface IProps {
    navigateToStage(stage: PARENT_REGISTRATION_STAGE): void,
    parent: IParentProfile,
    registrationStatus: IParentRegistrationStatus,

    context: IGlobalContext
}

export const ParentRegistrationFormNavigationBar = (props: IProps) => {

    const [open, setOpen] = useState(true);

    return (
        <>

            {
                props.context.isMobile &&
                <>
                    {
                        !open &&
                        <Menu onClick={() => setOpen(true)} className="border rounded hover" sx={{ fontSize: "45px" }} fontSize="large" />
                    }
                    {
                        open &&
                        <Close onClick={() => setOpen(false)} className="border rounded hover" sx={{ fontSize: "45px" }} fontSize="large" />
                    }
                </>
            }
            <Collapse in={open}>
                <div>
                    <div className="student-registration-nav-bar p-4 rounded">
                        {
                            props.parent.registrationStage !== PARENT_REGISTRATION_STAGE.APPROVED &&
                            <>
                                {
                                    props.parent.registrationStage !== PARENT_REGISTRATION_STAGE.PAY_REGISTRATION_FEE && props.parent.registrationStage !== PARENT_REGISTRATION_STAGE.REJECTED &&
                                    <>
                                        <div onClick={() => props.navigateToStage(PARENT_REGISTRATION_STAGE.ADD_DETAILS)} className="student-registration-nav-bar-item hover">
                                            <RadioButtonChecked style={{ color: (props.registrationStatus.detailsAdded && (props.registrationStatus.detailsRejectionMessage === null || props.registrationStatus.detailsRejectionMessage === "")) ? "green" : "red" }} />
                                            <h4>Profile Details</h4>
                                        </div>
                                        <div onClick={() => props.navigateToStage(PARENT_REGISTRATION_STAGE.ADD_OTHER_PARENTS)} className="student-registration-nav-bar-item hover">
                                            <RadioButtonChecked style={{ color: (props.registrationStatus.otherParentsAdded && (props.registrationStatus.otherParentsRejectionMessage === null || props.registrationStatus.otherParentsRejectionMessage === "")) ? "green" : "red" }} />
                                            <h4>Additional Parents/Guardians</h4>
                                        </div>
                                        <div onClick={() => props.navigateToStage(PARENT_REGISTRATION_STAGE.ADD_STUDENTS)} className="student-registration-nav-bar-item hover">
                                            <RadioButtonChecked style={{ color: (props.registrationStatus.studentsAdded && (props.registrationStatus.studentsRejectionMessage === null || props.registrationStatus.studentsRejectionMessage === "")) ? "green" : "red" }} />
                                            <h4>Student Applications</h4>
                                        </div>
                                        <div onClick={() => props.navigateToStage(PARENT_REGISTRATION_STAGE.ADD_REQUIRED_DOCS)} className="student-registration-nav-bar-item hover">
                                            <RadioButtonChecked style={{ color: (props.registrationStatus.requiredDocsAdded && (props.registrationStatus.requiredDocsRejectionMessage === null || props.registrationStatus.requiredDocsRejectionMessage === "")) ? "green" : "red" }} />
                                            <h4>Required Documents</h4>
                                        </div>

                                        <p className="hor-center p-4 border rounded">The administrator will review all of the details entered in this form. If there are any issues, they will be made apparent. Once all the details have been added, the Administrator will approve or deny the application.</p>
                                    </>
                                }

                                {
                                    props.parent.registrationStage === PARENT_REGISTRATION_STAGE.PAY_REGISTRATION_FEE &&
                                    <>
                                        <div onClick={() => props.navigateToStage(PARENT_REGISTRATION_STAGE.ADD_REQUIRED_DOCS)} className="student-registration-nav-bar-item hover">
                                            <RadioButtonChecked style={{ color: (props.registrationStatus.registrationFeePaid && (props.registrationStatus.registrationFeeRejectionMessage === null || props.registrationStatus.registrationFeeRejectionMessage === "")) ? "green" : "red" }} />
                                            <h4>Pay Registration Fee</h4>
                                        </div>

                                        <AlertComponent title="Application Successful!" type="success" content="Your application has been accepted by the school. All that is left to do is pay your registration fee. Only once the payment has been made and verified will this application be considered complete. Please be patient while the administrator reviews your proof of payment." footer="Thank you for choosing our school" dismissible={false} />
                                    </>
                                }


                                {
                                    props.parent.registrationStage === PARENT_REGISTRATION_STAGE.REJECTED &&
                                    <>
                                        <div onClick={() => props.navigateToStage(PARENT_REGISTRATION_STAGE.REJECTED)} className="student-registration-nav-bar-item hover">
                                            <RadioButtonChecked style={{ color: "red" }} />
                                            <h4>Application Denied</h4>
                                        </div>
                                    </>
                                }
                            </>
                        }

                        {
                            props.parent.registrationStage === PARENT_REGISTRATION_STAGE.APPROVED &&
                            <>
                                <div onClick={() => props.navigateToStage(PARENT_REGISTRATION_STAGE.APPROVED)} className="student-registration-nav-bar-item hover">
                                    <RadioButtonChecked style={{ color: "green" }} />
                                    <h4>Application Approved</h4>
                                </div>
                            </>
                        }
                    </div >
                </div>
            </Collapse>
        </>
    );
}