import { useEffect, useState } from "react";
import { Tab, Table, Tabs } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { Connection, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { IFile, IGlobalContext, IResponse, IUser } from "../../interfaces/general_interfaces";
import { STUDENT_REGISTRATION_STAGE } from "../../interfaces/registration_interfaces";
import { IStudent } from "../../interfaces/student_interfaces";
import { errorToast, successToast } from "../../shared-components/alert-components/toasts";
import StudentPrePrimaryProgressReports from "../../shared-components/pre-primary-student-progress-reports/prePrimaryStudentProgressReports";
import StudentCoursesComponent from "../../shared-components/student-courses-component/studentCoursesComponent";
import StudentProgressReportsList from "../../shared-components/student-progress-reports-list/studentProgressReportsList";
import "./staffStudentPage.css";

interface IProps {
    context: IGlobalContext
}

const StaffStudentPage = (props: IProps) => {
    const params = useLocation();
    const studentNumber = (params.state as string);

    // TAB VARIABLES
    const [tabKey, setTabKey] = useState('progress-reports');

    const [loading, setLoading] = useState(false);
    const [student, setStudent] = useState<IStudent>({
        parentId: 0,
        studentNumber: "",
        firstName: "",
        lastName: "",
        dob: "",
        grade: 0,

        age: 0,
        gender: 0,
        citizenship: "",
        studyPermit: "",
        homeLanguage: "",
        postalAddress: "",
        residentialAddress: "",
        telephoneHome: "",
        telephoneOther: "",
        currentChurch: "",
        currentChurchAddress: "",
        pastor: "",
        pastorTelephone: "",
        fatherConfirmationDate: "",
        motherConfirmationDate: "",
        baptismDate: "",
        currentGrade: 0,
        lastSchoolAttended: "",
        nameOfPrincipal: "",
        schoolAddress: "",
        studentsStrengths: "",
        talentsAndInterests: "",
        learningDifficulties: "",
        disiplinaryDifficulties: "",
        legalDifficulties: "",
        academicLevel: "",
        academicFailureAssessment: "",
        familyDoctor: "",
        doctorTelephone: "",
        otherMedicalConditions: "",
        generalHearingTestDate: "",
        generalVisionTestDate: "",
        tuberculosisTestDate: "",
        isShy: 0,
        bitesFingerNails: 0,
        sucksThumb: 0,
        hasExcessiveFears: 0,
        likesSchool: 0,
        playsWellWithOthers: 0,
        eatsBreakfastRegularly: 0,
        bedtime: "",
        risingTime: "",
        disabilityDueToDiseaseOrAccident: "",
        chronicMedication: "",

        approvalRequested: 0,
        registrationStage: STUDENT_REGISTRATION_STAGE.ADD_BASIC_DETAILS,
        rejectionMessage: "",

        createdAt: "",
    });

    // COMPONENT DID MOUNT
    useEffect(() => {
        getStudentDetails();
    }, []);

    // ON TAB CHANGE
    useEffect(() => {
        if (tabKey === "progress-reports") {

        }
    }, [tabKey]);

    //----   GET STUDENT DETAILS   ----
    const getStudentDetails = async () => {
        setLoading(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_STUDENT + studentNumber, "");
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setStudent(result.data);
    }

    return (
        <div className="admin-parent-page-container">

            {
                // USER DETAILS

                <div className='rounded student-details'>
                    <Table>
                        <tbody>
                            <tr>
                                <td width="40%">Student Number:</td>
                                <td>{student.studentNumber}</td>
                            </tr>
                            <tr>
                                <td>Name:</td>
                                <td>{student.firstName} {student.lastName}</td>
                            </tr>
                            <tr>
                                <td>Date of Birth:</td>
                                <td>{student.dob}</td>
                            </tr>
                            <tr>
                                <td>Grade:</td>
                                <td>{student.grade}</td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
            }

            {
                // TABS
                <Tabs activeKey={tabKey} onSelect={(e) => setTabKey(e ? e : "progress-reports")}>
                    <Tab eventKey="progress-reports" title="Progress Reports">
                        {
                            student.studentNumber !== "" && student.grade > 0 &&
                            <StudentProgressReportsList isStaff={false} context={props.context} studentNumber={studentNumber} />
                        }
                        {
                            student.studentNumber !== "" && student.grade === 0 &&
                            <StudentPrePrimaryProgressReports context={props.context} studentNumber={studentNumber} />
                        }
                    </Tab>
                    <Tab eventKey="courses" title="Courses">
                        <StudentCoursesComponent context={props.context} studentNumber={studentNumber} />
                    </Tab>
                </Tabs>
            }
        </div>
    );
}

export default StaffStudentPage;