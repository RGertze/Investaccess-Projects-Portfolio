import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { Connection, GET_ENDPOINT } from "../../connection";
import { IGlobalContext, IResponse } from "../../interfaces/general_interfaces";
import { ICourseProgressReport, IProgressReport, IProgressReportAssessment, IProgressReportCategory, IStudentAssessment, IStudentExamMark } from "../../interfaces/progress_report_interfaces";
import { IStudent } from "../../interfaces/student_interfaces";
import { errorToast } from "../alert-components/toasts";
import Loading from "../loading-component/loading";
import MarkSheetRecord from "../mark-sheet-record/markSheetRecord";
import "./markSheet.css";


interface IProps {
    context: IGlobalContext,
    courseProgressReport: ICourseProgressReport,
}

const MarkSheet = (props: IProps) => {

    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<IProgressReportCategory[]>([]);
    const [assessments, setAssessments] = useState<IProgressReportAssessment[]>([]);
    const [examMarks, setExamMarks] = useState<IStudentExamMark[]>([]);

    const [studentAssessments, setStudentAssessments] = useState<IStudentAssessment[]>([]);
    const [filteredAssessments, setFilteredAssessments] = useState<IStudentAssessment[][]>([]);
    const [numOfAssessmentsPerCat, setNumOfAssessmentsPerCat] = useState<number[]>([]);

    //----   COMPONENT DID MOUNT   ----
    useEffect(() => {
        getCategories();
        getAssessments();
        getStudentAssessments();
        getExamMarks();
    }, []);

    //----   ON ASSESSMENTS CHANGE   ----
    useEffect(() => {
        assessments.length > 0 &&
            getNumberOfAssessmentsPerCategory();
    }, [assessments]);

    //----   ON STUDENT ASSESSMENTS CHANGE   ----
    useEffect(() => {
        studentAssessments.length > 0 &&
            filterAssessmentsByStudent();
    }, [studentAssessments]);

    //----   GET CATEGORIES   ----
    const getCategories = async () => {
        setLoading(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_ALL_PROGRESS_REPORT_CATEGORIES + props.courseProgressReport.progressReportId, "");
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setCategories(result.data);
    }

    //----   GET ASSESSMENTS   ----
    const getAssessments = async () => {
        setLoading(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_ALL_ASSESSMENTS_FOR_PROGRESS_REPORT + props.courseProgressReport.progressReportId, "");
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setAssessments(result.data);
    }

    //----   GET STUDENT ASSESSMENTS   ----
    const getStudentAssessments = async () => {
        setLoading(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_ALL_STUDENT_ASSESSMENTS_FOR_COURSE_PROGRESS_REPORT + props.courseProgressReport.id, "");
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setStudentAssessments(result.data);
    }

    //----   GET EXAM MARKS   ----
    const getExamMarks = async () => {
        setLoading(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_ALL_EXAM_MARKS_FOR_PROGRESS_REPORT + props.courseProgressReport.id, "");
        console.log(result);
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setExamMarks(result.data);
    }

    //----   FILTER ASSESSMENTS   ----
    const filterAssessmentsByStudent = () => {

        let filtered: Map<string, IStudentAssessment[]> = new Map();

        studentAssessments.forEach(assessment => {
            let arr = filtered.get(assessment.studentNumber);
            if (arr === undefined)
                arr = [assessment];
            else
                arr.push(assessment);

            filtered.set(assessment.studentNumber, arr);
        });

        let arr: IStudentAssessment[][] = [];
        filtered.forEach((value, key) => {
            arr.push(value);
        });

        setFilteredAssessments(arr);
    }

    //----   GET NUMBER OF ASSESSMENTS PER CATEGORY   ----
    const getNumberOfAssessmentsPerCategory = () => {
        let numOfAssessments: number[] = [];

        categories.forEach((cat) => {
            numOfAssessments.push(assessments.filter(a => a.progressReportCategoryId === cat.id).length);
        });

        setNumOfAssessmentsPerCat(numOfAssessments);
    }

    return (
        <div className="rounded full-size mark-sheet">
            <div className="vert-flex mark-sheet-header">
                <h3>{props.courseProgressReport.name}</h3>
            </div>
            <div className="mark-sheet-table">
                {
                    !loading &&
                    <Table responsive striped bordered>
                        <thead>
                            <tr>
                                <th></th>

                                {
                                    categories.map((cat, index) => {
                                        return (
                                            <>
                                                <th key={index} colSpan={numOfAssessmentsPerCat[index]}>{cat.name}</th>
                                                <td className="mark-sheet-total">Total</td>
                                            </>
                                        );
                                    })
                                }

                                <th>Exam Mark</th>
                                <th className="mark-sheet-final">Final Mark</th>
                            </tr>
                            <tr>
                                <th></th>

                                {
                                    assessments.map((a, index) => {
                                        return (
                                            <>
                                                <td key={index}>{a.name} ({a.marksAvailable})</td>
                                                {
                                                    ((index < assessments.length - 1 && a.progressReportCategoryId !== assessments[index + 1].progressReportCategoryId) || index === assessments.length - 1) &&
                                                    <th className="mark-sheet-total">{assessments.filter(f => f.progressReportCategoryId === a.progressReportCategoryId).reduce((total, curr) => total += curr.marksAvailable, 0)}</th>
                                                }
                                            </>
                                        );
                                    })
                                }

                                <th>
                                    {
                                        examMarks.length > 0 &&
                                        examMarks[0].examMarksAvailable
                                    }
                                </th>
                                <th className="mark-sheet-final">%</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                filteredAssessments.map((s, index) => {
                                    return (
                                        <MarkSheetRecord key={index} categories={categories} assessments={s} examMarks={examMarks.filter(e => e.studentNumber === s[0].studentNumber)} examWeight={props.courseProgressReport.examWeight} numberOfTerms={props.courseProgressReport.numberOfTerms} context={props.context} />
                                    );
                                })
                            }
                        </tbody>
                    </Table>
                }
                {
                    loading &&
                    <Loading />
                }
            </div>
        </div>
    );
}

export default MarkSheet;