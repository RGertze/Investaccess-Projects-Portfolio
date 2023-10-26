import { AxiosRequestConfig } from "axios";
import { useState, useEffect } from "react";
import { Alert, Badge, Modal } from "react-bootstrap";
import { GET_ENDPOINT, Connection, POST_ENDPOINT, DELETE_ENDPOINT } from "../../connection";
import { IProofOfDeposit, PROOF_OF_DEPOSIT_STATUS } from "../../interfaces/finances-interfaces";
import { IFile, IGlobalContext, IResponse, ISignedPutRequest } from "../../interfaces/general_interfaces";
import AddEditComponentV2, { INPUT_TYPE } from "../../shared-components/add-edit-component-V2/AddEditComponentV2";
import { confirmWithReason, errorToast, successToast } from "../../shared-components/alert-components/toasts";
import DownloadDocumentComponent from "../../shared-components/file-downloader-component/downloadDocComponent";
import TableV2 from "../../shared-components/table-v2/tableV2";

interface IProps {
    context: IGlobalContext,
}

const AdminProofOfDepositComponent = (props: IProps) => {

    const [loading, setLoading] = useState(false);
    const [proofOfDeposits, setProofOfDeposits] = useState<IProofOfDeposit[]>([]);

    const [adding, setAdding] = useState(false);
    const [fileBeingDownloaded, setFileBeingDownloaded] = useState<IFile>();

    useEffect(() => {
        getPendingProofOfDeposits();
    }, []);

    //----   GET PENDING PROOF OF DEPOSITS   ----
    const getPendingProofOfDeposits = async () => {
        setLoading(true);
        let qry = GET_ENDPOINT.GET_PENDING_PROOF_OF_DEPOSITS.toString();
        let result: IResponse = await Connection.getRequest(qry, "");
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setProofOfDeposits(result.data);
    }

    //----   EDIT PROOF OF DEPOSIT STATUS   ----
    const editProofOfDepositStatus = async (data: IProofOfDeposit, status: number) => {

        let message = "";

        if (status === PROOF_OF_DEPOSIT_STATUS.REJECTED) {
            message = (await confirmWithReason("Reject proof of deposit")).value;
            if (message === "") {
                errorToast("Enter a rejection message");
                return;
            }
        }

        let dataToSend = {
            id: data.id,
            status: status,
            message: message
        }

        setLoading(true);
        let result = await Connection.postRequest(POST_ENDPOINT.ADMIN_EDIT_PROOF_OF_DEPOSIT_STATUS, dataToSend, {});
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return;
        }

        successToast("Success!", true, 2000);
        getPendingProofOfDeposits();
        return;
    }


    return (
        <div>
            {
                fileBeingDownloaded &&
                <DownloadDocumentComponent context={props.context} fileName={fileBeingDownloaded.fileName} filePath={fileBeingDownloaded.filePath} hide={() => setFileBeingDownloaded(undefined)} show={true} />
            }

            <TableV2
                title="Pending Proof of Deposits"
                columns={[
                    { title: "File Name", field: "fileName" },
                    { title: "Amount", field: "amount" },
                    {
                        title: "Status", field: "status",
                        render: (rowData: IProofOfDeposit) => <Badge bg={`${rowData.status === PROOF_OF_DEPOSIT_STATUS.PENDING && "warning"} ${rowData.status === PROOF_OF_DEPOSIT_STATUS.APPROVED && "success"} ${rowData.status === PROOF_OF_DEPOSIT_STATUS.REJECTED && "danger"}`}>
                            {rowData.status === PROOF_OF_DEPOSIT_STATUS.APPROVED && "approved"}
                            {rowData.status === PROOF_OF_DEPOSIT_STATUS.PENDING && "pending"}
                            {rowData.status === PROOF_OF_DEPOSIT_STATUS.REJECTED && "rejected"}
                        </Badge>
                    },
                ]}
                filtering={false}

                isLoading={loading}

                onDownload={async (data: IProofOfDeposit) => setFileBeingDownloaded({ fileName: data.fileName, filePath: data.filePath })}
                onApprove={async (data: IProofOfDeposit) => editProofOfDepositStatus(data, PROOF_OF_DEPOSIT_STATUS.APPROVED)}
                onReject={async (data: IProofOfDeposit) => editProofOfDepositStatus(data, PROOF_OF_DEPOSIT_STATUS.REJECTED)}

                data={proofOfDeposits}
            />

        </div>
    );
}

export default AdminProofOfDepositComponent;