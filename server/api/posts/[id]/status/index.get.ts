import prisma from "~/prisma/prisma";

interface EventHandlerResult {
  status: number;
  message: string;
}

export default defineEventHandler(
  async (event): Promise<EventHandlerResult> => {
    try {
      const id = getRouterParam(event, "id");
      const post = await prisma.post.findUnique({
        where: {
          id: id,
        },
        include: { author: true },
      });
      if (post) {
        await prisma.post.update({
          where: {
            id: post.id,
          },
          data: {
            published: !post.published,
          },
        });
        return {
          status: 200,
          message: "Updated Post Status.",
        };
      } else {
        throw createError({
          statusMessage: "1001",
          statusCode: 400,
        });
      }
    } catch (error: any) {
      if (error.message == "1001") {
        throw createError({
          statusMessage: "No such post found in database.",
          statusCode: 500,
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
