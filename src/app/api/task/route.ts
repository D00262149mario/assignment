import prisma from "@/lib/db";
import { Status } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { name, description, userId, color, priority } = await request.json();
    const existTask = await prisma.task.findUnique({
      where: {
        name,
      },
    });
    if (existTask) {
      return NextResponse.json({
        message: "Cannot add duplicate tasks",
        status: 400,
      });
    }
    await prisma.task.create({
      data: {
        name: name,
        color: color,
        status: Status["PENDING"],
        priority: priority,
        description: description,
        user: { connect: { id: Number(userId) } },
      },
    });
  } catch (error: any) {
    return NextResponse.json({ message: error, status: 500 });
  }
  return NextResponse.json({ message: "ok", status: 200 });
}

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  try {
    const tasks = await prisma.task.findMany({
      where: {
        userId: Number(id),
      },
    });

    return NextResponse.json({ message: "ok", status: 200, data: tasks });
  } catch (error: any) {
    return NextResponse.json({ message: error, status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { name, description, userId, color, priority, status, id } =
      await request.json();
    console.log(name);
    const taskupdate = await prisma.task.update({
      where: { id },
      data: {
        name: name,
        color: color,
        status: status,
        priority: priority,
        description: description,
        user: { connect: { id: Number(userId) } },
      },
    });
    if (taskupdate) {
      return NextResponse.json({ message: "Task updated", status: 200 });
    } else {
      return NextResponse.json({
        message: "Error while Updating task",
        status: 400,
      });
    }
  } catch (error: any) {
    return NextResponse.json({ message: error, status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  try {
    await prisma.task.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      message: "Task deleted",
      status: 200,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error, status: 500 });
  }
}
