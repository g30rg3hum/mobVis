/* eslint-disable @typescript-eslint/no-require-imports */
import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

const bcrypt = require("bcrypt");

export async function POST(request: Request) {
  try {
    // at this point, values have been validated.
    const { email, password } = await request.json();
    const sanitizedEmail = email.toLowerCase();

    // // need to check if email already exists in the db.
    const userExists =
      (await prisma.user.count({ where: { email: sanitizedEmail } })) > 0;
    if (!userExists) {
      // create the user.
      // hash the password first.
      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.user.create({
        data: {
          email: sanitizedEmail,
          password: hashedPassword,
        },
      });
      return NextResponse.json(
        { message: "Successfully registered the account." },
        { status: 201 }
      );
    } else {
      // user already exists, return error message.
      return NextResponse.json(
        { message: "Email already exists." },
        { status: 409 }
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
    return NextResponse.json(
      { message: "Something went wrong internally." },
      { status: 500 }
    );
  }
}
