
//#########################################
//        REACT IMPORTS
//#########################################

import React, { Component } from "react";

//#########################################
//        INTERFACE DEFINITIONS
//#########################################

interface IProps {
    now: number
}

//#########################################
//        CLASS DEFINITION
//#########################################

class ProgressBar extends Component<IProps> {

    render() {
        return (
            <div id="progress-bar-container">
                <p id="#progress-bar-label">Uploading: </p>
                <progress id="progress-bar" value={this.props.now} max={100} />
            </div>
        );
    }
}

export default ProgressBar;
