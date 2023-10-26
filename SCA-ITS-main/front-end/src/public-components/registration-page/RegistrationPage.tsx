import "./registrationPage.css";
import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { IGlobalContext, IResponse, UserType } from "../../interfaces/general_interfaces";
import { Connection, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../../shared-components/loading-component/loading";
import { errorToast, successToast } from "../../shared-components/alert-components/toasts";
import sca_logo from "./sca.webp";
import AccountCreatedPage from "../account-created-page/accountCreated";
import backgroundImage from "../../assets/designs-1/login-background.png";
import { PublicFooter } from "../footer/footer";

interface IState {
    userType: UserType,
    email: string,
    password: string,
    confirmPassword: string,
    firstName: string,
    lastName: string,
}

interface IProps {
    context: IGlobalContext
}

let RegistrationPage = (props: IProps) => {

    const [state, setState] = useState<IState>({
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        confirmPassword: "",
        userType: UserType.PARENT
    });

    const [loading, setLoading] = useState<boolean>(false);

    const [registrationSuccessful, setRegistrationSuccessful] = useState(false);

    const navigate = useNavigate();

    const validateUser = (): boolean => {
        if (state.email === "") {
            errorToast("Enter an email address!")
            return false;
        }
        if (state.firstName === "") {
            errorToast("Enter a first name!")
            return false;
        }
        if (state.lastName === "") {
            errorToast("Enter a last name!")
            return false;
        }
        if (state.password === "") {
            errorToast("Enter a password!")
            return false;
        }
        if (state.password !== state.confirmPassword) {
            errorToast("Passwords do not match!")
            return false;
        }

        return true;
    }

    const registerUser = async () => {
        setLoading(true);
        let data = {
            userType: state.userType,
            email: state.email,
            password: state.password,
            firstName: state.firstName,
            lastName: state.lastName
        }

        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.REGISTER_USER, data, {});
        setLoading(false);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true);
            return;
        }

        props.context.setUsername(state.email);
        successToast("User successfully created!", true);
        setRegistrationSuccessful(true);
    }

    return (
        <div className="registration-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="shadow-sm border mb-5 bg-white rounded hor-center register-form-container">

                <div className="register-form">
                    <div className="vert-flex space-between sign-up-header">
                        <h2>Parent Registration</h2>
                    </div>

                    <hr className="hor-center" style={{ width: "100%", height: "1px" }} />

                    {
                        !registrationSuccessful &&
                        <>
                            <Form>
                                <Row>
                                    <Form.Group as={Col} className="mb-3" controlId="formFirstName">
                                        <Form.Label className="login-label">First Name:</Form.Label>
                                        <Form.Control className="form-control-lg" onChange={(e) => setState({ ...state, firstName: e.target.value })} type="text" placeholder="first name" />
                                    </Form.Group>
                                    <Form.Group as={Col} className="mb-3" controlId="formLastName">
                                        <Form.Label className="login-label">Last Name:</Form.Label>
                                        <Form.Control className="form-control-lg" onChange={(e) => setState({ ...state, lastName: e.target.value })} type="text" placeholder="last name" />
                                    </Form.Group>
                                </Row>
                                <Form.Group className="mb-3" controlId="formEmail">
                                    <Form.Label className="login-label">Email:</Form.Label>
                                    <Form.Control className="form-control-lg" onChange={(e) => setState({ ...state, email: e.target.value })} type="email" placeholder="Enter email" />
                                </Form.Group>

                                <Row>
                                    <Form.Group as={Col} className="mb-3" controlId="formPassword">
                                        <Form.Label className="login-label">Password:</Form.Label>
                                        <Form.Control className="form-control-lg" onChange={(e) => setState({ ...state, password: e.target.value })} type="password" placeholder="Password" />
                                    </Form.Group>

                                    <Form.Group as={Col} className="mb-3" controlId="formConfirmPassword">
                                        <Form.Label className="login-label">Confirm Password:</Form.Label>
                                        <Form.Control className="form-control-lg" onChange={(e) => setState({ ...state, confirmPassword: e.target.value })} type="password" placeholder="Confirm Password" />
                                    </Form.Group>
                                </Row>


                                <Button className="register-btn" variant="" type="button" onClick={() => { registerUser() }}>
                                    Submit
                                </Button>
                                {
                                    loading &&
                                    <Loading />
                                }
                            </Form>
                        </>
                    }


                    {
                        registrationSuccessful &&
                        <AccountCreatedPage email={state.email} />
                    }
                    <hr className="hor-center" style={{ width: "100%", height: "1px", color: "#666" }} />
                    <h5 className="link-to-registration" style={{ color: "#212529" }}>Already registered? <Link className="link-to-registration" to="/">login</Link></h5>

                </div>

                <div className="login-logo vert-flex justify-center">
                    <img className="rounded-circle " src={sca_logo} alt="" />
                    <h3>Swakopmund Christian Academy</h3>
                </div>
            </div>
            <PublicFooter />
        </div>
    );
}


export default RegistrationPage;