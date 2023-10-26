"use client";

import { BsList } from "react-icons/all";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const Navbar = () => {

  const [menuOpen, setMenuOpen] = useState(false);

  const router = useRouter();

  return (
    <nav className="mb-10 p-9 flex flex-row justify-between items-center min-w-[100vw]">
      <img
        className="w-20 h-20 rounded-full"
        src="https://images.unsplash.com/photo-1567446537708-ac4aa75c9c28?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80"
        alt="" />
      <h1 className="hidden sm:inline text-orange-600 font-bold">Company Name</h1>
      <div className="hidden lg:inline ml-[40px]">
        <ul className="flex flex-row justify-between items-center min-w-[50vw]">
          <li>
            <Link href="/">Home</Link>
          </li>
        </ul>
      </div>

      <div className="w-[100px] flex-row space-evenly">
        <button onClick={() => setMenuOpen(!menuOpen)} className="float-right">
          <BsList className={"h-8 w-8 lg:hidden hover:cursor-pointer"} />
        </button>

        {
          menuOpen &&
          <ul
            className="absolute flex flex-col justify-between z-[1000] right-0 p-3 mt-9 mr-2 min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg"
          >
            <li>
              <Link href="/">Home</Link>
            </li>
          </ul>
        }
      </div>
    </nav>
  );
}