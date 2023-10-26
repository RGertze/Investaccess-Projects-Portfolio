import { useEffect, useState } from "react";
import { Badge, Tab, Tabs } from "react-bootstrap";
import { Connection, GET_ENDPOINT } from "../../connection";
import { IGlobalContext, IResponse, IUser } from "../../interfaces/general_interfaces";
import { IParentAll } from "../../interfaces/parent_interfaces";
import { PARENT_REGISTRATION_STAGE, STUDENT_REGISTRATION_STAGE } from "../../interfaces/registration_interfaces";
import { IStudent } from "../../interfaces/student_interfaces";
import { errorToast } from "../../shared-components/alert-components/toasts";
import { PopupComponent } from "../../shared-components/popup-component/popupComponent";
import TableV2 from "../../shared-components/table-v2/tableV2";
import { getParentStatusBadgeColour, getStatusBadgeColourFromString, REGISTRATION_STAGE_STRING } from "../../utilities/registrationHelpers";
import { ParentRegistrationForm } from "./parent-registration-view/parentRegistrationForm";
import { RegistrationDetailsPanel } from "./registration-details-panel/registrationDetailsPanel";
import { StudentRegistrationForm } from "./student-registration-view/studentRegistrationView";

interface IProps {
    context: IGlobalContext
}

export const AdminRegistrationPage = (props: IProps) => {

    const [loading, setLoading] = useState(false);
    const [parents, setParents] = useState<IParentAll[]>([]);
    const [parentToView, setParentToView] = useState<IParentAll>();

    const [students, setStudents] = useState<IStudent[]>([]);
    const [studentToView, setStudentToView] = useState<IStudent>();

    const [tabKey, initTabKey] = useState('parents');

    useEffect(() => {
        getRegistrationRequests();
        getStudentRegistrationRequests();
    }, []);

    const getRegistrationRequests = async () => {
        setLoading(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_REGISTRATION_REQUESTS, "");
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setParents(result.data);
    }

    const getStudentRegistrationRequests = async () => {
        setLoading(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_STUDENT_REGISTRATION_REQUESTS, "");
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setStudents(result.data);
    }


    return (
        <div>

            <h1>Registration Requests</h1>
            <p>View and Approve registration requests.</p>

            <Tabs>
                <Tab className="" eventKey="parents" title="Parents">
                    <TableV2
                        title="Parents"
                        columns={[
                            { title: "First Name", field: "firstName", filtering: false },
                            { title: "Last Name", field: "lastName", filtering: false },
                            { title: "Email", field: "email", filtering: false },
                            {
                                title: "Status", field: "registrationStageString",
                                render: (rowData: any) => <Badge bg={getStatusBadgeColourFromString(rowData.registrationStageString)}>
                                    {rowData.registrationStageString}
                                </Badge>,
                                lookup: { "approved": "approved", "denied": "denied", "incomplete": "incomplete" },
                            },
                            { title: "Created At", field: "createdAt", filtering: false },
                        ]}
                        filtering={true}

                        isLoading={loading}

                        data={parents.map(p => {
                            return {
                                ...p,
                                registrationStageString: (p.registrationStage === PARENT_REGISTRATION_STAGE.APPROVED ? REGISTRATION_STAGE_STRING.APPROVED : p.registrationStage === PARENT_REGISTRATION_STAGE.REJECTED ? REGISTRATION_STAGE_STRING.DENIED : REGISTRATION_STAGE_STRING.INCOMPLETE)
                            }
                        })}

                        onRowClick={async (data: IParentAll) => setParentToView(data)}

                        detailsPanels={[
                            {
                                tooltip: "Show details",
                                render: (rowData: any) => {
                                    return (
                                        <RegistrationDetailsPanel context={props.context} parentId={rowData.rowData.userId} />
                                    );
                                }
                            }
                        ]}
                    />
                    {
                        parentToView &&
                        <PopupComponent component={<ParentRegistrationForm context={props.context} parentId={parentToView.userId} />} onHide={() => setParentToView(undefined)} size={"xl"} fullscreen={true} />
                    }
                </Tab>
                <Tab className="" eventKey="students" title="Students">
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
                            { title: "Created At", field: "createdAt", filtering: false },
                        ]}
                        filtering={true}

                        isLoading={loading}
                        onRowClick={async (data) => setStudentToView(data)}

                        data={students.map(s => { return { ...s, registrationStageString: (s.registrationStage === STUDENT_REGISTRATION_STAGE.APPROVED ? REGISTRATION_STAGE_STRING.APPROVED : s.registrationStage === STUDENT_REGISTRATION_STAGE.REJECTED ? REGISTRATION_STAGE_STRING.DENIED : REGISTRATION_STAGE_STRING.INCOMPLETE) } })}
                    />

                    {
                        studentToView &&
                        <PopupComponent component={<StudentRegistrationForm context={props.context} studentNumber={studentToView.studentNumber} />} onHide={() => setStudentToView(undefined)} size={"xl"} fullscreen={true} />
                    }
                </Tab>
            </Tabs>
        </div>
    );
}