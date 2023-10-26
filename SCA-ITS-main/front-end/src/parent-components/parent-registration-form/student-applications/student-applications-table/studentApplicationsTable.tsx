import { useEffect, useState } from "react";
import { Badge } from "react-bootstrap";
import { Connection, GET_ENDPOINT, POST_ENDPOINT } from "../../../../connection";
import { IGlobalContext, IResponse } from "../../../../interfaces/general_interfaces"
import { STUDENT_REGISTRATION_STAGE } from "../../../../interfaces/registration_interfaces";
import { IStudent } from "../../../../interfaces/student_interfaces";
import AddEditComponentV2, { INPUT_TYPE } from "../../../../shared-components/add-edit-component-V2/AddEditComponentV2";
import { errorToast, successToast } from "../../../../shared-components/alert-components/toasts";
import { PopupComponent } from "../../../../shared-components/popup-component/popupComponent";
import TableV2 from "../../../../shared-components/table-v2/tableV2";
import { getStatusBadgeColourFromString, getStudentStatusBadgeColour, REGISTRATION_STAGE_STRING } from "../../../../utilities/registrationHelpers";
import { StudentRegistrationForm } from "../../../student-registration-form/studentRegistrationForm";


interface IProps {
    context: IGlobalContext,
    parentId: number
}

export const StudentApplicationsTable = (props: IProps) => {

    const [studentToView, setStudentToView] = useState<IStudent>();
    const [showAddingStudent, setShowAddingStudent] = useState(false);
    const [students, setStudents] = useState<IStudent[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getAllStudents();
    }, []);

    //----   GET ALL STUDENTS   ----
    const getAllStudents = async () => {
        setLoading(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_ALL_STUDENTS_FOR_PARENT + props.parentId, "");
        setLoading(false);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true);
            return;
        }
        setStudents(result.data);
    }

    //----   ADD NEW STUDENT   ----
    const addNewStudent = async (data: any): Promise<boolean> => {
        setLoading(true);
        if (!validateNewStudentData(data)) {
            setLoading(false);
            return false;
        }

        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.ADD_STUDENT, {
            parentId: props.context.userId,
            firstName: data.firstName,
            lastName: data.lastName,
            dob: data.dob,
            grade: data.grade
        }, {});
        setLoading(false);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true);
            return false;
        }
        successToast("Successfully added student", true);
        setShowAddingStudent(false);
        getAllStudents();
        return true;
    }

    //----   VALIDATE NEW STUDENT DATA   ----
    const validateNewStudentData = (data: any): boolean => {
        if (data.studentNumber === "") {
            errorToast("Enter a student number");
            return false;
        }
        if (data.firstName === "") {
            errorToast("Enter a first name");
            return false;
        }
        if (data.lastName === "") {
            errorToast("Enter a last name");
            return false;
        }
        if (data.dob === "") {
            errorToast("Enter a last name");
            return false;
        }
        if (data.grade < 0 || data.grade > 12 || !data.grade) {
            errorToast("Enter a grade between 0 and 12!");
            return false;
        }
        return true;
    }

    return (
        <>
            <TableV2
                title="Students"
                columns={[
                    { title: "Student Number", field: "studentNumber" },
                    { title: "First Name", field: "firstName" },
                    { title: "Last Name", field: "lastName" },
                    { title: "Date of Birth", field: "dob" },
                    { title: "Grade", field: "grade" },
                    {
                        title: "Status", field: "registrationStageString",
                        render: (rowData: any) => <Badge bg={getStatusBadgeColourFromString(rowData.registrationStageString)}>
                            {rowData.registrationStageString}
                        </Badge>,
                        lookup: { "approved": "approved", "denied": "denied", "incomplete": "incomplete" },
                    },
                ]}
                filtering={false}

                isLoading={loading}

                onAdd={async () => setShowAddingStudent(true)}
                onRowClick={async (data: IStudent) => setStudentToView(data)}

                data={students.map(s => { return { ...s, registrationStageString: (s.registrationStage === STUDENT_REGISTRATION_STAGE.APPROVED ? REGISTRATION_STAGE_STRING.APPROVED : s.registrationStage === STUDENT_REGISTRATION_STAGE.REJECTED ? REGISTRATION_STAGE_STRING.DENIED : REGISTRATION_STAGE_STRING.INCOMPLETE) } })}
            />

            {
                showAddingStudent &&
                <AddEditComponentV2
                    title='Add Student'
                    cancel={() => setShowAddingStudent(false)}
                    submit={addNewStudent}
                    fields={[
                        { key: "firstName", name: "First Name", type: INPUT_TYPE.TEXT, value: "" },
                        { key: "lastName", name: "Last Name", type: INPUT_TYPE.TEXT, value: "" },
                        { key: "dob", name: "Date of Birth", type: INPUT_TYPE.DATE, value: "" },
                        { key: "grade", name: "Grade", type: INPUT_TYPE.NUMBER, value: 0 },
                    ]}
                />
            }

            {
                studentToView &&
                <PopupComponent component={<StudentRegistrationForm context={props.context} studentNumber={studentToView.studentNumber} />} fullscreen={true} size="xl" onHide={() => setStudentToView(undefined)} />
            }
        </>
    );
}