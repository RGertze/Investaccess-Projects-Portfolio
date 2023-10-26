import { useEffect, useState } from "react";
import { Button, FormGroup } from "react-bootstrap";
import { IGlobalContext } from "../../../../interfaces/general_interfaces";
import { IParentProfile } from "../../../../interfaces/parent_interfaces";
import { IParentRegistrationStatus, PARENT_REGISTRATION_STAGE, REG_REQ_TYPE } from "../../../../interfaces/registration_interfaces";
import { AlertComponent } from "../../../../shared-components/alert-component/alertComponent";
import Loading from "../../../../shared-components/loading-component/loading";
import { RegistrationDocsAccordian } from "../../../../shared-components/registration-docs-accordian/registrationDocsAccordian";
import { ParentRejectButton } from "../reject-button/rejectButton";

interface IProps {
    context: IGlobalContext,
    parent: IParentProfile,
    registrationStatus: IParentRegistrationStatus,

    goToPrevPage(): Promise<void>,
    goToNextPage(): Promise<void>,

    editRegistrationStatus(data: any): Promise<boolean>
}

export const ParentRequiredDocsForm = (props: IProps) => {
    const [loading, setLoading] = useState(false);


    return (
        <div className="m-3">

            <h2>Upload Required Documents</h2>
            <p>For each of the categories below, upload a document as proof.</p>

            {
                props.registrationStatus.requiredDocsRejectionMessage !== null && props.registrationStatus.requiredDocsRejectionMessage !== "" &&
                <AlertComponent title="You have Rejected the info on this page with the following reason: " type="danger" content={props.registrationStatus.requiredDocsRejectionMessage} />
            }
            <RegistrationDocsAccordian context={props.context} type={REG_REQ_TYPE.PARENT} userIdOrStudentNumber={props.parent.userId.toString()} editable={false} />

            <FormGroup className="m-3">
                {
                    <>
                        <Button onClick={() => {
                            props.goToPrevPage();
                        }} variant={"primary"}>
                            Prev
                        </Button>
                    </>
                }
                {
                    loading &&
                    <Loading color="blue" small={true} />
                }
            </FormGroup>

            <ParentRejectButton context={props.context} editRegistrationStatus={props.editRegistrationStatus} parent={props.parent} type={PARENT_REGISTRATION_STAGE.ADD_REQUIRED_DOCS} />
        </div>
    );
}