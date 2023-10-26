import { FC, useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { IGlobalContext, ITodo, ROLES } from '../../api/interfaces/interfaces';
import { TodoApi } from '../../api/todoApi';
import { confirmChoice, errorToast, successToast } from '../../components/toasts/toasts';
import AddEditModal, { INPUT_TYPE } from '../../components/add-edit-modal/addEditModal';
import { Pencil, Trash } from 'react-bootstrap-icons';
import Loading from '../../components/loading-spinner/loadingSpinner';

interface IProps {
    context: IGlobalContext
}
export const HomePage: FC<IProps> = ({ context }) => {
    const [todosOriginal, setTodosOriginal] = useState<ITodo[]>([]);
    const [todosToShow, setTodosToShow] = useState<ITodo[]>([]);
    const [showAdding, setShowAdding] = useState(false);
    const [todoToEdit, setTodoToEdit] = useState<ITodo>();
    const [showTodo, setShowTodo] = useState(true);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getAll();
    }, []);

    useEffect(() => {
        filterTodos();
    }, [showTodo, todosOriginal]);

    const filterTodos = () => {
        console.log(todosOriginal);
        let temp = todosOriginal.filter((todo: ITodo) => (todo.isComplete === 0) === showTodo);
        setTodosToShow(temp);
    }

    const getAll = async () => {
        setLoading(true);
        let result = context.roleId === ROLES.ADMIN ? await TodoApi.getAll() : await TodoApi.getAllForUser(context.userId);
        setLoading(false);
        if (result.statusCode !== 200) {
            errorToast(result.message);
            return;
        }
        setTodosOriginal(result.data);
    }

    const addNew = async (todo: ITodo): Promise<boolean> => {
        let result = await TodoApi.add({
            userId: context.userId,
            name: todo.name,
            description: todo.description,
        });
        if (result.statusCode !== 200) {
            errorToast(result.message);
            return false;
        }
        successToast("Todo added successfully", true);
        getAll();
        setShowAdding(false);
        return true;
    }
    const edit = async (todo: ITodo): Promise<boolean> => {
        if (!todoToEdit) {
            errorToast("Nothing is being edited!");
            return false;
        }

        let result = await TodoApi.update({
            id: todoToEdit?.id || 0,
            userId: context.userId,
            name: todo.name,
            description: todo.description,
        });
        if (result.statusCode !== 200) {
            errorToast(result.message, true);
            return false;
        }
        successToast("Todo edited successfully", true);
        getAll();
        setTodoToEdit(undefined);
        return true;
    }
    const deleteItem = async (id: number) => {
        let confirm = await confirmChoice("Are you sure you want to delete this todo?", "This action cannot be undone!");
        if (!confirm.isConfirmed) return;

        setLoading(true);
        let result = await TodoApi.delete(id);
        setLoading(false);
        if (result.statusCode !== 200) {
            errorToast(result.message, true);
            return;
        }

        successToast("Todo deleted successfully", true);
        getAll();
    }
    const markDone = async (id: number) => {
        setLoading(true);
        let result = await TodoApi.markAsComplete(id);
        setLoading(false);
        if (result.statusCode !== 200) {
            errorToast(result.message, true);
            return;
        }

        successToast("Todo marked as done successfully", true);
        getAll();
    }
    const markIncomplete = async (id: number) => {
        setLoading(true);
        let result = await TodoApi.markAsIncomplete(id);
        setLoading(false);
        if (result.statusCode !== 200) {
            errorToast(result.message, true);
            return;
        }

        successToast("Todo marked as incomplete successfully", true);
        getAll();
    }


    return (
        <div className='p-5' >
            <div className='d-flex justify-content-between'>
                <h1 className='py-3'>List of Todos</h1>
                <Button variant='success' className='px-5' onClick={() => setShowAdding(true)}>New</Button>
            </div>

            <div className='d-flex pb-2'>
                <Button variant={showTodo ? "primary" : "secondary"} onClick={() => setShowTodo(true)}>Todo</Button>
                <Button variant={!showTodo ? "primary" : "secondary"} className='ms-2' onClick={() => setShowTodo(false)}>Done</Button>
            </div>
            <Table striped hover responsive>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Created At</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        !loading &&
                        todosToShow.map((todo: ITodo) => {
                            let createdAt = new Date(todo.createdAt ?? 0).toLocaleString();
                            return (
                                <tr key={todo.id}>
                                    <td style={{ paddingTop: "1rem" }}>{todo.name}</td>
                                    <td style={{ paddingTop: "1rem" }}>{todo.description}</td>
                                    <td style={{ paddingTop: "1rem" }}>{createdAt}</td>
                                    <td>
                                        <div className='d-flex justify-content-evenly align-items-center'>
                                            <Button variant={showTodo ? "primary" : "danger"} onClick={() => {
                                                if (showTodo)
                                                    markDone(todo.id)
                                                else
                                                    markIncomplete(todo.id)
                                            }}>
                                                {showTodo ? "done" : "todo"}
                                            </Button>
                                            <Pencil className='hover-pointer' onClick={() => setTodoToEdit(todo)} />
                                            <Trash className='hover-pointer bg-red' onClick={() => deleteItem(todo.id)} />
                                        </div>
                                    </td>
                                </tr>
                            )
                        })
                    }
                    {
                        !loading && todosToShow.length === 0 &&
                        <tr>
                            <td colSpan={6} className='text-center'>No data found</td>
                        </tr>
                    }
                    {
                        loading &&
                        <tr>
                            <td colSpan={6} className='text-center'><Loading /></td>
                        </tr>
                    }
                </tbody>
            </Table>


            {
                showAdding &&
                <AddEditModal
                    title='Add New'
                    cancel={() => setShowAdding(false)}
                    submit={addNew}
                    fields={[
                        { key: "name", name: "Name", type: INPUT_TYPE.TEXT, value: "", required: true },
                        { key: "description", name: "Description", type: INPUT_TYPE.TEXT, value: "", required: true },
                    ]}
                />
            }

            {
                todoToEdit &&
                <AddEditModal
                    title='Edit'
                    cancel={() => setTodoToEdit(undefined)}
                    submit={edit}
                    fields={[
                        { key: "name", name: "Name", type: INPUT_TYPE.TEXT, value: todoToEdit.name, required: true },
                        { key: "description", name: "Description", type: INPUT_TYPE.TEXT, value: todoToEdit.description, required: true },
                    ]}
                />
            }
        </div>
    );
}

export default HomePage;