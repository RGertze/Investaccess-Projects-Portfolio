
//##################################
//      REACT IMPORTS
//##################################

import React, { Component } from "react";

//##################################
//      CSS IMPORTS
//##################################

import "./emptyListNotification.css";

//##################################
//      INTERFACE DEFINITIONS
//##################################

interface IProps {
    message: string,
    color?: string
}


//##################################
//      CLASS DEFINITION
//##################################

class EmptyListNotification extends Component<IProps> {

    //##################################
    //      RENDER METHOD
    //##################################

    render() {
        return (
            <div id="empty-list-notif-container">
                <h2 style={{ color: (this.props.color) ? this.props.color : "#333" }} className="center">{this.props.message}</h2>
            </div >
        );
    }
}

export default EmptyListNotification;
