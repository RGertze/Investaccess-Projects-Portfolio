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
import "./registrationDocsAccordian.css";

interface IProps {
    context: IGlobalContext,
    type: REG_REQ_TYPE,
    userIdOrStudentNumber: string,
    editable?: boolean
}

export const RegistrationDocsAccordian = (props: IProps) => {

    const [accordianKey, setAccordianKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [requiredDocs, setRequiredDocs] = useState<IRequiredRegistrationDocument[]>([]);
    const [uploadedDocs, setUploadedDocs] = useState<IFile[]>([]);
    const [fileBeingDownloaded, setFileBeingDownloaded] = useState<IFile>();
    const [fileToView, setFileToView] = useState<IFile>();
    const [reqDocToAddFileTo, setReqDocToAddFileTo] = useState<IRequiredRegistrationDocument>();

    useEffect(() => {
        getDocuments();
    }, []);

    //--- GET REQUIRED DOCUMENTS ---
    const getDocuments = async () => {
        setLoading(true);
        let result: IResponse = (props.type === REG_REQ_TYPE.STUDENT) ? await Connection.getRequest(GET_ENDPOINT.GET_REQUIRED_REGISTRATION_DOCS_FOR_STUDENTS, "") : await Connection.getRequest(GET_ENDPOINT.GET_REQUIRED_REGISTRATION_DOCS_FOR_PARENTS, "");
        setLoading(false);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            console.log(result.errorMessage);
            return;
        }
        setRequiredDocs(result.data);
    }

    //--- GET UPLOADED DOCUMENTS ---
    const getUploadedDocuments = async (reqId: number) => {
        setLoading(true);
        let qry = `?reqId=${reqId}`;
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
    const addRegistrationFile = async (fileName: string, filePath: string, docId: number) => {
        console.log(docId);

        let data = {
            filePath: filePath,
            requiredId: docId,
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
        getUploadedDocuments(docId);
        setReqDocToAddFileTo(undefined);

        return true;
    }

    //--- DELETE REGISTRATION FILE ---
    const deleteRegistrationFile = async (filePath: string, docId: number) => {
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
        getUploadedDocuments(docId);
        return true;
    }

    return (
        <div>
            <Accordion onSelect={(key) => setAccordianKey((key === undefined || key === null) ? "" : key.toString())}>
                {
                    requiredDocs.map((reqDoc, index) => {
                        return (
                            <Accordion.Item key={index} eventKey={`${index}`}>
                                <Accordion.Header onClick={() => {
                                    if (accordianKey !== `${index}`) {
                                        getUploadedDocuments(reqDoc.id);
                                    }
                                }}>
                                    {reqDoc.name}
                                </Accordion.Header>
                                <Accordion.Body>
                                    <p>{reqDoc.description}</p>
                                    <TableV2
                                        title="Uploaded Documents"
                                        columns={[
                                            { title: "Name", field: "fileName", filtering: false },
                                        ]}
                                        filtering={true}

                                        isLoading={loading}

                                        onRowClick={async (file: IFile) => setFileToView(file)}
                                        onDownload={async (file: IFile) => setFileBeingDownloaded(file)}

                                        onAdd={props.editable ? async () => setReqDocToAddFileTo(reqDoc) : undefined}
                                        onDelete={props.editable ? async (file: IFile) => deleteRegistrationFile(file.filePath, reqDoc.id) : undefined}

                                        data={uploadedDocs}
                                    />

                                </Accordion.Body>
                            </Accordion.Item>
                        );
                    })
                }

                {
                    fileBeingDownloaded &&
                    <DownloadDocumentComponent context={props.context} fileName={fileBeingDownloaded.fileName} filePath={fileBeingDownloaded.filePath} hide={() => setFileBeingDownloaded(undefined)} show={true} />
                }
                {
                    fileToView &&
                    <FileViewerComponent context={props.context} fileName={fileToView.fileName} filePath={fileToView.filePath} hide={() => setFileToView(undefined)} />
                }

                {
                    reqDocToAddFileTo &&
                    <UploadDocumentComponent context={props.context} saveDetails={async (fileName, filePath) => addRegistrationFile(fileName, filePath, reqDocToAddFileTo.id)} setShow={(val) => setReqDocToAddFileTo(undefined)} show={true} />
                }

                {
                    requiredDocs.length === 0 &&
                    <h6>Nothing to show!</h6>
                }
            </Accordion>
        </div >
    );
}