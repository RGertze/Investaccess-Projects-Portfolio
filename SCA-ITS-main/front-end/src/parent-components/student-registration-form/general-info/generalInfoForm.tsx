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

export const StudentGeneralInfoForm = (props: IProps) => {
    const [loading, setLoading] = useState(false);

    //----   EDIT STUDENT   ----
    const editStudent = async (data: IStudent): Promise<boolean> => {
        data.studentNumber = props.student.studentNumber;
        data.registrationStage = STUDENT_REGISTRATION_STAGE.ADD_RELIGIOUS_INFO;
        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.EDIT_STUDENT, data, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }
        successToast("Info Saved!", true, 1500);
        props.editRegistrationStatus({
            generalInfoAdded: 1,
            generalRejectionMessage: ""
        });
        props.goToNextPage();
        return true;
    }

    return (
        <div>
            {
                props.registrationStatus.generalRejectionMessage !== null && props.registrationStatus.generalRejectionMessage !== "" &&
                <AlertComponent title="The Admin has Rejected the info on this page with the following reason: " type="danger" content={props.registrationStatus.generalRejectionMessage} footer="Please fix the above mentioned issues if possible." />
            }
            <FormComponent
                title={`General Info`}
                id={props.student.studentNumber}
                data={
                    [
                        { key: "age", name: "Age: ", value: props.student.age, type: INPUT_TYPE.NUMBER, },
                        {
                            key: "gender", name: "Gender: ", value: props.student.gender, type: INPUT_TYPE.SELECT,
                            selectValues: [{ name: "Male", value: 1 }, { name: "Female", value: 2 }, { name: "Other", value: 3 }]
                        },
                        { key: "citizenship", name: "Citizenship: ", value: props.student.citizenship, type: INPUT_TYPE.TEXT, },
                        { key: "studyPermit", name: "Study Permit: ", value: props.student.studyPermit, type: INPUT_TYPE.TEXT, },
                        { key: "homeLanguage", name: "Home Language: ", value: props.student.homeLanguage, type: INPUT_TYPE.TEXT, },
                        { key: "postalAddress", name: "Postal Address: ", value: props.student.postalAddress, type: INPUT_TYPE.TEXT, },
                        { key: "residentialAddress", name: "Residential Address: ", value: props.student.residentialAddress, type: INPUT_TYPE.TEXT, },
                        { key: "telephoneHome", name: "Telephone Home: ", value: props.student.telephoneHome, type: INPUT_TYPE.TEXT, },
                        { key: "telephoneOther", name: "Telephone Other: ", value: props.student.telephoneOther, type: INPUT_TYPE.TEXT, },
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