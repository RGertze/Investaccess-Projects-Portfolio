import moment from "moment";
import { useState } from "react";
import { Connection, POST_ENDPOINT } from "../../../../connection";
import { IGlobalContext, IResponse } from "../../../../interfaces/general_interfaces";
import { STUDENT_REGISTRATION_STAGE } from "../../../../interfaces/registration_interfaces";
import { IStudent } from "../../../../interfaces/student_interfaces";
import { INPUT_TYPE } from "../../../../shared-components/add-edit-component-V2/AddEditComponentV2";
import { errorToast, successToast } from "../../../../shared-components/alert-components/toasts";
import FormComponent from "../../../../shared-components/form-component/formComponent";
import { StudentRejectButton } from "../reject-button/rejectButton";

interface IProps {
    context: IGlobalContext,
    student: IStudent,

    goToPrevPage(): Promise<void>,
    goToNextPage(): Promise<void>,

    editRegistrationStatus(data: any): Promise<boolean>
}

export const StudentReligiousInfoForm = (props: IProps) => {
    const [loading, setLoading] = useState(false);

    return (
        <div>
            <FormComponent
                title={`Religious Info`}
                id={props.student.studentNumber}
                data={
                    [
                        { key: "currentChurch", name: "Current Church: ", value: props.student.currentChurch, type: INPUT_TYPE.TEXT, },
                        { key: "currentChurchAddress", name: "Current ChurchAddress: ", value: props.student.currentChurchAddress, type: INPUT_TYPE.TEXT, },
                        { key: "pastor", name: "Pastor: ", value: props.student.pastor, type: INPUT_TYPE.TEXT, },
                        { key: "pastorTelephone", name: "Pastor Telephone: ", value: props.student.pastorTelephone, type: INPUT_TYPE.TEXT, },
                        { key: "fatherConfirmationDate", name: "Father Confirmation Date (Leave open if not Christian): ", value: props.student.fatherConfirmationDate !== "" ? moment(props.student.fatherConfirmationDate, "DD-MM-YYYY").format("YYYY-MM-DD") : "", type: INPUT_TYPE.DATE, required: false },
                        { key: "motherConfirmationDate", name: "Mother Confirmation Date (Leave open if not Christian): ", value: props.student.motherConfirmationDate !== "" ? moment(props.student.motherConfirmationDate, "DD-MM-YYYY").format("YYYY-MM-DD") : "", type: INPUT_TYPE.DATE, required: false },
                        { key: "baptismDate", name: "Baptism Date (Leave open if not baptised): ", value: props.student.baptismDate !== "" ? moment(props.student.baptismDate, "DD-MM-YYYY").format("YYYY-MM-DD") : "", type: INPUT_TYPE.DATE, required: false },
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
            <StudentRejectButton context={props.context} editRegistrationStatus={props.editRegistrationStatus} student={props.student} type={STUDENT_REGISTRATION_STAGE.ADD_RELIGIOUS_INFO} />
        </div>
    );
}