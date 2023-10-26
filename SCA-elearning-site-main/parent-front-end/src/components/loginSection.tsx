// react imports
import React, { Component } from "react";

// interface/enum imports
import { SECTION } from "./base";

// interface definitions
interface IState {
    username: string,
    password: string
}

interface IProps {
    login(username: string, password: string): Promise<boolean>,
    changeSection(sect: SECTION): void
}

class LoginSection extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            username: "",
            password: ""
        }
    }

    componentDidUpdate() {
        //console.log(this.state);
    }

    onKeyPressHandler = (ev: React.KeyboardEvent<HTMLInputElement>) => {
        if (ev.key === "Enter") {
            this.props.login(this.state.username, this.state.password);
        }
    }

    render() {
        return (
            <div id="login-container">
                <div id="login-form">
                    <label className="login-labels">Username:</label>
                    <input className="login-input" onChange={(ev) => this.setState({ username: ev.target.value })} />
                    <br></br>
                    <label className="login-labels">Password:</label>
                    <input className="login-input" type="password" onKeyPress={this.onKeyPressHandler} onChange={(ev) => this.setState({ password: ev.target.value })} />
                    <br></br>
                    <div id="login-submit" onClick={() =>
                        this.props.login(this.state.username, this.state.password)
                    }>
                        <h3>Login</h3>
                    </div>
                </div>

                <h4 style={{
                    width: "fit-content"
                }} className="center link-button" onClick={() => this.props.changeSection(SECTION.REGISTRATION)}>
                    New Applicant
                </h4>
            </div >
        );
    }
}

export default LoginSection;
