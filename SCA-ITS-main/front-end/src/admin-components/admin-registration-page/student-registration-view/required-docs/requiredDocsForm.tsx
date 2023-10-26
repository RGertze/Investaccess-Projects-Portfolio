import { useEffect, useState } from "react";
import { Button, FormGroup } from "react-bootstrap";
import { Connection, POST_ENDPOINT } from "../../../../connection";
import { IGlobalContext, IResponse } from "../../../../interfaces/general_interfaces";
import { IStudentRegistrationStatus, REG_REQ_TYPE, STUDENT_REGISTRATION_STAGE } from "../../../../interfaces/registration_interfaces";
import { IStudent } from "../../../../interfaces/student_interfaces";
import { errorToast, successToast } from "../../../../shared-components/alert-components/toasts";
import Loading from "../../../../shared-components/loading-component/loading";
import { RegistrationDocsAccordian } from "../../../../shared-components/registration-docs-accordian/registrationDocsAccordian";
import { StudentRejectButton } from "../reject-button/rejectButton";

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

            <h2>Required Documents</h2>
            <p>A document should have been uploaded for each of the sections below.</p>

            <RegistrationDocsAccordian context={props.context} type={REG_REQ_TYPE.STUDENT} userIdOrStudentNumber={props.student.studentNumber} editable={false} />

            <FormGroup className="m-3">
                {
                    <>
                        <Button onClick={() => {
                            props.goToPrevPage();
                        }} variant={"primary"}>
                            Prev
                        </Button>
                        {
                            (props.registrationStatus.occupationalTherapyNeeded === 1 || props.registrationStatus.diagnosticTestNeeded === 1) &&
                            <Button className="m-3" onClick={() => {
                                props.goToNextPage();
                            }} variant="outline-success">Next</Button>
                        }
                    </>
                }
                {
                    loading &&
                    <Loading color="blue" small={true} />
                }
            </FormGroup>

            <StudentRejectButton context={props.context} editRegistrationStatus={props.editRegistrationStatus} student={props.student} type={STUDENT_REGISTRATION_STAGE.ADD_REQUIRED_DOCS} />
        </div>
    );
}