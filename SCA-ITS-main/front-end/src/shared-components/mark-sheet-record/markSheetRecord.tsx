import { useEffect, useState } from "react";
import { IGlobalContext } from "../../interfaces/general_interfaces";
import { IProgressReportCategory, IStudentAssessment, IStudentExamMark } from "../../interfaces/progress_report_interfaces";
import MarkSheetCell from "../mark-sheet-cell/markSheetCell";
import "./markSheetRecord.css";


interface IUpdatMark {
    termIndex: number,
    categoryIndex: number,
    assessmentIndex: number,
    newMark: number
}

interface ITerm {
    categories: IStudentAssessment[][]
}

interface IProps {
    numberOfTerms: number,
    categories: IProgressReportCategory[],
    assessments: IStudentAssessment[],
    examMarks: IStudentExamMark[],
    examWeight: number,
    context: IGlobalContext
}

const MarkSheetRecord = (props: IProps) => {
    const [terms, setTerms] = useState<ITerm[]>([])
    const [examMarks, setExamMarks] = useState<IStudentExamMark[]>([]);

    //----   COMPONENT DID MOUNT   ----
    useEffect(() => {
        setExamMarks(props.examMarks);
    }, []);

    useEffect(() => {
        filterAssessmentsByTerm();
    }, [props.assessments]);


    //----   FILTER ASSESSMENTS BY TERM   ----
    const filterAssessmentsByTerm = () => {
        let terms: ITerm[] = [];

        for (let i = 1; i <= props.numberOfTerms; i++) {
            // get assessments for term and sort by categoryId in ascending order
            let termAssessments = props.assessments.filter(a => a.term === i).sort((a, b) => a.categoryId - b.categoryId);

            let categories: IStudentAssessment[][] = [];
            let tempArr: IStudentAssessment[] = [];

            // filter term assessments by category
            for (let j = 0; j < termAssessments.length; j++) {

                // create new category array when categoryId changes
                if (j > 0 && termAssessments[j].categoryId !== termAssessments[j - 1].categoryId) {

                    // sort category assessments by id and push
                    categories.push(tempArr.sort((a, b) => a.id - b.id));

                    // clear temp arr
                    tempArr = [];
                }
                tempArr.push(termAssessments[j]);
            }

            // push last category not added in loop
            categories.push(tempArr.sort((a, b) => a.id - b.id));

            terms.push({ categories: categories });
        }

        setTerms(terms);
    }

    //----   GET FINAL MARK   ----
    const getFinalMark = (term: ITerm, index: number): string => {
        let totalPercentages: number[] = [];
        let weights: number[] = props.categories.map(cat => cat.weight);

        term.categories.forEach((cat) => {
            let total = 0;
            let totalAvail = 0;
            cat.forEach((assessment) => {
                total += assessment.mark;
                totalAvail += assessment.marksAvailable;
            });
            totalPercentages.push(total / totalAvail * 100);
        });

        let finalAssessmentMark = totalPercentages.reduce((total, curr, index) => total + (curr * (weights[index] / 100)), 0);

        let finalMark = finalAssessmentMark * ((100 - props.examWeight) / 100);
        finalMark += ((examMarks[index].mark / examMarks[index].examMarksAvailable * 100) * (props.examWeight / 100));

        return finalMark.toFixed(2).toString();
    }

    //----   ADD TO UPDATE QUEUE   ----
    const addToUpdateQueue = async (val: IUpdatMark) => {
        if (val.categoryIndex === -1) {
            // get copy of examMarks
            let examsCopy = examMarks.slice();

            // update specific exam
            examsCopy[val.termIndex].mark = val.newMark;

            // update state 
            setExamMarks(examsCopy);
            return;
        }

        // get copy of terms
        let termsCopy = terms.slice();

        // update specific assessment
        termsCopy[val.termIndex].categories[val.categoryIndex][val.assessmentIndex].mark = val.newMark;

        // update state 
        setTerms(termsCopy);
    }

    return (
        <>
            {
                // map terms
                terms.map((term, index) => {
                    return (
                        <>
                            <tr key={index} className="mark-sheet-record">
                                <td><h6>{(index === 0) ? `${term.categories[0][0].firstName} ${term.categories[0][0].lastName}: ${term.categories[0][0].studentNumber}` : ""}</h6></td>
                                {
                                    // map categories
                                    term.categories.map((assessments, j) => {
                                        return (

                                            // map assessments in categories
                                            assessments.map((a, k) => {
                                                return (
                                                    <>
                                                        <td>
                                                            <MarkSheetCell onUpdate={async (mark) => {
                                                                addToUpdateQueue({
                                                                    termIndex: index,
                                                                    categoryIndex: j,
                                                                    assessmentIndex: k,
                                                                    newMark: mark
                                                                })
                                                            }} context={props.context} elem={a} />
                                                        </td>

                                                        {
                                                            (k === assessments.length - 1) &&
                                                            <td className="mark-sheet-total"><h6>{assessments.reduce((total, curr) => total + curr.mark, 0).toFixed(2)}</h6></td>
                                                        }
                                                    </>
                                                );
                                            })
                                        );
                                    })
                                }
                                <td>
                                    {
                                        props.examMarks[index] &&
                                        <MarkSheetCell onUpdate={async (mark) => {
                                            addToUpdateQueue({
                                                termIndex: index,
                                                categoryIndex: -1,
                                                assessmentIndex: -1,
                                                newMark: mark
                                            })
                                        }} context={props.context} elem={props.examMarks[index]} />
                                    }
                                </td>
                                <td className="mark-sheet-final">
                                    {
                                        examMarks[index] &&
                                        <h6>
                                            {
                                                getFinalMark(term, index)
                                            }
                                        </h6>
                                    }
                                </td>
                            </tr>
                        </>
                    )
                })
            }
        </>
    );
}

export default MarkSheetRecord;