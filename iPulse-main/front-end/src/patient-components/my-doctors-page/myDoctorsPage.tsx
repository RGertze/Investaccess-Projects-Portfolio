import "./myDoctorsPage.css";
import { IDoctor, IDoctorAll } from "../../interfaces/doctor_interfaces";
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { IGlobalContext, IResponse } from "../../interfaces/general_interfaces";
import { Connection, GET_ENDPOINT } from "../../connection";
import { useNavigate } from "react-router-dom";
import { errorToast } from "../../shared-components/alert-components/toasts";
import Loading from "../../shared-components/loading-component/loading";
import DoctorCard from "../../shared-components/doctor-card/doctorCard";

interface IProps {
    context: IGlobalContext
}

let MyDoctorsPage = (props: IProps) => {

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const [doctors, setDoctors] = useState<IDoctorAll[]>([]);

    //----   COMPONENT DID MOUNT   ----
    useEffect(() => {
        getAllDoctors();
    }, []);

    //----   GET MY DOCTORS   ----
    const getAllDoctors = async () => {
        let result: IResponse = await Connection.getRequest(GET_ENDPOINT.GET_ALL_A_PATIENTS_DOCTORS + props.context.userId, "");
        if (result.errorMessage.length > 0) {
            console.log(result.errorMessage);
            errorToast(result.errorMessage, true);
        }
        setDoctors(result.data);
    }

    //----   Navigate to doctor   ----
    const navigateToDoctor = (doctorId) => {
        navigate(`/patient/doctor/${doctorId}`, { state: { userId: doctorId } });
    }

    return (
        <div className="all-doctors-container">
            <h2 className="hor-center">My Doctors</h2>
            {
                !loading &&
                doctors.map((doctor, index) => {
                    return (
                        <DoctorCard key={index} context={props.context} doctor={doctor} viewDoctor={() => navigateToDoctor(doctor.userId)} />
                    );
                })
            }
            {
                (!loading && doctors.length === 0) &&
                <h5>Nothing to Show!</h5>
            }
            {
                loading &&
                <Loading />
            }
        </div>
    );
}

export default MyDoctorsPage;