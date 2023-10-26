import { useEffect, useState } from "react";
import { Modal, Tab, Table, Tabs } from "react-bootstrap";
import { Connection, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { IGlobalContext, IResponse } from "../../interfaces/general_interfaces";
import { IDevelopmentAssessment, IDevelopmentAssessmentGrade, IDevelopmentCategory, IDevelopmentGroup, IPersonaCategory, IPersonaGrade, IReport, IReportDetails, IReportGroup } from "../../interfaces/report-interfaces";
import { errorToast, successToast } from "../../shared-components/alert-components/toasts";
import { INPUT_TYPE } from "../add-edit-component-V2/AddEditComponentV2";
import EditableCell from "../editable-cell/editableCell";
import EditableTable from "../editable-component/editableComponent";
import Loading from "../loading-component/loading";

interface IProps {
    context: IGlobalContext,
    studentProgressReportId: number,

    devGroups?: IDevelopmentGroup[],
    devCats?: IDevelopmentCategory[],
    devAssessments?: IDevelopmentAssessment[],
}

const PrePrimaryAssessmentEdit = (props: IProps) => {

    const [loading, setLoading] = useState(false);

    const [devGroups, setDevGroups] = useState<IDevelopmentGroup[]>([]);
    const [devCats, setDevCats] = useState<IDevelopmentCategory[]>([]);
    const [devAssessments, setDevAssessments] = useState<IDevelopmentAssessment[]>([]);
    const [devGrades, setDevGrades] = useState<IDevelopmentAssessmentGrade[]>([]);
    const [terms, setTerms] = useState(4);


    // COMPONENT DID MOUNT
    useEffect(() => {
        props.devGroups !== undefined ? setDevGroups(props.devGroups) : getDevGroups();
        props.devCats !== undefined ? setDevCats(props.devCats) : getDevCategories();
        props.devAssessments !== undefined ? setDevAssessments(props.devAssessments) : getDevAssessments();
        getDevAssGrades();
    }, []);

    //----   ON PERSONA GRADES CHANGE   ----
    useEffect(() => {
        if (devGrades.length > 0) {
            let allTerms = devGrades.map(dg => dg.term);
            let maxTerms = Math.max(...allTerms);
            setTerms(maxTerms);
        }
    }, [devGrades]);

    //----   GET DEVELOPMENT GROUPS   ----
    const getDevGroups = async () => {
        setLoading(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_DEV_GROUPS, "");
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setDevGroups(result.data);
    }

    //----   GET DEVELOPMENT CATEGORIES   ----
    const getDevCategories = async () => {
        setLoading(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_DEV_CATEGORIES, "");
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setDevCats(result.data);
    }

    //----   GET DEVELOPMENT ASSESSMENTS   ----
    const getDevAssessments = async () => {
        setLoading(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_DEV_ASSESSMENTS, "");
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setDevAssessments(result.data);
    }

    //----   GET DEVELOPMENT ASSESSMENT GRADES   ----
    const getDevAssGrades = async () => {
        setLoading(true);
        let qry = GET_ENDPOINT.GET_DEV_ASSESSMENT_GRADES.toString();
        qry = qry.replace("{studentProgressReportId}", props.studentProgressReportId.toString());
        let result: IResponse = await Connection.getRequest(qry, "");
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setDevGrades(result.data);
    }

    //----   UPDATE DEV GRADE   ----
    const updateDevGrade = async (id: number, grade: string): Promise<boolean> => {

        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.UPDATE_DEVELOPMENT_ASSESSMENT_GRADE, { id: id, grade: grade }, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        return true;
    }

    return (
        <div>
            {
                !loading &&
                devGroups.map((group, catIndex) => {
                    return (
                        <div key={catIndex}>
                            <Table responsive bordered className="student-report-edit-table">
                                <thead>
                                    <tr style={{ backgroundColor: "#eee" }}>
                                        <th colSpan={terms + 1}>
                                            <h4>{group.name}:</h4>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        devCats.filter(p => p.groupId == group.id).map((cat, personaIndex) => {
                                            return (
                                                <>
                                                    <tr>
                                                        <td><b>{cat.name}</b></td>
                                                        {
                                                            terms > 0 &&
                                                            [...Array(terms)].map((_, index) => {
                                                                return (
                                                                    <th style={{ backgroundColor: "#eeefff" }}>{index + 1}</th>
                                                                );
                                                            })
                                                        }
                                                    </tr>
                                                    {
                                                        devAssessments.filter(p => p.categoryId === cat.id).map((ass, pgIndex) => {
                                                            return (
                                                                <tr>
                                                                    <td width={"50%"}>{ass.name}: </td>
                                                                    {
                                                                        devGrades.filter(g => g.assessmentId === ass.id && g.term <= terms).sort((a, b) => a.term - b.term).map((grade, gIndex) => {
                                                                            return (
                                                                                <td style={{ minWidth: "60px" }}>
                                                                                    <EditableCell size={100} initialValue={grade.grade} onUpdate={(val) => updateDevGrade(grade.id, val)} />
                                                                                </td>
                                                                            );
                                                                        })
                                                                    }
                                                                </tr>
                                                            );
                                                        })
                                                    }
                                                </>
                                            );
                                        })
                                    }
                                </tbody>
                            </Table>
                        </div>
                    );
                })
            }
            {
                loading &&
                <Loading />
            }
        </div>
    );
}

export default PrePrimaryAssessmentEdit;