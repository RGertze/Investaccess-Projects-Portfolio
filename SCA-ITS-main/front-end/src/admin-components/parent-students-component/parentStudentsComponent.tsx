import { useEffect, useState } from 'react';
import { Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Connection, GET_ENDPOINT } from '../../connection';
import { IGlobalContext, IResponse } from '../../interfaces/general_interfaces';
import { STUDENT_REGISTRATION_STAGE } from '../../interfaces/registration_interfaces';
import { IStudent } from '../../interfaces/student_interfaces';
import { errorToast } from '../../shared-components/alert-components/toasts';
import TableList from '../../shared-components/table-list-component/tableListComponent';
import TableV2 from '../../shared-components/table-v2/tableV2';
import { getStatusBadgeColourFromString, REGISTRATION_STAGE_STRING } from '../../utilities/registrationHelpers';


interface IProps {
    context: IGlobalContext,
    parentId: number
}

const ParentStudentsComponent = (props: IProps) => {

    const navigate = useNavigate();

    const [students, setStudents] = useState<IStudent[]>([]);
    const [loading, setLoading] = useState(false);

    //----   COMPONENT DID MOUNT   ----
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

    // VIEW STUDENT
    const viewStudent = (userId: any) => {
        navigate(`/admin/students/${userId}`, { state: userId });
    }

    return (
        <div className="">
            <TableV2
                title="Students"
                columns={[
                    { title: "Student Number", field: "studentNumber", filtering: false },
                    { title: "First Name", field: "firstName", filtering: false },
                    { title: "Last Name", field: "lastName", filtering: false },
                    { title: "Date of Birth", field: "dob", filtering: false },
                    { title: "Grade", field: "grade", filtering: false },
                    {
                        title: "Status", field: "registrationStageString",
                        render: (rowData: any) => <Badge bg={getStatusBadgeColourFromString(rowData.registrationStageString)}>
                            {rowData.registrationStageString}
                        </Badge>,
                        lookup: { "approved": "approved", "denied": "denied", "incomplete": "incomplete" },
                    },
                ]}
                filtering={true}

                isLoading={loading}

                onRowClick={async (data: IStudent) => viewStudent(data.studentNumber)}

                data={students.map(s => { return { ...s, registrationStageString: (s.registrationStage === STUDENT_REGISTRATION_STAGE.APPROVED ? REGISTRATION_STAGE_STRING.APPROVED : s.registrationStage === STUDENT_REGISTRATION_STAGE.REJECTED ? REGISTRATION_STAGE_STRING.DENIED : REGISTRATION_STAGE_STRING.INCOMPLETE) } })}
            />
        </div>
    );
}

export default ParentStudentsComponent;