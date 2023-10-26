import React, { useState, useEffect } from 'react';
import { Accordion, Button } from "react-bootstrap";
import { CategoriesApi } from '../../api/api';
import AddEditComponentV2 from '../../components/add-edit-component-V2/AddEditComponent';
import { Category } from '../../components/category/category';

export const Categories = () => {
    const [categories, setCategories] = useState([])
    const [showAddCategory, setShowAddCategory] = useState(false);

    useEffect(() => {
        getAllCategories();
    }, [])

    const getAllCategories = async () => {
        let response = await CategoriesApi.getAll();
        if (response.errorMessage !== "")
            return;

        setCategories(response.data);
    }

    const addCategory = async (data) => {
        let body = {
            categoryName: data.categoryName,
            categoryDescription: data.categoryDescription,
        }
        let response = await CategoriesApi.create(body);
        if (response.errorMessage !== "")
            alert(response.errorMessage);

        getAllCategories();
        setShowAddCategory(false);
    }

    return (
        <div className="categories">
            <h1 className='vert-flex' style={{ padding: "20px" }}>
                Categories
                <Button style={{ marginLeft: "20px" }} variant="success" size="lg" onClick={() => setShowAddCategory(true)} className="float-end btn">Add</Button>
            </h1>
            <Accordion>
                {categories.map((category, index) => (
                    <Accordion.Item eventKey={index}>
                        <Category category={category} refresh={getAllCategories} showItems={false} />
                    </Accordion.Item>
                ))}
            </Accordion>

            {
                showAddCategory &&
                <AddEditComponentV2
                    show={showAddCategory}
                    setShow={setShowAddCategory}

                    title="Add Category"
                    fields={[
                        {
                            key: "categoryName",
                            name: "categoryName",
                            label: "Category Name",
                            type: "text",
                            required: true
                        },
                        {
                            key: "categoryDescription",
                            name: "categoryDescription",
                            label: "Category Description",
                            type: "text",
                            required: true
                        }
                    ]}

                    cancel={() => setShowAddCategory(false)}
                    submit={async (data) => await addCategory(data)}
                />
            }
        </div>
    )
}