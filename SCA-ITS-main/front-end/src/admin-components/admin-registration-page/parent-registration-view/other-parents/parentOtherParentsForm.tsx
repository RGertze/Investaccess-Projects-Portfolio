import { useState } from "react";
import { Button, FormGroup } from "react-bootstrap";
import { IGlobalContext } from "../../../../interfaces/general_interfaces";
import { IParentProfile } from "../../../../interfaces/parent_interfaces";
import { IParentRegistrationStatus, PARENT_REGISTRATION_STAGE } from "../../../../interfaces/registration_interfaces";
import { AlertComponent } from "../../../../shared-components/alert-component/alertComponent";
import Loading from "../../../../shared-components/loading-component/loading";
import OtherParentsComponent from "../../../../shared-components/other-parents-component/otherParentsComponent";
import { ParentRejectButton } from "../reject-button/rejectButton";

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

    return (
        <div className="m-3" style={{ maxWidth: "100%", overflow: "auto" }}>

            <h2>Additional Parents/Guardians</h2>
            <p>
                You, as the account holder, will act as the main parent through which students will be managed on this website.
                Please add any additional parents/guardians/care-takers whose information we will need below.
            </p>

            {
                props.registrationStatus.otherParentsRejectionMessage !== null && props.registrationStatus.otherParentsRejectionMessage !== "" &&
                <AlertComponent title="You have Rejected the info on this page with the following reason: " type="danger" content={props.registrationStatus.otherParentsRejectionMessage} />
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
                            props.goToNextPage();
                        }} variant="outline-success">Next</Button>
                    </>
                }
                {
                    loading &&
                    <Loading color="blue" small={true} />
                }
            </FormGroup>

            <ParentRejectButton context={props.context} editRegistrationStatus={props.editRegistrationStatus} parent={props.parent} type={PARENT_REGISTRATION_STAGE.ADD_OTHER_PARENTS} />
        </div>
    );
}