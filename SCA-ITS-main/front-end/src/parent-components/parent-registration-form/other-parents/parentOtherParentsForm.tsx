import { useEffect, useState } from "react";
import { Button, FormGroup } from "react-bootstrap";
import { Connection, GET_ENDPOINT, POST_ENDPOINT } from "../../../connection";
import { IGlobalContext, IResponse } from "../../../interfaces/general_interfaces";
import { IParentProfile } from "../../../interfaces/parent_interfaces";
import { IParentRegistrationStatus, IRequiredRegistrationDocument, IStudentRegistrationStatus, PARENT_REGISTRATION_STAGE, STUDENT_REGISTRATION_STAGE } from "../../../interfaces/registration_interfaces";
import { AlertComponent } from "../../../shared-components/alert-component/alertComponent";
import { errorToast, successToast } from "../../../shared-components/alert-components/toasts";
import Loading from "../../../shared-components/loading-component/loading";
import OtherParentsComponent from "../../../shared-components/other-parents-component/otherParentsComponent";

interface IProps {
    context: IGlobalContext,
    parent: IParentProfile,
    registrationStatus: IParentRegistrationStatus,

    goToPrevPage(): Promise<void>,
    goToNextPage(): Promise<void>,

    editRegistrationStatus(data: any): Promise<boolean>
}

export const ParentOtherParentsForm = (props: IProps) => {
    const [loading, setLoading] = useState(false);

    //----   EDIT PARENT PROFILE   ----
    const editProfile = async (data: IParentProfile): Promise<boolean> => {
        data.userId = props.parent.userId;
        data.registrationStage = PARENT_REGISTRATION_STAGE.ADD_STUDENTS;
        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.EDIT_PARENT_PROFILE, data, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }
        successToast("Info Saved!", true, 1500);
        props.editRegistrationStatus({
            otherParentsAdded: 1,
            otherParentsRejectionMessage: ""
        });
        props.goToNextPage();
        return true;
    }

    return (
        <div className="m-3" style={{ maxWidth: "100%", overflow: "auto" }}>

            <h2>Additional Parents/Guardians</h2>
            <p>
                You, as the account holder, will act as the main parent through which students will be managed on this website.
                Please add any additional parents/guardians/care-takers whose information we will need below.
            </p>

            {
                props.registrationStatus.requiredDocsRejectionMessage !== null && props.registrationStatus.requiredDocsRejectionMessage !== "" &&
                <AlertComponent title="The Admin has Rejected the info on this page with the following reason: " type="danger" content={props.registrationStatus.requiredDocsRejectionMessage} footer="Please fix the above mentioned issues if possible." />
            }
            <OtherParentsComponent context={props.context} parentId={props.parent.userId} />

            <FormGroup className="m-3">
                {
                    <>
                        <Button onClick={() => {
                            props.goToPrevPage();
                        }} variant={"primary"}>
                            Prev
                        </Button>
                        <Button onClick={() => {
                            let data: any = {};
                            editProfile(data);
                        }} variant="outline-success">Save and Next</Button>
                    </>
                }
                {
                    loading &&
                    <Loading color="blue" small={true} />
                }
            </FormGroup>

        </div>
    );
}