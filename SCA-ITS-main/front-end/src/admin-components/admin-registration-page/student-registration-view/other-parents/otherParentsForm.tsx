import moment from "moment";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import FormGroup from "react-bootstrap/esm/FormGroup";
import { Connection, GET_ENDPOINT, POST_ENDPOINT } from "../../../../connection";
import { IGlobalContext, IResponse } from "../../../../interfaces/general_interfaces";
import { IOtherParent } from "../../../../interfaces/parent_interfaces";
import { STUDENT_REGISTRATION_STAGE } from "../../../../interfaces/registration_interfaces";
import { IStudent } from "../../../../interfaces/student_interfaces";
import { errorToast, successToast } from "../../../../shared-components/alert-components/toasts";
import Loading from "../../../../shared-components/loading-component/loading";
import StudentOtherParentsComponent from "../../../../shared-components/student-other-parents-component/studentOtherParentsComponent";
import TableV2 from "../../../../shared-components/table-v2/tableV2";
import { StudentRejectButton } from "../reject-button/rejectButton";

interface IProps {
    context: IGlobalContext,
    student: IStudent,

    goToPrevPage(): Promise<void>,
    goToNextPage(): Promise<void>,

    editRegistrationStatus(data: any): Promise<boolean>
}

export const StudentOtherParentsForm = (props: IProps) => {
    const [loading, setLoading] = useState(false);

    const [parents, setParents] = useState<IOtherParent[]>([]);


    // COMPONENT DID MOUNT
    useEffect(() => {
        getAllOtherParentsForStudent();
    }, []);

    //----   GET ALL OTHER PARENTS FOR STUDENT   ----
    const getAllOtherParentsForStudent = async () => {
        setLoading(true);
        let qry = GET_ENDPOINT.GET_ALL_STUDENT_OTHER_PARENTS.toString();
        qry = qry.replace("{studentNumber}", props.student.studentNumber);
        let result: IResponse = await Connection.getRequest(qry, "");
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setParents(result.data);
    }

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
        });
        props.goToNextPage();
        return true;
    }

    return (
        <div style={{ maxWidth: "100%", overflow: "auto" }}>
            <TableV2
                title="Other Parents/Guardians"
                columns={[
                    { title: "First Name: ", field: "firstName", filtering: false },
                    { title: "Last Name: ", field: "lastName", filtering: false },
                    { title: "ID Number: ", field: "idNumber", filtering: false },
                    { title: "Employer: ", field: "employer", filtering: false },
                    { title: "Occupation: ", field: "occupation", filtering: false },
                    { title: "Annual Budget: ", field: "monthlyIncome", filtering: false },
                    { title: "Working Hours: ", field: "workingHours", filtering: false },
                    { title: "Specialist Skills/Hobbes: ", field: "specialistSkillsHobbies", filtering: false },
                    { title: "Telphone (Work): ", field: "telephoneWork", filtering: false },
                    { title: "Telphone (Home): ", field: "telephoneHome", filtering: false },
                    { title: "Fax: ", field: "fax", filtering: false },
                    { title: "Cell Number: ", field: "cellNumber", filtering: false },
                    { title: "Postal Address: ", field: "postalAddress", filtering: false },
                    { title: "Residential Address: ", field: "residentialAddress", filtering: false },
                    { title: "Marital Status: ", field: "maritalStatus", filtering: false },
                ]}
                filtering={true}

                isLoading={loading}

                data={parents}
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
                            props.goToNextPage();
                        }} variant="outline-success">Next</Button>
                    </>
                }
                {
                    loading &&
                    <Loading color="blue" small={true} />
                }
            </FormGroup>
            <StudentRejectButton context={props.context} editRegistrationStatus={props.editRegistrationStatus} student={props.student} type={STUDENT_REGISTRATION_STAGE.ADD_OTHER_PARENTS} />
        </div >
    );
}