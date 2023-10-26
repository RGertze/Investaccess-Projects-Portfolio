import { ErrorOutline, TaskAlt } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Connection, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { IGlobalContext, IResponse } from "../../interfaces/general_interfaces";
import { IStudentRegistrationStatus, STUDENT_REGISTRATION_STAGE } from "../../interfaces/registration_interfaces";
import { IStudent } from "../../interfaces/student_interfaces";
import { errorToast } from "../../shared-components/alert-components/toasts";
import Loading from "../../shared-components/loading-component/loading";
import { StudentBasicInfoForm } from "./basic-info/basicInfoForm";
import { StudentDiagnosticTestForm } from "./diagnostic-test/diagnosticTestForm";
import { StudentGeneralInfoForm } from "./general-info/generalInfoForm";
import { StudentMedicalConditionsForm } from "./medical-conditions/medicalConditionsForm";
import { StudentMedicalInfoForm } from "./medical-info/medicalInfoForm";
import { StudentRegistrationFormNavigationBar } from "./nav-bar/navBar";
import { StudentNonScaStudentsForm } from "./non-sca-students/nonScaStudentsForm";
import { StudentOccupationalTherapyForm } from "./occupational-therapy/occupationalTherapyForm";
import { StudentOtherParentsForm } from "./other-parents/otherParentsForm";
import { StudentReligiousInfoForm } from "./religious-info/religiousInfoForm";
import { StudentRequiredDocsForm } from "./required-docs/requiredDocsForm";
import { StudentScholasticInfoForm } from "./scholastic-info/scholasticInfoForm";
import "./studentRegistrationForm.css"

interface IProps {
    context: IGlobalContext,
    studentNumber: string
}

export const StudentRegistrationForm = (props: IProps) => {
    const [registrationStage, setRegistrationStage] = useState<number>(0);
    const [registrationStatus, setRegistrationStatus] = useState<IStudentRegistrationStatus>({
        studentNumber: props.studentNumber,
        basicDetailsAdded: 0,
        generalInfoAdded: 0,
        religiousInfoAdded: 0,
        scholasticInfoAdded: 0,
        medicalInfoAdded: 0,
        medicalConditionsAdded: 0,
        otherParentsAdded: 0,
        nonScaStudentsAdded: 0,
        requiredDocsAdded: 0,
        occupationalTherapyNeeded: 0,
        occupationalReportAdded: 0,
        diagnosticTestNeeded: 0,
        diagnosticResultAdded: 0,

        therapistName: "",
        therapistCell: "",
        therapistEmail: "",
        therapistUrl: "",

        diagnosticTestLink: "",

        basicRejectionMessage: "",
        generalRejectionMessage: "",
        religiousRejectionMessage: "",
        scholasticRejectionMessage: "",
        medicalRejectionMessage: "",
        conditionsRejectionMessage: "",
        otherParentsRejectionMessage: "",
        nonScaRejectionMessage: "",
        requiredDocsRejectionMessage: "",
        therapyRejectionMessage: "",
        diagnosticRejectionMessage: "",
    });
    const [student, setStudent] = useState<IStudent>();

    const [loadingStatus, setLoadingStatus] = useState(false);
    const [loadingStudent, setLoadingStudent] = useState(false);


    useEffect(() => {
        getStudentDetailsLoading();
        getStudentRegistrationStatus();
    }, []);

    useEffect(() => {
        if (student && registrationStage === 0)
            setRegistrationStage(student.registrationStage);
    }, [student]);

    //----   GET STUDENT DETAILS   ----
    const getStudentDetailsLoading = async () => {
        setLoadingStudent(true);
        await getStudentDetailsSilent();
        setLoadingStudent(false);
    }

    //----   GET STUDENT DETAILS   ----
    const getStudentDetailsSilent = async () => {
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_STUDENT + props.studentNumber, "");
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }
        setStudent(result.data);
        return (true);
    }

    //----   GET STUDENT REGISTRATION STATUS   ----
    const getStudentRegistrationStatus = async () => {
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_REGISTRATION_STATUS_FOR_STUDENT + props.studentNumber, "");
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }
        setRegistrationStatus(result.data);
        return (true);
    }

    //----   EDIT STUDENT REGISTRATION STATUS   ----
    const editStudentRegistrationStatus = async (data: IStudentRegistrationStatus): Promise<boolean> => {
        data.studentNumber = props.studentNumber;
        console.log(data);
        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.EDIT_STUDENT_REGISTRATION_STATUS, data, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }
        getStudentRegistrationStatus();
        return true;
    }

    const navigateToStage = async (stage: STUDENT_REGISTRATION_STAGE) => {
        getStudentDetailsSilent();
        setRegistrationStage(stage);
    }

    return (
        <div className="student-registration-form-container">

            <h1 className="p-4 mb-2" style={{ gridColumn: "1/3" }}>Complete Student Application</h1>

            {
                loadingStatus || loadingStudent &&
                <div style={{ gridColumn: "1/3" }}>
                    <Loading />
                </div>
            }

            {
                // nav bar
                !(loadingStatus || loadingStudent) && student &&
                <StudentRegistrationFormNavigationBar context={props.context} student={student} navigateToStage={navigateToStage} registrationStatus={registrationStatus} />
            }

            {
                // application pages
                (!(loadingStatus || loadingStudent) && student !== undefined) &&
                <>
                    {
                        registrationStage === STUDENT_REGISTRATION_STAGE.ADD_BASIC_DETAILS &&
                        <StudentBasicInfoForm registrationStatus={registrationStatus} editRegistrationStatus={editStudentRegistrationStatus} context={props.context} goToNextPage={() => navigateToStage(STUDENT_REGISTRATION_STAGE.ADD_GENERAL_INFO)} goToPrevPage={async () => { errorToast("You are at the first stage!") }} student={student} />
                    }
                    {
                        registrationStage === STUDENT_REGISTRATION_STAGE.ADD_GENERAL_INFO &&
                        <StudentGeneralInfoForm registrationStatus={registrationStatus} editRegistrationStatus={editStudentRegistrationStatus} context={props.context} goToNextPage={() => navigateToStage(STUDENT_REGISTRATION_STAGE.ADD_RELIGIOUS_INFO)} goToPrevPage={async () => navigateToStage(STUDENT_REGISTRATION_STAGE.ADD_BASIC_DETAILS)} student={student} />
                    }
                    {
                        registrationStage === STUDENT_REGISTRATION_STAGE.ADD_RELIGIOUS_INFO &&
                        <StudentReligiousInfoForm registrationStatus={registrationStatus} editRegistrationStatus={editStudentRegistrationStatus} context={props.context} goToNextPage={() => navigateToStage(STUDENT_REGISTRATION_STAGE.ADD_SCHOLASTIC_INFO)} goToPrevPage={async () => navigateToStage(STUDENT_REGISTRATION_STAGE.ADD_GENERAL_INFO)} student={student} />
                    }
                    {
                        registrationStage === STUDENT_REGISTRATION_STAGE.ADD_SCHOLASTIC_INFO &&
                        <StudentScholasticInfoForm registrationStatus={registrationStatus} editRegistrationStatus={editStudentRegistrationStatus} context={props.context} goToNextPage={() => navigateToStage(STUDENT_REGISTRATION_STAGE.ADD_MEDICAL_DETAILS)} goToPrevPage={async () => navigateToStage(STUDENT_REGISTRATION_STAGE.ADD_RELIGIOUS_INFO)} student={student} />
                    }
                    {
                        registrationStage === STUDENT_REGISTRATION_STAGE.ADD_MEDICAL_DETAILS &&
                        <StudentMedicalInfoForm registrationStatus={registrationStatus} editRegistrationStatus={editStudentRegistrationStatus} context={props.context} goToNextPage={() => navigateToStage(STUDENT_REGISTRATION_STAGE.ADD_MEDICAL_CONDITIONS)} goToPrevPage={async () => navigateToStage(STUDENT_REGISTRATION_STAGE.ADD_SCHOLASTIC_INFO)} student={student} />
                    }
                    {
                        registrationStage === STUDENT_REGISTRATION_STAGE.ADD_MEDICAL_CONDITIONS &&
                        <StudentMedicalConditionsForm registrationStatus={registrationStatus} editRegistrationStatus={editStudentRegistrationStatus} context={props.context} goToNextPage={() => navigateToStage(STUDENT_REGISTRATION_STAGE.ADD_OTHER_PARENTS)} goToPrevPage={async () => navigateToStage(STUDENT_REGISTRATION_STAGE.ADD_MEDICAL_DETAILS)} student={student} />
                    }
                    {
                        registrationStage === STUDENT_REGISTRATION_STAGE.ADD_OTHER_PARENTS &&
                        <StudentOtherParentsForm registrationStatus={registrationStatus} editRegistrationStatus={editStudentRegistrationStatus} context={props.context} goToNextPage={() => navigateToStage(STUDENT_REGISTRATION_STAGE.ADD_NON_SCA_STUDENTS)} goToPrevPage={async () => navigateToStage(STUDENT_REGISTRATION_STAGE.ADD_MEDICAL_CONDITIONS)} student={student} />
                    }
                    {
                        registrationStage === STUDENT_REGISTRATION_STAGE.ADD_NON_SCA_STUDENTS &&
                        <StudentNonScaStudentsForm registrationStatus={registrationStatus} editRegistrationStatus={editStudentRegistrationStatus} context={props.context} goToNextPage={() => navigateToStage(STUDENT_REGISTRATION_STAGE.ADD_REQUIRED_DOCS)} goToPrevPage={async () => navigateToStage(STUDENT_REGISTRATION_STAGE.ADD_OTHER_PARENTS)} student={student} />
                    }
                    {
                        registrationStage === STUDENT_REGISTRATION_STAGE.ADD_REQUIRED_DOCS &&
                        <StudentRequiredDocsForm context={props.context} registrationStatus={registrationStatus} editRegistrationStatus={editStudentRegistrationStatus} goToNextPage={() => navigateToStage(STUDENT_REGISTRATION_STAGE.OCCUPATIONAL_THERAPY_NEEDED)} goToPrevPage={async () => navigateToStage(STUDENT_REGISTRATION_STAGE.ADD_NON_SCA_STUDENTS)} student={student} />
                    }
                    {
                        registrationStage === STUDENT_REGISTRATION_STAGE.OCCUPATIONAL_THERAPY_NEEDED &&
                        <StudentOccupationalTherapyForm context={props.context} registrationStatus={registrationStatus} editRegistrationStatus={editStudentRegistrationStatus} goToNextPage={() => navigateToStage(STUDENT_REGISTRATION_STAGE.DIAGNOSTIC_TEST_NEEDED)} goToPrevPage={async () => navigateToStage(STUDENT_REGISTRATION_STAGE.ADD_REQUIRED_DOCS)} student={student} />
                    }
                    {
                        registrationStage === STUDENT_REGISTRATION_STAGE.DIAGNOSTIC_TEST_NEEDED &&
                        <StudentDiagnosticTestForm editRegistrationStatus={editStudentRegistrationStatus} context={props.context} registrationStatus={registrationStatus} goToNextPage={() => navigateToStage(STUDENT_REGISTRATION_STAGE.DIAGNOSTIC_TEST_NEEDED)} goToPrevPage={async () => navigateToStage(STUDENT_REGISTRATION_STAGE.OCCUPATIONAL_THERAPY_NEEDED)} student={student} />
                    }
                    {
                        registrationStage === STUDENT_REGISTRATION_STAGE.REJECTED &&
                        <div className="rounded border shadow m-1">
                            <ErrorOutline fontSize="large" color="error" className="mt-3" />
                            <h2 className="p-3">This application has been denied</h2>
                            <p className="p-2">This application will not be further considered for our school. If you feel this was an error, please contact the school with your grievances. We wish your children the best going forward.</p>
                        </div>
                    }
                    {
                        registrationStage === STUDENT_REGISTRATION_STAGE.APPROVED &&
                        <div className="rounded border shadow m-1">
                            <TaskAlt fontSize="large" color="success" className="mt-3" />
                            <h2 className="p-3">This student has been approved!</h2>
                            <p>Congratulations {student.firstName} {student.lastName}</p>
                        </div>
                    }
                </>
            }

        </div>
    );
}