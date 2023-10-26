import { ReactNode, useEffect, useState } from "react";
import { IGlobalContext, IResponse, ISignedPutRequest } from "../../interfaces/general_interfaces";
import UserAccountComponent from "../user-account-component/userAccountComponent";
import { PencilSquare } from "react-bootstrap-icons";
import "./userAccountPage.css";
import { Button, Form, Modal, ProgressBar } from "react-bootstrap";
import { Connection, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { AxiosRequestConfig } from "axios";
import { errorToast, successToast } from "../alert-components/toasts";

interface IProps {
    context: IGlobalContext,
    children?: ReactNode
}

let UserAccountPage = (props: IProps) => {

    const [editingProfilePic, setEditingProfilePic] = useState(false);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [file, setFile] = useState<File>();

    const [profilePicUrl, setProfilePicUrl] = useState("");

    // Component did mount
    useEffect(() => {
        getProfilePicUrl();
    }, []);

    // GET PROFILE PIC URL
    const getProfilePicUrl = async () => {
        // get path
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_USER_PROFILE_PIC + props.context.userId, "");
        if (result.errorMessage.length > 0) {
            errorToast("Failed to get profile pic url: " + result.errorMessage, true);
            return;
        }

        let path: string = result.data.profilePicPath;
        let data = {
            filePath: path
        }

        console.log(data);

        // get signed get url
        result = await Connection.postRequest(POST_ENDPOINT.GET_SIGNED_GET_URL, data, {});
        if (result.errorMessage.length > 0) {
            errorToast("Failed to get profile pic url: " + result.errorMessage, true);
            return;
        }

        setProfilePicUrl(result.data.signedUrl);
    }


    // UPDATE PROFILE PIC
    const updateProfilePic = async () => {

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
            errorToast(result.errorMessage, true);
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
            errorToast("Failed to upload file. Try again later", true);
            setLoading(false);
            return;
        }

        // send profile pic data to server
        let data = {
            userId: props.context.userId,
            profilePicPath: signedUrl.filePath
        }

        result = await Connection.postRequest(POST_ENDPOINT.UPDATE_USER_PROFILE_PIC, data, {});
        setLoading(false);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true);
            return;
        }

        setEditingProfilePic(false);
        setFile(undefined);
        getProfilePicUrl();
        successToast("Successfully updated profile pic!", true);
    }

    // VALIDATE FILE
    const validateFile = (): boolean => {

        // check if file has been chosen
        if (file === undefined) {
            errorToast("Choose a file", true);
            return false;
        }

        // check for correct file extension
        let ext = file.name.split(".").pop();
        if (ext !== "png" && ext !== "jpg" && ext !== "jpeg" && ext !== "webp") {
            errorToast("Only jpg/jpeg, webp, or png files accepted", true);
            return false;
        }

        return true;
    }

    return (
        <div className="user-account-container">

            <div className="hor-center vert-flex user-account-header"><h2 >Account Settings</h2></div>

            <div className="vert-flex space-evenly hor-center user-component-container">
                <div className="vert-flex user-image">
                    <img className="rounded-circle " src={profilePicUrl !== "" ? profilePicUrl : "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"} />
                    <PencilSquare className="hover" onClick={() => setEditingProfilePic(true)} size={20} />

                    {
                        // Update profile pic

                        <Modal show={editingProfilePic} onHide={() => setEditingProfilePic(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Update Profile Picture</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Form.Group>
                                        <Form.Label>Choose a profile pic</Form.Label>
                                        <Form.Control type="file" onChange={(e) => setFile((e as any).target.files[0])} accept="image/png, image/jpeg" />
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
                                <Button variant="secondary" onClick={() => setEditingProfilePic(false)}>
                                    Cancel
                                </Button>
                                <Button variant="primary" onClick={() => updateProfilePic()}>
                                    Save Changes
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    }
                </div>
                <div className="vert-flex user-component">
                    <UserAccountComponent userId={props.context.userId} />
                </div>
            </div>

            <div className="hor-center rounded shadow user-account-tabs-container">
                {props.children && props.children}
            </div>
        </div>
    );
}


export default UserAccountPage;