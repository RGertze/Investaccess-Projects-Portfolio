
//-----------------------------------------
//        REACT IMPORTS
//-----------------------------------------

import React, { Component } from "react";

//-----------------------------------------
//        CSS IMPORTS
//-----------------------------------------

import "./suggestionBox.css";

//-----------------------------------------
//        INTERFACE IMPORTS
//-----------------------------------------

import { IAddSuggestion, IResponse } from "../../interfaces";
import Connection, { POST_TYPE } from "../../connection";


//-----------------------------------------
//        INTERFACE DEFINITIONS
//-----------------------------------------

interface IState {
    messageIn: string
}

interface IProps {
    token: string
}

//-----------------------------------------
//        CLASS DEFINITION
//-----------------------------------------

class SuggestionBox extends Component<IProps, IState> {

    //----------------------
    //    CONSTRUCTOR
    //----------------------

    constructor(props: IProps) {
        super(props);

        this.state = {
            messageIn: ""
        }
    }

    //----------------------
    //    ADD SUGGESTION
    //----------------------

    addSuggestion = async () => {
        if (this.state.messageIn !== "") {

            let data: IAddSuggestion = {
                message: this.state.messageIn
            }

            let result: IResponse = await Connection.postReq(POST_TYPE.ADD_SUGGESTION, this.props.token, data, {});

            if (result.stat === "ok") {
                alert("suggestion submitted");
                this.setState({ messageIn: "" });
                return;
            }
            alert("failed to submit suggestion");

        } else {
            alert("suggestion field is empty");
        }
    }


    //----------------------
    //    RENDER METHOD
    //----------------------

    render() {
        return (
            <div id="suggestion-container">
                <label>Add suggestion:</label>
                <textarea value={this.state.messageIn} onChange={ev => this.setState({ messageIn: ev.target.value })} />
                <button onClick={this.addSuggestion}>Submit</button>
            </div >
        );
    }
}

export default SuggestionBox;
