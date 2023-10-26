import { useEffect, useState } from "react";
import { Button, Form, FormGroup, Modal } from "react-bootstrap";
import { Connection, POST_ENDPOINT } from "../../connection";
import { APPOINTMENT_STATUS, IAppointment } from "../../interfaces/appointment_interfaces";
import { IGlobalContext, IResponse } from "../../interfaces/general_interfaces";
import { errorToast } from "../../shared-components/alert-components/toasts";
import Loading from "../../shared-components/loading-component/loading";
import "./cancelAppointmentComponent.css";

interface IProps {
    context: IGlobalContext,
    userId: number,
    appointmentStatus: number,
    appointmentId: number,
    refresh(): void,
    close(): void
}

const CancelAppointment = (props: IProps) => {

    const [cancellingAppointment, setCancellingAppointment] = useState(false);
    const [cancellationReason, setCancellationReason] = useState("");

    //----   CANCEL APPOINTNMENT   ----
    const cancelAppointment = async () => {
        setCancellingAppointment(true);

        let data = {
            appointmentId: props.appointmentId,
            userId: props.userId,
            reason: "None"
        }

        if (props.appointmentStatus === APPOINTMENT_STATUS.APPROVED) {
            if (cancellationReason === "") {
                errorToast("Enter a reason");
                return;
            }
            data.reason = cancellationReason;
        }

        let result: IResponse = await Connection.postRequest(POST_ENDPOINT.CANCEL_APPOINTMENT, data, {});
        setCancellingAppointment(false);
        if (result.errorMessage.length > 0) {
            errorToast(result.errorMessage, true);
            return;
        }

        setCancellationReason("");

        props.refresh();
        props.close();
    }

    return (
        <Modal show={true} onHide={() => { props.close(); }}>
            <Modal.Header closeButton>
                {
                    (props.appointmentStatus === APPOINTMENT_STATUS.PENDING) &&
                    <h3>Are you sure you want to cancel?</h3>
                }
                {
                    (props.appointmentStatus === APPOINTMENT_STATUS.APPROVED) &&
                    <h3>Cancel appointment</h3>
                }

            </Modal.Header>
            <Modal.Body>
                {
                    (props.appointmentStatus === APPOINTMENT_STATUS.APPROVED && !cancellingAppointment) &&
                    <Form>
                        <FormGroup>
                            <Form.Label>Reason for Cancellation</Form.Label>
                            <Form.Control onChange={ev => setCancellationReason(ev.target.value)} as="textarea" rows={3} placeholder="type reason" value={cancellationReason} />
                        </FormGroup>
                    </Form>
                }

                <p className="btn-reject">This action cannot be undone!</p>

                {
                    cancellingAppointment &&
                    <Loading />
                }
            </Modal.Body>
            <Modal.Footer>
                {
                    (props.appointmentStatus === APPOINTMENT_STATUS.PENDING) &&
                    <>
                        <Button onClick={() => props.close()}>No</Button>
                        <Button onClick={() => cancelAppointment()}>Yes</Button>
                    </>
                }
                {
                    (props.appointmentStatus === APPOINTMENT_STATUS.APPROVED) &&
                    <>
                        <Button onClick={() => props.close()}>Cancel</Button>
                        <Button onClick={() => cancelAppointment()}>Confirm</Button>
                    </>
                }
            </Modal.Footer>
        </Modal>
    );
}

export default CancelAppointment;