import { Close, Menu, RadioButtonChecked } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Collapse } from "react-bootstrap";
import { IGlobalContext } from "../../../interfaces/general_interfaces";
import { STUDENT_REGISTRATION_STAGE } from "../../../interfaces/registration_interfaces";
import { IStudent } from "../../../interfaces/student_interfaces";
import "./navBar.css";

interface IProps {
    navigateToStage(stage: STUDENT_REGISTRATION_STAGE): void,
    student: IStudent,
    registrationStatus: any,

    context: IGlobalContext
}

export const StudentRegistrationFormNavigationBar = (props: IProps) => {

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
                    <div className="student-registration-nav-bar rounded">
                        {
                            props.student.registrationStage !== STUDENT_REGISTRATION_STAGE.APPROVED &&
                            <>
                                {
                                    props.student.registrationStage !== STUDENT_REGISTRATION_STAGE.REJECTED &&
                                    <>
                                        <div onClick={() => props.navigateToStage(STUDENT_REGISTRATION_STAGE.ADD_BASIC_DETAILS)} className="student-registration-nav-bar-item hover">
                                            <RadioButtonChecked style={{ color: (props.registrationStatus.basicDetailsAdded && (props.registrationStatus.basicRejectionMessage === null || props.registrationStatus.basicRejectionMessage === "")) ? "green" : "red" }} />
                                            <h4>Basic Details</h4>
                                        </div>
                                        <div onClick={() => props.navigateToStage(STUDENT_REGISTRATION_STAGE.ADD_GENERAL_INFO)} className="student-registration-nav-bar-item hover">
                                            <RadioButtonChecked style={{ color: (props.registrationStatus.generalInfoAdded && (props.registrationStatus.generalRejectionMessage === null || props.registrationStatus.generalRejectionMessage === "")) ? "green" : "red" }} />
                                            <h4>General Info</h4>
                                        </div>
                                        <div onClick={() => props.navigateToStage(STUDENT_REGISTRATION_STAGE.ADD_RELIGIOUS_INFO)} className="student-registration-nav-bar-item hover">
                                            <RadioButtonChecked style={{ color: (props.registrationStatus.religiousInfoAdded && (props.registrationStatus.religiousRejectionMessage === null || props.registrationStatus.religiousRejectionMessage === "")) ? "green" : "red" }} />
                                            <h4>Religious Info</h4>
                                        </div>
                                        <div onClick={() => props.navigateToStage(STUDENT_REGISTRATION_STAGE.ADD_SCHOLASTIC_INFO)} className="student-registration-nav-bar-item hover">
                                            <RadioButtonChecked style={{ color: (props.registrationStatus.scholasticInfoAdded && (props.registrationStatus.scholasticRejectionMessage === null || props.registrationStatus.scholasticRejectionMessage === "")) ? "green" : "red" }} />
                                            <h4>Scholastic Info</h4>
                                        </div>
                                        <div onClick={() => props.navigateToStage(STUDENT_REGISTRATION_STAGE.ADD_MEDICAL_DETAILS)} className="student-registration-nav-bar-item hover">
                                            <RadioButtonChecked style={{ color: (props.registrationStatus.medicalInfoAdded && (props.registrationStatus.medicalRejectionMessage === null || props.registrationStatus.medicalRejectionMessage === "")) ? "green" : "red" }} />
                                            <h4>Medical Info</h4>
                                        </div>
                                        <div onClick={() => props.navigateToStage(STUDENT_REGISTRATION_STAGE.ADD_MEDICAL_CONDITIONS)} className="student-registration-nav-bar-item hover">
                                            <RadioButtonChecked style={{ color: (props.registrationStatus.medicalConditionsAdded && (props.registrationStatus.conditionsRejectionMessage === null || props.registrationStatus.conditionsRejectionMessage === "")) ? "green" : "red" }} />
                                            <h4>Medical Conditions</h4>
                                        </div>
                                        <div onClick={() => props.navigateToStage(STUDENT_REGISTRATION_STAGE.ADD_OTHER_PARENTS)} className="student-registration-nav-bar-item hover">
                                            <RadioButtonChecked style={{ color: (props.registrationStatus.otherParentsAdded && (props.registrationStatus.otherParentsRejectionMessage === null || props.registrationStatus.otherParentsRejectionMessage === "")) ? "green" : "red" }} />
                                            <h4>Additional Parents/Guardians</h4>
                                        </div>
                                        <div onClick={() => props.navigateToStage(STUDENT_REGISTRATION_STAGE.ADD_NON_SCA_STUDENTS)} className="student-registration-nav-bar-item hover">
                                            <RadioButtonChecked style={{ color: (props.registrationStatus.nonScaStudentsAdded && (props.registrationStatus.nonScaRejectionMessage === null || props.registrationStatus.nonScaRejectionMessage === "")) ? "green" : "red" }} />
                                            <h4>Non SCA Siblings</h4>
                                        </div>
                                        <div onClick={() => props.navigateToStage(STUDENT_REGISTRATION_STAGE.ADD_REQUIRED_DOCS)} className="student-registration-nav-bar-item hover">
                                            <RadioButtonChecked style={{ color: (props.registrationStatus.requiredDocsAdded && (props.registrationStatus.requiredDocsRejectionMessage === null || props.registrationStatus.requiredDocsRejectionMessage === "")) ? "green" : "red" }} />
                                            <h4>Required Documents</h4>
                                        </div>
                                        {
                                            props.registrationStatus.occupationalTherapyNeeded === 1 &&
                                            <div onClick={() => props.navigateToStage(STUDENT_REGISTRATION_STAGE.OCCUPATIONAL_THERAPY_NEEDED)} className="student-registration-nav-bar-item hover">
                                                <RadioButtonChecked style={{ color: (props.registrationStatus.occupationalReportAdded && (props.registrationStatus.therapyRejectionMessage === null || props.registrationStatus.therapyRejectionMessage === "")) ? "green" : "red" }} />
                                                <h4>Occupational Therapy</h4>
                                            </div>
                                        }
                                        {
                                            props.registrationStatus.diagnosticTestNeeded === 1 &&
                                            <div onClick={() => props.navigateToStage(STUDENT_REGISTRATION_STAGE.DIAGNOSTIC_TEST_NEEDED)} className="student-registration-nav-bar-item hover">
                                                <RadioButtonChecked style={{ color: (props.registrationStatus.diagnosticResultAdded && (props.registrationStatus.diagnosticRejectionMessage === null || props.registrationStatus.diagnosticRejectionMessage === "")) ? "green" : "red" }} />
                                                <h4>Diagnostic Test</h4>
                                            </div>
                                        }

                                        <p className="hor-center p-4 border rounded">The administrator will review all of the details entered in this form. If there are any issues, they will be made apparent. Once all the details have been added, the Administrator will approve or deny the application.</p>

                                    </>
                                }
                                {
                                    props.student.registrationStage === STUDENT_REGISTRATION_STAGE.REJECTED &&
                                    <>
                                        <div onClick={() => props.navigateToStage(STUDENT_REGISTRATION_STAGE.REJECTED)} className="student-registration-nav-bar-item hover">
                                            <RadioButtonChecked style={{ color: "red" }} />
                                            <h4>Application Denied</h4>
                                        </div>
                                    </>
                                }
                            </>
                        }

                        {
                            props.student.registrationStage === STUDENT_REGISTRATION_STAGE.APPROVED &&
                            <>
                                <div onClick={() => props.navigateToStage(STUDENT_REGISTRATION_STAGE.APPROVED)} className="student-registration-nav-bar-item hover">
                                    <RadioButtonChecked style={{ color: "green" }} />
                                    <h4>Student Approved</h4>
                                </div>
                            </>
                        }

                    </div>
                </div>
            </Collapse>
        </>
    );
}