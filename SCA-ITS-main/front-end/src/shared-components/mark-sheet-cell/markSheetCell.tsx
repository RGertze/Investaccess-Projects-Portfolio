import { useEffect, useState } from "react";
import { FormControl } from "react-bootstrap";
import { Connection, POST_ENDPOINT } from "../../connection";
import { IGlobalContext, IResponse } from "../../interfaces/general_interfaces";
import { IStudentAssessment, IStudentExamMark } from "../../interfaces/progress_report_interfaces";
import { errorToast } from "../alert-components/toasts";
import Loading from "../loading-component/loading";



interface IProps {
    context: IGlobalContext,
    elem: IStudentAssessment | IStudentExamMark,
    onUpdate(mark: number): Promise<void>
}

const MarkSheetCell = (props: IProps) => {
    const [loading, setLoading] = useState(false);
    const [mark, setMark] = useState(0);
    const [oldMark, setOldMark] = useState(0);

    useEffect(() => {
        setMark(props.elem.mark);
        setOldMark(props.elem.mark);
    }, []);

    //----   UPDATE MARK   ----
    const updateMark = async () => {
        if (oldMark === mark)
            return;

        setLoading(true);

        if (mark < 0 || isNaN(mark)) {
            errorToast("Enter a valid mark");
            setLoading(false);
            return;
        }

        let data = {}
        let isAssessmentMark = Object.hasOwn(props.elem, "progressReportAssessmentId");

        if (isAssessmentMark) {
            let elem = props.elem as IStudentAssessment;
            data = {
                reportAssessmentId: elem.progressReportAssessmentId,
                studentAssessmentId: elem.id,
                mark: mark
            }
        }
        else {
            let elem = props.elem as IStudentExamMark;
            data = {
                id: elem.id,
                mark: mark
            }
        }

        let result: IResponse = await Connection.postRequest(isAssessmentMark ? POST_ENDPOINT.UPDATE_STUDENT_ASSESSMENT_MARK : POST_ENDPOINT.UPDATE_STUDENT_EXAM_MARK, data, {});
        setLoading(false);

        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            setMark(oldMark);
            return;
        }

        setOldMark(mark);

        props.onUpdate(mark);
    }

    return (
        <>
            {
                loading &&
                <Loading />
            }
            {
                !loading &&
                <FormControl onBlur={updateMark} className="hor-center mark-sheet-cell-input" onChange={(e) => setMark(parseFloat(e.target.value))} type={"number"} value={mark} placeholder="" />
            }
        </>
    )
}

export default MarkSheetCell;