import moment from "moment";
import { useState } from "react";
import { Connection, POST_ENDPOINT } from "../../../connection";
import { IGlobalContext, IResponse } from "../../../interfaces/general_interfaces";
import { IParentProfile } from "../../../interfaces/parent_interfaces";
import { IParentRegistrationStatus, IStudentRegistrationStatus, PARENT_REGISTRATION_STAGE, STUDENT_REGISTRATION_STAGE } from "../../../interfaces/registration_interfaces";
import { IStudent } from "../../../interfaces/student_interfaces";
import { INPUT_TYPE } from "../../../shared-components/add-edit-component-V2/AddEditComponentV2";
import { AlertComponent } from "../../../shared-components/alert-component/alertComponent";
import { errorToast, successToast } from "../../../shared-components/alert-components/toasts";
import FormComponent from "../../../shared-components/form-component/formComponent";

interface IProps {
    context: IGlobalContext,
    parent: IParentProfile,
    registrationStatus: IParentRegistrationStatus,

    goToPrevPage(): Promise<void>,
    goToNextPage(): Promise<void>,

    editRegistrationStatus(data: any): Promise<boolean>
}

export const ParentProfileDetailsForm = (props: IProps) => {
    const [loading, setLoading] = useState(false);

    //----   EDIT PARENT PROFILE   ----
    const editProfile = async (data: IParentProfile): Promise<boolean> => {
        data.userId = props.parent.userId;
        data.registrationStage = PARENT_REGISTRATION_STAGE.ADD_OTHER_PARENTS;
        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.EDIT_PARENT_PROFILE, data, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }
        successToast("Info Saved!", true, 1500);
        props.editRegistrationStatus({
            detailsAdded: 1,
            detailsRejectionMessage: ""
        });
        props.goToNextPage();
        return true;
    }

    return (
        <div>
            {
                props.registrationStatus.detailsRejectionMessage !== null && props.registrationStatus.detailsRejectionMessage !== "" &&
                <AlertComponent title="The Admin has Rejected the info on this page with the following reason: " type="danger" content={props.registrationStatus.detailsRejectionMessage} footer="Please fix the above mentioned issues if possible." />
            }

            <FormComponent
                title={`Profile Details`}
                id={props.parent.userId}
                data={
                    [
                        { key: "idNumber", name: "ID Number: ", value: props.parent.idNumber, type: INPUT_TYPE.TEXT },
                        { key: "employer", name: "Employer: ", value: props.parent.employer, type: INPUT_TYPE.TEXT },
                        { key: "occupation", name: "Occupation: ", value: props.parent.occupation, type: INPUT_TYPE.TEXT },
                        { key: "monthlyIncome", name: "Annual Budget: ", value: props.parent.monthlyIncome, type: INPUT_TYPE.NUMBER },
                        { key: "workingHours", name: "Working Hours: ", value: props.parent.workingHours, type: INPUT_TYPE.TEXT },
                        { key: "specialistSkillsHobbies", name: "Specialist Skills/Hobbies: ", value: props.parent.specialistSkillsHobbies, type: INPUT_TYPE.TEXT },
                        { key: "telephoneWork", name: "Telephone (Work): ", value: props.parent.telephoneWork, type: INPUT_TYPE.TEXT },
                        { key: "telephoneHome", name: "Telephone (Home): ", value: props.parent.telephoneHome, type: INPUT_TYPE.TEXT },
                        { key: "fax", name: "Fax: ", value: props.parent.fax, type: INPUT_TYPE.TEXT },
                        { key: "cellNumber", name: "Cell Number: ", value: props.parent.cellNumber, type: INPUT_TYPE.TEXT },
                        { key: "postalAddress", name: "Postal Address: ", value: props.parent.postalAddress, type: INPUT_TYPE.TEXT },
                        { key: "residentialAddress", name: "Residential Address: ", value: props.parent.residentialAddress, type: INPUT_TYPE.TEXT },
                        {
                            key: "maritalStatus", name: "Marital Status: ", value: props.parent.maritalStatus, type: INPUT_TYPE.SELECT,
                            selectValues: [
                                { name: "Married", value: "Married" },
                                { name: "Widowed", value: "Widowed" },
                                { name: "Separated", value: "Separated" },
                                { name: "Divorced", value: "Divorced" },
                                { name: "Single", value: "Single" },
                            ]
                        },
                    ]
                }
                loading={loading}

                onEdit={editProfile}

                backButtonText="Previous"
                backButtonType="primary"
                onBackClick={props.goToPrevPage}

                saveButtonText="Save and Next"
            />
        </div>
    );
}