import moment from "moment";
import { useState } from "react";
import { Button } from "react-bootstrap";
import FormGroup from "react-bootstrap/esm/FormGroup";
import { Connection, POST_ENDPOINT } from "../../../connection";
import { IGlobalContext, IResponse } from "../../../interfaces/general_interfaces";
import { IStudentRegistrationStatus, STUDENT_REGISTRATION_STAGE } from "../../../interfaces/registration_interfaces";
import { IStudent } from "../../../interfaces/student_interfaces";
import { INPUT_TYPE } from "../../../shared-components/add-edit-component-V2/AddEditComponentV2";
import { AlertComponent } from "../../../shared-components/alert-component/alertComponent";
import { errorToast, successToast } from "../../../shared-components/alert-components/toasts";
import FormComponent from "../../../shared-components/form-component/formComponent";
import Loading from "../../../shared-components/loading-component/loading";
import StudentOtherParentsComponent from "../../../shared-components/student-other-parents-component/studentOtherParentsComponent";

interface IProps {
    context: IGlobalContext,
    student: IStudent,
    registrationStatus: IStudentRegistrationStatus,

    goToPrevPage(): Promise<void>,
    goToNextPage(): Promise<void>,

    editRegistrationStatus(data: any): Promise<boolean>
}

export const StudentOtherParentsForm = (props: IProps) => {
    const [loading, setLoading] = useState(false);

    //----   EDIT STUDENT   ----
    const editStudent = async (data: IStudent): Promise<boolean> => {
        data.studentNumber = props.student.studentNumber;
        data.registrationStage = STUDENT_REGISTRATION_STAGE.ADD_NON_SCA_STUDENTS;
        setLoading(true);
        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.EDIT_STUDENT, data, {});
        setLoading(false);
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
        <div style={{ maxWidth: "100%", overflow: "auto" }}>
            {
                props.registrationStatus.otherParentsRejectionMessage !== null && props.registrationStatus.otherParentsRejectionMessage !== "" &&
                <AlertComponent title="The Admin has Rejected the info on this page with the following reason: " type="danger" content={props.registrationStatus.otherParentsRejectionMessage} footer="Please fix the above mentioned issues if possible." />
            }
            <StudentOtherParentsComponent context={props.context} studentNumber={props.student.studentNumber} parentId={props.student.parentId} />
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
                            editStudent(data);
                        }} variant="outline-success">Save and Next</Button>
                    </>
                }
                {
                    loading &&
                    <Loading color="blue" small={true} />
                }
            </FormGroup>
        </div >
    );
}