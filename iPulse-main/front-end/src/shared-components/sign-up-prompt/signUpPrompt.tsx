import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../contexts/globalContext";
import "./signUpPrompt.css";

interface IProps {
    message: string,

    hide(): void
}

const SignUpPrompt = (props: IProps) => {

    const navigate = useNavigate();

    return (
        <GlobalContext.Consumer>
            {context => (
                <Modal className="sign-up-prompt-container" show={true} onHide={() => props.hide()}>
                    <ModalHeader style={{ backgroundColor: context.theme.tertiary }} closeButton>
                        <h2 style={{ color: context.theme.primary }}>Sign Up now!</h2>
                    </ModalHeader>

                    <ModalBody>
                        <div>
                            <p style={{ color: context.theme.mutedTertiary }}>{props.message}</p>
                        </div>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant="outline-primary" onClick={() => props.hide()}>Back</Button>
                        <Button className="sign-up-prompt-btn" variant="success" onClick={() => navigate("/register")}>Sign Me Up!</Button>
                    </ModalFooter>
                </Modal>
            )}
        </GlobalContext.Consumer>
    );
}

export default SignUpPrompt;