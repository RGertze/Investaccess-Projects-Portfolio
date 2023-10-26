import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Connection, DELETE_ENDPOINT, GET_ENDPOINT } from "../../connection";
import { IGlobalContext, IResponse, IUser } from "../../interfaces/general_interfaces";
import Loading from "../../shared-components/loading-component/loading";
import PatientsList, { PATIENTS_LIST_TYPE } from "../patients-list-component/patientsListComponent";
import "./allPatientsPage.css";

interface IProps {
    context: IGlobalContext
}

let AllPatientsPage = (props: IProps) => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);


    // COMPONENT DID MOUNT
    useEffect(() => {
    }, []);

    return (
        <div className="all-patients-page-container">
            <h4 style={{ backgroundColor: props.context.theme.tertiary, color: props.context.theme.primary }} className="all-patients-title hor-center vert-flex justify-center rounded">All Patients</h4>

            <PatientsList context={props.context} refreshTracker={0} doctorId={0} type={PATIENTS_LIST_TYPE.ALL} />
        </div>
    );
}

export default AllPatientsPage;