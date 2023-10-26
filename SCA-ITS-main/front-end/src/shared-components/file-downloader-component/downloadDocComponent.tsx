import { AxiosRequestConfig } from 'axios';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Button, Modal, ProgressBar } from 'react-bootstrap';
import { Connection, POST_ENDPOINT } from '../../connection';
import { IGlobalContext, IResponse, ISignedGetRequest } from '../../interfaces/general_interfaces';
import { errorToast } from '../alert-components/toasts';


interface IProps {
    context: IGlobalContext,
    filePath: string,
    fileName: string,
    show: boolean,
    hide(): void,

    directDownload?: boolean,

    extension?: string
}

const DownloadDocumentComponent = (props: IProps) => {

    const [loading, setLoading] = useState(false);
    const controller = new AbortController();
    const [progress, setProgress] = useState(0);
    const [file, setFile] = useState<Blob>();

    // COMPONENT DID MOUNT 
    useEffect(() => {
        setupUrl();
    }, []);

    // COMPONENT WILL UNMOUNT
    useLayoutEffect(() => {
        // cancel download if user closes component
        return () => {
            console.log("download canceled");
            if (progress !== 100) {
                controller.abort();
            }
        }
    }, []);

    //----   SETUP URL   ----
    const setupUrl = async () => {
        if (props.filePath === "" || !props.filePath) {
            errorToast("File does not exist");
            return;
        }

        setLoading(true);
        setProgress(0);

        if (!props.directDownload) {
            // get signed get url
            let result: IResponse = await Connection.postRequest(POST_ENDPOINT.GET_SIGNED_GET_URL, { filePath: props.filePath }, {});
            console.log(result);
            if (result.errorMessage.length > 0) {
                errorToast(result.errorMessage, true, 2000);
                props.hide();
                return;
            }

            let signedUrl: ISignedGetRequest = result.data;

            return performDownload(signedUrl.signedUrl);
        }

        performDownload(props.filePath);
    }

    //----   PERFORM DOWNLOAD   ----
    const performDownload = async (downloadUrl: string) => {
        // setup config to handle download progress and cancel events
        let config: AxiosRequestConfig = {
            responseType: "blob",
            signal: controller.signal,      //  CANCEL DOWNLOAD IF NECESSARY
            onDownloadProgress: (progressEvent) => { //  -->  TRACK DOWNLOAD PROGRESS
                const { loaded, total } = progressEvent;
                let progress = Math.floor(loaded / total * 100);
                setProgress(progress);
            }
        }

        let fileData: IResponse;

        // start download
        if (props.directDownload) {
            fileData = await Connection.downloadBackEndFile(downloadUrl, config);
        } else {
            fileData = await Connection.downloadS3File(downloadUrl, config);
        }
        if (fileData.errorMessage && fileData.errorMessage.length > 0) {
            errorToast(fileData.errorMessage, true, 2000);
            props.hide();
            return;
        }

        // create download url
        const url = window.URL.createObjectURL(new Blob([fileData.data]));

        // create a node
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
            'download',
            `${props.fileName}${props.extension ? `.${props.extension}` : ""}`,
        );

        // Append to html link element page
        document.body.appendChild(link);

        // Start download
        link.click();

        // Clean up and remove the link
        link.remove();

        props.hide();
    }

    return (
        <Modal style={{ zIndex: "999999" }} show={props.show} onHide={() => props.hide()}>
            <Modal.Header closeButton>
                <Modal.Title>Downloading {props.fileName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                    loading &&
                    <div className="w-100 prg-bar">
                        <ProgressBar now={progress} label={`${progress}%`} />
                    </div>
                }
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={() => { controller.abort(); props.hide(); }}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default DownloadDocumentComponent;