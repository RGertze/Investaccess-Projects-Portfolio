import { useEffect, useState } from "react";
import { Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Connection, GET_ENDPOINT } from "../../connection";
import { IParentBalance } from "../../interfaces/finances-interfaces";
import { IGlobalContext, IResponse } from "../../interfaces/general_interfaces";
import { errorToast } from "../../shared-components/alert-components/toasts";
import TableV2 from "../../shared-components/table-v2/tableV2";
import "./adminParentBalances.css";

interface IProps {
    context: IGlobalContext
}

export const AdminParentBalances = (props: IProps) => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [balances, setBalances] = useState<IParentBalance[]>([]);

    useEffect(() => {
        getAllParents();
    }, []);

    const getAllParents = async () => {
        setLoading(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.ADMIN_GET_PARENT_BALANCES, "");
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setBalances(result.data);
    }

    const viewParent = (userId: number) => {
        navigate(`/admin/parents/${userId}`, { state: userId });
    }

    return (
        <div>
            <TableV2
                title="Balances"
                columns={[
                    { title: "Email", field: "email", filtering: false },
                    { title: "First Name", field: "firstName", filtering: false },
                    { title: "Last Name", field: "lastName", filtering: false },
                    { title: "Balance N$", field: "currentBalance", filtering: false },
                    {
                        title: "Status", field: "status",
                        render: (rowData: any) => <Badge bg={`${rowData.status === 1 ? "success" : "danger"}`}>
                            {rowData.status === 1 ? "Creditor" : "Debtor"}
                        </Badge>,
                        lookup: { 1: "creditor", 0: "debtor" },
                    },
                ]}
                filtering={true}

                isLoading={loading}

                onRowClick={async (parent: IParentBalance) => viewParent(parent.userId)}

                data={balances.map(b => { return { ...b, currentBalance: b.currentBalance.toFixed(2), status: b.currentBalance >= 0 ? 1 : 0 } })}
            />
        </div>
    );
}