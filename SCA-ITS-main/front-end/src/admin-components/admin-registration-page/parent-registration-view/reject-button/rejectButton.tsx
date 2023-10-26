import moment from "moment";
import { useState } from "react";
import { Button, FormGroup } from "react-bootstrap";
import { Connection, POST_ENDPOINT } from "../../../../connection";
import { IGlobalContext, IResponse } from "../../../../interfaces/general_interfaces";
import { IParentProfile } from "../../../../interfaces/parent_interfaces";
import { PARENT_REGISTRATION_STAGE } from "../../../../interfaces/registration_interfaces";
import { confirmWithReason, errorToast, successToast } from "../../../../shared-components/alert-components/toasts";
import Loading from "../../../../shared-components/loading-component/loading";

interface IProps {
    context: IGlobalContext,
    parent: IParentProfile,
    type: PARENT_REGISTRATION_STAGE,

    editRegistrationStatus(data: any): Promise<boolean>
}

export const ParentRejectButton = (props: IProps) => {
    const [loading, setLoading] = useState(false);

    const getData = (message: string) => {
        switch (props.type) {
            case PARENT_REGISTRATION_STAGE.ADD_DETAILS:
                return {
                    detailsRejectionMessage: message
                }
            case PARENT_REGISTRATION_STAGE.ADD_OTHER_PARENTS:
                return {
                    otherParentsRejectionMessage: message
                }
            case PARENT_REGISTRATION_STAGE.ADD_STUDENTS:
                return {
                    studentsRejectionMessage: message
                }
            case PARENT_REGISTRATION_STAGE.ADD_REQUIRED_DOCS:
                return {
                    requiredDocsRejectionMessage: message
                }
            case PARENT_REGISTRATION_STAGE.PAY_REGISTRATION_FEE:
                return {
                    registrationFeeRejectionMessage: message
                }
        }

        return {};
    }

    return (
        <FormGroup>
            <Button variant="danger" onClick={async () => {
                let res = await confirmWithReason("Reject This Stage");
                if (res.isConfirmed) {
                    if (res.value === "") {
                        errorToast("enter a reason");
                        return;
                    }
                    setLoading(true);
                    if (await props.editRegistrationStatus(getData(res.value)))
                        successToast("Success", true, 2000);
                    setLoading(false);
                }
            }}>
                {
                    !loading &&
                    "Reject"
                }
                {
                    loading &&
                    <Loading />
                }
            </Button>
        </FormGroup>
    );
}