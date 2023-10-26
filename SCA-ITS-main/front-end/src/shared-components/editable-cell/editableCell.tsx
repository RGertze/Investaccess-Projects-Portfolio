import { useEffect, useState } from "react";
import { FormControl } from "react-bootstrap";
import Loading from "../loading-component/loading";



interface IProps {
    initialValue: number | string,
    size: number,
    onUpdate(val: any): Promise<boolean>
}

const EditableCell = (props: IProps) => {
    const [loading, setLoading] = useState(false);
    const [val, setVal] = useState<number | string>();
    const [oldValue, setOldValue] = useState<number | string>();

    useEffect(() => {
        setVal(props.initialValue);
        setOldValue(props.initialValue);
    }, []);

    //----   UPDATE VALUE   ----
    const updateValue = async () => {
        if (oldValue === val) {
            return;
        }

        if (typeof val === "string") {
            if (val === "") {
                return;
            }
        }

        if (typeof val === "number") {
            if (val < 0) {
                return;
            }
        }

        setLoading(true);
        let result = await props.onUpdate(val)
        setLoading(false);

        if (result) {
            setOldValue(val);
            return;
        }
        setVal(oldValue);
    }

    return (
        <>
            {
                loading &&
                <Loading />
            }
            {
                !loading &&
                <FormControl style={{ width: `${props.size}%` }} onBlur={updateValue} className="hor-center editable-cell-input" onChange={(e) => {
                    if (typeof props.initialValue === "number")
                        setVal(parseFloat(e.target.value));
                    if (typeof props.initialValue === "string")
                        setVal(e.target.value);
                }} type={typeof props.initialValue === "string" ? "text" : "number"} value={val} placeholder="" />
            }
        </>
    )
}

export default EditableCell;