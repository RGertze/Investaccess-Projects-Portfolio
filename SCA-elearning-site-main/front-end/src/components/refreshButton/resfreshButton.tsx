
//-----------------------------------------
//        REACT IMPORTS
//-----------------------------------------

import React, { Component } from "react";

//-----------------------------------------
//        CSS IMPORTS
//-----------------------------------------

import "./resfreshButton.css";

//-----------------------------------------
//        COMPONENT IMPORTS
//-----------------------------------------

import RefreshRounded from '@material-ui/icons/RefreshRounded';


//-----------------------------------------
//        INTERFACE DEFINITIONS
//-----------------------------------------

interface IProps {
    refresh(): void,
    centered: boolean
}

//-----------------------------------------
//        CLASS DEFINITION
//-----------------------------------------

class RefreshButton extends Component<IProps> {

    //----------------------
    //    CONSTRUCTOR
    //----------------------

    constructor(props: IProps) {
        super(props);
    }


    //----------------------
    //    RENDER METHOD
    //----------------------

    render() {
        return (
            <div className={`refresh-button ${this.props.centered ? "center" : ""}`} onClick={() => {
                this.props.refresh();
            }}>
                <RefreshRounded style={{ width: "100%", height: "100%" }} />
            </div>
        );
    }
}

export default RefreshButton;
