import { useState } from "react";
import { Button, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Connection, POST_ENDPOINT } from "../../connection";
import { IGlobalContext, ILoginResponse, IResponse, UserType } from "../../interfaces/general_interfaces";
import { errorToast } from "../../shared-components/alert-components/toasts";
import Loading from "../../shared-components/loading-component/loading";
import "./loginPage.css";
import sca_logo from "./sca.webp";
import backgroundImage from "../../assets/designs-1/login-background.png";
import { PublicFooter } from "../footer/footer";

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
        props.context.setUserRegistrationComplete(loginResponse.isApproved === 1);

        // update Connection details
        Connection.setConnectionDetail(username, loginResponse.token, loginResponse.refreshToken, loginResponse.userId, loginResponse.roleId, loginResponse.isApproved);

        console.log(loginResponse);

        // navigate to appropriate landing page
        switch (loginResponse.roleId as UserType) {
            case UserType.ADMIN:
                navigate("/admin/home");
                break;
            case UserType.PARENT:
                navigate("/parent/students");
                break;
            case UserType.STAFF:
                navigate("/staff/students");
                break;
            default:
                navigate("/");
                break;
        }

        setLoading(false);
    }

    return (
        <div className="login-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="shadow-sm mb-5 border rounded hor-center login-form-container">
                <div className="login-form">
                    <div className="vert-flex space-evenly login-header">
                        <h2>Login</h2>
                    </div>
                    <hr className="hor-center" style={{ width: "100%" }} />
                    <Form>
                        <Form.Group className="mb-3" controlId="formUsername">
                            <Form.Label className="login-label">Username:</Form.Label>
                            <Form.Control className="form-control-lg" onChange={(e) => setUsername(e.target.value)} type="email" placeholder="Enter email" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formPassword">
                            <Form.Label className="login-label">Password:</Form.Label>
                            <Form.Control className="form-control-lg" onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
                        </Form.Group>

                        <Button className="login-btn" variant="" type="button" onClick={() => { login() }}>Login</Button>
                        {
                            loading &&
                            <Loading />
                        }
                    </Form>

                    <hr className="hor-center" style={{ width: "100%" }} />

                    <h5 className="link-to-registration" style={{ color: "#212529" }}>New parent? <Link className="link-to-registration" to="/register">Register</Link></h5>
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


export default LoginPage;