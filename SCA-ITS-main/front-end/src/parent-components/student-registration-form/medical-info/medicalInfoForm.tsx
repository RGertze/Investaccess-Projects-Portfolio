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

export const StudentMedicalInfoForm = (props: IProps) => {
    const [loading, setLoading] = useState(false);

    //----   EDIT STUDENT   ----
    const editStudent = async (data: IStudent): Promise<boolean> => {
        data.studentNumber = props.student.studentNumber;
        data.registrationStage = STUDENT_REGISTRATION_STAGE.ADD_MEDICAL_CONDITIONS;
        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.EDIT_STUDENT, data, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }
        successToast("Info Saved!", true, 1500);
        props.editRegistrationStatus({
            medicalInfoAdded: 1,
            medicalRejectionMessage: ""
        });
        props.goToNextPage();
        return true;
    }

    return (
        <div>
            {
                props.registrationStatus.medicalRejectionMessage !== null && props.registrationStatus.medicalRejectionMessage !== "" &&
                <AlertComponent title="The Admin has Rejected the info on this page with the following reason: " type="danger" content={props.registrationStatus.medicalRejectionMessage} footer="Please fix the above mentioned issues if possible." />
            }
            <FormComponent
                title={`Medical Info`}
                id={props.student.studentNumber}
                data={
                    [
                        { key: "familyDoctor", name: "Family Doctor: ", value: props.student.familyDoctor, type: INPUT_TYPE.TEXT, },
                        { key: "doctorTelephone", name: "Doctor Telephone: ", value: props.student.doctorTelephone, type: INPUT_TYPE.TEXT, },
                        { key: "otherMedicalConditions", name: "Medical conditions not listed in the conditions form: ", value: props.student.otherMedicalConditions, type: INPUT_TYPE.TEXT_AREA, },
                        { key: "generalHearingTestDate", name: "General Hearing Test Date: ", value: props.student.generalHearingTestDate !== "" ? moment(props.student.generalHearingTestDate, "DD-MM-YYYY").format("YYYY-MM-DD") : "", type: INPUT_TYPE.DATE, required: false },
                        { key: "generalVisionTestDate", name: "General Vision Test Date: ", value: props.student.generalVisionTestDate !== "" ? moment(props.student.generalVisionTestDate, "DD-MM-YYYY").format("YYYY-MM-DD") : "", type: INPUT_TYPE.DATE, required: false },
                        { key: "tuberculosisTestDate", name: "Tuberculosis Test Date: ", value: props.student.tuberculosisTestDate !== "" ? moment(props.student.tuberculosisTestDate, "DD-MM-YYYY").format("YYYY-MM-DD") : "", type: INPUT_TYPE.DATE, required: false },
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

                    // convert boolean values to number
                    for (let key of Object.keys(data)) {
                        if (typeof data[key] === "boolean") {
                            data[key] = data[key] ? 1 : 0;
                        }
                    }

                    return editStudent(data);
                }}

                backButtonText="Previous"
                backButtonType="primary"
                onBackClick={props.goToPrevPage}

                saveButtonText="Save and Next"
            />
        </div>
    );
}