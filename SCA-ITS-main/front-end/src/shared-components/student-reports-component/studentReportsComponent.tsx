import { useEffect, useState } from 'react';
import { Connection, GET_ENDPOINT } from '../../connection';
import { IGlobalContext, IResponse } from '../../interfaces/general_interfaces';
import { IStudentReportFile } from '../../interfaces/report-interfaces';
import { errorToast } from '../alert-components/toasts';
import DownloadDocumentComponent from '../file-downloader-component/downloadDocComponent';
import FileViewerComponent from '../file-viewer-component/fileViewerComponent';
import TableList from '../table-list-component/tableListComponent';
import TableV2 from '../table-v2/tableV2';


interface IProps {
    context: IGlobalContext,
    studentNumber: string
}

const StudentReportsComponent = (props: IProps) => {

    const [reports, setReports] = useState<IStudentReportFile[]>([]);
    const [reportToDownload, setReportToDownload] = useState<IStudentReportFile>();
    const [reportToView, setReportToView] = useState<IStudentReportFile>();
    const [loading, setLoading] = useState(false);

    //----   COMPONENT DID MOUNT   ----
    useEffect(() => {
        getAllReportFilesForStudent();
    }, []);

    //----   GET ALL STUDENT COURSES   ----
    const getAllReportFilesForStudent = async () => {
        setLoading(true);
        let qry = GET_ENDPOINT.GET_ALL_GENERATED_REPORTS_FOR_STUDENT.toString();
        qry = qry.replace("{studentNumber}", props.studentNumber);
        console.log(qry);
        let result: IResponse = await Connection.getRequest(qry, "");
        setLoading(false);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true);
            return;
        }
        setReports(result.data);
    }

    return (
        <div className="">
            <TableV2
                title="Reports"
                columns={[
                    { title: "Year", field: "year", filtering: false },
                    { title: "Term", field: "term", filtering: false },
                ]}
                filtering={true}

                isLoading={loading}

                onRowClick={async (file: IStudentReportFile) => setReportToView(file)}
                onDownload={async (file: IStudentReportFile) => setReportToDownload(file)}

                data={reports}
            />
            {
                reportToView &&
                <FileViewerComponent context={props.context} fileName={`${props.studentNumber}-${reportToView.year}-${reportToView.term}`} filePath={reportToView.filePath} hide={() => setReportToView(undefined)} />
            }
            {
                reportToDownload &&
                <DownloadDocumentComponent extension="pdf" context={props.context} fileName={`${props.studentNumber}-${reportToDownload.year}-${reportToDownload.term}`} filePath={reportToDownload.filePath} hide={() => setReportToDownload(undefined)} show={reportToDownload !== undefined} />
            }
        </div>
    );
}

export default StudentReportsComponent;