import { useEffect, useState } from "react";
import { Connection, GET_ENDPOINT, POST_ENDPOINT } from "../../../connection";
import { IGlobalContext, IResponse } from "../../../interfaces/general_interfaces";
import { IMedicalCondition, IStudentMedicalCondition } from "../../../interfaces/medical-conditions";
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

export const StudentMedicalConditionsForm = (props: IProps) => {
    const [loading, setLoading] = useState(false);

    const [medicalConditions, setMedicalConditions] = useState<IMedicalCondition[]>([]);
    const [studentMedicalConditions, setStudentMedicalConditions] = useState<IStudentMedicalCondition[]>([]);
    const [studentMedicalConditionMap, setStudentMedicalConditionMap] = useState<{}>({});

    // COMPONENT DID MOUNT
    useEffect(() => {
        getAllMedicalConditions();
        getAllStudentMedicalConditions();
    }, []);


    // ON STUDENT MEDICAL CONDITIONS CHANGE
    useEffect(() => {

        // create map of conditions
        let newMap = {};
        studentMedicalConditions.forEach(cond => {
            newMap[cond.id.toString()] = true;
        });
        setStudentMedicalConditionMap(newMap);

    }, [studentMedicalConditions]);


    //----   GET ALL MEDICAL CONDITIONS   ----
    const getAllMedicalConditions = async () => {
        setLoading(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_ALL_MEDICAL_CONDITIONS, "");
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setMedicalConditions(result.data);
    }

    //----   GET ALL STUDENT MEDICAL CONDITIONS   ----
    const getAllStudentMedicalConditions = async () => {
        setLoading(true);
        let qry = GET_ENDPOINT.GET_ALL_MEDICAL_CONDITIONS_FOR_STUDENTS.toString();
        qry = qry.replace("{studentNumber}", props.student.studentNumber);
        let result: IResponse = await Connection.getRequest(qry, "");
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setStudentMedicalConditions(result.data);
    }

    //----   EDIT STUDENT MEDICAL CONDITIONS   ----
    const editStudentMedicalConditions = async (data: number[]): Promise<boolean> => {
        let dataToSend = {
            studentNumber: props.student.studentNumber,
            conditionIds: data
        }
        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.EDIT_STUDENT_MEDICAL_CONDITIONS, dataToSend, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }
        let temp: any = {};
        editStudent(temp);
        return true;
    }

    //----   EDIT STUDENT   ----
    const editStudent = async (data: IStudent): Promise<boolean> => {
        data.studentNumber = props.student.studentNumber;
        data.registrationStage = STUDENT_REGISTRATION_STAGE.ADD_OTHER_PARENTS;
        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.EDIT_STUDENT, data, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }
        successToast("Info Saved!", true, 1500);
        props.editRegistrationStatus({
            medicalConditionsAdded: 1,
            conditionsRejectionMessage: ""
        });
        props.goToNextPage();
        return true;
    }

    return (
        <div>
            {
                props.registrationStatus.conditionsRejectionMessage !== null && props.registrationStatus.conditionsRejectionMessage !== "" &&
                <AlertComponent title="The Admin has Rejected the info on this page with the following reason: " type="danger" content={props.registrationStatus.conditionsRejectionMessage} footer="Please fix the above mentioned issues if possible." />
            }
            <FormComponent
                title={`Medical Conditions`}
                id={props.student.studentNumber}
                data={
                    medicalConditions.map((cond) => {
                        return { key: cond.id.toString(), name: `${cond.name}: `, value: studentMedicalConditionMap[cond.id.toString()] !== undefined ? true : false, type: INPUT_TYPE.CHECK, required: false }
                    })
                }
                loading={loading}

                onEdit={async (data) => {

                    // convert boolean values to list of numbers
                    let studentConditions: number[] = [];
                    for (let key of Object.keys(data)) {
                        if (data[key] === true)
                            studentConditions.push(parseInt(key));
                    }

                    return editStudentMedicalConditions(studentConditions);
                }}

                backButtonText="Previous"
                backButtonType="primary"
                onBackClick={props.goToPrevPage}

                saveButtonText="Save and Next"
            />
        </div>
    );
}