"use client"

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function SignInPage(
    {
        params,
        searchParams,
    }: {
        params: { slug: string };
        searchParams: { [key: string]: string | string[] | undefined };
    }) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();

    const login = async () => {
        if (username === "" || password === "") {
            alert("Please fill in all fields");
            return;
        }

        let res = await signIn("credentials", {
            username,
            password,
            redirect: false,
        });

        if (!res) {
            alert("An error occurred");
            return;
        }

        // check if the response is an error
        if (res.error) {
            alert(res.error);
            return;
        }

        router.push("/");
    }


    return (
        <div className="min-h-screen min-w-full">
            <h1 className="ml-[auto] mr-[auto] text-center text-3xl mb-4">Sign In:</h1>
            <form className="flex bg-slate-100 rounded shadow p-10 flex-col items-center center w-[300px] ml-[auto] mr-[auto]" onSubmit={(e) => {
                e.preventDefault();
                login();
            }}>
                <label className="p-2 pt-0" htmlFor="username">Username:</label>
                <input className="required focus:ring-3 border rounded" onChange={(e) => {
                    setUsername(e.target.value);
                }} type="text" id="username" name="username" value={username} placeholder="exampleUser" />
                <label className="mt-5 p-2" htmlFor="password">Password:</label>
                <input className="required border rounded" onChange={(e) => {
                    setPassword(e.target.value);
                }} type="password" id="password" name="password" value={password} placeholder="****" />

                <button formAction="submit" className=" mt-4 pl-5 pr-5 pt-1 pb-1 text-white rounded-full bg-orange-500">Sign in</button>
            </form>
        </div>
    );
}
