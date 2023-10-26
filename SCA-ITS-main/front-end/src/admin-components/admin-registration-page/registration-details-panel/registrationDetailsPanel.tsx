import { useEffect, useState } from "react";
import { Badge } from "react-bootstrap";
import { Connection, GET_ENDPOINT } from "../../../connection";
import { IGlobalContext, IResponse } from "../../../interfaces/general_interfaces";
import { STUDENT_REGISTRATION_STAGE } from "../../../interfaces/registration_interfaces";
import { IStudent } from "../../../interfaces/student_interfaces";
import { errorToast } from "../../../shared-components/alert-components/toasts";
import { PopupComponent } from "../../../shared-components/popup-component/popupComponent";
import TableV2 from "../../../shared-components/table-v2/tableV2";
import { getStudentStatusBadgeColour, getStatusBadgeColourFromString, REGISTRATION_STAGE_STRING } from "../../../utilities/registrationHelpers";
import { StudentRegistrationForm } from "../student-registration-view/studentRegistrationView";
import "./registrationDetailsPanel.css"

interface IProps {
    context: IGlobalContext,
    parentId: number
}

export const RegistrationDetailsPanel = (props: IProps) => {

    const [loading, setLoading] = useState(false);
    const [studentsTemp, setStudentsTemp] = useState<IStudent[]>([]);
    const [students, setStudents] = useState<IStudent[]>([]);

    const [studentToView, setStudentView] = useState<IStudent>();

    useEffect(() => {
        getRegistrationRequests();
    }, []);

    useEffect(() => {
        let temp = studentsTemp.filter(s => s.registrationStage !== STUDENT_REGISTRATION_STAGE.APPROVED);
        setStudents(temp);
    }, [studentsTemp]);

    const getRegistrationRequests = async () => {
        setLoading(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_ALL_STUDENTS_FOR_PARENT + props.parentId.toString(), "");
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setStudentsTemp(result.data);
    }

    return (
        <div className="registration-details-panel p-5">

            <p>These students are in the process of being registered.</p>

            <TableV2
                title="Students Being Registered"
                columns={[
                    { title: "Student Number", field: "studentNumber", filtering: false },
                    { title: "First Name", field: "firstName", filtering: false },
                    { title: "Last Name", field: "lastName", filtering: false },
                    {
                        title: "Grade", field: "grade", type: "numeric",
                        lookup: { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, 11: 11, 12: 12, },
                    },
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
                onRowClick={async (data) => setStudentView(data)}

                data={students.map(s => { return { ...s, registrationStageString: (s.registrationStage === STUDENT_REGISTRATION_STAGE.APPROVED ? REGISTRATION_STAGE_STRING.APPROVED : s.registrationStage === STUDENT_REGISTRATION_STAGE.REJECTED ? REGISTRATION_STAGE_STRING.DENIED : REGISTRATION_STAGE_STRING.INCOMPLETE) } })}
            />

            {
                studentToView &&
                <PopupComponent component={<StudentRegistrationForm context={props.context} studentNumber={studentToView.studentNumber} />} onHide={() => setStudentView(undefined)} size={"xl"} fullscreen={true} />
            }

        </div>
    );
}