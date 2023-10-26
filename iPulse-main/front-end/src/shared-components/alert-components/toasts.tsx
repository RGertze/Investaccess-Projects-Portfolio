import { ReactNode } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { IGlobalContext, INotification } from "../../interfaces/general_interfaces";
import NotificationComponent from "../notification-component/notificationComponent";

const MySwal = withReactContent(Swal);

export const errorToast = async (title: string, showIcon?: boolean, timer?: number) => {
    await MySwal.fire({
        toast: true,
        position: "top-right",
        icon: showIcon ? "error" : undefined,
        title: title,
        timer: timer ? timer : 1000,
        timerProgressBar: true,
        showConfirmButton: false,
    });
}

export const successToast = async (title: string, showIcon?: boolean, timer?: number) => {
    await MySwal.fire({
        toast: true,
        position: "top-right",
        icon: showIcon ? "success" : undefined,
        title: title,
        timer: timer ? timer : 1000,
        timerProgressBar: true,
        showConfirmButton: false,
    });
}

export const notificationToast = async (notification: INotification, timer?: number) => {
    await MySwal.fire({
        toast: true,
        position: "top-right",
        padding: 1,
        html: <NotificationComponent notification={notification} />,
        timer: timer ? timer : 1500,
        timerProgressBar: true,
        showConfirmButton: false,
    });
}

export const confirmation = async (message?: string): Promise<boolean> => {
    let result = await MySwal.fire({
        title: message ?? "Are you sure?",
        position: "center",
        padding: 1,
        showConfirmButton: true,
        confirmButtonText: "Confirm",
        showDenyButton: true,
        denyButtonText: "Cancel"
    });

    return result.isConfirmed;
}