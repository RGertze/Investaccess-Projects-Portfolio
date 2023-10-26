import { Close, Menu, RadioButtonChecked } from "@mui/icons-material";
import { useState } from "react";
import { Button, Collapse } from "react-bootstrap";
import { Connection, POST_ENDPOINT } from "../../../../connection";
import { IGlobalContext, IResponse } from "../../../../interfaces/general_interfaces";
import { IParentProfile } from "../../../../interfaces/parent_interfaces";
import { PARENT_REGISTRATION_STAGE, IParentRegistrationStatus, STUDENT_REGISTRATION_STAGE } from "../../../../interfaces/registration_interfaces";
import { confirmChoice, errorToast, successToast } from "../../../../shared-components/alert-components/toasts";
import Loading from "../../../../shared-components/loading-component/loading";
import "./navBar.css";

interface IProps {
    navigateToStage(stage: PARENT_REGISTRATION_STAGE): void,
    parent: IParentProfile,
    registrationStatus: IParentRegistrationStatus,

    editRegistrationStatus(data: any): Promise<boolean>,
    refreshParent(): Promise<void>,

    context: IGlobalContext
}

export const ParentRegistrationFormNavigationBar = (props: IProps) => {

    const [open, setOpen] = useState(true);

    const [approving, setApproving] = useState(false);
    const [settingRegistrationFeeStage, setSettingRegistrationFeeStage] = useState(false);
    const [denying, setDenying] = useState(false);


    //----   EDIT PARENT PROFILE   ----
    const editProfile = async (data: IParentProfile): Promise<boolean> => {
        data.userId = props.parent.userId;
        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.EDIT_PARENT_PROFILE, data, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }
        successToast("success!", true, 1500);
        return true;
    }

    //----   APPROVE PARENT   ----
    const approveParent = async (): Promise<boolean> => {
        let res = await confirmChoice("Are you sure?", "This action cannot be undone. All students of this parent not denied will also be approved if you approve this parent. Please ensure all of the parent's details, aswell as those of any of their students, are complete.");
        if (res.isConfirmed) {
            setApproving(true);
            let result: IResponse = await Connection.postRequest(POST_ENDPOINT.APPROVE_PARENT_REGISTRATION, {
                userId: props.parent.userId
            }, {});
            setApproving(false);
            if (result.errorMessage && result.errorMessage.length > 0) {
                errorToast(result.errorMessage, true, 2000);
                return false;
            }
            successToast("Approved!", true, 1500);
            props.refreshParent();
        }
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

                                        <p className="hor-center">
                                            If the application is acceptable, click the button below to allow the parent to upload their proof of registration fee payment.
                                        </p>
                                        <Button onClick={async () => {
                                            setSettingRegistrationFeeStage(true);
                                            let data: any = {
                                                registrationStage: PARENT_REGISTRATION_STAGE.PAY_REGISTRATION_FEE
                                            }
                                            await editProfile(data);
                                            setSettingRegistrationFeeStage(false);
                                            props.refreshParent();
                                        }} style={{ width: "80%", marginBottom: "40px" }} className="hor-center" variant="success">
                                            {
                                                !settingRegistrationFeeStage &&
                                                "Registration Fee Payement"
                                            }
                                            {
                                                settingRegistrationFeeStage &&
                                                <Loading />
                                            }
                                        </Button>
                                    </>
                                }

                                {
                                    props.parent.registrationStage === PARENT_REGISTRATION_STAGE.PAY_REGISTRATION_FEE &&
                                    <>
                                        <div onClick={() => props.navigateToStage(PARENT_REGISTRATION_STAGE.ADD_REQUIRED_DOCS)} className="student-registration-nav-bar-item hover">
                                            <RadioButtonChecked style={{ color: (props.registrationStatus.registrationFeePaid && (props.registrationStatus.registrationFeeRejectionMessage === null || props.registrationStatus.registrationFeeRejectionMessage === "")) ? "green" : "red" }} />
                                            <h4>Pay Registration Fee</h4>
                                        </div>

                                        <p className="hor-center p-0">
                                            If you feel that anything has been missed in the previous stages, you may move the application back.
                                        </p>
                                        <Button onClick={async () => {
                                            let res = await confirmChoice("Are you sure?", "If the parent uploaded any proof of registration fee payment, the documents will be saved. If you plan on rejecting the application, you will have to issue a refund to the parent.")
                                            if (res.isConfirmed) {
                                                setSettingRegistrationFeeStage(true);
                                                let data: any = {
                                                    registrationStage: PARENT_REGISTRATION_STAGE.ADD_REQUIRED_DOCS
                                                }
                                                await editProfile(data);
                                                setSettingRegistrationFeeStage(false);
                                                props.refreshParent();
                                            }
                                        }} style={{ width: "80%", marginBottom: "40px" }} className="hor-center mt-4" variant="danger">
                                            {
                                                !settingRegistrationFeeStage &&
                                                "Cancel Registration Fee Payment"
                                            }
                                            {
                                                settingRegistrationFeeStage &&
                                                <Loading />
                                            }
                                        </Button>

                                        <p className="hor-center">
                                            If the parent has paid their registration fee and the rest of the application is in order, you may approve the parent.
                                        </p>
                                        <Button onClick={async () => {
                                            approveParent();
                                        }} style={{ width: "80%", marginBottom: "40px" }} className="hor-center mt-4" variant="success">
                                            {
                                                !approving &&
                                                "Approve"
                                            }
                                            {
                                                approving &&
                                                <Loading />
                                            }
                                        </Button>
                                    </>
                                }


                                {
                                    props.parent.registrationStage !== PARENT_REGISTRATION_STAGE.REJECTED &&
                                    <>
                                        <p className="hor-center p-0">
                                            If this application will not or cannot be accepted under any circumstances, deny the application.
                                        </p>
                                        <Button onClick={async () => {
                                            let res = await confirmChoice("Are you sure?", "")
                                            if (res.isConfirmed) {
                                                setDenying(true);
                                                let data: any = {
                                                    registrationStage: PARENT_REGISTRATION_STAGE.REJECTED
                                                }
                                                await editProfile(data);
                                                setDenying(false);
                                                props.refreshParent();
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

                                {
                                    props.parent.registrationStage === PARENT_REGISTRATION_STAGE.REJECTED &&
                                    <>
                                        <p className="hor-center p-0">
                                            If would like to re-open this application, click the button below.
                                        </p>
                                        <Button onClick={async () => {
                                            let res = await confirmChoice("Are you sure?", "")
                                            if (res.isConfirmed) {
                                                setDenying(true);
                                                let data: any = {
                                                    registrationStage: PARENT_REGISTRATION_STAGE.ADD_DETAILS
                                                }
                                                await editProfile(data);
                                                setDenying(false);
                                                props.refreshParent();
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
                            props.parent.registrationStage === PARENT_REGISTRATION_STAGE.APPROVED &&
                            <>
                                <div onClick={() => props.navigateToStage(PARENT_REGISTRATION_STAGE.APPROVED)} className="student-registration-nav-bar-item hover">
                                    <RadioButtonChecked style={{ color: "green" }} />
                                    <h4>Application Approved</h4>
                                </div>
                            </>
                        }
                    </div>
                </div>
            </Collapse>
        </>
    );
}