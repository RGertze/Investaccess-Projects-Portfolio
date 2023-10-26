import { renderToString } from 'react-dom/server'
import { useEffect, useState } from "react";
import { Button, Form, Modal, ModalBody, ModalHeader } from "react-bootstrap";
import { EditorState, ContentState, convertFromHTML, convertToRaw, convertFromRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import Loading from "../loading-component/loading";
import { GlobalContext } from "../../contexts/globalContext";

interface IProps {
    hide(): void,
    submit(jsonString: string): Promise<boolean>,
}

const AddHealthSummary = (props: IProps) => {
    const [loading, setLoading] = useState(false);

    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    useEffect(() => {
        const blocks = convertFromHTML(
            renderToString(
                <>
                    <h2><u>Overvall Summary:</u></h2>
                    <p><i>overview of patient health</i></p>
                    <h2><u>Current Treatments:</u></h2>
                    <ul>
                        <li></li>
                    </ul>
                    <h2><u>Current Medications:</u></h2>
                    <ul>
                        <li></li>
                    </ul>
                    <h2><u>Pre-Existing Conditions:</u></h2>
                    <ul>
                        <li></li>
                    </ul>
                    <h2><u>Notes:</u></h2>
                    <p><i>further notes by doctor</i></p>
                </>
            )
        );

        let newEditorState = EditorState.createWithContent(ContentState.createFromBlockArray(blocks.contentBlocks, blocks.entityMap));
        setEditorState(newEditorState);
    }, []);

    const submit = async () => {
        setLoading(true);
        let raw = convertToRaw(editorState.getCurrentContent());
        let jsonString = JSON.stringify(raw);
        await props.submit(jsonString);
        setLoading(false);
    }

    return (
        <GlobalContext.Consumer>
            {
                context => (
                    <Modal size="lg" show={true} onHide={() => props.hide()}>
                        <ModalHeader style={{ backgroundColor: context.theme.tertiary, color: context.theme.primary }} closeButton>
                            <h2>Adding Summary</h2>
                        </ModalHeader>
                        <ModalBody>
                            {
                                <Form>
                                    <Form.Group className="mb-3">
                                        <Editor
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
                                </Form>
                            }
                            {
                                loading &&
                                <Loading />
                            }
                        </ModalBody>
                        <Modal.Footer>
                            <Button onClick={() => props.hide()} variant="outline-primary">Cancel</Button>
                            <Button onClick={() => submit()} variant="success">Submit</Button>
                        </Modal.Footer>
                    </Modal>
                )
            }
        </GlobalContext.Consumer>
    );
}

export default AddHealthSummary;