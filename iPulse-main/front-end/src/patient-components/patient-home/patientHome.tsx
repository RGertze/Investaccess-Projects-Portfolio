import { useState } from "react";
import { IGlobalContext } from "../../interfaces/general_interfaces";
import { IProfileAccessRequest } from "../../interfaces/patient_interfaces";
import DashboardRequestCard, { REQUEST_CARD_TYPE } from "../../shared-components/dashboard-request-card/dashboardRequestCard";
import "./patientHome.css";

interface IProps {
    context: IGlobalContext
}

let PatientHome = (props: IProps) => {

    return (
        <div className="patient-home">
            <h2>Dashboard</h2>
            {
                // PROFILE ACCESS REQUESTS
                <DashboardRequestCard context={props.context} header={"Profile Access Requests"} type={REQUEST_CARD_TYPE.PROFILE_ACCESS_REQUESTS} />
            }
        </div>
    );
}

export default PatientHome;