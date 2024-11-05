import prisma from "~/prisma/prisma";

export default defineEventHandler(async (event) => {
  try {
    const posts = await prisma.post.findMany();
    return posts;
    console.log("Posts fetched:", posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
  } finally {
    await prisma.$disconnect();
  }
});
