import { Link } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Button, FormGroup } from "react-bootstrap";
import { Connection, GET_ENDPOINT, POST_ENDPOINT } from "../../../connection";
import { IGlobalContext, IResponse } from "../../../interfaces/general_interfaces";
import { IStudentRegistrationStatus } from "../../../interfaces/registration_interfaces";
import { IStudent } from "../../../interfaces/student_interfaces";
import { AlertComponent } from "../../../shared-components/alert-component/alertComponent";
import { errorToast, successToast } from "../../../shared-components/alert-components/toasts";
import Loading from "../../../shared-components/loading-component/loading";

interface IProps {
    context: IGlobalContext,
    student: IStudent,
    registrationStatus: IStudentRegistrationStatus,

    goToPrevPage(): Promise<void>,
    goToNextPage(): Promise<void>,

    editRegistrationStatus(data: any): Promise<boolean>
}

export const StudentDiagnosticTestForm = (props: IProps) => {
    const [loading, setLoading] = useState(false);

    //----   EDIT STUDENT   ----
    const editStudent = async (data: IStudent): Promise<boolean> => {
        data.studentNumber = props.student.studentNumber;
        setLoading(true);
        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.EDIT_STUDENT, data, {});
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }
        successToast("Info Saved!", true, 1500);
        props.editRegistrationStatus({
            diagnosticResultAdded: 1,
            diagnosticRejectionMessage: ""
        });
        props.goToNextPage();
        return true;
    }

    return (
        <div className="m-3">

            <h2>Complete Diagnostic Test</h2>
            <p className={`${props.context.isMobile ? "w-100" : "w-50"} hor-center`}>Your child is required to complete a diagnostic test before being accepted at our school. Please follow the link below to the test. Once it is completed, click on the Test Completed button to notify the school.</p>

            {
                props.registrationStatus.diagnosticRejectionMessage !== null && props.registrationStatus.diagnosticRejectionMessage !== "" &&
                <AlertComponent title="The Admin has Rejected the info on this page with the following reason: " type="danger" content={props.registrationStatus.diagnosticRejectionMessage} footer="Please fix the above mentioned issues if possible." />
            }

            <div className={`therapy-doc-details border rounded shadow ${props.context.isMobile ? "w-100" : "w-50"} hor-center`}>
                <h3 className="mt-2">Link to Test:</h3>
                <div className="vert-flex">
                    <Link style={{ color: "#555" }} />
                    <p>{props.registrationStatus.diagnosticTestLink}</p>
                </div>
            </div>

            <FormGroup className="m-3">
                {
                    <>
                        <Button onClick={() => {
                            props.goToPrevPage();
                        }} variant={"primary"}>
                            Prev
                        </Button>
                        <Button className="m-3" onClick={() => {
                            let data: any = {};
                            editStudent(data);
                        }} variant="outline-success">Test Completed</Button>
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