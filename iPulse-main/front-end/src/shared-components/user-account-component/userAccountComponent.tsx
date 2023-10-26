import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Connection, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { IUser } from "../../interfaces/general_interfaces";
import { errorToast, successToast } from "../alert-components/toasts";
import Loading from "../loading-component/loading";
import "./userAccountComponent.css";

interface IProps {
    userId: number
}

let UserAccountComponent = (props: IProps) => {

    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);

    const [user, setUser] = useState<IUser>({
        userId: 0,
        email: "",
        firstName: "",
        lastName: "",
        profilePicPath: ""
    });

    useEffect(() => {
        getUserDetails();
    }, []);

    // GET USER DETAILS 
    const getUserDetails = async () => {
        setLoading(true);
        let result = await Connection.getRequest(GET_ENDPOINT.GET_USER + props.userId, "");
        setLoading(false);
        if (result.errorMessage.length > 0) {
            console.log(result.errorMessage);
            errorToast("Failed to get user details" + result.errorMessage, true);
            return;
        }
        setLoading(false);
        setUser(result.data);
    }

    // UPDATE USER DETAILS 
    const updateUserDetails = async () => {
        setLoading(true);

        if (!validateUserDetails()) {
            setLoading(false);
            return;
        }

        let result = await Connection.postRequest(POST_ENDPOINT.UPDATE_USER, user, {});
        setLoading(false);

        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true);
            return;
        }

        setEditing(false);
        successToast("User updated", true)
        getUserDetails();
    }

    // VALIDATE USER DETAILS 
    const validateUserDetails = (): boolean => {
        if (user.firstName === "") {
            errorToast("Enter a first name!");
            return false;
        }
        if (user.lastName === "") {
            errorToast("Enter a last name!");
            return false;
        }

        return true;
    }

    return (
        <div className="rounded user-account-component-container">
            <Form>
                <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="" value={user.email} disabled />
                </Form.Group>
                <Row>
                    <Form.Group as={Col} className="mb-3" controlId="formFirstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control onChange={ev => setUser({ ...user, firstName: ev.target.value })} type="text" placeholder="" value={user.firstName} disabled={!editing} />
                    </Form.Group>
                    <Form.Group as={Col} className="mb-3" controlId="formFormLastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control onChange={ev => setUser({ ...user, lastName: ev.target.value })} type="text" placeholder="" value={user.lastName} disabled={!editing} />
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group as={Col} className="mb-3" controlId="formEdit">
                        <Button variant={editing ? "outline-primary" : "primary"} className="user-account-form-btn" onClick={() => {
                            editing ? setEditing(false) : setEditing(true);
                        }}>{editing ? "Cancel" : "Edit"}</Button>
                    </Form.Group>

                    {
                        editing &&
                        <Form.Group as={Col} className="mb-3" controlId="formEdit">
                            <Button variant="success" className="user-account-form-btn" onClick={() => {
                                updateUserDetails();
                            }}>Submit</Button>
                        </Form.Group>
                    }
                </Row>
            </Form>
            {
                loading &&
                <Loading />
            }
        </div>
    );
}

export default UserAccountComponent;