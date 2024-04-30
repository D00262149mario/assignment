import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    const existUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existUser) {
      return NextResponse.json({
        message: "User already Exists with this email",
        status: 400,
      });
    }
    await prisma.user.create({
      data: {
        email: email,
        name: name,
        password: password,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ message: error, status: 500 });
  }
  return NextResponse.json({ message: "ok", status: 200 });
}
