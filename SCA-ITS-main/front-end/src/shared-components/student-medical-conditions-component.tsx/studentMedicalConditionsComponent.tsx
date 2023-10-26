import { useEffect, useState } from 'react';
import { Connection, GET_ENDPOINT, POST_ENDPOINT } from '../../connection';
import { IGlobalContext, IResponse } from '../../interfaces/general_interfaces';
import { IMedicalCondition, IStudentMedicalCondition } from '../../interfaces/medical-conditions';
import { IStudent } from '../../interfaces/student_interfaces';
import { INPUT_TYPE } from '../../shared-components/add-edit-component-V2/AddEditComponentV2';
import { errorToast, successToast } from '../../shared-components/alert-components/toasts';
import EditableTable from '../editable-component/editableComponent';



interface IProps {
    context: IGlobalContext,
    studentNumber: string,
    editable?: boolean
}

const StudentMedicalConditionsComponent = (props: IProps) => {

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
        qry = qry.replace("{studentNumber}", props.studentNumber);
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
            studentNumber: props.studentNumber,
            conditionIds: data
        }
        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.EDIT_STUDENT_MEDICAL_CONDITIONS, dataToSend, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }
        successToast("Medical conditions updated!", true, 1500);
        getAllStudentMedicalConditions();
        return true;
    }

    return (
        <EditableTable
            title={`Medical Conditions`}
            id={props.studentNumber}
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

            editable={props.editable}
        />

    );
}

export default StudentMedicalConditionsComponent;