import React from "react";
import { GlobalContext } from "../../contexts/globalContext";
import "./adminHome.css";

let AdminHome = () => {
    return (
        <GlobalContext.Consumer>
            {context => (
                <div className="admin-home">
                    <h1>This is the admin home page!</h1>
                    <p>{context.username}</p>
                </div>
            )}
        </GlobalContext.Consumer>
    );
}

export default AdminHome;