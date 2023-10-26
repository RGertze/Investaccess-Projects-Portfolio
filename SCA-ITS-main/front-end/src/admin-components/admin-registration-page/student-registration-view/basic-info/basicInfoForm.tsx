import moment from "moment";
import { useState } from "react";
import { Button, FormGroup } from "react-bootstrap";
import { IGlobalContext } from "../../../../interfaces/general_interfaces";
import { STUDENT_REGISTRATION_STAGE } from "../../../../interfaces/registration_interfaces";
import { IStudent } from "../../../../interfaces/student_interfaces";
import { INPUT_TYPE } from "../../../../shared-components/add-edit-component-V2/AddEditComponentV2";
import { confirmWithReason, errorToast } from "../../../../shared-components/alert-components/toasts";
import FormComponent from "../../../../shared-components/form-component/formComponent";
import { StudentRejectButton } from "../reject-button/rejectButton";

interface IProps {
    context: IGlobalContext,
    student: IStudent,

    goToPrevPage(): Promise<void>,
    goToNextPage(): Promise<void>,

    editRegistrationStatus(data: any): Promise<boolean>
}

export const StudentBasicInfoForm = (props: IProps) => {
    const [loading, setLoading] = useState(false);

    return (
        <div>
            <FormComponent
                title={`Basic Info`}
                id={props.student.studentNumber}
                data={
                    [
                        { key: "_", name: "Student Number: ", value: props.student.studentNumber, disabled: true, type: INPUT_TYPE.TEXT, },
                        { key: "firstName", name: "First Name: ", value: props.student.firstName, type: INPUT_TYPE.TEXT, },
                        { key: "lastName", name: "Last Name: ", value: props.student.lastName, type: INPUT_TYPE.TEXT, },
                        { key: "dob", name: "Date of Birth: ", value: moment(props.student.dob, "DD-MM-YYYY").format("YYYY-MM-DD"), type: INPUT_TYPE.DATE, },
                        { key: "grade", name: "Grade: ", value: props.student.grade, type: INPUT_TYPE.NUMBER, },
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

            <StudentRejectButton context={props.context} editRegistrationStatus={props.editRegistrationStatus} student={props.student} type={STUDENT_REGISTRATION_STAGE.ADD_BASIC_DETAILS} />
        </div>
    );
}