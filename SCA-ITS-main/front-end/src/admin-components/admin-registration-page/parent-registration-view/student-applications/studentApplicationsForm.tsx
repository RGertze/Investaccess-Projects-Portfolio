import moment from "moment";
import { useState } from "react";
import { FormGroup, Button } from "react-bootstrap";
import { Connection, POST_ENDPOINT } from "../../../../connection";
import { IGlobalContext, IResponse } from "../../../../interfaces/general_interfaces";
import { IParentProfile } from "../../../../interfaces/parent_interfaces";
import { IParentRegistrationStatus, PARENT_REGISTRATION_STAGE } from "../../../../interfaces/registration_interfaces";
import { AlertComponent } from "../../../../shared-components/alert-component/alertComponent";
import { errorToast, successToast } from "../../../../shared-components/alert-components/toasts";
import Loading from "../../../../shared-components/loading-component/loading";
import { ParentRejectButton } from "../reject-button/rejectButton";
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

    return (
        <div>
            {
                props.registrationStatus.studentsRejectionMessage !== null && props.registrationStatus.studentsRejectionMessage !== "" &&
                <AlertComponent title="You have Rejected the info on this page with the following reason: " type="danger" content={props.registrationStatus.studentsRejectionMessage} />
            }

            <h2>Student Applications</h2>
            <p>The table below shows all of the students this parent would like to register. Click on the students and approve/deny their applications.</p>
            <p>Any students not denied will automatically be approved once the parent is approved in the final stage</p>

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
                            props.goToNextPage();
                        }} variant="outline-success">Next</Button>
                    </>
                }
                {
                    loading &&
                    <Loading color="blue" small={true} />
                }
            </FormGroup>

            <ParentRejectButton context={props.context} editRegistrationStatus={props.editRegistrationStatus} parent={props.parent} type={PARENT_REGISTRATION_STAGE.ADD_STUDENTS} />
        </div>
    );
}