import { useEffect, useState } from "react";
import { Button, FormGroup } from "react-bootstrap";
import { GET_ENDPOINT, Connection, POST_ENDPOINT, DELETE_ENDPOINT } from "../../../connection";
import { IGlobalContext, IFile, IResponse } from "../../../interfaces/general_interfaces";
import { IParentProfile } from "../../../interfaces/parent_interfaces";
import { IParentRegistrationStatus } from "../../../interfaces/registration_interfaces";
import { AlertComponent } from "../../../shared-components/alert-component/alertComponent";
import { errorToast, successToast } from "../../../shared-components/alert-components/toasts";
import { BankingDetails } from "../../../shared-components/banking-details/bankingDetails";
import DownloadDocumentComponent from "../../../shared-components/file-downloader-component/downloadDocComponent";
import FileViewerComponent from "../../../shared-components/file-viewer-component/fileViewerComponent";
import Loading from "../../../shared-components/loading-component/loading";
import TableV2 from "../../../shared-components/table-v2/tableV2";
import UploadDocumentComponent from "../../../shared-components/upload-doc-component/uploadDocComponent";

interface IProps {
    context: IGlobalContext,
    parent: IParentProfile,
    registrationStatus: IParentRegistrationStatus,

    goToPrevPage(): Promise<void>,
    goToNextPage(): Promise<void>
}

export const ParentProofOfRegistrationFee = (props: IProps) => {
    const [loading, setLoading] = useState(false);

    const [fileBeingDownloaded, setFileBeingDownloaded] = useState<IFile>();
    const [uploadedDocs, setUploadedDocs] = useState<IFile[]>([]);
    const [fileToView, setFileToView] = useState<IFile>();
    const [addingFile, setAddingFile] = useState(false);

    // COMPONENT DID MOUNT
    useEffect(() => {
        getUploadedDocuments();
    }, []);

    //--- GET UPLOADED DOCUMENTS ---
    const getUploadedDocuments = async () => {
        setLoading(true);
        let qry = GET_ENDPOINT.GET_PARENT_REGISTRATION_FEE_FILES.toString();
        qry = qry.replace("{parentId}", props.parent.userId.toString());

        let result: IResponse = await Connection.getRequest(qry, "");
        setLoading(false);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return;
        }
        setUploadedDocs(result.data);
    }

    //--- ADD FILE ---
    const addFile = async (fileName: string, filePath: string) => {

        let data = {
            parentId: props.parent.userId,
            filePath: filePath,
            fileName: fileName,
        }

        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.ADD_PARENT_REGISTRATION_FEE_FILE, data, {});
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }
        successToast("document uploaded!", true);
        getUploadedDocuments();

        return true;
    }

    //--- DELETE FILE ---
    const deleteFile = async (filePath: string) => {
        setLoading(true);
        let qry = DELETE_ENDPOINT.DELETE_PARENT_REGISTRATION_FEE_FILE.toString();
        qry = qry.replace("{filePath}", filePath);

        let result: IResponse = await Connection.delRequest(qry);
        setLoading(false);
        if (result.errorMessage.length > 0) {
            return false;
        }
        successToast("document deleted!", true);
        getUploadedDocuments();
        return true;
    }

    return (
        <div className="m-3">

            <h2>Upload Proof of Registration Fee Payment</h2>

            <div className="w-75 hor-center">
                <BankingDetails />
            </div>
            <h6 className="w-75 hor-center">
                Using the banking details above, pay the registration fee and upload a document such as a statement proving that you have paid.
                The amount to be paid is <b>N$ 3850.00</b>
            </h6>

            {
                props.registrationStatus.registrationFeeRejectionMessage !== null && props.registrationStatus.registrationFeeRejectionMessage !== "" &&
                <AlertComponent title="The Admin has Rejected the info on this page with the following reason: " type="danger" content={props.registrationStatus.registrationFeeRejectionMessage} footer="Please fix the above mentioned issues if possible." />
            }
            <TableV2
                title="Uploaded Documents"
                columns={[
                    { title: "Name", field: "fileName", filtering: false },
                ]}
                filtering={true}

                isLoading={loading}

                onRowClick={async (file: IFile) => setFileToView(file)}
                onDownload={async (file: IFile) => setFileBeingDownloaded(file)}

                onAdd={async () => setAddingFile(true)}
                onDelete={async (file: IFile) => deleteFile(file.filePath)}

                data={uploadedDocs}
            />
            {
                fileBeingDownloaded &&
                <DownloadDocumentComponent context={props.context} fileName={fileBeingDownloaded.fileName} filePath={fileBeingDownloaded.filePath} hide={() => setFileBeingDownloaded(undefined)} show={true} />
            }
            {
                fileToView &&
                <FileViewerComponent context={props.context} fileName={fileToView.fileName} filePath={fileToView.filePath} hide={() => setFileToView(undefined)} />
            }
            {
                addingFile &&
                <UploadDocumentComponent context={props.context} saveDetails={async (fileName, filePath) => addFile(fileName, filePath)} setShow={(val) => setAddingFile(false)} show={true} />
            }

        </div>
    );
}