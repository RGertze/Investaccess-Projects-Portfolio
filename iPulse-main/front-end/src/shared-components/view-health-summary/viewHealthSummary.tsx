import { useEffect, useState } from "react";
import { Button, Form, Modal, ModalBody, ModalHeader } from "react-bootstrap";
import { EditorState, ContentState, convertFromHTML, convertToRaw, convertFromRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import Loading from "../loading-component/loading";
import { GlobalContext } from "../../contexts/globalContext";
import { IGlobalContext, IResponse, UserType } from "../../interfaces/general_interfaces";
import { IHealthSummarySingle } from "../../interfaces/general_health_interfaces";
import { errorToast, successToast } from "../alert-components/toasts";
import { Connection, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";

interface IProps {
    context: IGlobalContext,
    hide(): void,

    summaryId: number,
}

const ViewHealthSummary = (props: IProps) => {
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [originalEditorState, setOriginalEditorState] = useState(EditorState.createEmpty());

    const [summary, setSummary] = useState<IHealthSummarySingle>();

    useEffect(() => {
        getHealthSummary();
    }, []);

    useEffect(() => {
        if (summary) {
            let rawContent = JSON.parse(summary.content);
            let contentState = convertFromRaw(rawContent);
            let newEditorState = EditorState.createWithContent(contentState);
            setEditorState(newEditorState);
        }
    }, [summary]);

    useEffect(() => {
        if (!editing) {
            setOriginalEditorState(editorState);
        }
    }, [editorState]);

    //----   GET HEALTH SUMMARY   ----
    const getHealthSummary = async () => {
        setLoading(true);
        let qry = GET_ENDPOINT.GET_SINGLE_HEALTH_SUMMARY.toString();
        qry = qry.replace("{summaryId}", props.summaryId.toString());
        let result: IResponse = await Connection.getRequest(qry, "");
        setLoading(false);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return;
        }

        setSummary(result.data);
    }

    //----   UPDATE SUMMARY   ----
    const updateSummary = async () => {
        if (!summary) {
            errorToast("Summary not loaded");
            return;
        }

        setLoading(true);

        let raw = convertToRaw(editorState.getCurrentContent());

        let dataToSend = {
            id: summary.id,
            content: JSON.stringify(raw)
        }

        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.UPDATE_HEALTH_SUMMARY, dataToSend, {});
        setLoading(false);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }
        setEditing(false);
        setOriginalEditorState(editorState);
        successToast("Health summary saved", true, 1500);

        return true;
    }

    return (
        <Modal size="lg" show={true} onHide={() => props.hide()}>
            <ModalHeader style={{ backgroundColor: props.context.theme.tertiary, color: props.context.theme.primary }} closeButton>
                <h2>View Summary</h2>
            </ModalHeader>
            <ModalBody>
                {
                    <Form>

                        <Form.Group className="mb-3">
                            <Form.Label className="vert-flex space-between">
                                {
                                    (!editing && summary && props.context.userId === summary.doctorId) &&
                                    <Button onClick={() => setEditing(true)} variant="success">Edit</Button>
                                }
                            </Form.Label>
                            <Editor
                                toolbarHidden={!editing}
                                readOnly={!editing}
                                toolbarStyle={{
                                    position: "sticky",
                                    top: 0,
                                    zIndex: 1000
                                }}
                                editorState={editorState}
                                editorClassName="border"
                                onEditorStateChange={(editorState) => setEditorState(editorState)}
                            />
                        </Form.Group>


                        {
                            editing &&
                            <div className="vert-flex hor-center w-25 space-between">
                                <Button onClick={() => {
                                    setEditing(false);
                                    setEditorState(originalEditorState);
                                }} variant="outline-primary">Cancel</Button>
                                <Button onClick={() => updateSummary()} variant="success">Save</Button>
                            </div>
                        }
                    </Form>
                }
                {
                    loading &&
                    <Loading />
                }
            </ModalBody>
            <Modal.Footer>
                <Button onClick={() => props.hide()} variant="outline-primary">Close</Button>
            </Modal.Footer>
        </Modal >
    );
}

export default ViewHealthSummary;