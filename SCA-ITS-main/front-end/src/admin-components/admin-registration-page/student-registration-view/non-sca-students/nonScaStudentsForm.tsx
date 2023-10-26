import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import FormGroup from "react-bootstrap/esm/FormGroup";
import { Connection, GET_ENDPOINT, POST_ENDPOINT } from "../../../../connection";
import { IGlobalContext, IResponse } from "../../../../interfaces/general_interfaces";
import { STUDENT_REGISTRATION_STAGE } from "../../../../interfaces/registration_interfaces";
import { INonScaSibling, IStudent } from "../../../../interfaces/student_interfaces";
import { errorToast, successToast } from "../../../../shared-components/alert-components/toasts";
import Loading from "../../../../shared-components/loading-component/loading";
import NonScaSiblingsComponent from "../../../../shared-components/non-sca-siblings-component/nonScaSiblingsComponent";
import TableV2 from "../../../../shared-components/table-v2/tableV2";
import { StudentRejectButton } from "../reject-button/rejectButton";

interface IProps {
    context: IGlobalContext,
    student: IStudent,

    goToPrevPage(): Promise<void>,
    goToNextPage(): Promise<void>,

    editRegistrationStatus(data: any): Promise<boolean>
}

export const StudentNonScaStudentsForm = (props: IProps) => {
    const [loading, setLoading] = useState(false);

    const [siblings, setSiblings] = useState<INonScaSibling[]>([]);

    // COMPONENT DID MOUNT
    useEffect(() => {
        getAll();
    }, []);

    //----   GET ALL   ----
    const getAll = async () => {
        setLoading(true);
        let qry = GET_ENDPOINT.GET_ALL_NON_SCA_SIBLINGS_FOR_STUDENT.toString();
        qry = qry.replace("{studentNumber}", props.student.studentNumber);
        let result: IResponse = await Connection.getRequest(qry, "");
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setSiblings(result.data);
    }

    //----   EDIT STUDENT   ----
    const editStudent = async (data: IStudent): Promise<boolean> => {
        data.studentNumber = props.student.studentNumber;
        data.registrationStage = STUDENT_REGISTRATION_STAGE.ADD_REQUIRED_DOCS;
        setLoading(true);
        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.EDIT_STUDENT, data, {});
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }
        successToast("Info Saved!", true, 1500);
        props.editRegistrationStatus({
            nonScaStudentsAdded: 1,
        });
        props.goToNextPage();
        return true;
    }
    return (
        <div>
            <TableV2
                title="Non SCA Siblings"
                columns={[
                    { title: "Name", field: "name", filtering: false },
                    { title: "Age", field: "age", filtering: false },
                ]}
                filtering={true}

                isLoading={loading}

                data={siblings}
            />
            <FormGroup>
                {
                    <>
                        <Button onClick={() => {
                            props.goToPrevPage();
                        }} variant={"primary"}>
                            Prev
                        </Button>
                        <Button onClick={() => {
                            props.goToNextPage()
                        }} variant="outline-success">Next</Button>
                    </>
                }
                {
                    loading &&
                    <Loading color="blue" small={true} />
                }
            </FormGroup>
            <StudentRejectButton context={props.context} editRegistrationStatus={props.editRegistrationStatus} student={props.student} type={STUDENT_REGISTRATION_STAGE.ADD_NON_SCA_STUDENTS} />
        </div >
    );
}