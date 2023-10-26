import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Connection, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { IFeeForGrade } from "../../interfaces/finances-interfaces";
import { IGlobalContext, IResponse } from "../../interfaces/general_interfaces";
import { IReport } from "../../interfaces/report-interfaces";
import AddEditComponentV2, { INPUT_TYPE } from "../../shared-components/add-edit-component-V2/AddEditComponentV2";
import AddEditComponent from "../../shared-components/add-edit-component/AddEditComponent";
import { errorToast } from "../../shared-components/alert-components/toasts";
import TableV2 from "../../shared-components/table-v2/tableV2";



interface IProps {
    context: IGlobalContext,
}

const AdminFeesForGradesPage = (props: IProps) => {

    const [loading, setLoading] = useState(false);

    const [feesForGrades, setFeesForGrades] = useState<IFeeForGrade[]>([]);
    const [feeToEdit, setFeeToEdit] = useState<IFeeForGrade>();

    // COMPONENT DID MOUNT
    useEffect(() => {
        getAllFeesForGrades();
    }, []);

    //----   GET ALL FEES FOR GRADES   ----
    const getAllFeesForGrades = async () => {
        setLoading(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.ADMIN_GET_FEES_FOR_GRADES, "");
        setLoading(false);
        if (result.errorMessage !== "") {
            errorToast(result.errorMessage, true, 2000);
            return;
        }

        setFeesForGrades(result.data);
    }

    //----   EDIT FEE FOR GRADE   ----
    const editFeeForGrade = async (grade: number, amount: number): Promise<boolean> => {
        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.EDIT_FEES_FOR_GRADES, {
            grade: grade,
            amount: amount
        }, {});
        if (result.errorMessage !== "") {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setFeeToEdit(undefined);
        getAllFeesForGrades();
        return true;
    }

    return (
        <div className="admin-reports-list-container">
            {
                <TableV2
                    title="Fees for Grades"
                    columns={[
                        { title: "Grade", field: "grade" },
                        { title: "Amount", field: "amount" },
                    ]}
                    filtering={false}

                    isLoading={loading}

                    data={feesForGrades}

                    onEdit={async (data: IFeeForGrade) => setFeeToEdit(data)}
                />
            }
            {
                feeToEdit &&
                <AddEditComponentV2
                    title={`Editing Fee For Grade ${feeToEdit.grade}`}
                    fields={[
                        { key: "amount", name: "Amount", type: INPUT_TYPE.NUMBER, value: feeToEdit.amount }
                    ]}
                    submit={(data) => editFeeForGrade(feeToEdit.grade, data.amount)}
                    cancel={() => setFeeToEdit(undefined)}
                />
            }
        </div>
    );
}

export default AdminFeesForGradesPage;