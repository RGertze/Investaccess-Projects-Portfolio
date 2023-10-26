import { useEffect, useState } from "react";
import { Button, Form, Modal, Row } from "react-bootstrap";
import Loading from "../loading-component/loading";


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

    // COMPONENT DID MOUNT
    useEffect(() => {

        // get object keys
        let keys = Object.keys(props.data);
        console.log(keys);

        let initState = {}

        // init state
        for (let key of keys) {
            initState[key] = props.data[key];
        }


        setState(initState);
        setInputs(keys);

    }, []);

    //----   HANDLE INPUT   ----
    const handleInput = (key: string, value: string) => {
        let newState = Object.assign({}, state);
        newState[key] = value;
        setState(newState);
    }

    //----   GET INPUT TYPE   ----
    const getInputType = (key: string): string => {
        if (typeof state[key] === "string") {
            return "text";
        }
        if (typeof state[key] === "number") {
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
        <Modal show={true} onHide={() => props.cancel()} style={{ zIndex: 10000000 }}>
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
                                return (
                                    <Form.Group className="mb-3" controlId={key} key={index}>
                                        {/* Replace _ with space */}
                                        <Form.Label>{key.replaceAll("_", " ")}</Form.Label>
                                        <Form.Control onChange={(e) => handleInput(key, e.target.value)} type={getInputType(key)} value={state[key]} placeholder="" />
                                    </Form.Group>
                                );
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