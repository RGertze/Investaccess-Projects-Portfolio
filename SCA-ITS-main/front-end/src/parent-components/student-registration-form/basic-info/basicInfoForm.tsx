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

export const StudentBasicInfoForm = (props: IProps) => {
    const [loading, setLoading] = useState(false);

    //----   EDIT STUDENT   ----
    const editStudent = async (data: IStudent): Promise<boolean> => {
        data.studentNumber = props.student.studentNumber;
        data.registrationStage = STUDENT_REGISTRATION_STAGE.ADD_GENERAL_INFO;
        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.EDIT_STUDENT, data, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }
        successToast("Info Saved!", true, 1500);
        props.editRegistrationStatus({
            basicDetailsAdded: 1,
            basicRejectionMessage: ""
        });
        props.goToNextPage();
        return true;
    }

    return (
        <div>
            {
                props.registrationStatus.basicRejectionMessage !== null && props.registrationStatus.basicRejectionMessage !== "" &&
                <AlertComponent title="The Admin has Rejected the info on this page with the following reason: " type="danger" content={props.registrationStatus.basicRejectionMessage} footer="Please fix the above mentioned issues if possible." />
            }

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

                onEdit={editStudent}

                backButtonText="Previous"
                backButtonType="primary"
                onBackClick={props.goToPrevPage}

                saveButtonText="Save and Next"
            />
        </div>
    );
}