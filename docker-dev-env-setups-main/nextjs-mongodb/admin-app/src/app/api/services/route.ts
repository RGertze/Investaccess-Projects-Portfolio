import Service from "@/db-models/Service";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { IService } from "@/utils/interfaces/models";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session) {
        console.log("not authenticated");
        return NextResponse.json(401);
    }

    console.log(session);

    const services = await Service.find();
    return NextResponse.json(services);
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        console.log("not authenticated");
        return NextResponse.json(401);
    }

    // get body of post request
    let data: IService = await req.json();
    console.log(data);

    let result = await Service.create(data);
    if (!result) {
        return NextResponse.json(500);
    }

    return NextResponse.json(200);
}

export async function DELETE(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session) {
        console.log("not authenticated");
        return NextResponse.json(401);
    }

    let id = req.nextUrl.searchParams.get("id");

    let result = await Service.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
        return NextResponse.json(500);
    }

    return NextResponse.json(200);
}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        console.log("not authenticated");
        return NextResponse.json(401);
    }

    let data: IService = await req.json();
    console.log(data);

    // update the service
    let result = await Service.updateOne({ _id: data._id }, data);
    if (result.modifiedCount === 0) {
        return NextResponse.json(500);
    }

    return NextResponse.json(200);
}