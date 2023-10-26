import { useEffect, useState } from "react";
import { Button, FormGroup } from "react-bootstrap";
import { Connection, GET_ENDPOINT, POST_ENDPOINT } from "../../../connection";
import { IGlobalContext, IResponse } from "../../../interfaces/general_interfaces";
import { IRequiredRegistrationDocument, IStudentRegistrationStatus, REG_REQ_TYPE, STUDENT_REGISTRATION_STAGE } from "../../../interfaces/registration_interfaces";
import { IStudent } from "../../../interfaces/student_interfaces";
import { INPUT_TYPE } from "../../../shared-components/add-edit-component-V2/AddEditComponentV2";
import { AlertComponent } from "../../../shared-components/alert-component/alertComponent";
import { errorToast, successToast } from "../../../shared-components/alert-components/toasts";
import Loading from "../../../shared-components/loading-component/loading";
import { RegistrationDocsAccordian } from "../../../shared-components/registration-docs-accordian/registrationDocsAccordian";

interface IProps {
    context: IGlobalContext,
    student: IStudent,
    registrationStatus: IStudentRegistrationStatus,

    goToPrevPage(): Promise<void>,
    goToNextPage(): Promise<void>,

    editRegistrationStatus(data: any): Promise<boolean>
}

export const StudentRequiredDocsForm = (props: IProps) => {
    const [loading, setLoading] = useState(false);

    //----   EDIT STUDENT   ----
    const editStudent = async (data: IStudent): Promise<boolean> => {
        if (props.student.grade <= 1 || props.registrationStatus.occupationalTherapyNeeded === 1) {
            data.studentNumber = props.student.studentNumber;
            data.registrationStage = STUDENT_REGISTRATION_STAGE.OCCUPATIONAL_THERAPY_NEEDED;
            let result: IResponse = await Connection.postRequest(POST_ENDPOINT.EDIT_STUDENT, data, {});
            if (result.errorMessage && result.errorMessage.length > 0) {
                errorToast(result.errorMessage, true, 2000);
                return false;
            }
            successToast("Info Saved!", true, 1500);
            props.goToNextPage();
        }
        return true;
    }

    return (
        <div className="m-3">

            <h2>Upload Required Documents</h2>
            <p>For each of the categories below, upload a document as proof.</p>

            {
                props.registrationStatus.requiredDocsRejectionMessage !== null && props.registrationStatus.requiredDocsRejectionMessage !== "" &&
                <AlertComponent title="The Admin has Rejected the info on this page with the following reason: " type="danger" content={props.registrationStatus.requiredDocsRejectionMessage} footer="Please fix the above mentioned issues if possible." />
            }
            <RegistrationDocsAccordian context={props.context} type={REG_REQ_TYPE.STUDENT} userIdOrStudentNumber={props.student.studentNumber} editable={true} />

            <FormGroup className="m-3">
                {
                    <>
                        <Button onClick={() => {
                            props.goToPrevPage();
                        }} variant={"primary"}>
                            Prev
                        </Button>
                        <Button className="m-3" onClick={async () => {
                            setLoading(true);
                            let data: any = {};
                            await editStudent(data);
                            props.editRegistrationStatus({});
                            setLoading(false);
                        }} variant="outline-success">
                            {
                                props.registrationStatus.occupationalTherapyNeeded === 1 ? "Save and Next" : "Save"
                            }
                        </Button>
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