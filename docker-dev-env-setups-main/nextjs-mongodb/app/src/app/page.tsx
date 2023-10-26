
"use client";

import { IService } from "@/utils/interfaces/models";
import { useEffect, useState } from "react";


export default function Home() {
  const [services, setServices] = useState<IService[]>([]);

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

  return (
    <div className="min-w-full">

      <h1 className="text-center bold text-3xl pb-3">Our services:</h1>

      <div className="w-60 ml-[auto] mr-[auto]">

        {
          services.map((service, index) => {
            return (
              <div key={index} className="w-[400px] p-4 mb-3 border-2 border-gray-300 rounded-lg flex flex-row justify-between items-center">
                <div className="flex flex-col">
                  <h2 className="text-lg font-bold">{service.name}</h2>
                  <p className="text-sm">{service.description}
                  </p>
                </div>
                <div className="flex flex-col ml-1">
                  <p className="text-lg font-bold">${service.price}</p>
                </div>
              </div>
            )
          })
        }

      </div>

    </div>
  )
}
