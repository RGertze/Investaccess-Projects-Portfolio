import React, { useEffect, useState } from "react";
import { Button, Form, Modal, ProgressBar } from "react-bootstrap";
import Loading from "../loading-spinner/loadingSpinner";
import { errorToast } from "../toasts/toasts";

export enum INPUT_TYPE {
    NUMBER = "number",
    TEXT = "text",
    TEXT_AREA = "textarea",
    PASSWORD = "password",
    EMAIL = "email",
    DATE = "date",

    RADIO = "radio",
    CHECK = "check",
    SELECT = "select",

    FILE = "file",
}

export interface field {
    key: string,
    name: string,
    value: any,
    type: INPUT_TYPE,
    required?: boolean,

    numberStep?: number,
    selectValues?: { value: number | string, name: string }[]
    radioValues?: { value: number | string, name: string }[]
}


interface IProps {
    title: string,
    fields: field[],

    uploadProgress?: number,

    submit(data: any): Promise<boolean>,
    cancel(): void
}

const AddEditModal = (props: IProps) => {

    const [loading, setLoading] = useState(false);

    const [state, setState] = useState<any>({});


    useEffect(() => {

        let initState = {};

        // init state
        props.fields.forEach(val => {
            initState[val.key] = val.value;
        });

        setState(initState);
    }, []);

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

    const validateData = async (data: Object): Promise<boolean> => {

        for (const field of props.fields) {

            if (field.required !== undefined && field.required) {

                if (data[field.key] === undefined) {
                    errorToast("Empty required field!");
                    return false;
                }

                if (field.type === INPUT_TYPE.EMAIL) {
                    let regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
                    if (!regex.test(data[field.key])) {
                        errorToast("Invalid email!");
                        return false;
                    }
                }

                if (field.type === INPUT_TYPE.PASSWORD) {
                    let regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;
                    if (!regex.test(data[field.key])) {
                        errorToast("Password must contain atleast 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@ ! # etc). The password must be atleast 8 characters long", false, 4000);
                        return false;
                    }
                }

            }

        }

        return true;
    }

    //----   SUBMIT DATA   ----
    const submitData = async (ev: React.FormEvent<HTMLFormElement>) => {

        ev.preventDefault();
        ev.stopPropagation();

        let data = Object.assign({}, state);
        if (!await validateData(data))
            return;

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
                        <div className="w-100 d-flex justify-content-center">
                            <Loading />
                        </div>
                    }
                    {
                        (loading && props.uploadProgress && props.uploadProgress > 0) &&
                        <div className="w-100 prg-bar">
                            <h4 className="text-center">Upload progress:</h4>
                            <ProgressBar now={props.uploadProgress > 0 ? props.uploadProgress : 1} label={`${props.uploadProgress > 0 ? props.uploadProgress : 1}%`} />
                        </div>
                    }
                    {
                        !loading &&
                        <>
                            {
                                props.fields.map((val, index) => {
                                    if (
                                        val.type === INPUT_TYPE.TEXT
                                        || val.type === INPUT_TYPE.DATE
                                        || val.type === INPUT_TYPE.EMAIL
                                        || val.type === INPUT_TYPE.PASSWORD
                                    ) {
                                        return (
                                            <Form.Group className="mb-3" controlId={val.key} key={index}>
                                                <Form.Label>{val.name}</Form.Label>
                                                <Form.Control required={val.required !== undefined ? val.required : true} onChange={(e) => handleInput(val.key, e.target.value)} type={val.type.toString()} value={state[val.key]} placeholder="" />
                                            </Form.Group>
                                        );
                                    }

                                    if (
                                        val.type === INPUT_TYPE.NUMBER
                                    ) {
                                        return (
                                            <Form.Group className="mb-3" controlId={val.key} key={index}>
                                                <Form.Label>{val.name}</Form.Label>
                                                <Form.Control required={val.required !== undefined ? val.required : true} onChange={(e) => handleInput(val.key, parseFloat(e.target.value) ?? "")} step={val.numberStep ?? 1} type={"number"} value={state[val.key]} placeholder="" />
                                            </Form.Group>
                                        );
                                    }

                                    if (
                                        val.type === INPUT_TYPE.CHECK
                                    ) {
                                        return (
                                            <Form.Group className="mb-3" controlId={val.key} key={index}>
                                                <Form.Label>{val.name}</Form.Label>
                                                <Form.Check required={val.required !== undefined ? val.required : true} onChange={(e) => handleInput(val.key, e.target.checked)} type={"checkbox"} checked={state[val.key]} />
                                            </Form.Group>
                                        );
                                    }

                                    if (
                                        val.type === INPUT_TYPE.SELECT
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

                                    if (
                                        val.type === INPUT_TYPE.FILE
                                    ) {
                                        return (
                                            <Form.Group className="mb-3" controlId={val.key} key={index}>
                                                <Form.Label>{val.name}</Form.Label>
                                                <Form.Control onChange={(e) => handleInput(val.key, (e as any).target.files[0])} type={"file"} />
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

export default AddEditModal;