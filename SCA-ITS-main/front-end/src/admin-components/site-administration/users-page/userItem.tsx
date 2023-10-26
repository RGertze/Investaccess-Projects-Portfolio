import { useState } from "react";
import { Button } from "react-bootstrap";
import { IGlobalContext } from "../../../interfaces/general_interfaces";
import Loading from "../../../shared-components/loading-component/loading";

interface IProps {
    info: string,
    buttonLabel: string,
    action(): Promise<void>
}

export const UserItem = (props: IProps) => {
    const [loading, setLoading] = useState(false);

    const submit = async () => {
        setLoading(true);
        await props.action();
        setLoading(false);
    }

    return (
        <div className="site-admin-user-item vert-flex space-between">
            <p>{props.info}</p>
            <Button onClick={submit} variant="success">
                {!loading && props.buttonLabel}
                {
                    loading &&
                    <Loading small={true} />
                }
            </Button>
        </div>
    );
}