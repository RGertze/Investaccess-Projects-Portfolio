import React from "react";
import { Modal } from "react-bootstrap";

interface IProps {
    component: React.ReactNode
    size: "lg" | "sm" | "xl",
    fullscreen?: boolean
    onHide(): void
}

export const PopupComponent = (props: IProps) => {
    return (
        <Modal enforceFocus={false} style={{ zIndex: "999999" }} show={true} size={props.size} onHide={() => props.onHide()} fullscreen={props.fullscreen === true ? true : undefined}>
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
                <div>
                    {props.component}
                </div>
            </Modal.Body>
        </Modal>
    );
}