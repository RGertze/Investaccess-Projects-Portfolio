import { useState } from "react";
import { Button, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Connection, POST_ENDPOINT } from "../../connection";
import { USER_TYPE } from "../../interfaces/general_enums";
import { IGlobalContext, ILoginResponse, IResponse } from "../../interfaces/general_interfaces";
import { errorToast } from "../../shared-components/alert-components/toasts";
import Loading from "../../shared-components/loading-component/loading";
import { WaveVector } from "../../shared-components/wave-vector/waveVector";
import "./loginPage.css";

interface IProps {
    context: IGlobalContext
}

let LoginPage = (props: IProps) => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();

    //----   VALIDATE DATA   ----
    const validateLogin = (): boolean => {
        if (username === "") {
            errorToast("Enter a username");
            return false;
        }
        if (password === "") {
            errorToast("Enter a password");
            return false;
        }

        return true;
    }

    //----   LOGIN   ----
    const login = async () => {
        setLoading(true);

        if (!validateLogin()) {
            setLoading(false);
            return;
        }

        let data = {
            username: username,
            password: password
        }

        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.LOGIN, data, {});

        setLoading(false);

        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true);
            return;
        }

        let loginResponse: ILoginResponse = result.data;

        // update context
        props.context.setUserId(loginResponse.userId);
        props.context.setUsername(username);
        props.context.setUserType(loginResponse.roleId);
        props.context.setToken(loginResponse.token);

        // update Connection details
        Connection.setConnectionDetail(loginResponse.token, loginResponse.refreshToken, loginResponse.userId, loginResponse.roleId);

        console.log(loginResponse);

        // navigate to appropriate landing page
        switch (loginResponse.roleId as USER_TYPE) {
            case USER_TYPE.ADMIN:
                navigate("/admin");
                break;
            case USER_TYPE.DOCTOR:
                navigate("/doctor");
                break;
            case USER_TYPE.PATIENT:
                navigate("/patient");
                break;
            default:
                navigate("/");
                break;
        }

        setLoading(false);
    }

    return (
        <div className="login-container">
            <div className=" p-3 mb-5  rounded hor-center login-form-container">
                <div className=" login-header">
                    <h1 style={{ color: props.context.theme.tertiary }}>Login</h1>
                    <p style={{ color: props.context.theme.tertiary }}>Login to access your IPulse account</p>
                </div>
                <hr className="hor-center" style={{ width: "100%", height: "1px" }} />
                <Form>
                    <Form.Group className="mb-3" controlId="formUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control style={{ backgroundColor: props.context.theme.tertiary, color: "#dddddd" }} onChange={(e) => setUsername(e.target.value)} type="email" placeholder="Enter email" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control style={{ backgroundColor: props.context.theme.tertiary }} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
                    </Form.Group>


                    <Button style={{ width: "100%", backgroundColor: props.context.theme.secondary }} type="button" onClick={() => { login() }}>Login</Button>

                    <p><Link style={{ textDecoration: "none", color: props.context.theme.tertiary }} to="/password-reset">Forgot password?</Link></p>
                </Form>

                {
                    loading &&
                    <Loading />
                }

                <hr className="hor-center" style={{ width: "100%", height: "1px", color: "#666" }} />

                <h5>Don't have an account? <Link to="/register">Sign up</Link></h5>
            </div>

        </div>
    );
}


export default LoginPage;