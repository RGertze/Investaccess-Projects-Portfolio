import { Close, Menu, RadioButtonChecked } from "@mui/icons-material";
import { useState } from "react";
import { Button, Collapse } from "react-bootstrap";
import { Connection, POST_ENDPOINT } from "../../../../connection";
import { IGlobalContext, IResponse } from "../../../../interfaces/general_interfaces";
import { IStudentRegistrationStatus, STUDENT_REGISTRATION_STAGE } from "../../../../interfaces/registration_interfaces";
import { IStudent } from "../../../../interfaces/student_interfaces";
import { confirmChoice, errorToast, successToast } from "../../../../shared-components/alert-components/toasts";
import Loading from "../../../../shared-components/loading-component/loading";
import "./navBar.css";

interface IProps {
    navigateToStage(stage: STUDENT_REGISTRATION_STAGE): void,
    registrationStatus: IStudentRegistrationStatus,

    student: IStudent,

    editRegistrationStatus(data: any): Promise<boolean>,
    refreshStudent(): Promise<void>,

    context: IGlobalContext
}

export const StudentRegistrationFormNavigationBar = (props: IProps) => {

    const [open, setOpen] = useState(true);

    const [loadingTherapy, setLoadingTherapy] = useState(false);
    const [loadingDiagnostic, setLoadingDiagnostic] = useState(false);
    const [approving, setApproving] = useState(false);
    const [denying, setDenying] = useState(false);

    //----   APPROVE STUDENT   ----
    const approveStudent = async (): Promise<boolean> => {
        let res = await confirmChoice("Are you sure?", "This action cannot be undone. Please make sure all of the student's details are in order");
        if (res.isConfirmed) {
            setApproving(true);
            let result: IResponse = await Connection.postRequest(POST_ENDPOINT.APPROVE_STUDENT_REGISTRATION, {
                studentNumber: props.student.studentNumber
            }, {});
            setApproving(false);
            if (result.errorMessage && result.errorMessage.length > 0) {
                errorToast(result.errorMessage, true, 2000);
                return false;
            }
            successToast("Approved!", true, 1500);
            props.refreshStudent();
        }
        return true;
    }

    //----   EDIT STUDENT   ----
    const editStudent = async (data: IStudent): Promise<boolean> => {
        data.studentNumber = props.student.studentNumber;
        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.EDIT_STUDENT, data, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }
        successToast("success!", true, 1500);
        props.refreshStudent();
        return true;
    }

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


                                        {
                                            props.registrationStatus.occupationalTherapyNeeded === 0 &&
                                            <Button onClick={async () => {
                                                setLoadingTherapy(true);
                                                if (await props.editRegistrationStatus({
                                                    occupationalTherapyNeeded: 1
                                                }))
                                                    successToast("Success", true, 2000);
                                                setLoadingTherapy(false);
                                            }} style={{ width: "80%" }} className="hor-center mb-2" variant="danger">Needs Occupational Therapy</Button>
                                        }

                                        {
                                            props.registrationStatus.diagnosticTestNeeded === 0 &&
                                            <Button onClick={async () => {
                                                setLoadingDiagnostic(true);
                                                if (await props.editRegistrationStatus({
                                                    diagnosticTestNeeded: 1
                                                }))
                                                    successToast("Success", true, 2000);
                                                setLoadingDiagnostic(false);
                                            }} style={{ width: "80%" }} className="hor-center mb-2" variant="danger">
                                                {
                                                    !loadingDiagnostic &&
                                                    "Needs Diagnostic Test"
                                                }
                                                {
                                                    loadingDiagnostic &&
                                                    <Loading />
                                                }
                                            </Button>
                                        }

                                        <Button onClick={async () => {
                                            approveStudent();
                                        }} style={{ width: "80%" }} className="hor-center" variant="success">
                                            {
                                                !approving &&
                                                "Approve"
                                            }
                                            {
                                                approving &&
                                                <Loading />
                                            }
                                        </Button>

                                        {
                                            props.student.registrationStage !== STUDENT_REGISTRATION_STAGE.REJECTED &&
                                            <>
                                                <p className="hor-center p-0" style={{ marginTop: "20px" }}>
                                                    If this application will not or cannot be accepted under any circumstances, deny the application.
                                                </p>
                                                <Button onClick={async () => {
                                                    let res = await confirmChoice("Are you sure?", "")
                                                    if (res.isConfirmed) {
                                                        setDenying(true);
                                                        let data: any = {
                                                            registrationStage: STUDENT_REGISTRATION_STAGE.REJECTED
                                                        }
                                                        await editStudent(data);
                                                        setDenying(false);
                                                    }
                                                }} style={{ width: "80%" }} className="hor-center mt-4" variant="danger">
                                                    {
                                                        !denying &&
                                                        "Deny Application"
                                                    }
                                                    {
                                                        denying &&
                                                        <Loading />
                                                    }
                                                </Button>
                                            </>
                                        }
                                    </>
                                }

                                {
                                    props.student.registrationStage === STUDENT_REGISTRATION_STAGE.REJECTED &&
                                    <>
                                        <div onClick={() => props.navigateToStage(STUDENT_REGISTRATION_STAGE.REJECTED)} className="student-registration-nav-bar-item hover">
                                            <RadioButtonChecked style={{ color: "red" }} />
                                            <h4>Application Denied</h4>
                                        </div>

                                        <p className="hor-center p-0" >
                                            If would like to re-open this application, click the button below.
                                        </p>
                                        <Button onClick={async () => {
                                            let res = await confirmChoice("Are you sure?", "")
                                            if (res.isConfirmed) {
                                                setDenying(true);
                                                let data: any = {
                                                    registrationStage: STUDENT_REGISTRATION_STAGE.ADD_BASIC_DETAILS
                                                }
                                                await editStudent(data);
                                                setDenying(false);
                                            }
                                        }} style={{ width: "80%" }} className="hor-center mt-4" variant="danger">
                                            {
                                                !denying &&
                                                "Re-Open Application"
                                            }
                                            {
                                                denying &&
                                                <Loading />
                                            }
                                        </Button>
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
                    </div >
                </div>
            </Collapse>
        </>
    );
}