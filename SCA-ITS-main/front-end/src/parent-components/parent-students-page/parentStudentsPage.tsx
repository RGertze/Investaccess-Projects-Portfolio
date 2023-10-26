import { useEffect, useState } from 'react';
import { Badge, Button } from 'react-bootstrap';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Connection, GET_ENDPOINT, POST_ENDPOINT } from '../../connection';
import { IGlobalContext, IResponse } from '../../interfaces/general_interfaces';
import { IStudent } from '../../interfaces/student_interfaces';
import AddEditComponentV2, { INPUT_TYPE } from '../../shared-components/add-edit-component-V2/AddEditComponentV2';
import { errorToast, successToast } from '../../shared-components/alert-components/toasts';
import TableV2 from '../../shared-components/table-v2/tableV2';
import { STUDENT_REGISTRATION_STAGE } from '../../interfaces/registration_interfaces';
import { getStatusBadgeColourFromString, getStudentStatusBadgeColour, REGISTRATION_STAGE_STRING } from '../../utilities/registrationHelpers';

interface IProps {
    context: IGlobalContext
}

const ParentStudentsPage = (props: IProps) => {

    const navigate = useNavigate();

    const [showAddingStudent, setShowAddingStudent] = useState(false);
    const [students, setStudents] = useState<IStudent[]>([]);
    const [loading, setLoading] = useState(false);

    //----   COMPONENT DID MOUNT   ----
    useEffect(() => {
        getAllStudents();
    }, []);

    //----   GET ALL STUDENTS   ----
    const getAllStudents = async () => {
        setLoading(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_ALL_STUDENTS_FOR_PARENT + props.context.userId, "");
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
            errorToast("Enter a date of birth");
            return false;
        }
        if (!(data.grade >= 0 && data.grade <= 12)) {
            errorToast("Enter a grade between 0 and 12!");
            return false;
        }
        return true;
    }

    // VIEW STUDENT
    const viewStudent = (userId: any) => {
        navigate(`/parent/students/${userId}`, { state: userId });
    }

    return (
        <div className="">

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
                onRowClick={async (data: IStudent) => viewStudent(data.studentNumber)}

                data={students.map(s => { return { ...s, registrationStageString: (s.registrationStage === STUDENT_REGISTRATION_STAGE.APPROVED ? REGISTRATION_STAGE_STRING.APPROVED : s.registrationStage === STUDENT_REGISTRATION_STAGE.REJECTED ? REGISTRATION_STAGE_STRING.DENIED : REGISTRATION_STAGE_STRING.INCOMPLETE) } })}
            />

            {
                showAddingStudent &&
                <AddEditComponentV2
                    title='Add new Student'
                    cancel={() => setShowAddingStudent(false)}
                    submit={addNewStudent}
                    fields={[
                        { key: "firstName", name: "First Name", type: INPUT_TYPE.TEXT, value: "" },
                        { key: "lastName", name: "Last Name", type: INPUT_TYPE.TEXT, value: "" },
                        { key: "dob", name: "Date of Birth", type: INPUT_TYPE.DATE, value: "" },
                        { key: "grade", name: "Grade", type: INPUT_TYPE.NUMBER, value: "" },
                    ]}
                />
            }
        </div>
    );
}

export default ParentStudentsPage;