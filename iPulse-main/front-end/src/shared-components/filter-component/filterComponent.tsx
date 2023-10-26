import { useEffect, useState } from "react";
import { FormControl, FormGroup, FormLabel, FormSelect } from "react-bootstrap";
import "./filterComponent.css";

export enum FILTER_TYPE {
    STRING,
    NUMBER,
    SELECT
}

export interface IValue {
    id: any,
    name: string
}

export interface IFilter {
    type: FILTER_TYPE,
    label: string,
    values?: IValue[],
    defaultValue: any
}

interface IProps {
    filters: IFilter[],
    onSubmit(data: any): Promise<void>
}

const FilterComponent = (props: IProps) => {

    const [state, setState] = useState<any>({});

    //----   ON STATE CHANGE   ----
    useEffect(() => {
        if (Object.keys(state).length > 0) {
            props.onSubmit(state);
        }
    }, [state]);

    const handleInput = (key: string, data: any) => {
        let newState = Object.assign({}, state);
        newState[key] = data;
        setState(newState);
    }

    return (
        <div className="vert-flex justify-center filter-component-container">
            {
                props.filters.map((filter, index) => {
                    return (
                        <FormGroup key={index} className="filter-component">
                            <FormLabel><b>{filter.label.replaceAll("_", " ")}</b></FormLabel>
                            {
                                filter.type === FILTER_TYPE.STRING &&
                                <FormControl onChange={(e) => handleInput(filter.label, e.target.value)} type={"text"} value={state[filter.label] ?? ""} placeholder={filter.defaultValue} />
                            }
                            {
                                filter.type === FILTER_TYPE.NUMBER &&
                                <FormControl onChange={(e) => handleInput(filter.label, parseFloat(e.target.value) === NaN ? 0 : parseFloat(e.target.value))} type={"number"} value={state[filter.label] ?? 0} placeholder="" />
                            }
                            {
                                filter.type === FILTER_TYPE.SELECT &&
                                <FormSelect onChange={(e) => handleInput(filter.label, JSON.parse(e.target.value))} value={state[filter.label] ?? 0}>
                                    {
                                        <option value={0}>None</option>
                                    }
                                    {
                                        filter.values &&
                                        filter.values.map((val, index) => {
                                            return (
                                                <option key={index} value={JSON.stringify(val.id)}>{val.name}</option>
                                            );
                                        })
                                    }
                                </FormSelect>
                            }
                        </FormGroup>
                    );
                })
            }
        </div>
    );
}

export default FilterComponent;