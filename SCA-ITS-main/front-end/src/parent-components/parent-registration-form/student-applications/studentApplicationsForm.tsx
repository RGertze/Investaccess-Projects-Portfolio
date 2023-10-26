import moment from "moment";
import { useState } from "react";
import { FormGroup, Button } from "react-bootstrap";
import { Connection, POST_ENDPOINT } from "../../../connection";
import { IGlobalContext, IResponse } from "../../../interfaces/general_interfaces";
import { IParentProfile } from "../../../interfaces/parent_interfaces";
import { IParentRegistrationStatus, IStudentRegistrationStatus, PARENT_REGISTRATION_STAGE, STUDENT_REGISTRATION_STAGE } from "../../../interfaces/registration_interfaces";
import { IStudent } from "../../../interfaces/student_interfaces";
import { INPUT_TYPE } from "../../../shared-components/add-edit-component-V2/AddEditComponentV2";
import { AlertComponent } from "../../../shared-components/alert-component/alertComponent";
import { errorToast, successToast } from "../../../shared-components/alert-components/toasts";
import FormComponent from "../../../shared-components/form-component/formComponent";
import Loading from "../../../shared-components/loading-component/loading";
import { StudentApplicationsTable } from "./student-applications-table/studentApplicationsTable";

interface IProps {
    context: IGlobalContext,
    parent: IParentProfile,
    registrationStatus: IParentRegistrationStatus,

    goToPrevPage(): Promise<void>,
    goToNextPage(): Promise<void>,

    editRegistrationStatus(data: any): Promise<boolean>
}

export const ParentStudentsApplicationsForm = (props: IProps) => {
    const [loading, setLoading] = useState(false);

    //----   EDIT PARENT PROFILE   ----
    const editProfile = async (data: IParentProfile): Promise<boolean> => {
        data.userId = props.parent.userId;
        data.registrationStage = PARENT_REGISTRATION_STAGE.ADD_REQUIRED_DOCS;
        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.EDIT_PARENT_PROFILE, data, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }
        successToast("Info Saved!", true, 1500);
        props.goToNextPage();
        return true;
    }

    return (
        <div>
            {
                props.registrationStatus.studentsRejectionMessage !== null && props.registrationStatus.studentsRejectionMessage !== "" &&
                <AlertComponent title="The Admin has Rejected the info on this page with the following reason: " type="danger" content={props.registrationStatus.studentsRejectionMessage} footer="Please fix the above mentioned issues if possible." />
            }

            <h2>Student Applications</h2>
            <p>In the table below, please add at least one student. Once added, click on the student and complete their application.</p>
            <p>
                For this stage to be complete, the administrator must approve at least one of the student applications added below. Please check back here regularly to view student application progress.
                If a student application is denied, they will not be accepted at the school even if the other children you have added are accepted.
            </p>

            <StudentApplicationsTable context={props.context} parentId={props.parent.userId} />

            <FormGroup>
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