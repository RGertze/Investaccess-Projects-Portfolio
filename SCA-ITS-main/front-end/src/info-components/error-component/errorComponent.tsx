import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Connection, GET_ENDPOINT } from "../../connection";
import { ERROR_MESSAGE_CODES, IResponse } from "../../interfaces/general_interfaces";
import { errorToast } from "../../shared-components/alert-components/toasts";
import Loading from "../../shared-components/loading-component/loading";
import "./errorComponent.css";

const ErrorComponent = () => {

    let { code } = useParams();


    return (
        <div className="rounded shadow hor-center appointment-status-container">
            <h3 className="appointment-status-title">An error has occurred!</h3>
            <p>
                {code && parseInt(code) === ERROR_MESSAGE_CODES.USER_NOT_FOUND && "User not found"}
                {code && parseInt(code) === ERROR_MESSAGE_CODES.WRONG_CONFIRMATION_CODE && "Wrong confirmation code"}
            </p>
        </div>
    );
}

export default ErrorComponent;