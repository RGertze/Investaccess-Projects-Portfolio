import { Spinner } from "react-bootstrap";
import "./loading.css";

interface IProps {
    children?: React.ReactNode,
    small?: boolean,
    color?: string
}

let Loading = (props: IProps) => {
    console.log(props.color);
    return (
        <div style={{ padding: props.small ? "2px" : "0px" }} className="vert-flex space-evenly loading-container">
            {props.children && props.children}
            <Spinner style={{ color: props.color ? props.color : "#4488FF" }} className={props.small ? "icon-sm" : ""} animation="border" />
        </div>
    );
}

export default Loading;