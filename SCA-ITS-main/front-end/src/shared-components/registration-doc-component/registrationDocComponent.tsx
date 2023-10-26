import { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import { Connection, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { IFile, IGlobalContext, IResponse } from "../../interfaces/general_interfaces";
import { IRequiredRegistrationDocument, REG_REQ_TYPE } from "../../interfaces/registration_interfaces";
import { errorToast, successToast } from "../alert-components/toasts";
import DownloadDocumentComponent from "../file-downloader-component/downloadDocComponent";
import FileViewerComponent from "../file-viewer-component/fileViewerComponent";
import TableV2 from "../table-v2/tableV2";
import UploadDocumentComponent from "../upload-doc-component/uploadDocComponent";

interface IProps {
    context: IGlobalContext,
    requiredDoc: IRequiredRegistrationDocument,
    type: REG_REQ_TYPE,
    userIdOrStudentNumber: string,
    editable?: boolean
}

export const RegistrationDocComponent = (props: IProps) => {

    const [loading, setLoading] = useState(false);
    const [adding, setAdding] = useState(false);
    const [uploadedDocs, setUploadedDocs] = useState<IFile[]>([]);
    const [fileBeingDownloaded, setFileBeingDownloaded] = useState<IFile>();
    const [fileToView, setFileToView] = useState<IFile>();

    useEffect(() => {
        getUploadedDocuments();
    }, []);


    //--- GET UPLOADED DOCUMENTS ---
    const getUploadedDocuments = async () => {
        setLoading(true);
        let qry = `?reqId=${props.requiredDoc.id}`;
        if (props.type === REG_REQ_TYPE.STUDENT)
            qry += `&studentNumber=${props.userIdOrStudentNumber}`;
        else
            qry += `&userId=${props.userIdOrStudentNumber}`;

        let result: IResponse = (props.type === REG_REQ_TYPE.STUDENT) ? await Connection.getRequest(GET_ENDPOINT.GET_UPLOADED_STUDENT_REGISTRATION_DOCS + qry, "") : await Connection.getRequest(GET_ENDPOINT.GET_UPLOADED_PARENT_REGISTRATION_DOCS + qry, "");
        setLoading(false);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            console.log(result.errorMessage);
            return;
        }
        setUploadedDocs(result.data);
    }

    //--- ADD REGISTRATION FILE ---
    const addRegistrationFile = async (fileName: string, filePath: string) => {
        let data = {
            filePath: filePath,
            requiredId: props.requiredDoc.id,
            name: fileName
        }

        if (props.type === REG_REQ_TYPE.STUDENT)
            data["studentNumber"] = props.userIdOrStudentNumber;
        else
            data["userId"] = props.userIdOrStudentNumber;

        let result: IResponse = (props.type === REG_REQ_TYPE.STUDENT) ? await Connection.postRequest(POST_ENDPOINT.UPLOAD_STUDENT_REQUIRED_REGISTRATION_DOC, data, {}) : await Connection.postRequest(POST_ENDPOINT.UPLOAD_PARENT_REQUIRED_REGISTRATION_DOC, data, {});
        if (result.errorMessage.length > 0) {
            return false;
        }
        successToast("document uploaded!", true);
        setAdding(false);
        getUploadedDocuments();

        return true;
    }

    //--- DELETE REGISTRATION FILE ---
    const deleteRegistrationFile = async (filePath: string) => {
        setLoading(true);
        let data = {
            filePath: filePath,
        }

        let result: IResponse = (props.type === REG_REQ_TYPE.STUDENT) ? await Connection.postRequest(POST_ENDPOINT.DELETE_STUDENT_REGISTRATION_FILE, data, {}) : await Connection.postRequest(POST_ENDPOINT.DELETE_PARENT_REGISTRATION_FILE, data, {});
        setLoading(false);
        if (result.errorMessage.length > 0) {
            return false;
        }
        successToast("document deleted!", true);
        getUploadedDocuments();
        return true;
    }

    return (
        <div className="w-100">
            <h2 className="p-2">{props.requiredDoc.name}</h2>
            <p className="p-2">{props.requiredDoc.description}</p>
            <TableV2
                title="Uploaded Documents"
                columns={[
                    { title: "Name", field: "fileName", filtering: false },
                ]}
                filtering={true}

                isLoading={loading}

                onRowClick={async (file: IFile) => setFileToView(file)}
                onDownload={async (file: IFile) => setFileBeingDownloaded(file)}

                onAdd={props.editable ? async () => setAdding(true) : undefined}
                onDelete={props.editable ? async (file: IFile) => deleteRegistrationFile(file.filePath) : undefined}

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
                adding &&
                <UploadDocumentComponent context={props.context} saveDetails={async (fileName, filePath) => addRegistrationFile(fileName, filePath)} setShow={(val) => setAdding(false)} show={true} />
            }
        </div >
    );
}