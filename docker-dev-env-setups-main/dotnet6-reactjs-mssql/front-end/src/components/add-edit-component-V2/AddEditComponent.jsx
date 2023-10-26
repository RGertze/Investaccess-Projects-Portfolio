import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import Loading from "../loading-component/loading";

const INPUT_TYPE_NUMBER = "number";
const INPUT_TYPE_TEXT = "text";
const INPUT_TYPE_TEXT_AREA = "textarea";
const INPUT_TYPE_PASSWORD = "password";
const INPUT_TYPE_EMAIL = "email";
const INPUT_TYPE_DATE = "date";

const INPUT_TYPE_RADIO = "radio";
const INPUT_TYPE_CHECK = "check";
const INPUT_TYPE_SELECT = "select";

const INPUT_TYPE_FILE = "file";


export class Field {
    /**
     * 
     * @param {string} key 
     * @param {string} name 
     * @param {string|number} value 
     * @param {string} type 
     * @param {boolean} required 
     * @param {number?} numberStep 
     * @param {
     *    {
     *       value: string|number,
     *       name: string,
     *    }|undefined} selectValues 
     * @param {} radioValues 
     */
    constructor(
        key,
        name,
        value,
        type,
        required,
        numberStep,
        selectValues,
    ) {
        this.key = key;
        this.name = name;
        this.value = value;
        this.type = type;
        this.required = required;
        this.numberStep = numberStep;
        this.selectValues = selectValues;
    }
}


/**
 * 
 * @param {{
 *    title: string,
 *    fields: field[],
 *    uploadProgress?: number,
 *    submit(data: any): Promise<boolean>,
 *    cancel(): void
 * }} props 
 * @returns 
 */
const AddEditComponentV2 = (props) => {

    const [loading, setLoading] = useState(false);

    const [state, setState] = useState({});


    // COMPONENT DID MOUNT
    useEffect(() => {

        let initState = {};

        // init state
        props.fields.forEach(val => {
            initState[val.key] = val.value;
        });

        setState(initState);
    }, []);

    /**
     * Handle input change
     * @param {string} key 
     * @param {any} value 
     */
    const handleInput = (key, value) => {
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

    /**
     * Submit data
     * @param {React.FormEvent<HTMLFormElement>} ev 
     * @returns 
     */
    const submitData = async (ev) => {
        ev.preventDefault();
        ev.stopPropagation();

        let data = Object.assign({}, state);

        setLoading(true);
        await props.submit(data);
        setLoading(false);
    }

    return (
        <Modal style={{ zIndex: "999999" }} show={true} onHide={() => props.cancel()}>
            <Form onSubmit={(ev) => submitData(ev)}>
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
                        <>
                            {
                                props.fields.map((val, index) => {
                                    if (
                                        val.type === INPUT_TYPE_TEXT
                                        || val.type === INPUT_TYPE_DATE
                                        || val.type === INPUT_TYPE_EMAIL
                                        || val.type === INPUT_TYPE_PASSWORD
                                    ) {
                                        return (
                                            <Form.Group className="mb-3" controlId={val.key} key={index}>
                                                <Form.Label>{val.name}</Form.Label>
                                                <Form.Control required={val.required !== undefined ? val.required : true} onChange={(e) => handleInput(val.key, e.target.value)} type={val.type.toString()} value={state[val.key]} placeholder="" />
                                            </Form.Group>
                                        );
                                    }

                                    if (
                                        val.type === INPUT_TYPE_NUMBER
                                    ) {
                                        return (
                                            <Form.Group className="mb-3" controlId={val.key} key={index}>
                                                <Form.Label>{val.name}</Form.Label>
                                                <Form.Control required={val.required !== undefined ? val.required : true} onChange={(e) => handleInput(val.key, parseFloat(e.target.value) ?? "")} step={val.numberStep ?? 1} type={"number"} value={state[val.key]} placeholder="" />
                                            </Form.Group>
                                        );
                                    }

                                    if (
                                        val.type === INPUT_TYPE_CHECK
                                    ) {
                                        return (
                                            <Form.Group className="mb-3" controlId={val.key} key={index}>
                                                <Form.Label>{val.name}</Form.Label>
                                                <Form.Check required={val.required !== undefined ? val.required : true} onChange={(e) => handleInput(val.key, e.target.checked)} type={"checkbox"} checked={state[val.key]} />
                                            </Form.Group>
                                        );
                                    }

                                    if (
                                        val.type === INPUT_TYPE_SELECT
                                    ) {
                                        return (
                                            <Form.Group className="mb-3" controlId="Parent">
                                                <Form.Label>{val.name}</Form.Label>
                                                <Form.Select required={val.required !== undefined ? val.required : true} onChange={(e) => handleInput(val.key, e.target.value)} value={state[val.key]}>
                                                    {
                                                        val.selectValues &&
                                                        val.selectValues.map((selectVal, selectIndex) => {
                                                            return (
                                                                <option key={selectIndex} value={selectVal.value}>{selectVal.name}</option>
                                                            );
                                                        })
                                                    }
                                                </Form.Select>
                                            </Form.Group>
                                        );
                                    }
                                })
                            }
                        </>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => props.cancel()} variant="outline-primary">Cancel</Button>
                    <Button type="submit" variant="success">Submit</Button>
                </Modal.Footer>

            </Form>
        </Modal>
    );
}

export default AddEditComponentV2;