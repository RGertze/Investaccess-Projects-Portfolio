import { ErrorOutline, TaskAlt } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Connection, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { IGlobalContext, IResponse } from "../../interfaces/general_interfaces";
import { IParentProfile } from "../../interfaces/parent_interfaces";
import { IParentRegistrationStatus, PARENT_REGISTRATION_STAGE } from "../../interfaces/registration_interfaces";
import { errorToast } from "../../shared-components/alert-components/toasts";
import Loading from "../../shared-components/loading-component/loading";
import { ParentRegistrationFormNavigationBar } from "./nav-bar/navBar";
import { ParentOtherParentsForm } from "./other-parents/parentOtherParentsForm";
import "./parentRegistrationForm.css"
import { ParentProfileDetailsForm } from "./profile-details/profileDetails";
import { ParentProofOfRegistrationFee } from "./proof-of-registration-fee/proofOfRegistrationFee";
import { ParentRequiredDocsForm } from "./required-docs/requiredDocsForm";
import { ParentStudentsApplicationsForm } from "./student-applications/studentApplicationsForm";

interface IProps {
    context: IGlobalContext,
    parentId: number
}

export const ParentRegistrationForm = (props: IProps) => {
    const [registrationStage, setRegistrationStage] = useState<number>(0);
    const [registrationStatus, setRegistrationStatus] = useState<IParentRegistrationStatus>({
        parentId: 0,
        detailsAdded: 0,
        otherParentsAdded: 0,
        studentsAdded: 0,
        requiredDocsAdded: 0,

        detailsRejectionMessage: "",
        otherParentsRejectionMessage: "",
        studentsRejectionMessage: "",
        requiredDocsRejectionMessage: "",

        registrationFeePaid: 0,
        registrationFeeRejectionMessage: "",
    });
    const [parent, setParent] = useState<IParentProfile>();

    const [loadingStatus, setLoadingStatus] = useState(false);
    const [loadingParent, setLoadingParent] = useState(false);


    useEffect(() => {
        getParentDetailsLoading();
        getParentRegistrationStatus();
    }, []);

    useEffect(() => {
        if (parent && registrationStage === 0)
            setRegistrationStage(parent.registrationStage);
    }, [parent]);

    //----   GET PARENT DETAILS   ----
    const getParentDetailsLoading = async () => {
        setLoadingParent(true);
        await getParentDetailsSilent();
        setLoadingParent(false);
    }

    //----   GET PARENT DETAILS   ----
    const getParentDetailsSilent = async () => {
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_PARENT_PROFILE + props.parentId.toString(), "");
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }
        setParent(result.data);
        return (true);
    }

    //----   GET PARENT REGISTRATION STATUS   ----
    const getParentRegistrationStatus = async () => {
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_REGISTRATION_STATUS_FOR_PARENT + props.parentId, "");
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }
        setRegistrationStatus(result.data);
        return (true);
    }

    //----   EDIT PARENT REGISTRATION STATUS   ----
    const editParentRegistrationStatus = async (data: IParentRegistrationStatus): Promise<boolean> => {
        data.parentId = props.parentId;
        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.EDIT_PARENT_REGISTRATION_STATUS, data, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }
        getParentRegistrationStatus();
        return true;
    }

    const navigateToStage = async (stage: PARENT_REGISTRATION_STAGE) => {
        getParentDetailsSilent();
        setRegistrationStage(stage);
    }

    return (
        <div className="parent-registration-form-container">

            {
                loadingStatus || loadingParent &&
                <div style={{ gridColumn: "1/3" }}>
                    <Loading />
                </div>
            }

            {
                // nav bar
                !(loadingStatus || loadingParent) && parent &&
                <ParentRegistrationFormNavigationBar context={props.context} parent={parent} navigateToStage={navigateToStage} registrationStatus={registrationStatus} />
            }

            {
                // application pages
                (!(loadingStatus || loadingParent) && parent !== undefined) &&
                <>
                    {
                        registrationStage === PARENT_REGISTRATION_STAGE.ADD_DETAILS &&
                        <ParentProfileDetailsForm registrationStatus={registrationStatus} editRegistrationStatus={editParentRegistrationStatus} context={props.context} goToNextPage={() => navigateToStage(PARENT_REGISTRATION_STAGE.ADD_OTHER_PARENTS)} goToPrevPage={async () => { errorToast("You are at the first stage!") }} parent={parent} />
                    }
                    {
                        registrationStage === PARENT_REGISTRATION_STAGE.ADD_OTHER_PARENTS &&
                        <ParentOtherParentsForm registrationStatus={registrationStatus} editRegistrationStatus={editParentRegistrationStatus} context={props.context} goToNextPage={() => navigateToStage(PARENT_REGISTRATION_STAGE.ADD_STUDENTS)} goToPrevPage={async () => { navigateToStage(PARENT_REGISTRATION_STAGE.ADD_DETAILS) }} parent={parent} />
                    }
                    {
                        registrationStage === PARENT_REGISTRATION_STAGE.ADD_STUDENTS &&
                        <ParentStudentsApplicationsForm registrationStatus={registrationStatus} editRegistrationStatus={editParentRegistrationStatus} context={props.context} goToNextPage={() => navigateToStage(PARENT_REGISTRATION_STAGE.ADD_REQUIRED_DOCS)} goToPrevPage={async () => { navigateToStage(PARENT_REGISTRATION_STAGE.ADD_OTHER_PARENTS) }} parent={parent} />
                    }
                    {
                        registrationStage === PARENT_REGISTRATION_STAGE.ADD_REQUIRED_DOCS &&
                        <ParentRequiredDocsForm registrationStatus={registrationStatus} editRegistrationStatus={editParentRegistrationStatus} context={props.context} goToNextPage={() => navigateToStage(PARENT_REGISTRATION_STAGE.ADD_REQUIRED_DOCS)} goToPrevPage={async () => { navigateToStage(PARENT_REGISTRATION_STAGE.ADD_STUDENTS) }} parent={parent} />
                    }
                    {
                        registrationStage === PARENT_REGISTRATION_STAGE.PAY_REGISTRATION_FEE &&
                        <ParentProofOfRegistrationFee registrationStatus={registrationStatus} context={props.context} goToNextPage={() => navigateToStage(PARENT_REGISTRATION_STAGE.PAY_REGISTRATION_FEE)} goToPrevPage={async () => { navigateToStage(PARENT_REGISTRATION_STAGE.ADD_REQUIRED_DOCS) }} parent={parent} />
                    }
                    {
                        registrationStage === PARENT_REGISTRATION_STAGE.REJECTED &&
                        <div className="rounded border shadow m-1">
                            <ErrorOutline fontSize="large" color="error" className="mt-3" />
                            <h2 className="p-3">Your application has been denied</h2>
                            <p className="p-2">Your application will not be further considered for our school. If you feel this was an error, please contact the school with your grievances. We wish you and your children the best going forward.</p>
                        </div>
                    }
                    {
                        registrationStage === PARENT_REGISTRATION_STAGE.APPROVED &&
                        <div className="rounded border shadow m-1">
                            <TaskAlt fontSize="large" color="success" className="mt-3" />
                            <h2 className="p-3">Your application has been approved!</h2>
                            <p>Welcome to our school. Please log out and log back in to access the site normally.</p>
                        </div>
                    }
                </>
            }

        </div>
    );
}