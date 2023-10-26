import { useEffect, useState } from "react";
import { Button, Form, FormGroup, Table } from "react-bootstrap";
import { INPUT_TYPE } from "../add-edit-component-V2/AddEditComponentV2";
import Loading from "../loading-component/loading";

export interface IRow {
    key: string,
    name: string,
    value: string | number | boolean,
    type: INPUT_TYPE,

    disabled?: boolean,
    required?: boolean,
    selectValues?: { name: string, value: number | string }[]
}

interface IProps {
    id: any,
    title: string,
    data: IRow[],
    loading: boolean,
    onEdit(data: any): Promise<boolean>,

    saveButtonText: string,
    backButtonText: string,
    backButtonType: "danger" | "primary",
    onBackClick(): void,

    editable?: boolean
}

const FormComponent = (props: IProps) => {

    const [state, setState] = useState({});
    const [originalState, setOriginalState] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let newState = {};
        props.data.forEach(data => {
            newState[data.key] = data.value
        });
        setState(newState);
        setOriginalState(newState);
    }, [props]);

    //----   HANDLE INPUT   ----
    const handleInput = (key: string, value: any) => {
        let newState = Object.assign({}, state);

        if (typeof newState[key] === "number") {
            newState[key] = parseFloat(value);
        }
        if (typeof newState[key] === "string") {
            newState[key] = value;
        }
        if (typeof newState[key] === "boolean") {
            newState[key] = value;
        }
        if (newState[key] === null || newState[key] === undefined) {
            newState[key] = value;
        }

        setState(newState);
    }

    //----   HANDLE SUBMIT   ----
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();

        edit();
    };

    const edit = async () => {
        setLoading(true);
        let result = await props.onEdit(state);
        setLoading(false);
        if (result) {
            setOriginalState(state);
        }
    }

    return (
        <Form onSubmit={(ev) => handleSubmit(ev)}>
            <Table>
                <thead>
                    <tr>
                        <th colSpan={2}>
                            <h3>{props.title}</h3>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.data.map((data, index) => {
                            return (
                                <tr key={index}>
                                    <td width={"45%"}>{data.name}</td>
                                    <td>
                                        {
                                            (data.type === INPUT_TYPE.NUMBER) &&
                                            <Form.Control required={data.required !== undefined ? data.required : true} disabled={props.editable !== undefined ? !props.editable : (data.disabled ? data.disabled : false)} onChange={(e) => handleInput(data.key, e.target.value)} type={"number"} value={state[data.key]} placeholder="" />
                                        }
                                        {
                                            (data.type === INPUT_TYPE.TEXT) &&
                                            <Form.Control required={data.required !== undefined ? data.required : true} disabled={props.editable !== undefined ? !props.editable : (data.disabled ? data.disabled : false)} onChange={(e) => handleInput(data.key, e.target.value)} type={"text"} value={state[data.key]} placeholder="" />
                                        }
                                        {
                                            (data.type === INPUT_TYPE.TEXT_AREA) &&
                                            <Form.Control required={data.required !== undefined ? data.required : true} disabled={props.editable !== undefined ? !props.editable : (data.disabled ? data.disabled : false)} onChange={(e) => handleInput(data.key, e.target.value)} as={"textarea"} rows={3} value={state[data.key]} placeholder="" />
                                        }
                                        {
                                            (data.type === INPUT_TYPE.EMAIL) &&
                                            <Form.Control required={data.required !== undefined ? data.required : true} disabled={props.editable !== undefined ? !props.editable : (data.disabled ? data.disabled : false)} onChange={(e) => handleInput(data.key, e.target.value)} type={"email"} value={state[data.key]} placeholder="" />
                                        }
                                        {
                                            (data.type === INPUT_TYPE.DATE) &&
                                            <Form.Control required={data.required !== undefined ? data.required : true} disabled={props.editable !== undefined ? !props.editable : (data.disabled ? data.disabled : false)} onChange={(e) => handleInput(data.key, e.target.value)} type={"date"} value={state[data.key]} placeholder="" />
                                        }
                                        {
                                            (data.type === INPUT_TYPE.CHECK) &&
                                            <Form.Check required={data.required !== undefined ? data.required : true} disabled={props.editable !== undefined ? !props.editable : (data.disabled ? data.disabled : false)} onChange={(e) => handleInput(data.key, e.target.checked)} type={"checkbox"} checked={state[data.key]} />
                                        }
                                        {
                                            (data.type === INPUT_TYPE.SELECT && data.selectValues !== undefined) &&
                                            <Form.Select required={data.required !== undefined ? data.required : true} disabled={props.editable !== undefined ? !props.editable : (data.disabled ? data.disabled : false)} onChange={(e) => handleInput(data.key, e.target.value)} value={(state[data.key] && state[data.key] !== "") ? state[data.key] : "Single"}>
                                                {
                                                    data.selectValues.length === 0 &&
                                                    <option value={0}>None Available!</option>
                                                }
                                                {
                                                    data.selectValues.map((val, index) => {
                                                        return (
                                                            <option key={index} value={val.value}>{val.name}</option>
                                                        );
                                                    })
                                                }
                                            </Form.Select>
                                        }
                                    </td>
                                </tr>
                            );
                        })
                    }
                    <tr>
                        <td colSpan={2}>
                            <FormGroup>
                                {
                                    <>
                                        <Button onClick={() => {
                                            props.onBackClick();
                                        }} variant={props.backButtonType}>
                                            {props.backButtonText}
                                        </Button>
                                        <Button type="submit" variant="outline-success">{props.saveButtonText}</Button>
                                    </>
                                }
                                {
                                    (loading || props.loading) &&
                                    <Loading color="blue" small={true} />
                                }
                            </FormGroup>
                        </td>
                    </tr>
                </tbody>
            </Table>
        </Form>
    );
}

export default FormComponent;