import { useState } from "react";
import { Alert } from "react-bootstrap";

interface IProps {
    title: string,
    content?: string,
    footer?: string,
    dismissible?: boolean,

    type: "warning" | "danger" | "success" | "primary"
}

export const AlertComponent = (props: IProps) => {
    const [show, setShow] = useState(true);

    return (
        <Alert show={show} className='m-3' variant={props.type} onClose={() => setShow(false)} dismissible={props.dismissible !== undefined ? props.dismissible : true}>
            <Alert.Heading>
                {props.title}
            </Alert.Heading>

            {
                props.content &&
                <>
                    <hr />
                    <p>
                        {props.content}
                    </p>
                </>
            }

            {
                props.footer &&
                <>
                    <hr />
                    <p>
                        {props.footer}
                    </p>
                </>
            }
        </Alert>
    );
}