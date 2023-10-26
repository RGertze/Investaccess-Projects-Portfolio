import { Email, Link, Person, Smartphone } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Button, FormGroup } from "react-bootstrap";
import { Connection, DELETE_ENDPOINT, GET_ENDPOINT, POST_ENDPOINT } from "../../../connection";
import { IFile, IGlobalContext, IResponse } from "../../../interfaces/general_interfaces";
import { IStudentRegistrationStatus, STUDENT_REGISTRATION_STAGE } from "../../../interfaces/registration_interfaces";
import { IStudent } from "../../../interfaces/student_interfaces";
import { AlertComponent } from "../../../shared-components/alert-component/alertComponent";
import { errorToast, successToast } from "../../../shared-components/alert-components/toasts";
import DownloadDocumentComponent from "../../../shared-components/file-downloader-component/downloadDocComponent";
import FileViewerComponent from "../../../shared-components/file-viewer-component/fileViewerComponent";
import Loading from "../../../shared-components/loading-component/loading";
import TableV2 from "../../../shared-components/table-v2/tableV2";
import UploadDocumentComponent from "../../../shared-components/upload-doc-component/uploadDocComponent";
import "./occupationalTherapyForm.css";

interface IProps {
    context: IGlobalContext,
    student: IStudent,
    registrationStatus: IStudentRegistrationStatus,

    goToPrevPage(): Promise<void>,
    goToNextPage(): Promise<void>,

    editRegistrationStatus(data: any): Promise<boolean>
}

export const StudentOccupationalTherapyForm = (props: IProps) => {
    const [loading, setLoading] = useState(false);

    const [uploadedDocs, setUploadedDocs] = useState<IFile[]>([]);

    const [fileBeingDownloaded, setFileBeingDownloaded] = useState<IFile>();
    const [fileToView, setFileToView] = useState<IFile>();
    const [addingFile, setAddingFile] = useState(false);

    // COMPONENT DID MOUNT
    useEffect(() => {
        getUploadedDocuments();
    }, []);

    //----   EDIT STUDENT   ----
    const editStudent = async (data: IStudent): Promise<boolean> => {
        if (props.registrationStatus.diagnosticTestNeeded === 1) {
            data.studentNumber = props.student.studentNumber;
            data.registrationStage = STUDENT_REGISTRATION_STAGE.DIAGNOSTIC_TEST_NEEDED;
            let result: IResponse = await Connection.postRequest(POST_ENDPOINT.EDIT_STUDENT, data, {});
            if (result.errorMessage && result.errorMessage.length > 0) {
                errorToast(result.errorMessage, true, 2000);
                return false;
            }
            successToast("Info Saved!", true, 1500);
            props.goToNextPage();
            return true;
        }
        props.editRegistrationStatus({});
        successToast("Info Saved!", true, 1500);
        return true;
    }

    //--- GET UPLOADED DOCUMENTS ---
    const getUploadedDocuments = async () => {
        setLoading(true);
        let qry = GET_ENDPOINT.GET_STUDENT_THERAPY_FILES.toString();
        qry = qry.replace("{studentNumber}", props.student.studentNumber);

        let result: IResponse = await Connection.getRequest(qry, "");
        setLoading(false);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return;
        }
        setUploadedDocs(result.data);
    }

    //--- ADD THERAPY FILE ---
    const addTherapyFile = async (fileName: string, filePath: string) => {

        let data = {
            studentNumber: props.student.studentNumber,
            filePath: filePath,
            fileName: fileName,
        }

        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.ADD_STUDENT_THERAPY_FILE, data, {});
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }
        successToast("document uploaded!", true);
        getUploadedDocuments();

        return true;
    }

    //--- DELETE THERAPY FILE ---
    const deleteTherapyFile = async (filePath: string) => {
        setLoading(true);
        let qry = DELETE_ENDPOINT.DELETE_STUDENT_THERAPY_FILE.toString();
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
        <div className="m-3 occupational-therapy-form">

            <h2>Occupational Therapy</h2>
            <p className={`${props.context.isMobile ? "w-100" : "w-50"} hor-center`}>Your child is required to visit an occupational therapist before being accepted at our school. Please book an appointment with the doctor below and upload the report they provide here.</p>

            {
                props.registrationStatus.therapyRejectionMessage !== null && props.registrationStatus.therapyRejectionMessage !== "" &&
                <AlertComponent title="The Admin has Rejected the info on this page with the following reason: " type="danger" content={props.registrationStatus.therapyRejectionMessage} footer="Please fix the above mentioned issues if possible." />
            }

            <div className="therapy-doc-details border rounded shadow hor-center">
                <h3 className="mt-2">Therapist Details:</h3>
                <div className="vert-flex">
                    <Person style={{ color: "#555" }} />
                    <p>{props.registrationStatus.therapistName}</p>
                </div>
                <div className="vert-flex">
                    <Smartphone style={{ color: "#555" }} />
                    <p>{props.registrationStatus.therapistCell}</p>
                </div>
                <div className="vert-flex">
                    <Email style={{ color: "#555" }} />
                    <p>{props.registrationStatus.therapistEmail}</p>
                </div>
                <div className="vert-flex">
                    <Link style={{ color: "#555" }} />
                    <p>{props.registrationStatus.therapistUrl}</p>
                </div>
            </div>

            <TableV2
                title="Uploaded Therapy Reports"
                columns={[
                    { title: "Name", field: "fileName", filtering: false },
                ]}
                filtering={true}

                isLoading={loading}

                onRowClick={async (file: IFile) => setFileToView(file)}
                onDownload={async (file: IFile) => setFileBeingDownloaded(file)}

                onAdd={async () => setAddingFile(true)}
                onDelete={async (file: IFile) => deleteTherapyFile(file.filePath)}

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
                <UploadDocumentComponent context={props.context} saveDetails={async (fileName, filePath) => addTherapyFile(fileName, filePath)} setShow={(val) => setAddingFile(false)} show={true} />
            }

            <FormGroup className="m-3">
                {
                    <>
                        <Button onClick={() => {
                            props.goToPrevPage();
                        }} variant={"primary"}>
                            Prev
                        </Button>
                        <Button className="m-3" onClick={() => {
                            let data: any = {};
                            editStudent(data);
                        }} variant="outline-success">
                            {
                                props.registrationStatus.diagnosticTestNeeded === 1 ? "Save and Next" : "Save"
                            }
                        </Button>
                    </>
                }
                {
                    loading &&
                    <Loading color="blue" small={true} />
                }
            </FormGroup>

        </div>
    );
}