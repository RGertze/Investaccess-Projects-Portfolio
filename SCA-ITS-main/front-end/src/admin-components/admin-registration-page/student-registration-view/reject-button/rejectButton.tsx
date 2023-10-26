import moment from "moment";
import { useState } from "react";
import { Button, FormGroup } from "react-bootstrap";
import { Connection, POST_ENDPOINT } from "../../../../connection";
import { IGlobalContext, IResponse } from "../../../../interfaces/general_interfaces";
import { IStudentRegistrationStatus, STUDENT_REGISTRATION_STAGE } from "../../../../interfaces/registration_interfaces";
import { IStudent } from "../../../../interfaces/student_interfaces";
import { confirmWithReason, errorToast, successToast } from "../../../../shared-components/alert-components/toasts";
import Loading from "../../../../shared-components/loading-component/loading";

interface IProps {
    context: IGlobalContext,
    student: IStudent,
    type: STUDENT_REGISTRATION_STAGE,

    editRegistrationStatus(data: any): Promise<boolean>
}

export const StudentRejectButton = (props: IProps) => {
    const [loading, setLoading] = useState(false);

    const getData = (message: string) => {
        switch (props.type) {
            case STUDENT_REGISTRATION_STAGE.ADD_BASIC_DETAILS:
                return {
                    basicRejectionMessage: message
                }
            case STUDENT_REGISTRATION_STAGE.ADD_GENERAL_INFO:
                return {
                    generalRejectionMessage: message
                }
            case STUDENT_REGISTRATION_STAGE.ADD_RELIGIOUS_INFO:
                return {
                    religiousRejectionMessage: message
                }
            case STUDENT_REGISTRATION_STAGE.ADD_SCHOLASTIC_INFO:
                return {
                    scholasticRejectionMessage: message
                }
            case STUDENT_REGISTRATION_STAGE.ADD_MEDICAL_DETAILS:
                return {
                    medicalRejectionMessage: message
                }
            case STUDENT_REGISTRATION_STAGE.ADD_MEDICAL_CONDITIONS:
                return {
                    conditionsRejectionMessage: message
                }
            case STUDENT_REGISTRATION_STAGE.ADD_OTHER_PARENTS:
                return {
                    otherParentsRejectionMessage: message
                }
            case STUDENT_REGISTRATION_STAGE.ADD_NON_SCA_STUDENTS:
                return {
                    nonScaRejectionMessage: message
                }
            case STUDENT_REGISTRATION_STAGE.ADD_REQUIRED_DOCS:
                return {
                    requiredDocsRejectionMessage: message
                }
            case STUDENT_REGISTRATION_STAGE.OCCUPATIONAL_THERAPY_NEEDED:
                return {
                    therapyRejectionMessage: message
                }
            case STUDENT_REGISTRATION_STAGE.DIAGNOSTIC_TEST_NEEDED:
                return {
                    diagnosticRejectionMessage: message
                }
        }
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