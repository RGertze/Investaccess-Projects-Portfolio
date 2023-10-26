import { AxiosRequestConfig } from "axios";
import { useState, useEffect } from "react";
import { Alert, Badge, Modal } from "react-bootstrap";
import { GET_ENDPOINT, Connection, POST_ENDPOINT, DELETE_ENDPOINT } from "../../connection";
import { IProofOfDeposit, PROOF_OF_DEPOSIT_STATUS } from "../../interfaces/finances-interfaces";
import { IFile, IGlobalContext, IResponse, ISignedPutRequest } from "../../interfaces/general_interfaces";
import AddEditComponentV2, { INPUT_TYPE } from "../../shared-components/add-edit-component-V2/AddEditComponentV2";
import { errorToast, successToast } from "../../shared-components/alert-components/toasts";
import DownloadDocumentComponent from "../../shared-components/file-downloader-component/downloadDocComponent";
import TableV2 from "../../shared-components/table-v2/tableV2";

interface IProps {
    context: IGlobalContext,
    parentId: number
}

function getVariant(status: PROOF_OF_DEPOSIT_STATUS) {
    if (status === PROOF_OF_DEPOSIT_STATUS.APPROVED)
        return "success";
    if (status === PROOF_OF_DEPOSIT_STATUS.REJECTED)
        return "danger";
    if (status === PROOF_OF_DEPOSIT_STATUS.PENDING)
        return "warning";

    return "";
}

const ParentProofOfDepositComponent = (props: IProps) => {

    const [loading, setLoading] = useState(false);
    const [proofOfDeposits, setProofOfDeposits] = useState<IProofOfDeposit[]>([]);

    const [adding, setAdding] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [proofOfDepositToEdit, setProofOfDepositToEdit] = useState<IProofOfDeposit>();
    const [fileBeingDownloaded, setFileBeingDownloaded] = useState<IFile>();

    const [proofOfDepositToView, setProofOfDepositToView] = useState<IProofOfDeposit>();

    useEffect(() => {
        getProofOfDeposits();
    }, []);

    //----   GET PROOF OF DEPOSITS   ----
    const getProofOfDeposits = async () => {
        setLoading(true);
        let qry = GET_ENDPOINT.GET_PROOF_OF_DEPOSITS_FOR_PARENT.toString();
        qry = qry.replace("{parentId}", props.parentId.toString());
        let result: IResponse = await Connection.getRequest(qry, "");
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setProofOfDeposits(result.data);
    }

    //----   ADD PROOF OF DEPOSIT   ----
    const addProofOfDeposit = async (data: any): Promise<boolean> => {

        if (!data.amount || data.amount === 0) {
            errorToast("Enter an amount");
            return false;
        }
        if (!data.proof) {
            errorToast("Choose a file");
            return false;
        }

        // get signed url
        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.GET_SIGNED_PUT_URL, { filename: data.proof?.name }, {});
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        // upload to S3
        let signedUrl: ISignedPutRequest = result.data;

        let config: AxiosRequestConfig = {
            onUploadProgress: (progressEvent) => {
                const { loaded, total } = progressEvent;
                let progress = Math.floor(loaded / total * 100);
                setUploadProgress(progress);
            }
        }
        let uploadStatus = await Connection.uploadFile(signedUrl.signedUrl, data.proof as File, config);

        if (uploadStatus !== 200) {
            errorToast("Failed to upload file. Try again later", true, 2000);
            return false;
        }

        let dataToSend = {
            parentId: props.parentId,
            amount: data.amount,
            filePath: signedUrl.filePath,
            fileName: data.proof.name,
        }

        result = await Connection.postRequest(POST_ENDPOINT.ADD_PROOF_OF_DEPOSIT, dataToSend, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        successToast("Proof Added!", true, 2000);
        setAdding(false);
        setUploadProgress(0);
        getProofOfDeposits();
        return true;
    }

    //----   EDIT PROOF OF DEPOSIT   ----
    const editProofOfDeposit = async (id: number, data: any): Promise<boolean> => {

        let amount = NaN;
        let filePath = "";
        let fileName = "";

        if (data.amount) {
            if (data.amount <= 0) {
                errorToast("Amount should be greater than 0");
                return false;
            }

            amount = data.amount;
        }

        if (data.proof) {
            // get signed url
            let result: IResponse = await Connection.postRequest(POST_ENDPOINT.GET_SIGNED_PUT_URL, { filename: data.proof?.name }, {});
            if (result.errorMessage.length > 0) {
                errorToast(result.errorMessage, true, 2000);
                return false;
            }

            // upload to S3
            let signedUrl: ISignedPutRequest = result.data;

            let config: AxiosRequestConfig = {
                onUploadProgress: (progressEvent) => {
                    const { loaded, total } = progressEvent;
                    let progress = Math.floor(loaded / total * 100);
                    setUploadProgress(progress);
                }
            }
            let uploadStatus = await Connection.uploadFile(signedUrl.signedUrl, data.proof as File, config);

            if (uploadStatus !== 200) {
                errorToast("Failed to upload file. Try again later", true, 2000);
                return false;
            }

            filePath = signedUrl.filePath;
            fileName = data.proof.name;
        }

        let dataToSend = {
            id: id,
            amount: amount !== NaN ? amount : null,
            filePath: filePath !== "" ? filePath : null,
            fileName: fileName !== "" ? fileName : null,
        }

        let result = await Connection.postRequest(POST_ENDPOINT.EDIT_PROOF_OF_DEPOSIT, dataToSend, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        successToast("Proof Edited!", true, 2000);
        setProofOfDepositToEdit(undefined);
        setUploadProgress(0);
        getProofOfDeposits();
        return true;
    }

    //----   DELETE PROOF OF DEPOSIT   ----
    const deleteProofOfDeposit = async (id: number) => {
        setLoading(true);
        let qry = DELETE_ENDPOINT.ADMIN_DELETE_PROOF_OF_DEPOSIT.toString();
        qry = qry.replace("{id}", id.toString());
        let result: IResponse = await Connection.delRequest(qry);
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        successToast("Successfully deleted", true, 2000);
        getProofOfDeposits();
        return true;
    }

    return (
        <div>
            {
                adding &&
                <AddEditComponentV2
                    title="Add New Proof of Deposit"
                    fields={[
                        { key: "amount", name: "Amount", value: 0, type: INPUT_TYPE.NUMBER },
                        { key: "proof", name: "Proof", value: undefined, type: INPUT_TYPE.FILE },
                    ]}
                    cancel={() => setAdding(false)}
                    submit={addProofOfDeposit}
                    uploadProgress={uploadProgress}
                />
            }
            {
                proofOfDepositToEdit &&
                <AddEditComponentV2
                    title="Edit Proof of Deposit"
                    fields={[
                        { key: "amount", name: "Amount", value: proofOfDepositToEdit.amount, type: INPUT_TYPE.NUMBER },
                        { key: "proof", name: "New Proof File", value: undefined, type: INPUT_TYPE.FILE },
                    ]}
                    cancel={() => setProofOfDepositToEdit(undefined)}
                    submit={async (data: any) => await editProofOfDeposit(proofOfDepositToEdit.id, data)}
                    uploadProgress={uploadProgress}
                />
            }
            {
                fileBeingDownloaded &&
                <DownloadDocumentComponent context={props.context} fileName={fileBeingDownloaded.fileName} filePath={fileBeingDownloaded.filePath} hide={() => setFileBeingDownloaded(undefined)} show={true} />
            }

            <TableV2
                title="Proof of Deposits"
                columns={[
                    { title: "File Name", field: "fileName" },
                    { title: "Amount", field: "amount" },
                    {
                        title: "Status", field: "status",
                        render: (rowData: IProofOfDeposit) => <Badge bg={`${getVariant(rowData.status)}`}>
                            {rowData.status === PROOF_OF_DEPOSIT_STATUS.APPROVED && "approved"}
                            {rowData.status === PROOF_OF_DEPOSIT_STATUS.PENDING && "pending"}
                            {rowData.status === PROOF_OF_DEPOSIT_STATUS.REJECTED && "rejected"}
                        </Badge>
                    },
                ]}
                filtering={false}

                isLoading={loading}

                onAdd={async () => setAdding(true)}
                onEdit={async (data: IProofOfDeposit) => {
                    if (data.status === PROOF_OF_DEPOSIT_STATUS.APPROVED) {
                        errorToast("Cannot edit an approved deposit", false, 2000);
                        return;
                    }
                    setProofOfDepositToEdit(data);
                }}
                onDelete={async (data: IProofOfDeposit) => {
                    if (data.status === PROOF_OF_DEPOSIT_STATUS.APPROVED) {
                        errorToast("Cannot delete an approved deposit", false, 2000);
                        return false;
                    }
                    return await deleteProofOfDeposit(data.id);
                }}
                onDownload={async (data: IProofOfDeposit) => setFileBeingDownloaded({ fileName: data.fileName, filePath: data.filePath })}

                onRowClick={async (data: IProofOfDeposit) => setProofOfDepositToView(data)}

                data={proofOfDeposits}
            />

            {
                proofOfDepositToView &&
                <Modal style={{ zIndex: "999999" }} size="lg" onHide={() => setProofOfDepositToView(undefined)} show={true}>
                    <Modal.Header closeButton>
                        <h2>Status</h2>
                    </Modal.Header>
                    <Modal.Body>
                        <Alert variant={`${getVariant(proofOfDepositToView.status)}`}>
                            <h4>
                                {proofOfDepositToView.status === PROOF_OF_DEPOSIT_STATUS.APPROVED && "This request has been approved!"}
                                {proofOfDepositToView.status === PROOF_OF_DEPOSIT_STATUS.PENDING && "This request is awaiting approval by an administrator!"}
                                {proofOfDepositToView.status === PROOF_OF_DEPOSIT_STATUS.REJECTED && "This request has been rejected for the following reason:"}
                            </h4>
                            {
                                proofOfDepositToView.status === PROOF_OF_DEPOSIT_STATUS.REJECTED &&
                                <p>{proofOfDepositToView.rejectionMessage}</p>
                            }
                        </Alert>
                    </Modal.Body>
                </Modal>

            }

        </div>
    );
}

export default ParentProofOfDepositComponent;