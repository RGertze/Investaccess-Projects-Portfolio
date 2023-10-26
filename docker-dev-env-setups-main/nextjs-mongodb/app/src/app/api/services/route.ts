import { Service } from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET() {
    const services = await Service.find();
    return NextResponse.json(services);
}