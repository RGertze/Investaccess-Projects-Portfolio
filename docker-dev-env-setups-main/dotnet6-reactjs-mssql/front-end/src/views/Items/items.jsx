
import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { CategoriesApi, ItemsApi } from "../../api/api";
import AddEditComponentV2 from "../../components/add-edit-component-V2/AddEditComponent";
import { Item } from "../../components/item/item";


export const Items = () => {
    const [showAddItem, setShowAddItem] = useState(false);
    const [items, setItems] = useState([])
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        getAllItems();
        getAllCategories();
    }, [])

    const getAllItems = async () => {
        let response = await ItemsApi.getAll();
        if (response.errorMessage !== "")
            return;

        setItems(response.data);
    }

    const getAllCategories = async () => {
        let response = await CategoriesApi.getAll();
        if (response.errorMessage !== "")
            return;

        setCategories(response.data);
    }

    return (
        <div className="items">
            <h1 style={{ padding: "10px" }}>
                Items
            </h1>
            <Table>
                <thead>
                    <tr>
                        <th>Item ID</th>
                        <th>Item Name</th>
                        <th>Item Description</th>
                        <th>Category ID</th>
                        <th>Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <Item item={item} refresh={getAllItems} />
                    ))}
                </tbody>
            </Table>

            {
                showAddItem &&
                <AddEditComponentV2
                    show={showAddItem}
                    setShow={setShowAddItem}

                    title="Add Item"
                    fields={[
                        {
                            key: "categoryId",
                            name: "Category ID",
                            label: "Category ID",
                            type: "select",
                            selectValues: categories.map((category) => ({ value: category.categoryId, name: category.categoryName })),
                        },
                        {
                            key: "itemName",
                            name: "Item name",
                            label: "Item Name",
                            type: "text",
                            required: true
                        },
                        {
                            key: "itemDescription",
                            name: "Item Description",
                            label: "Item Description",
                            type: "text",
                            required: true
                        },
                    ]}

                    cancel={() => setShowAddItem(false)}
                    submit={async (data) => await setShowAddItem(data)}
                />
            }
        </div>
    )
}