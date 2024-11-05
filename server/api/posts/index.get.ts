import prisma from "~/prisma/prisma";

export default defineEventHandler(async (event) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: true,
        comments: true,
      },
    });
    return posts;
  } catch (error: any) {
    console.error("Error fetching posts:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Error fetching posts",
    });
  } finally {
    await prisma.$disconnect();
  }
});
