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

export const StudentGeneralInfoForm = (props: IProps) => {
    const [loading, setLoading] = useState(false);

    return (
        <div>
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
            <StudentRejectButton context={props.context} editRegistrationStatus={props.editRegistrationStatus} student={props.student} type={STUDENT_REGISTRATION_STAGE.ADD_GENERAL_INFO} />
        </div>
    );
}