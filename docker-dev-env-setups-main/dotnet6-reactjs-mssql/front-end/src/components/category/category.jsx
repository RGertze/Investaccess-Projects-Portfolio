
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { CategoriesApi, ItemsApi } from '../../api/api';

/**
 * 
 * @param {{
 *  category:{
 *     categoryID: number,
 *     categoryName: string,
 *     categoryDescription: string,
 *     createdAt: string,
 *  },
 *  refresh: () => void,
 *  showItems: boolean
 * }} props 
 * @returns React.Component
 */
export const Category = (props) => {

    const [items, setItems] = useState([]);

    useEffect(() => {
        props.showItems &&
            getItems();
    }, []);

    const getItems = async () => {
        console.log(props.category);
        let response = await ItemsApi.getAll({ categoryId: props.category.categoryId });
        if (response.errorMessage !== "")
            return;

        setItems(response.data);
    }

    const deleteCategory = async () => {
        let response = await CategoriesApi.delete(props.category.categoryId);
        if (response.errorMessage !== "")
            alert(response.errorMessage);

        props.refresh();
    }


    return (
        <div>
            <h1 className='vert-flex' style={{ padding: "20px" }}>
                {props.category.categoryName}
                <Button style={{ marginLeft: "20px" }} variant="danger" size="sm" className="float-end" onClick={deleteCategory}>Delete</Button>
            </h1>
            <p>
                {props.category.categoryDescription}
            </p>

            <hr />

            {
                props.showItems &&
                <div>
                    <h4>
                        Items
                    </h4>
                    <ul>
                        {items.map((item, index) => (
                            <li key={index}>
                                {item.itemName}
                            </li>
                        ))}
                    </ul>
                </div>
            }
        </div>
    )
}