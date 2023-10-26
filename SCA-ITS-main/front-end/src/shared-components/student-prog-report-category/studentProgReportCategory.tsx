import { useEffect, useState } from "react";
import { Connection, DELETE_ENDPOINT, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { IGlobalContext, IResponse } from "../../interfaces/general_interfaces"
import { IProgressReportAssessment, IProgressReportCategory, IStudentAssessment } from "../../interfaces/progress_report_interfaces";
import { errorToast, successToast } from "../alert-components/toasts";
import Loading from "../loading-component/loading";
import StudentProgReportAssessment from "../student-prog-report-assessment/studentProgReportAssessment";
import "./studentProgReportCategory.css";


interface IProps {
    context: IGlobalContext,
    studentNumber: string,
    courseReportId: number,
    category: IProgressReportCategory,
    term: number
}

const StudentProgReportCategory = (props: IProps) => {

    const [loading, setLoading] = useState(false);
    const [assessments, setAssessments] = useState<IStudentAssessment[]>([]);
    const [filteredAssessments, setFilteredAssessments] = useState<IStudentAssessment[]>([]);

    useEffect(() => {
        getAssessments();
    }, []);

    useEffect(() => {
        if (assessments.length == 0)
            return;

        let filtered = assessments.filter(a => a.term == props.term);
        setFilteredAssessments(filtered);
        console.log(filtered);
    }, [props.term, assessments]);

    //----   GET ASSESSMENTS   ----
    const getAssessments = async () => {
        setLoading(true);

        let qry = `?studentNumber=${props.studentNumber}&categoryId=${props.category.id}&courseReportId=${props.courseReportId}`;
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_STUDENT_ASSESSMENTS + qry, "");

        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setAssessments(result.data);
    }

    //----   UPDATE LOCAL ASSESSMENT MARK   ----
    const updateLocalAssessmentMark = (id: number, mark: number) => {
        let updatedAssessments = assessments.slice();
        let index = updatedAssessments.findIndex(a => a.id == id);
        updatedAssessments[index].mark = mark;
        setAssessments(updatedAssessments);
    }

    return (
        <div className="shadow rounded student-progress-report-category-container">

            {
                loading &&
                <Loading />
            }
            {
                !loading &&
                <>
                    <h5 className="rounded student-progress-report-category-header">{props.category.name}</h5>
                    <div className="admin-categories-assessments">
                        {
                            filteredAssessments.map((asm, index) => {
                                return (
                                    <StudentProgReportAssessment key={index} updateLocalMark={updateLocalAssessmentMark} assessment={asm} context={props.context} index={index} />
                                );
                            })
                        }
                        {
                            assessments.length === 0 &&
                            <p>Nothing to show</p>
                        }
                    </div>
                </>
            }

        </div>
    );
}

export default StudentProgReportCategory;