import moment from "moment";
import { useEffect, useState } from "react";
import { Button, Form, FormControl, FormGroup, FormText } from "react-bootstrap";
import { PencilFill, X } from "react-bootstrap-icons";
import { Connection, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { IGlobalContext, IResponse } from "../../interfaces/general_interfaces";
import { IStudent } from "../../interfaces/student_interfaces";
import { errorToast, successToast } from "../alert-components/toasts";
import Loading from "../loading-component/loading";

interface IProps {
    context: IGlobalContext,
    studentNumber: string,
    editable: boolean
}

export const StudentInterviewDetailsComponent = (props: IProps) => {

    const [loading, setLoading] = useState(false);
    const [editingDate, setEditingDate] = useState(false);
    const [editingComments, setEditingComments] = useState(false);

    const [date, setDate] = useState("");
    const [comments, setComments] = useState("");

    useEffect(() => {
        getInterviewDetails();
    }, []);

    // get student interview details
    const getInterviewDetails = async () => {
        setLoading(true);
        let qry = GET_ENDPOINT.GET_STUDENT_INTERVIEW_DETAILS.toString();
        qry = qry.replace("{studentNumber}", props.studentNumber);
        let result: IResponse = await Connection.getRequest(qry, "");
        setLoading(false);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return;
        }

        if (result.data.interviewDate !== undefined && result.data.interviewDate !== null)
            setDate(moment(result.data.interviewDate, "DD-MM-YYYY").format("YYYY-MM-DD"));
        if (result.data.interviewComments !== undefined && result.data.interviewComments !== null)
            setComments(result.data.interviewComments);
    }

    // set interview date
    const updateDate = async () => {
        if (date === "") {
            errorToast("Enter a date!");
            return;
        }

        setLoading(true);
        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.UPDATE_STUDENT_INTERVIEW_DATE, {
            studentNumber: props.studentNumber,
            date: date
        }, {});
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            getInterviewDetails();
            return;
        }
        successToast("Date set!", true, 1500);
        setEditingDate(false);
    }

    // update interview comments
    const updateComments = async () => {
        if (comments === "") {
            errorToast("Enter your comments!");
            return;
        }

        setLoading(true);
        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.UPDATE_STUDENT_INTERVIEW_COMMENTS, {
            studentNumber: props.studentNumber,
            comments: comments
        }, {});
        setLoading(false);
        if (result.errorMessage && result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            getInterviewDetails();
            return;
        }
        successToast("Comments updated", true, 1500);
        setEditingComments(false);
    }

    return (
        <div>

            {
                loading &&
                <Loading />
            }

            <Form className="m-2">
                <FormGroup >
                    <div className="vert-flex space-between">
                        <h3>Interview Date</h3>
                        {
                            (props.editable && !editingDate) &&
                            <PencilFill onClick={() => setEditingDate(true)} className="icon-sm hover" />
                        }
                    </div>
                    <FormText>
                        {
                            props.editable &&
                            "Set a date to interview the student!"
                        }
                        {
                            !props.editable &&
                            "This is the date on which this student will be interviewed!"
                        }
                    </FormText>
                    <FormControl onChange={(e) => setDate(e.target.value)} disabled={!editingDate} type={"date"} value={date} />
                </FormGroup>
                {
                    editingDate &&
                    <>
                        <Button onClick={() => { setEditingDate(false); getInterviewDetails(); }} variant="danger">Cancel</Button>
                        <Button onClick={() => updateDate()} variant="success" className="m-3">Save</Button>
                    </>
                }
            </Form>

            <Form className="m-2">
                <FormGroup >
                    <div className="vert-flex space-between">
                        <h3>Interview Comments</h3>
                        {
                            (props.editable && !editingComments) &&
                            <PencilFill onClick={() => setEditingComments(true)} className="icon-sm hover" />
                        }
                    </div>
                    <FormText>
                        {
                            props.editable &&
                            "Provide the student with feedback on their interview or just share your thoughts."
                        }
                        {
                            !props.editable &&
                            "Once the interview is completed, the interviewer will share their feedback with you here."
                        }
                    </FormText>
                    <Form.Control onChange={(e) => setComments(e.target.value)} disabled={!editingComments} as={"textarea"} rows={5} value={comments} />
                </FormGroup>
                {
                    editingComments &&
                    <>
                        <Button onClick={() => { setEditingComments(false); getInterviewDetails(); }} variant="danger">Cancel</Button>
                        <Button onClick={() => updateComments()} variant="success" className="m-3">Save</Button>
                    </>
                }
            </Form>
        </div>
    );
}