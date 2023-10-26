import { Edit, Email, Link, Person, Smartphone } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Button, FormGroup } from "react-bootstrap";
import { Connection, POST_ENDPOINT, GET_ENDPOINT } from "../../../../connection";
import { IGlobalContext, IFile, IResponse } from "../../../../interfaces/general_interfaces";
import { IStudentRegistrationStatus, STUDENT_REGISTRATION_STAGE } from "../../../../interfaces/registration_interfaces";
import { IStudent } from "../../../../interfaces/student_interfaces";
import AddEditComponentV2, { INPUT_TYPE } from "../../../../shared-components/add-edit-component-V2/AddEditComponentV2";
import { errorToast, successToast } from "../../../../shared-components/alert-components/toasts";
import DownloadDocumentComponent from "../../../../shared-components/file-downloader-component/downloadDocComponent";
import FileViewerComponent from "../../../../shared-components/file-viewer-component/fileViewerComponent";
import Loading from "../../../../shared-components/loading-component/loading";
import TableV2 from "../../../../shared-components/table-v2/tableV2";
import { StudentRejectButton } from "../reject-button/rejectButton";
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
    const [editing, setEditing] = useState(false);

    const [uploadedDocs, setUploadedDocs] = useState<IFile[]>([]);

    const [fileBeingDownloaded, setFileBeingDownloaded] = useState<IFile>();
    const [fileToView, setFileToView] = useState<IFile>();

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
        }
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

    return (
        <div className="m-3 occupational-therapy-form">

            <h2>Occupational Therapy</h2>
            <p className={`${props.context.isMobile ? "w-100" : "w-50"} hor-center`}>Your child is required to visit an occupational therapist before being accepted at our school. Please book an appointment with the doctor below and upload the report they provide here.</p>

            <div className="therapy-doc-details border rounded shadow hor-center">
                <h3 className="mt-2 vert-flex space-between">Therapist Details:   <Edit onClick={() => setEditing(true)} className="hover" /></h3>
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

            {
                editing &&
                <AddEditComponentV2
                    title='Edit therapist details'
                    cancel={() => setEditing(false)}
                    submit={async (data: any) => {
                        if (await props.editRegistrationStatus(data))
                            setEditing(false);
                        return true;
                    }}
                    fields={[
                        { key: "therapistName", name: "Therapist Name", type: INPUT_TYPE.TEXT, value: props.registrationStatus.therapistName },
                        { key: "therapistCell", name: "Therapist Cell", type: INPUT_TYPE.TEXT, value: props.registrationStatus.therapistCell },
                        { key: "therapistEmail", name: "Therapist Email", type: INPUT_TYPE.TEXT, value: props.registrationStatus.therapistEmail },
                        { key: "therapistUrl", name: "Therapist Url", type: INPUT_TYPE.TEXT, value: props.registrationStatus.therapistUrl },
                    ]}
                />
            }

            <TableV2
                title="Uploaded Therapy Reports"
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

            <FormGroup className="m-3">
                {
                    <>
                        <Button onClick={() => {
                            props.goToPrevPage();
                        }} variant={"primary"}>
                            Prev
                        </Button>
                        <Button className="m-3" onClick={() => {
                            props.goToNextPage();
                        }} variant="outline-success">Next</Button>
                    </>
                }
                {
                    loading &&
                    <Loading color="blue" small={true} />
                }
            </FormGroup>
            <StudentRejectButton context={props.context} editRegistrationStatus={props.editRegistrationStatus} student={props.student} type={STUDENT_REGISTRATION_STAGE.OCCUPATIONAL_THERAPY_NEEDED} />

        </div>
    );
}