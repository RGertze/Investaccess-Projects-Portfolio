"use client"

import { IService } from "@/utils/interfaces/models";
import { data } from "autoprefixer";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import { IoAddSharp } from "react-icons/io5";

export const Services = () => {

    const router = useRouter();
    const { data: session, status } = useSession();

    const [services, setServices] = useState<IService[]>([]);
    const [showAddService, setShowAddService] = useState<boolean>(false);

    const [newServiceName, setNewServiceName] = useState<string>("");
    const [newServiceDescription, setNewServiceDescription] = useState<string>("");
    const [newServicePrice, setNewServicePrice] = useState<number>(0);

    const [serviceToUpdate, setServiceToUpdate] = useState<IService>();

    useEffect(() => {
        if (status !== "loading" && status !== "authenticated") {
            alert("You are not logged in");
            // router.push("/signin");
            router.push("/signin");
        }
    }, [status]);

    useEffect(() => {
        getServices();
    }, []);

    const getServices = async () => {
        const res = await fetch("/api/services", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        console.log(res);

        // get services from body
        let services: IService[] = await res.json();
        console.log(services);
        setServices(services);
    }

    const addService = async () => {
        if (newServiceName === "" || newServiceDescription === "" || newServicePrice < 0) {
            alert("Please fill out all fields");
            return;
        }

        const res = await fetch("/api/services", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: newServiceName,
                description: newServiceDescription,
                price: newServicePrice
            })
        });

        if (res.status !== 200) {
            alert("Error adding service");
            return;
        }

        setShowAddService(false);
        setNewServiceName("");
        setNewServiceDescription("");
        setNewServicePrice(0);

        getServices();
    }

    const deleteService = async (id: string) => {
        let res = await fetch(`/api/services?id=${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (res.status !== 200) {
            alert("Error deleting service");
            return;
        }

        alert("Service deleted");
        getServices();
    }

    const updateService = async () => {
        if (serviceToUpdate === undefined)
            return;

        if (serviceToUpdate.name === "" || serviceToUpdate.description === "" || serviceToUpdate.price < 0) {
            alert("Please fill out all fields");
            return;
        }

        const res = await fetch("/api/services", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                _id: serviceToUpdate._id,
                name: serviceToUpdate.name,
                description: serviceToUpdate.description,
                price: serviceToUpdate.price
            })
        });

        if (res.status !== 200) {
            alert("Error adding service");
            return;
        }

        setServiceToUpdate(undefined);

        getServices();
    }

    return (
        <div className="pl-5 pr-5 flex flex-col justify-evenly items center">
            <h1 className="text-center mb-3 text-2xl bold">Services:</h1>
            <table className="border border-collapse border-slate-400" suppressHydrationWarning={true}>
                <thead>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th></th>
                    <th>
                        <button onClick={() => setShowAddService(true)} className="hover:cursor-pointer hover:text-green-500 text-green-700 flex flex-row items-center justify-center ">
                            <IoAddSharp />
                        </button>
                    </th>
                </thead>
                <tbody>
                    {
                        services.map((service, index) => {
                            return (
                                <tr key={index}>
                                    <td align="center">{service.name}</td>
                                    <td align="center">{service.description}</td>
                                    <td align="center">{service.price}</td>
                                    <td align="center">
                                        <button onClick={() => setServiceToUpdate(service)} className=" hover:text-blue-500 text-blue-700">
                                            <BsPencilSquare />
                                        </button>
                                    </td>
                                    <td align="center">
                                        <button onClick={() => deleteService(service._id)} className=" hover:text-red-500 text-red-700">
                                            <BsTrash />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </table>

            <div className={`${!showAddService && "hidden"} absolute flex flex-col items-center p-5 w-50 justify-evenly ml-[40%]  bg-white shadow border `}>
                <h3 className="mb-4 underline">Add Service</h3>
                <form className="flex flex-col items-center justify-evenly" onSubmit={(e) => {
                    e.preventDefault();
                    addService();
                }}>
                    <label htmlFor="name">Name:</label>
                    <input className="border" type="text" id="name" name="name" onChange={(e) => setNewServiceName(e.target.value)} value={newServiceName} />
                    <label htmlFor="description">Description:</label>
                    <input className="border" type="text" id="description" name="description" onChange={(e) => setNewServiceDescription(e.target.value)} value={newServiceDescription} />
                    <label htmlFor="price">Price:</label>
                    <input className="border" type="number" id="price" name="price" onChange={(e) => {
                        if (e.target.value === "" || e.target.value === null || e.target.value === undefined)
                            return;
                        setNewServicePrice(Number.parseFloat(e.target.value))
                    }} value={newServicePrice} />
                    <button className="p-2 mt-3 border rounded hover:bg-green-500 bg-green-700 text-white" type="submit">Add</button>
                </form>
                <button onClick={() => setShowAddService(false)} className="p-2 mt-3 border rounded hover:bg-red-500 bg-red-700 text-white">Cancel</button>
            </div>

            <div className={`${serviceToUpdate === undefined && "hidden"} absolute flex flex-col items-center p-5 w-50 justify-evenly ml-[40%]  bg-white shadow border `}>
                <h3 className="mb-4 underline">Update Service:</h3>
                <form className="flex flex-col items-center justify-evenly" onSubmit={(e) => {
                    e.preventDefault();
                    updateService();
                }}>
                    <label htmlFor="name">Name:</label>
                    <input className="border" type="text" id="name" name="name" onChange={(e) => {
                        if (serviceToUpdate !== undefined)
                            setServiceToUpdate({ ...serviceToUpdate, name: e.target.value });
                    }} value={serviceToUpdate?.name} />
                    <label htmlFor="description">Description:</label>
                    <input className="border" type="text" id="description" name="description" onChange={(e) => {
                        if (serviceToUpdate !== undefined)
                            setServiceToUpdate({ ...serviceToUpdate, description: e.target.value });
                    }} value={serviceToUpdate?.description} />
                    <label htmlFor="price">Price:</label>
                    <input className="border" type="number" id="price" name="price" onChange={(e) => {
                        if (e.target.value === "" || e.target.value === null || e.target.value === undefined)
                            return;
                        if (serviceToUpdate !== undefined)
                            setServiceToUpdate({ ...serviceToUpdate, price: Number.parseFloat(e.target.value) });
                    }} value={serviceToUpdate?.price} />
                    <button className="p-2 mt-3 border rounded hover:bg-green-500 bg-green-700 text-white" type="submit">Add</button>
                </form>
                <button onClick={() => {
                    setServiceToUpdate(undefined);
                }} className="p-2 mt-3 border rounded hover:bg-red-500 bg-red-700 text-white">Cancel</button>
            </div>
        </div>
    );
}