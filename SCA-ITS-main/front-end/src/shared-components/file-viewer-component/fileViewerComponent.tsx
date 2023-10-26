import { AxiosRequestConfig } from 'axios';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Button, Modal, ProgressBar } from 'react-bootstrap';
import { Connection, POST_ENDPOINT } from '../../connection';
import { IGlobalContext, IResponse, ISignedGetRequest } from '../../interfaces/general_interfaces';
import { errorToast } from '../alert-components/toasts';
import Loading from '../loading-component/loading';
import "./fileViewerComponent.css";

enum FILE_TYPE {
    PDF = "pdf",
    PNG = "png",
    JPG = "jpg",
    WEBP = "webp",
    JPEG = "jpeg",
    GIF = "gif",
    APNG = "apng",
    AVIF = "avif",
    BMP = "bmp",
}

interface IProps {
    context: IGlobalContext,
    filePath: string,
    fileName: string,
    hide(): void,
}

const FileViewerComponent = (props: IProps) => {

    const [loading, setLoading] = useState(false);
    const [extension, setExtension] = useState<FILE_TYPE>();
    const [url, setUrl] = useState("");

    // COMPONENT DID MOUNT 
    useEffect(() => {
        findExtension();
        getSignedUrl();
    }, []);

    //----   FIND EXTENSION   ----
    const findExtension = async () => {
        let ext = props.filePath.substring(props.filePath.lastIndexOf(".") + 1);
        console.log(ext);
        switch (ext) {
            case FILE_TYPE.PDF:
                setExtension(FILE_TYPE.PDF);
                break;
            case FILE_TYPE.JPG:
                setExtension(FILE_TYPE.JPG);
                break;
            case FILE_TYPE.PNG:
                setExtension(FILE_TYPE.PNG);
                break;
            case FILE_TYPE.WEBP:
                setExtension(FILE_TYPE.WEBP);
                break;
            case FILE_TYPE.JPEG:
                setExtension(FILE_TYPE.JPEG);
                break;
            case FILE_TYPE.GIF:
                setExtension(FILE_TYPE.GIF);
                break;
            case FILE_TYPE.APNG:
                setExtension(FILE_TYPE.APNG);
                break;
            case FILE_TYPE.AVIF:
                setExtension(FILE_TYPE.AVIF);
                break;
            case FILE_TYPE.BMP:
                setExtension(FILE_TYPE.BMP);
                break;

            default:
                errorToast("File type not supported", true, 2000);
                props.hide();
        }
    }

    //----   GET SIGNED URL   ----
    const getSignedUrl = async () => {
        if (props.filePath === "" || !props.filePath) {
            errorToast("File does not exist");
            return;
        }

        setLoading(true);

        // get signed get url
        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.GET_SIGNED_GET_URL, { filePath: props.filePath }, {});
        setLoading(false);
        if (result.errorMessage.length > 0) {
            errorToast("Failed to obtain URL", true, 2000);
            props.hide();
            return;
        }

        let signedUrl: ISignedGetRequest = result.data;
        setUrl(signedUrl.signedUrl);
    }

    return (
        <Modal style={{ zIndex: "999999" }} fullscreen show={true} onHide={() => props.hide()}>
            <Modal.Header closeButton>
                <Modal.Title>Viewing: {props.fileName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                    !loading &&
                    <>
                        {
                            extension === FILE_TYPE.PDF &&
                            <div className='w-100 h-100 file-viewer-pdf-container'>
                                <iframe className='hor-center file-viewer-pdf' width={1000} height={1000} src={url} frameBorder="0"></iframe>
                            </div>
                        }
                        {

                            extension !== FILE_TYPE.PDF &&
                            <img className='file-viewer-img' src={url} alt="" />
                        }
                    </>
                }
                {
                    loading &&
                    <Loading />
                }
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={() => { props.hide(); }}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default FileViewerComponent;