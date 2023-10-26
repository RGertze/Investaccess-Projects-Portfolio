import { Edit, Link } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Button, FormGroup } from "react-bootstrap";
import { Connection, POST_ENDPOINT } from "../../../../connection";
import { IGlobalContext, IResponse } from "../../../../interfaces/general_interfaces";
import { IStudentRegistrationStatus, STUDENT_REGISTRATION_STAGE } from "../../../../interfaces/registration_interfaces";
import { IStudent } from "../../../../interfaces/student_interfaces";
import AddEditComponentV2, { INPUT_TYPE } from "../../../../shared-components/add-edit-component-V2/AddEditComponentV2";
import { errorToast, successToast } from "../../../../shared-components/alert-components/toasts";
import Loading from "../../../../shared-components/loading-component/loading";
import { StudentRejectButton } from "../reject-button/rejectButton";

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
    const [editing, setEditing] = useState(false);

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
        });
        props.goToNextPage();
        return true;
    }

    return (
        <div className="m-3">

            <h2>Complete Diagnostic Test</h2>
            <p className={`${props.context.isMobile ? "w-100" : "w-50"} hor-center`}>This child is required to complete a diagnostic test before being accepted at our school. Add a link to the test below.</p>

            <div className={`therapy-doc-details border rounded shadow ${props.context.isMobile ? "w-100" : "w-50"} hor-center`}>
                <h3 className="mt-2 vert-flex space-between">Link to Test: <Edit onClick={() => setEditing(true)} className="hover" /></h3>
                <div className="vert-flex">
                    <Link style={{ color: "#555" }} />
                    <p>{props.registrationStatus.diagnosticTestLink}</p>
                </div>
            </div>

            {
                editing &&
                <AddEditComponentV2
                    title='Edit test link'
                    cancel={() => setEditing(false)}
                    submit={async (data: any) => {
                        if (await props.editRegistrationStatus(data))
                            setEditing(false);
                        return true;
                    }}
                    fields={[
                        { key: "diagnosticTestLink", name: "Link", type: INPUT_TYPE.TEXT, value: props.registrationStatus.diagnosticTestLink },
                    ]}
                />
            }

            <FormGroup className="m-3">
                {
                    <>
                        <Button onClick={() => {
                            props.goToPrevPage();
                        }} variant={"primary"}>
                            Prev
                        </Button>
                        <Button className="m-3" onClick={() => {
                            props.goToNextPage();
                        }} variant="outline-success">Next</Button>
                    </>
                }
                {
                    loading &&
                    <Loading color="blue" small={true} />
                }
            </FormGroup>
            <StudentRejectButton context={props.context} editRegistrationStatus={props.editRegistrationStatus} student={props.student} type={STUDENT_REGISTRATION_STAGE.DIAGNOSTIC_TEST_NEEDED} />
        </div>
    );
}