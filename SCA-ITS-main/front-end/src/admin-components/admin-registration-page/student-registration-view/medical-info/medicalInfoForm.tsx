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

export const StudentMedicalInfoForm = (props: IProps) => {
    const [loading, setLoading] = useState(false);

    return (
        <div>
            <FormComponent
                title={`Medical Info`}
                id={props.student.studentNumber}
                data={
                    [
                        { key: "familyDoctor", name: "Family Doctor: ", value: props.student.familyDoctor, type: INPUT_TYPE.TEXT, },
                        { key: "doctorTelephone", name: "Doctor Telephone: ", value: props.student.doctorTelephone, type: INPUT_TYPE.TEXT, },
                        { key: "otherMedicalConditions", name: "Medical conditions not listed in the conditions form: ", value: props.student.otherMedicalConditions, type: INPUT_TYPE.TEXT_AREA, },
                        { key: "generalHearingTestDate", name: "General Hearing Test Date: ", value: props.student.generalHearingTestDate !== "" ? moment(props.student.generalHearingTestDate, "DD-MM-YYYY").format("YYYY-MM-DD") : "", type: INPUT_TYPE.DATE, required: true },
                        { key: "generalVisionTestDate", name: "General Vision Test Date: ", value: props.student.generalVisionTestDate !== "" ? moment(props.student.generalVisionTestDate, "DD-MM-YYYY").format("YYYY-MM-DD") : "", type: INPUT_TYPE.DATE, required: true },
                        { key: "tuberculosisTestDate", name: "Tuberculosis Test Date: ", value: props.student.tuberculosisTestDate !== "" ? moment(props.student.tuberculosisTestDate, "DD-MM-YYYY").format("YYYY-MM-DD") : "", type: INPUT_TYPE.DATE, required: true },
                        { key: "isShy", name: "Is Shy: ", value: props.student.isShy === 1 ? true : false, type: INPUT_TYPE.CHECK, required: false },
                        { key: "bitesFingerNails", name: "Bites Finger Nails: ", value: props.student.bitesFingerNails === 1 ? true : false, type: INPUT_TYPE.CHECK, required: false },
                        { key: "sucksThumb", name: "Sucks Thumb: ", value: props.student.sucksThumb === 1 ? true : false, type: INPUT_TYPE.CHECK, required: false },
                        { key: "hasExcessiveFears", name: "Has Excessive Fears: ", value: props.student.hasExcessiveFears === 1 ? true : false, type: INPUT_TYPE.CHECK, required: false },
                        { key: "likesSchool", name: "Likes School: ", value: props.student.likesSchool === 1 ? true : false, type: INPUT_TYPE.CHECK, required: false },
                        { key: "playsWellWithOthers", name: "Plays Well With Others: ", value: props.student.playsWellWithOthers === 1 ? true : false, type: INPUT_TYPE.CHECK, required: false },
                        { key: "eatsBreakfastRegularly", name: "Eats Breakfast Regularly: ", value: props.student.eatsBreakfastRegularly === 1 ? true : false, type: INPUT_TYPE.CHECK, required: false },
                        { key: "bedtime", name: "Bedtime: ", value: props.student.bedtime, type: INPUT_TYPE.TEXT, },
                        { key: "risingTime", name: "Rising Time: ", value: props.student.risingTime, type: INPUT_TYPE.TEXT_AREA, },
                        { key: "disabilityDueToDiseaseOrAccident", name: "Disability Due To Disease Or Accident: ", value: props.student.disabilityDueToDiseaseOrAccident, type: INPUT_TYPE.TEXT_AREA, required: false },
                        { key: "chronicMedication", name: "Chronic Medication: ", value: props.student.chronicMedication, type: INPUT_TYPE.TEXT_AREA, required: false },
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
            <StudentRejectButton context={props.context} editRegistrationStatus={props.editRegistrationStatus} student={props.student} type={STUDENT_REGISTRATION_STAGE.ADD_MEDICAL_DETAILS} />
        </div>
    );
}