import { AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';
import { Button, Form, Modal, ProgressBar } from 'react-bootstrap';
import { Connection, POST_ENDPOINT } from '../../connection';
import { IGlobalContext, IResponse, ISignedPutRequest } from '../../interfaces/general_interfaces';


interface IProps {
    context: IGlobalContext,
    saveDetails(fileName: string, filePath: string): Promise<boolean>,
    show: boolean,
    setShow(val: boolean): void
}

const UploadDocumentComponent = (props: IProps) => {

    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [file, setFile] = useState<File>();

    //----   UPLOAD FILE   ----
    const uploadFile = async () => {

        setLoading(true);
        setProgress(0);

        // validate file
        if (!validateFile()) {
            setLoading(false);
            return;
        }

        // get signed url
        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.GET_SIGNED_PUT_URL, { filename: file?.name }, {});
        console.log(result);
        if (result.errorMessage.length > 0) {
            alert(result.errorMessage);
            setLoading(false);
            return;
        }

        // upload to S3
        let signedUrl: ISignedPutRequest = result.data;

        let config: AxiosRequestConfig = {      //  -->  TRACKS UPLOAD PROGRESS
            onUploadProgress: (progressEvent) => {
                const { loaded, total } = progressEvent;
                let progress = Math.floor(loaded / total * 100);
                setProgress(progress);
            }
        }
        let uploadStatus = await Connection.uploadFile(signedUrl.signedUrl, file as File, config);

        if (uploadStatus !== 200) {
            alert("Failed to upload file. Try again later");
            setLoading(false);
            return;
        }

        // send profile pic data to server
        if (!await props.saveDetails(file?.name as string, signedUrl.filePath)) {
            alert("Failed to upload file. Try again later");
            setLoading(false);
            return;
        }

        props.setShow(false);
    }


    // VALIDATE FILE
    const validateFile = (): boolean => {

        // check if file has been chosen
        if (file === undefined) {
            alert("Choose a file");
            return false;
        }

        return true;
    }

    return (
        <Modal style={{ zIndex: "999999" }} show={props.show} onHide={() => props.setShow(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Upload file</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Choose a file</Form.Label>
                        <Form.Control type="file" onChange={(e) => setFile((e as any).target.files[0])} />
                    </Form.Group>
                </Form>
                {
                    loading &&
                    <div className="w-100 prg-bar">
                        <ProgressBar now={progress} label={`${progress}%`} />
                    </div>
                }
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => props.setShow(false)}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={() => uploadFile()}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default UploadDocumentComponent;