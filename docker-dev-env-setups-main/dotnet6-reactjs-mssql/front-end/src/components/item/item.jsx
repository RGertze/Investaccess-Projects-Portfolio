import { ItemsApi } from "../../api/api";
import { Button } from "react-bootstrap";
import { useState } from "react";


/**
 * 
 * @param {{
 *    item: {
 *       itemID: number,
 *       itemName: string,
 *       itemDescription: string,
 *       categoryID: number,
 *       createdAt: string,
 *    },
 *   refresh: () => void
 * }} props 
 * @returns 
 */
export const Item = (props) => {

    const deleteItem = async () => {
        let response = await ItemsApi.delete(props.item.itemID);
        if (response.errorMessage !== "")
            alert(response.errorMessage);

        props.refresh();
    }

    return (
        <tr>
            <td>{props.item.itemID}</td>
            <td>{props.item.itemName}</td>
            <td>{props.item.itemDescription}</td>
            <td>{props.item.categoryID}</td>
            <td>{props.item.createdAt}</td>
            <td><Button variant="danger" size="sm" onClick={deleteItem}>Delete</Button></td>
        </tr>
    )
}