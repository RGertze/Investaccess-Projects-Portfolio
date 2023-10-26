
import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ItemsApi } from "../../api/api";
import { CategoriesApi } from "../../api/api";


export const Home = () => {

    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getItems();
        getCategories();
    }, []);

    const getItems = async () => {
        let response = await ItemsApi.getAll();
        if (response.errorMessage !== "")
            return;

        setItems(response.data);
    }

    const getCategories = async () => {
        let response = await CategoriesApi.getAll();
        if (response.errorMessage !== "")
            return;

        setCategories(response.data);
    }

    return (
        <div className="home">
            <h1>Home</h1>

            <Card className="hover" onClick={() => {
                navigate("/items");
            }}>
                <Card.Header>Items</Card.Header>
                <Card.Body>
                    <h1>
                        {items.length}
                    </h1>
                </Card.Body>
            </Card>

            <Card className="hover" onClick={() => {
                navigate("/categories");
            }}>
                <Card.Header>Categories</Card.Header>
                <Card.Body>
                    <h1>
                        {categories.length}
                    </h1>
                </Card.Body>
            </Card>
        </div>
    )
}