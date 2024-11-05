import prisma from "~/prisma/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface EventHandlerResult {
  status: number;
  message: string;
  token: string;
}

interface LoginInputs {
  email: string;
  password: string;
  keepAlive: boolean;
}

export default defineEventHandler(
  async (event): Promise<EventHandlerResult> => {
    try {
      const { email, password, keepAlive }: LoginInputs = await readBody(event);

      if (!(email && password)) {
        throw createError({
          statusMessage: "1002",
          statusCode: 400,
        });
      }

      const existingUser = await prisma.user.findUnique({
        where: {
          email: email.toLowerCase(),
        },
      });
      if (!existingUser) {
        throw createError({
          statusMessage: "1001",
          statusCode: 400,
        });
      }

      //Encrypt user password
      let passValid: boolean = await bcrypt.compare(
        password,
        existingUser?.password
      );

      if (existingUser && passValid) {
        let access_token: string;
        if (keepAlive) {
          access_token = jwt.sign(
            {
              id: existingUser.id,
              email: existingUser.email,
              name: existingUser.name,
              role: existingUser.role,
            },
            process.env.TOKEN_KEY as jwt.Secret
          );
        } else {
          access_token = jwt.sign(
            {
              id: existingUser.id,
              email: existingUser.email,
              name: existingUser.name,
              role: existingUser.role,
            },
            process.env.TOKEN_KEY as jwt.Secret,
            {
              expiresIn: "1h",
            }
          );
        }
        return {
          status: 200,
          message: "User Login Successful",
          token: access_token,
        };
      } else {
        throw createError({
          statusMessage: "1003",
          statusCode: 400,
        });
      }
    } catch (error: any) {
      if (error.message === "1001") {
        throw createError({
          statusMessage: "No existing user.",
          statusCode: 400,
        });
      }
      if (error.message === "1002") {
        throw createError({
          statusMessage: "Input fields missing.",
          statusCode: 400,
        });
      }
      if (error.message === "1003") {
        throw createError({
          statusMessage: "Invalid Credentials.",
          statusCode: 400,
        });
      }
      throw createError({
        statusMessage: "An unknown error occurred",
        statusCode: 500,
      });
    } finally {
      await prisma.$disconnect();
    }
  }
);
