import { useEffect, useState } from "react";
import { Button, Modal, Tab, Table, Tabs } from "react-bootstrap";
import { Connection, DELETE_ENDPOINT, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { IGlobalContext, IResponse, IUser } from "../../interfaces/general_interfaces";
import { ICourseRemark, IPersona, IPersonaCategory, IPersonaGrade, IReport, IReportDetails, IReportGroup } from "../../interfaces/report-interfaces";
import { errorToast, successToast } from "../../shared-components/alert-components/toasts";
import { INPUT_TYPE } from "../add-edit-component-V2/AddEditComponentV2";
import EditableCell from "../editable-cell/editableCell";
import EditableTable from "../editable-component/editableComponent";
import Loading from "../loading-component/loading";
import "./reportSheetStudent.css";

interface IProps {
    context: IGlobalContext,
    personaCategories: IPersonaCategory[],
    personas: IPersona[],
    report: IReport,
    terms: number
}

const ReportSheetStudent = (props: IProps) => {

    const [loading, setLoading] = useState(false);
    const [loadingReportDetails, setLoadingReportDetails] = useState(false);

    const [reportDetails, setReportDetails] = useState<IReportDetails>({ daysAbsent: 0, dominantHand: 0, personaBriefComments: "", registerTeacher: "", remarks: "" });
    const [personaGrades, setPersonaGrades] = useState<IPersonaGrade[]>([]);
    const [courseRemarks, setCourseRemarks] = useState<ICourseRemark[]>([]);

    // TAB VARIABLES
    const [tabKey, setTabKey] = useState('details');

    // COMPONENT DID MOUNT
    useEffect(() => {
        getReportDetails();
        getPersonaGrades();
        getCourseRemarks();
    }, []);

    //----   GET REPORT DETAILS   ----
    const getReportDetails = async () => {
        setLoadingReportDetails(true);

        let qry = GET_ENDPOINT.GET_REPORT_DETAILS.toString();
        qry = qry.replace("{reportId}", props.report.reportdId.toString());
        let result: IResponse = await Connection.getRequest(qry, "");

        setLoadingReportDetails(false);

        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        console.log(result.data);

        setReportDetails(result.data);
    }

    //----   GET PERSONA GRADES   ----
    const getPersonaGrades = async () => {
        setLoading(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_PERSONA_GRADES + props.report.reportdId, "");
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setPersonaGrades(result.data);
    }

    //----   GET COURSE REMARKS   ----
    const getCourseRemarks = async () => {
        setLoading(true);
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_COURSE_REMARKS + props.report.reportdId, "");
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        setCourseRemarks(result.data);
    }

    //----   UPDATE REPORT DETAILS   ----
    const updateReportDetails = async (data: any): Promise<boolean> => {

        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.UPDATE_REPORT_DETAILS, {
            id: props.report.reportdId,
            daysAbsent: data.daysAbsent,
            dominantHand: null,
            remarks: null,
            personaBriefComments: data.personaBriefComments,
            registerTeacher: data.registerTeacher,
        }, {});
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }
        successToast("Details updated", true, 1500);
        getReportDetails();
        return true;
    }

    //----   UPDATE PERSONA GRADE   ----
    const updatePersonaGrade = async (id: number, grade: string): Promise<boolean> => {

        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.UPDATE_PERSONA_GRADE, { id: id, grade: grade }, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        return true;
    }

    //----   UPDATE COURSE REMARK   ----
    const updateCourseRemark = async (id: number, remark: string, initials: string): Promise<boolean> => {

        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.UPDATE_COURSE_REMARK, { id: id, remark: remark, initials: initials }, {});
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }

        return true;
    }

    return (
        <div className="report-sheet-student-container">
            <h2 className="report-sheet-student">{props.report.firstName} {props.report.lastName}</h2>
            <div style={{ overflow: "auto" }}>
                <Tabs activeKey={tabKey} onSelect={(e) => setTabKey(e ? e : "persona")}>
                    <Tab eventKey={`details`} title={`Details`} className="student-single-report-persona-tab">
                        <EditableTable
                            title={`Report details`}
                            id={props.report.reportdId}
                            data={
                                [
                                    { key: "daysAbsent", name: "Days Absent: ", value: reportDetails.daysAbsent, type: INPUT_TYPE.NUMBER, },
                                    { key: "registerTeacher", name: "Register Teacher: ", value: reportDetails.registerTeacher, type: INPUT_TYPE.TEXT, },
                                    { key: "personaBriefComments", name: "Persona Brief Comments: ", value: reportDetails.personaBriefComments, type: INPUT_TYPE.TEXT, },
                                ]
                            }
                            loading={loadingReportDetails}
                            onEdit={updateReportDetails}
                        />
                    </Tab>
                    <Tab eventKey={`persona`} title={`Persona`} className="student-report-persona-tab">
                        {
                            !loading &&
                            props.personaCategories.map((cat, catIndex) => {
                                return (
                                    <Table key={catIndex} responsive bordered striped className="student-report-edit-table">
                                        <thead>
                                            <tr>
                                                <td colSpan={props.personas.filter(p => p.categoryId === cat.id).length + 1}>
                                                    {cat.name}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                {
                                                    props.personas.filter(p => p.categoryId === cat.id).map((persona, personaIndex) => {
                                                        return (
                                                            <td key={personaIndex}>{persona.name}</td>
                                                        );
                                                    })
                                                }
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                [...Array(props.terms)].map((_, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            {
                                                                personaGrades.filter(p => p.term === index + 1 && p.categoryId === cat.id).map((pGrade, pGradeIndex) => {
                                                                    return (
                                                                        <td key={pGradeIndex}>
                                                                            <EditableCell size={100} initialValue={pGrade.grade} onUpdate={(val) => updatePersonaGrade(pGrade.id, (val as string).toUpperCase())} />
                                                                        </td>
                                                                    );
                                                                })
                                                            }
                                                        </tr>
                                                    );
                                                })
                                            }
                                        </tbody>
                                    </Table>
                                );
                            })
                        }
                        {
                            loading &&
                            <Loading />
                        }
                    </Tab>

                    <Tab eventKey={`course-remarks`} title={`Course Remarks`} className="student-report-persona-tab">
                        {
                            // course remarks
                            <Table bordered striped>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Remark</th>
                                        <th>Initials</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        !loading &&
                                        courseRemarks.map((courseRemark, index) => {
                                            return (
                                                <tr>
                                                    <td>{courseRemark.courseName}:</td>
                                                    <td><EditableCell size={100} initialValue={courseRemark.remark} onUpdate={(val) => updateCourseRemark(courseRemark.id, val, courseRemark.initials)} /></td>
                                                    <td><EditableCell size={100} initialValue={courseRemark.initials} onUpdate={(val) => updateCourseRemark(courseRemark.id, courseRemark.remark, val)} /></td>
                                                </tr>
                                            );
                                        })
                                    }
                                    {
                                        (!loading && courseRemarks.length === 0) &&
                                        <tr>
                                            <td colSpan={3}>Nothing to show</td>
                                        </tr>
                                    }
                                    {
                                        loading &&
                                        <tr>
                                            <td colSpan={3}><Loading /></td>
                                        </tr>
                                    }
                                </tbody>
                            </Table>
                        }

                    </Tab>
                </Tabs>
            </div>
        </div >
    );
}

export default ReportSheetStudent;