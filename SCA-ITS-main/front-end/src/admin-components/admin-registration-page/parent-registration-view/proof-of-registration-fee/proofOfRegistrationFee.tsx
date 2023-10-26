import { useEffect, useState } from "react";
import { GET_ENDPOINT, Connection } from "../../../../connection";
import { IFile, IGlobalContext, IResponse } from "../../../../interfaces/general_interfaces";
import { IParentProfile } from "../../../../interfaces/parent_interfaces";
import { IParentRegistrationStatus, PARENT_REGISTRATION_STAGE } from "../../../../interfaces/registration_interfaces";
import { AlertComponent } from "../../../../shared-components/alert-component/alertComponent";
import { errorToast } from "../../../../shared-components/alert-components/toasts";
import { BankingDetails } from "../../../../shared-components/banking-details/bankingDetails";
import DownloadDocumentComponent from "../../../../shared-components/file-downloader-component/downloadDocComponent";
import FileViewerComponent from "../../../../shared-components/file-viewer-component/fileViewerComponent";
import TableV2 from "../../../../shared-components/table-v2/tableV2";
import { ParentRejectButton } from "../reject-button/rejectButton";

interface IProps {
    context: IGlobalContext,
    parent: IParentProfile,
    registrationStatus: IParentRegistrationStatus,

    goToPrevPage(): Promise<void>,
    goToNextPage(): Promise<void>,

    editRegistrationStatus(data: any): Promise<boolean>
}

export const ParentProofOfRegistrationFee = (props: IProps) => {
    const [loading, setLoading] = useState(false);

    const [fileBeingDownloaded, setFileBeingDownloaded] = useState<IFile>();
    const [uploadedDocs, setUploadedDocs] = useState<IFile[]>([]);
    const [fileToView, setFileToView] = useState<IFile>();

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

    return (
        <div className="m-3">

            <h2>Upload Proof of Registration Fee Payment</h2>

            <BankingDetails />
            <h6 className="w-75 hor-center">
                The parent should upload a document proving that they have paid the registration fee to the account listed above.
                The amount to be paid is <b>N$ 3850.00</b>
            </h6>
            {
                props.registrationStatus.registrationFeeRejectionMessage !== null && props.registrationStatus.registrationFeeRejectionMessage !== "" &&
                <AlertComponent title="You have Rejected the info on this page with the following reason: " type="danger" content={props.registrationStatus.registrationFeeRejectionMessage} />
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


            <ParentRejectButton context={props.context} editRegistrationStatus={props.editRegistrationStatus} parent={props.parent} type={PARENT_REGISTRATION_STAGE.PAY_REGISTRATION_FEE} />
        </div>
    );
}