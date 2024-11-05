import prisma from "~/prisma/prisma";
import { User } from "@prisma/client";

interface EventHandlerResult {
  status: number;
  user: User;
  message: string;
}

export default defineEventHandler(
  async (event): Promise<EventHandlerResult> => {
    try {
      const id = getRouterParam(event, "id");

      const user = await prisma.user.findUnique({
        where: {
          id: id,
        },
      });

      if (!user) {
        throw createError({
          statusMessage: "5001",
          statusCode: 400,
        });
      }

      return {
        status: 200,
        user: user,
        message: "Got User",
      };
    } catch (error: any) {
      if (error.message === "5001") {
        throw createError({
          statusMessage: "User not found",
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
