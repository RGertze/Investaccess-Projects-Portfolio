import "./passwordResetPage.css";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { IGlobalContext, IResponse } from "../../interfaces/general_interfaces";
import { Connection, GET_ENDPOINT, POST_ENDPOINT } from "../../connection";
import { errorToast, successToast } from "../alert-components/toasts";
import Loading from "../loading-component/loading";
import { useNavigate } from "react-router-dom";

interface IProps {
    context: IGlobalContext
}

const PasswordResetPage = (props: IProps) => {
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    const [email, setEmail] = useState("");
    const [confirmationCode, setConfirmationCode] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [pageIndex, setPageIndex] = useState(0);

    const navigate = useNavigate();

    //----   REQUEST PASSWORD RESET   ----
    const requestPasswordReset = async (): Promise<boolean> => {
        setLoading(true);
        setResending(true);

        if (!validateData()) {
            setLoading(false);
            setResending(false);
            return false;
        }


        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.REQUEST_PASSWORD_RESET + email, "");
        setLoading(false);
        setResending(false);
        if (result.errorMessage.length !== 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }
        return true;
    }

    //----   CONFIRM CODE   ----
    const confirmCode = async (): Promise<boolean> => {
        setLoading(true);

        if (!validateData()) {
            setLoading(false);
            return false;
        }

        let data = {
            email: email,
            confirmationCode: confirmationCode
        }

        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.CONFIRM_PASSWORD_RESET, data, {});

        setLoading(false);

        if (result.errorMessage.length !== 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }
        setConfirmed(true);
        return true;
    }

    //----   RESET PASSWORD   ----
    const resetPassword = async (): Promise<boolean> => {
        setLoading(true);

        if (!validateData()) {
            setLoading(false);
            return false;
        }

        let data = {
            email: email,
            password: password
        }

        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.RESET_PASSWORD, data, {});
        setLoading(false);

        if (result.errorMessage.length !== 0) {
            errorToast(result.errorMessage, true, 2000);
            return false;
        }
        successToast("Password changed", true, 2000);
        return true;
    }

    //----   VALIDATE DATA   ----
    const validateData = (): boolean => {
        if (pageIndex === 0) {
            if (email === "") {
                errorToast("Enter an email");
                return false;
            }
        }
        if (pageIndex === 1) {
            if (confirmationCode === "") {
                errorToast("Enter a confirmation code");
                return false;
            }
        }
        if (pageIndex === 2) {
            if (!confirmed) {
                errorToast("Please request a new confirmation code and retry.");
                return false;
            }
            if (password === "") {
                errorToast("Enter a password");
                return false;
            }
            if (password !== confirmPassword) {
                errorToast("Passwords do not match");
                return false;
            }
        }
        return true;
    }

    //----   PAGE NAVIGATION   ----
    const nextPage = async () => {

        let success = false;
        switch (pageIndex) {
            case 0:
                success = await requestPasswordReset();
                break;
            case 1:
                success = await confirmCode();
                break;
            case 2:
                success = await resetPassword();
                if (success) {
                    props.context.logout();
                    navigate("/login");
                }
                break;
        }

        if (!success) {
            return;
        }

        pageIndex < 2 && setPageIndex(pageIndex + 1);
    }
    const prevPage = () => {
        pageIndex > 0 && setPageIndex(pageIndex - 1);
    }

    return (
        <div className="vert-flex space-evenly password-reset-page">

            <div className="rounded shadow password-reset-container">

                <h3>Reset your password</h3>

                {
                    // request password reset

                    pageIndex === 0 &&
                    <div>
                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Enter your email</Form.Label>
                            <Form.Control onChange={(e) => setEmail(e.target.value)} type="email" placeholder="email" value={email} />
                        </Form.Group>
                    </div>
                }

                {
                    // enter confirmation code

                    pageIndex === 1 &&
                    <div className="password-reset-confirm">
                        <p>
                            An email has been sent to <b>{email}</b>
                            <Button onClick={requestPasswordReset} className="password-reset-resend-btn" variant="success">
                                {
                                    resending &&
                                    <Loading small={true} color={"#ffffff"} />
                                }
                                {
                                    !resending &&
                                    "Resend"
                                }
                            </Button>
                        </p>
                        <Form.Group className="mb-3" controlId="formConfCode">
                            <Form.Label>Enter confirmation code:</Form.Label>
                            <Form.Control onChange={(e) => setConfirmationCode(e.target.value)} type="text" placeholder="000-000" value={confirmationCode} />
                        </Form.Group>
                    </div>
                }

                {
                    // create new passwrd

                    pageIndex === 2 &&
                    <div>
                        <Form.Group className="mb-3" controlId="formNewPass">
                            <Form.Label>Enter new password:</Form.Label>
                            <Form.Control onChange={(e) => setPassword(e.target.value)} type="password" placeholder="" value={password} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formConfPass">
                            <Form.Label>Confirm password:</Form.Label>
                            <Form.Control onChange={(e) => setConfirmPassword(e.target.value)} type="password" placeholder="" value={confirmPassword} />
                        </Form.Group>
                    </div>
                }

                <div className="vert-flex password-reset-buttons">
                    {
                        pageIndex !== 0 &&
                        <Button variant="outline-primary" onClick={prevPage}>Prev</Button>
                    }
                    <Button
                        variant={pageIndex === 2 ? "success" : "primary"}
                        className="password-reset-next-btn" onClick={() => {
                            nextPage();
                        }}>
                        {
                            (!loading && pageIndex !== 2) &&
                            "Next"
                        }
                        {
                            (!loading && pageIndex === 2) &&
                            "Submit"
                        }
                        {
                            loading &&
                            <Loading small={true} color={"#ffffff"} />
                        }
                    </Button>
                </div>

            </div>

        </div>
    );
}

export default PasswordResetPage;