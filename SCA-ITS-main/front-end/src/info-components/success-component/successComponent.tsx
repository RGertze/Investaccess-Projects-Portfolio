import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Connection, GET_ENDPOINT } from "../../connection";
import { ERROR_MESSAGE_CODES, IResponse, SUCCESS_MESSAGE_CODES } from "../../interfaces/general_interfaces";
import { errorToast } from "../../shared-components/alert-components/toasts";
import Loading from "../../shared-components/loading-component/loading";
import "./successComponent.css";

const SuccessComponent = () => {

    let { code } = useParams();


    return (
        <div className="rounded shadow hor-center appointment-status-container">
            <h3 className="appointment-status-title">Success!</h3>
            <p>
                {code && parseInt(code) === SUCCESS_MESSAGE_CODES.REGISTRATION_SUCCESSFUL &&
                    <>
                        Registration has successfully been completed
                        <Link to={"/"}>Login Now!</Link>
                    </>
                }
            </p>
        </div>
    );
}

export default SuccessComponent;