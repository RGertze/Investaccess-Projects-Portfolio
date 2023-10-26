import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

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


export const confirmChoice = async (title: string, text: string) => {
    return await MySwal.fire({
        title: title,
        text: text,
        icon: "warning",
        confirmButtonText: "Confirm",
        cancelButtonText: "cancel",
        showConfirmButton: true,
        showCancelButton: true,
    });
}

export const confirmInfo = async (title: string, text: string) => {
    return await MySwal.fire({
        title: title,
        text: text,
        icon: "info",
        confirmButtonText: "Confirm",
        showConfirmButton: true,
    });
}

export const confirmWithReason = async (title: string) => {
    return await MySwal.fire({
        title: title,
        inputLabel: "Reason",
        input: "textarea",
        inputAttributes: {
            autocapitalize: 'off'
        },
        confirmButtonText: "Confirm",
        cancelButtonText: "cancel",
        showConfirmButton: true,
        showCancelButton: true,
    });
}