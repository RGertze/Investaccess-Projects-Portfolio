import moment from "moment";
import { useState } from "react";
import { Connection, POST_ENDPOINT } from "../../../connection";
import { IGlobalContext, IResponse } from "../../../interfaces/general_interfaces";
import { IStudentRegistrationStatus, STUDENT_REGISTRATION_STAGE } from "../../../interfaces/registration_interfaces";
import { IStudent } from "../../../interfaces/student_interfaces";
import { INPUT_TYPE } from "../../../shared-components/add-edit-component-V2/AddEditComponentV2";
import { AlertComponent } from "../../../shared-components/alert-component/alertComponent";
import { errorToast, successToast } from "../../../shared-components/alert-components/toasts";
import FormComponent from "../../../shared-components/form-component/formComponent";

interface IProps {
    context: IGlobalContext,
    student: IStudent,
    registrationStatus: IStudentRegistrationStatus,

    goToPrevPage(): Promise<void>,
    goToNextPage(): Promise<void>,

    editRegistrationStatus(data: any): Promise<boolean>
}

export const StudentScholasticInfoForm = (props: IProps) => {
    const [loading, setLoading] = useState(false);

    //----   EDIT STUDENT   ----
    const editStudent = async (data: IStudent): Promise<boolean> => {
        data.studentNumber = props.student.studentNumber;
        data.registrationStage = STUDENT_REGISTRATION_STAGE.ADD_MEDICAL_DETAILS;
        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.EDIT_STUDENT, data, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }
        successToast("Info Saved!", true, 1500);
        props.editRegistrationStatus({
            scholasticInfoAdded: 1,
            scholasticRejectionMessage: ""
        });
        props.goToNextPage();
        return true;
    }

    return (
        <div>
            {
                props.registrationStatus.scholasticRejectionMessage !== null && props.registrationStatus.scholasticRejectionMessage !== "" &&
                <AlertComponent title="The Admin has Rejected the info on this page with the following reason: " type="danger" content={props.registrationStatus.scholasticRejectionMessage} footer="Please fix the above mentioned issues if possible." />
            }
            <FormComponent
                title={`Scholastic Info`}
                id={props.student.studentNumber}
                data={
                    [
                        { key: "currentGrade", name: "Current Grade: ", value: props.student.currentGrade, type: INPUT_TYPE.NUMBER, },
                        { key: "lastSchoolAttended", name: "Last School Attended: ", value: props.student.lastSchoolAttended, type: INPUT_TYPE.TEXT, },
                        { key: "nameOfPrincipal", name: "Name Of Principal: ", value: props.student.nameOfPrincipal, type: INPUT_TYPE.TEXT, },
                        { key: "schoolAddress", name: "School Address: ", value: props.student.schoolAddress, type: INPUT_TYPE.TEXT, },
                        { key: "studentsStrengths", name: "Student's Strengths: ", value: props.student.studentsStrengths, type: INPUT_TYPE.TEXT_AREA, },
                        { key: "talentsAndInterests", name: "Talents And Interests: ", value: props.student.talentsAndInterests, type: INPUT_TYPE.TEXT_AREA, },
                        { key: "learningDifficulties", name: "Learning Difficulties: ", value: props.student.learningDifficulties, type: INPUT_TYPE.TEXT_AREA, },
                        { key: "disiplinaryDifficulties", name: "Disiplinary Difficulties: ", value: props.student.disiplinaryDifficulties, type: INPUT_TYPE.TEXT_AREA, },
                        { key: "legalDifficulties", name: "Legal Difficulties: ", value: props.student.legalDifficulties, type: INPUT_TYPE.TEXT_AREA, },
                        {
                            key: "academicLevel", name: "Academic Level: ", value: props.student.academicLevel, type: INPUT_TYPE.SELECT,
                            selectValues: [{ name: "Excellent", value: "Excellent" }, { name: "Good", value: "Good" }, { name: "Average", value: "Average" }, { name: "Poor", value: "Poor" }]
                        },
                        { key: "academicFailureAssessment", name: "Academic Failure Assessment: ", value: props.student.academicFailureAssessment, type: INPUT_TYPE.TEXT_AREA, },
                    ]
                }
                loading={loading}

                onEdit={editStudent}

                backButtonText="Previous"
                backButtonType="primary"
                onBackClick={props.goToPrevPage}

                saveButtonText="Save and Next"
            />
        </div>
    );
}