import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { Pencil } from "react-bootstrap-icons";
import { Connection, DELETE_ENDPOINT, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { IGlobalContext, IResponse } from "../../interfaces/general_interfaces"
import { IProgressReportAssessment, IProgressReportCategory, IStudentAssessment } from "../../interfaces/progress_report_interfaces";
import { errorToast, successToast } from "../alert-components/toasts";
import Loading from "../loading-component/loading";
import "./studentProgReportAssessment.css";


interface IProps {
    context: IGlobalContext,
    assessment: IStudentAssessment,
    index: number,
    updateLocalMark(id: number, mark: number): void
}

const StudentProgReportAssessment = (props: IProps) => {

    const [loading, setLoading] = useState(false);
    const [mark, setMark] = useState(0);
    const [oldMark, setOldMark] = useState(0);

    useEffect(() => {
        setMark(props.assessment.mark);
        setOldMark(props.assessment.mark);
    }, []);

    useEffect(() => {
        setMark(props.assessment.mark);
        setOldMark(props.assessment.mark);
    }, [props.assessment.term]);

    //----   UPDATE MARK   ----
    const updateMark = async () => {
        if (oldMark === mark)
            return;

        setLoading(true);

        if (mark < 0 || mark > 100 || isNaN(mark)) {
            errorToast("Enter a valid mark between 0 and 100");
            setLoading(false);
            return;
        }

        let data = {
            reportAssessmentId: props.assessment.progressReportAssessmentId,
            studentAssessmentId: props.assessment.id,
            mark: mark
        }

        console.log(data);

        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.UPDATE_STUDENT_ASSESSMENT_MARK, data, {});
        setLoading(false);

        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            setMark(oldMark);
            return;
        }

        props.updateLocalMark(props.assessment.id, mark);

        setOldMark(mark);
    }

    return (
        <div className="student-progress-report-assessment-container">
            <div className="vert-flex student-assessment-name">
                <p>{props.assessment.name}</p>
            </div>
            {
                !loading &&
                <p className="vert-flex">
                    <Form.Control onBlur={updateMark} className="hor-center student-assessment-mark-input" onChange={(e) => setMark(parseFloat(e.target.value))} type={"number"} value={mark} placeholder="" />/{props.assessment.marksAvailable}
                </p>
            }
            {
                loading &&
                <div className="full-size">
                    <Loading />
                </div>
            }
        </div>
    );
}

export default StudentProgReportAssessment;