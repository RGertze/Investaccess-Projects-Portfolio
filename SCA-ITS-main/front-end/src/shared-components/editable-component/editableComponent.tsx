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
    editable?: boolean,
    onEdit(data: any): Promise<boolean>,
}

const EditableTable = (props: IProps) => {

    const [state, setState] = useState({});
    const [originalState, setOriginalState] = useState({});
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);

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
        const form = event.currentTarget;

        event.preventDefault();
        event.stopPropagation();

        edit();
    };

    const edit = async () => {
        setLoading(true);
        console.log(state);
        let result = await props.onEdit(state);
        if (result) {
            setOriginalState(state);
            setEditing(false);
        }
        setLoading(false);
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
                                            <Form.Control required={data.required !== undefined ? data.required : true} disabled={data.disabled ? true : !editing} onChange={(e) => handleInput(data.key, e.target.value)} type={"number"} value={state[data.key]} placeholder="" />
                                        }
                                        {
                                            (data.type === INPUT_TYPE.TEXT) &&
                                            <Form.Control required={data.required !== undefined ? data.required : true} disabled={data.disabled ? true : !editing} onChange={(e) => handleInput(data.key, e.target.value)} type={"text"} value={state[data.key]} placeholder="" />
                                        }
                                        {
                                            (data.type === INPUT_TYPE.TEXT_AREA) &&
                                            <Form.Control required={data.required !== undefined ? data.required : true} disabled={data.disabled ? true : !editing} onChange={(e) => handleInput(data.key, e.target.value)} as={"textarea"} rows={3} value={state[data.key]} placeholder="" />
                                        }
                                        {
                                            (data.type === INPUT_TYPE.EMAIL) &&
                                            <Form.Control required={data.required !== undefined ? data.required : true} disabled={data.disabled ? true : !editing} onChange={(e) => handleInput(data.key, e.target.value)} type={"email"} value={state[data.key]} placeholder="" />
                                        }
                                        {
                                            (data.type === INPUT_TYPE.DATE) &&
                                            <Form.Control required={data.required !== undefined ? data.required : true} disabled={data.disabled ? true : !editing} onChange={(e) => handleInput(data.key, e.target.value)} type={"date"} value={state[data.key]} placeholder="" />
                                        }
                                        {
                                            (data.type === INPUT_TYPE.CHECK) &&
                                            <Form.Check required={data.required !== undefined ? data.required : true} disabled={data.disabled ? true : !editing} onChange={(e) => handleInput(data.key, e.target.checked)} type={"checkbox"} checked={state[data.key]} />
                                        }
                                        {
                                            (data.type === INPUT_TYPE.SELECT && data.selectValues !== undefined) &&
                                            <Form.Select required={data.required !== undefined ? data.required : true} disabled={data.disabled ? true : !editing} onChange={(e) => handleInput(data.key, e.target.value)} value={(state[data.key] && state[data.key] !== "") ? state[data.key] : "Single"}>
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
                                    (!editing && !props.loading && (props.editable !== undefined ? props.editable : true)) &&
                                    <Button onClick={() => setEditing(true)} variant="outline-success">edit</Button>
                                }
                                {
                                    (editing && !loading && !props.loading) &&
                                    <>
                                        <Button onClick={() => {
                                            setEditing(false);
                                            setState(originalState);
                                        }} variant="outline-primary">cancel</Button>
                                        <Button type="submit" variant="outline-success">save</Button>
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

export default EditableTable;