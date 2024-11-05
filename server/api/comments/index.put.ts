import prisma from "~/prisma/prisma";

interface CommentInputs {
  commentId: string;
  content: string;
}

interface EventHandlerResult {
  status: number;
  message: string;
}

export default defineEventHandler(
  async (event): Promise<EventHandlerResult> => {
    try {
      const { commentId, content }: CommentInputs = await readBody(event);

      if (!(commentId && content)) {
        throw createError({
          statusMessage: "4002",
          statusCode: 400,
        });
      }

      const comment = await prisma.comment.findUnique({
        where: {
          id: commentId,
        },
      });

      if (!comment) {
        throw createError({
          statusMessage: "4001",
          statusCode: 400,
        });
      }
      await prisma.comment.update({
        where: {
          id: comment.id,
        },
        data: {
          content: content,
        },
      });

      return {
        status: 200,
        message: "Upload Successful",
      };
    } catch (error: any) {
      if (error.message === "4001") {
        throw createError({
          statusMessage: "Comment not found",
          statusCode: 400,
        });
      }
      if (error.code === "4002") {
        throw createError({
          statusMessage: `Invalid data.`,
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
