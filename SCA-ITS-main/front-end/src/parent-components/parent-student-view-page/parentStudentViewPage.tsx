import moment from 'moment';
import { useEffect, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { Connection, GET_ENDPOINT, POST_ENDPOINT } from '../../connection';
import { IGlobalContext, IResponse } from '../../interfaces/general_interfaces';
import { REG_REQ_TYPE, STUDENT_REGISTRATION_STAGE } from '../../interfaces/registration_interfaces';
import { IStudent } from '../../interfaces/student_interfaces';
import { INPUT_TYPE } from '../../shared-components/add-edit-component-V2/AddEditComponentV2';
import { errorToast, successToast } from '../../shared-components/alert-components/toasts';
import EditableTable from '../../shared-components/editable-component/editableComponent';
import Loading from '../../shared-components/loading-component/loading';
import NonScaSiblingsComponent from '../../shared-components/non-sca-siblings-component/nonScaSiblingsComponent';
import { RegistrationDocsAccordian } from '../../shared-components/registration-docs-accordian/registrationDocsAccordian';
import StudentCoursesComponent from '../../shared-components/student-courses-component/studentCoursesComponent';
import StudentMedicalConditionsComponent from '../../shared-components/student-medical-conditions-component.tsx/studentMedicalConditionsComponent';
import StudentOtherParentsComponent from '../../shared-components/student-other-parents-component/studentOtherParentsComponent';
import StudentReportsComponent from '../../shared-components/student-reports-component/studentReportsComponent';
import { StudentRegistrationForm } from '../student-registration-form/studentRegistrationForm';
import "./parentStudentViewPage.css";



interface IProps {
    context: IGlobalContext
}

const ParentStudentViewPage = (props: IProps) => {

    const params = useLocation();
    const studentNumber = (params.state as string);

    // TAB VARIABLES
    const [tabKey, setTabKey] = useState('registration');

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
        if (tabKey === "registration") {

        }
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

    //----   EDIT STUDENT   ----
    const editStudent = async (data: IStudent): Promise<boolean> => {
        data.studentNumber = student.studentNumber;
        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.EDIT_STUDENT, data, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }
        successToast("Student updated", true, 1500);
        getStudentDetails();
        return true;
    }

    return (
        <div className="full-size main-content">
            {
                loading &&
                <Loading color='blue' />
            }
            {
                student.registrationStage !== STUDENT_REGISTRATION_STAGE.APPROVED && !loading && student.studentNumber !== "" &&
                <>
                    <StudentRegistrationForm context={props.context} studentNumber={studentNumber} />
                </>
            }
            {
                student.registrationStage === STUDENT_REGISTRATION_STAGE.APPROVED && !loading &&
                <>
                    <div className='rounded student-details'>
                        <EditableTable
                            title={`Student view`}
                            id={student.studentNumber}
                            data={
                                [
                                    { key: "_", name: "Student Number: ", value: student.studentNumber, disabled: true, type: INPUT_TYPE.TEXT, },
                                    { key: "firstName", name: "First Name: ", value: student.firstName, type: INPUT_TYPE.TEXT, },
                                    { key: "lastName", name: "Last Name: ", value: student.lastName, type: INPUT_TYPE.TEXT, },
                                    { key: "dob", name: "Date of Birth: ", value: moment(student.dob, "DD-MM-YYYY").format("YYYY-MM-DD"), type: INPUT_TYPE.DATE, },
                                    { key: "grade", name: "Grade: ", value: student.grade, type: INPUT_TYPE.NUMBER, },
                                ]
                            }
                            loading={loading}
                            onEdit={editStudent}
                        />
                    </div>

                    {
                        // TABS
                        <Tabs activeKey={tabKey} onSelect={(e) => setTabKey(e ? e : "registration")}>
                            <Tab className="registration-tab" eventKey="registration" title="Registration Documents">
                                <div className='mt-3'>
                                    <RegistrationDocsAccordian context={props.context} type={REG_REQ_TYPE.STUDENT} userIdOrStudentNumber={studentNumber} editable={true} />
                                </div>
                            </Tab>
                            <Tab className="general-info-tab" eventKey="general-info" title="General Info">
                                <EditableTable
                                    title={`General Info`}
                                    id={student.studentNumber}
                                    data={
                                        [
                                            { key: "age", name: "Age: ", value: student.age, type: INPUT_TYPE.NUMBER, },
                                            {
                                                key: "gender", name: "Gender: ", value: student.gender, type: INPUT_TYPE.SELECT,
                                                selectValues: [{ name: "Male", value: 1 }, { name: "Female", value: 2 }, { name: "Other", value: 3 }]
                                            },
                                            { key: "citizenship", name: "Citizenship: ", value: student.citizenship, type: INPUT_TYPE.TEXT, },
                                            { key: "studyPermit", name: "Study Permit: ", value: student.studyPermit, type: INPUT_TYPE.TEXT, },
                                            { key: "homeLanguage", name: "Home Language: ", value: student.homeLanguage, type: INPUT_TYPE.TEXT, },
                                            { key: "postalAddress", name: "Postal Address: ", value: student.postalAddress, type: INPUT_TYPE.TEXT, },
                                            { key: "residentialAddress", name: "Residential Address: ", value: student.residentialAddress, type: INPUT_TYPE.TEXT, },
                                            { key: "telephoneHome", name: "Telephone Home: ", value: student.telephoneHome, type: INPUT_TYPE.TEXT, },
                                            { key: "telephoneOther", name: "Telephone Other: ", value: student.telephoneOther, type: INPUT_TYPE.TEXT, },
                                        ]
                                    }
                                    loading={loading}
                                    onEdit={editStudent}
                                />
                            </Tab>
                            <Tab className="religious-info-tab" eventKey="religious-info" title="Religious Info">
                                <EditableTable
                                    title={`Religious Info`}
                                    id={student.studentNumber}
                                    data={
                                        [
                                            { key: "currentChurch", name: "Current Church: ", value: student.currentChurch, type: INPUT_TYPE.TEXT, },
                                            { key: "currentChurchAddress", name: "Current ChurchAddress: ", value: student.currentChurchAddress, type: INPUT_TYPE.TEXT, },
                                            { key: "pastor", name: "Pastor: ", value: student.pastor, type: INPUT_TYPE.TEXT, },
                                            { key: "pastorTelephone", name: "Pastor Telephone: ", value: student.pastorTelephone, type: INPUT_TYPE.TEXT, },
                                            { key: "fatherConfirmationDate", name: "Father Confirmation Date (Leave open if not Christian): ", value: student.fatherConfirmationDate !== "" ? moment(student.fatherConfirmationDate, "DD-MM-YYYY").format("YYYY-MM-DD") : "", type: INPUT_TYPE.DATE, required: false },
                                            { key: "motherConfirmationDate", name: "Mother Confirmation Date (Leave open if not Christian): ", value: student.motherConfirmationDate !== "" ? moment(student.motherConfirmationDate, "DD-MM-YYYY").format("YYYY-MM-DD") : "", type: INPUT_TYPE.DATE, required: false },
                                            { key: "baptismDate", name: "Baptism Date (Leave open if not baptised): ", value: student.baptismDate !== "" ? moment(student.baptismDate, "DD-MM-YYYY").format("YYYY-MM-DD") : "", type: INPUT_TYPE.DATE, required: false },
                                        ]
                                    }
                                    loading={loading}
                                    onEdit={editStudent}
                                />
                            </Tab>
                            <Tab className="scholastic-info-tab" eventKey="scholastic-info" title="Scholastic Info">
                                <EditableTable
                                    title={`Scholastic Info`}
                                    id={student.studentNumber}
                                    data={
                                        [
                                            { key: "currentGrade", name: "Current Grade: ", value: student.currentGrade, type: INPUT_TYPE.NUMBER, },
                                            { key: "lastSchoolAttended", name: "Last School Attended: ", value: student.lastSchoolAttended, type: INPUT_TYPE.TEXT, },
                                            { key: "nameOfPrincipal", name: "Name Of Principal: ", value: student.nameOfPrincipal, type: INPUT_TYPE.TEXT, },
                                            { key: "schoolAddress", name: "School Address: ", value: student.schoolAddress, type: INPUT_TYPE.TEXT, },
                                            { key: "studentsStrengths", name: "Students Strengths: ", value: student.studentsStrengths, type: INPUT_TYPE.TEXT_AREA, },
                                            { key: "talentsAndInterests", name: "Talents And Interests: ", value: student.talentsAndInterests, type: INPUT_TYPE.TEXT_AREA, },
                                            { key: "learningDifficulties", name: "Learning Difficulties: ", value: student.learningDifficulties, type: INPUT_TYPE.TEXT_AREA, },
                                            { key: "disiplinaryDifficulties", name: "Disiplinary Difficulties: ", value: student.disiplinaryDifficulties, type: INPUT_TYPE.TEXT_AREA, },
                                            { key: "legalDifficulties", name: "Legal Difficulties: ", value: student.legalDifficulties, type: INPUT_TYPE.TEXT_AREA, },
                                            {
                                                key: "academicLevel", name: "Academic Level: ", value: student.academicLevel, type: INPUT_TYPE.SELECT,
                                                selectValues: [{ name: "Excellent", value: "Excellent" }, { name: "Good", value: "Good" }, { name: "Average", value: "Average" }, { name: "Poor", value: "Poor" }]
                                            },
                                            { key: "academicFailureAssessment", name: "Academic Failure Assessment: ", value: student.academicFailureAssessment, type: INPUT_TYPE.TEXT_AREA, },
                                        ]
                                    }
                                    loading={loading}
                                    onEdit={editStudent}
                                />
                            </Tab>
                            <Tab className="medical-info-tab" eventKey="medical-info" title="Medical Info">
                                <EditableTable
                                    title={`Medical Info`}
                                    id={student.studentNumber}
                                    data={
                                        [
                                            { key: "familyDoctor", name: "Family Doctor: ", value: student.familyDoctor, type: INPUT_TYPE.TEXT, },
                                            { key: "doctorTelephone", name: "Doctor Telephone: ", value: student.doctorTelephone, type: INPUT_TYPE.TEXT, },
                                            { key: "otherMedicalConditions", name: "Medical conditions not listed in the conditions form: ", value: student.otherMedicalConditions, type: INPUT_TYPE.TEXT_AREA, },
                                            { key: "generalHearingTestDate", name: "General Hearing Test Date: ", value: student.generalHearingTestDate !== "" ? moment(student.generalHearingTestDate, "DD-MM-YYYY").format("YYYY-MM-DD") : "", type: INPUT_TYPE.DATE, required: false },
                                            { key: "generalVisionTestDate", name: "General Vision Test Date: ", value: student.generalVisionTestDate !== "" ? moment(student.generalVisionTestDate, "DD-MM-YYYY").format("YYYY-MM-DD") : "", type: INPUT_TYPE.DATE, required: false },
                                            { key: "tuberculosisTestDate", name: "Tuberculosis Test Date: ", value: student.tuberculosisTestDate !== "" ? moment(student.tuberculosisTestDate, "DD-MM-YYYY").format("YYYY-MM-DD") : "", type: INPUT_TYPE.DATE, required: false },
                                            { key: "isShy", name: "Is Shy: ", value: student.isShy === 1 ? true : false, type: INPUT_TYPE.CHECK, required: false },
                                            { key: "bitesFingerNails", name: "Bites Finger Nails: ", value: student.bitesFingerNails === 1 ? true : false, type: INPUT_TYPE.CHECK, required: false },
                                            { key: "sucksThumb", name: "Sucks Thumb: ", value: student.sucksThumb === 1 ? true : false, type: INPUT_TYPE.CHECK, required: false },
                                            { key: "hasExcessiveFears", name: "Has Excessive Fears: ", value: student.hasExcessiveFears === 1 ? true : false, type: INPUT_TYPE.CHECK, required: false },
                                            { key: "likesSchool", name: "Likes School: ", value: student.likesSchool === 1 ? true : false, type: INPUT_TYPE.CHECK, required: false },
                                            { key: "playsWellWithOthers", name: "Plays Well With Others: ", value: student.playsWellWithOthers === 1 ? true : false, type: INPUT_TYPE.CHECK, required: false },
                                            { key: "eatsBreakfastRegularly", name: "Eats Breakfast Regularly: ", value: student.eatsBreakfastRegularly === 1 ? true : false, type: INPUT_TYPE.CHECK, required: false },
                                            { key: "bedtime", name: "Bedtime: ", value: student.bedtime, type: INPUT_TYPE.TEXT, },
                                            { key: "risingTime", name: "Rising Time: ", value: student.risingTime, type: INPUT_TYPE.TEXT_AREA, },
                                            { key: "disabilityDueToDiseaseOrAccident", name: "Disability Due To Disease Or Accident: ", value: student.disabilityDueToDiseaseOrAccident, type: INPUT_TYPE.TEXT_AREA, required: false },
                                            { key: "chronicMedication", name: "Chronic Medication: ", value: student.chronicMedication, type: INPUT_TYPE.TEXT_AREA, required: false },
                                        ]
                                    }
                                    loading={loading}
                                    onEdit={async (data) => {

                                        // convert boolean values to number
                                        for (let key of Object.keys(data)) {
                                            if (typeof data[key] === "boolean") {
                                                data[key] = data[key] ? 1 : 0;
                                            }
                                        }

                                        return editStudent(data);
                                    }}
                                />
                            </Tab>
                            <Tab className="medical-conditions-tab" eventKey="medical-conditions" title="Medical Conditions">
                                <StudentMedicalConditionsComponent context={props.context} studentNumber={studentNumber} />
                            </Tab>
                            <Tab className="other-parents-tab" eventKey="other-parents-siblings" title="Other Parents/Guardians">
                                {
                                    student.parentId !== 0 &&
                                    <StudentOtherParentsComponent context={props.context} studentNumber={studentNumber} parentId={student.parentId} />
                                }
                                {
                                    student.parentId === 0 &&
                                    <Loading />
                                }
                            </Tab>
                            <Tab className="non-sca-siblings-tab" eventKey="non-sca-siblings" title="Non SCA Siblings">
                                <NonScaSiblingsComponent context={props.context} studentNumber={studentNumber} />
                            </Tab>
                            <Tab className="courses" eventKey="courses" title="Courses">
                                <StudentCoursesComponent context={props.context} studentNumber={studentNumber} />
                            </Tab>
                            {/* <Tab className="progress-reports-tab" eventKey="progress-reports" title="Progress Reports"></Tab> */}
                            <Tab eventKey="reports-tab" title="Reports">
                                <StudentReportsComponent context={props.context} studentNumber={studentNumber} />
                            </Tab>
                        </Tabs>
                    }
                </>
            }
        </div>
    );
}

export default ParentStudentViewPage;