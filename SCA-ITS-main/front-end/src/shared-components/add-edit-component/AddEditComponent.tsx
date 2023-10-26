import { useEffect, useState } from "react";
import { Button, Form, Modal, Row } from "react-bootstrap";
import Loading from "../loading-component/loading";

export interface ISelect {
    ISelect: "ISelect",

    key: string,
    values: { value: number | string, name: string }[],
    value: any
}
export interface IDate {
    IDate: "IDate",

    key: string,
    value: string
}

interface IProps {
    title: string,
    data: any,

    submit(data: any): Promise<boolean>,
    cancel(): void
}

/**
 * Component to obtain user input.
 *  
 * The props object passed in contains a data object that will have its keys used as labels.
 * The keys must be in the following format: A_Variable_Name.  The underscores will be replaced
 * with spaces upon rendering the component.
 * The values must but initializedd and will be used to determine the type of input displayed 
 * to the user.
 * 
 * @param props 
 * @returns 
 */
const AddEditComponent = (props: IProps) => {

    const [loading, setLoading] = useState(false);

    const [state, setState] = useState<any>({});
    const [inputs, setInputs] = useState<string[]>([]);
    const [inputTypes, setInputTypes] = useState<string[]>([]);

    // COMPONENT DID MOUNT
    useEffect(() => {

        // get object keys
        let keys = Object.keys(props.data);

        let initInputTypes: string[] = [];

        let initState = {}

        // init state
        for (let key of keys) {
            initState[key] = props.data[key];
            initInputTypes.push(typeof props.data[key]);
        }

        setState(initState);
        setInputTypes(initInputTypes);
        setInputs(keys);

    }, []);

    //----   HANDLE INPUT   ----
    const handleInput = (key: string, value: string) => {
        let newState = Object.assign({}, state);

        if (typeof newState[key] === "object") {
            if (typeof newState[key].value === "number") {
                newState[key].value = parseInt(value);
            } else {
                newState[key].value = value;
            }
        } else {
            newState[key] = value;
        }

        setState(newState);
    }

    //----   GET INPUT TYPE   ----
    const getInputType = (val: string): string => {
        if (val === "string") {
            return "text";
        }
        if (val === "number") {
            return "number";
        }

        return "text";
    }

    //----   SUBMIT DATA   ----
    const submitData = async () => {
        setLoading(true);

        console.log(state);

        let data = {}
        for (let key of inputs) {
            data[key] = state[key];
        }

        await props.submit(data);
        setLoading(false);
    }

    return (
        <Modal style={{ zIndex: "999999" }} show={true} onHide={() => props.cancel()}>
            <Modal.Header closeButton>
                <h4>{props.title}</h4>
            </Modal.Header>
            <Modal.Body>
                {
                    loading &&
                    <Loading />
                }
                {
                    !loading &&
                    <Form>
                        {
                            inputs.map((key, index) => {
                                if (["number", "string"].find(v => v === inputTypes[index]) !== undefined) {
                                    return (
                                        <Form.Group className="mb-3" controlId={key} key={index}>
                                            {/* Replace _ with space */}
                                            <Form.Label>{key.replaceAll("_", " ")}</Form.Label>
                                            <Form.Control onChange={(e) => handleInput(key, e.target.value)} type={getInputType(inputTypes[index])} value={state[key]} placeholder="" />
                                        </Form.Group>
                                    );
                                }


                                if ("ISelect" in state[key]) {
                                    let iSelect = (state[key] as ISelect);
                                    return (
                                        <Form.Group className="mb-3" controlId="Parent">
                                            <Form.Label>{key.replaceAll("_", " ")}</Form.Label>
                                            <Form.Select onChange={(e) => handleInput(key, e.target.value)} value={iSelect.value}>
                                                {
                                                    iSelect.values.length === 0 &&
                                                    <option value={0}>None Available!</option>
                                                }
                                                {
                                                    iSelect.values.map((val, index) => {
                                                        return (
                                                            <option key={index} value={val.value}>{val.name}</option>
                                                        );
                                                    })
                                                }
                                            </Form.Select>
                                        </Form.Group>
                                    );
                                }

                                if ("IDate" in state[key]) {
                                    let iDate = (state[key] as IDate);
                                    return (
                                        <Form.Group className="mb-3" controlId="Parent">
                                            <Form.Label>{key.replaceAll("_", " ")}</Form.Label>
                                            <Form.Control onChange={(e) => handleInput(key, e.target.value)} type={"date"} value={iDate.value} placeholder="" />
                                        </Form.Group>
                                    );
                                }
                            })
                        }
                    </Form>
                }
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => props.cancel()} variant="outline-primary">Cancel</Button>
                <Button onClick={() => submitData()} variant="success">Submit</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AddEditComponent;