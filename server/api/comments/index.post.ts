import prisma from "~/prisma/prisma";
interface CommentInputs {
  postId: string;
  userId: string;
  comment: string;
}

interface EventHandlerResult {
  status: number;
  message: string;
}

export default defineEventHandler(
  async (event): Promise<EventHandlerResult> => {
    try {
      const { postId, userId, comment }: CommentInputs = await readBody(event);
      console.log(postId);
      if (!(postId && userId && comment)) {
        throw createError({
          statusMessage: "3002",
          statusCode: 400,
        });
      }

      const post = await prisma.post.findUnique({
        where: {
          id: postId,
        },
      });
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!post || !user) {
        throw createError({
          statusMessage: "3001",
          statusCode: 400,
        });
      }
      await prisma.comment.create({
        data: {
          content: comment,
          authorId: user.id,
          postId: post.id,
        },
      });

      return {
        status: 200,
        message: "Upload Successful",
      };
    } catch (error: any) {
      if (error.message === "3001") {
        throw createError({
          statusMessage: "Post or user not found",
          statusCode: 400,
        });
      }
      if (error.code === "3002") {
        throw createError({
          statusMessage: `Invalid credentials.`,
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
