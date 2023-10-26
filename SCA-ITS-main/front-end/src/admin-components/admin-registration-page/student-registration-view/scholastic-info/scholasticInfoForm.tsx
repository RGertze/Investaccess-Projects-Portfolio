import moment from "moment";
import { useState } from "react";
import { IGlobalContext } from "../../../../interfaces/general_interfaces";
import { STUDENT_REGISTRATION_STAGE } from "../../../../interfaces/registration_interfaces";
import { IStudent } from "../../../../interfaces/student_interfaces";
import { INPUT_TYPE } from "../../../../shared-components/add-edit-component-V2/AddEditComponentV2";
import FormComponent from "../../../../shared-components/form-component/formComponent";
import { StudentRejectButton } from "../reject-button/rejectButton";

interface IProps {
    context: IGlobalContext,
    student: IStudent,

    goToPrevPage(): Promise<void>,
    goToNextPage(): Promise<void>,

    editRegistrationStatus(data: any): Promise<boolean>
}

export const StudentScholasticInfoForm = (props: IProps) => {
    const [loading, setLoading] = useState(false);

    return (
        <div>
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

                onEdit={async (data) => {
                    props.goToNextPage();
                    return true;
                }}

                backButtonText="Previous"
                backButtonType="primary"
                onBackClick={props.goToPrevPage}

                saveButtonText="Next"
                editable={false}
            />
            <StudentRejectButton context={props.context} editRegistrationStatus={props.editRegistrationStatus} student={props.student} type={STUDENT_REGISTRATION_STAGE.ADD_SCHOLASTIC_INFO} />
        </div>
    );
}