import prisma from "~/prisma/prisma";

interface EventHandlerResult {
  status: number;
  message: string;
}

export default defineEventHandler(
  async (event): Promise<EventHandlerResult> => {
    try {
      const id = getRouterParam(event, "id");
      const { image, type } = await readBody(event);
      const post = await prisma.post.findUnique({
        where: {
          id: id,
        },
        include: { author: true },
      });
      if (post) {
        if (type !== "covers" || type !== "gallery") {
          if (type == "covers" && post.covers.includes(image)) {
            await prisma.post.update({
              where: {
                id: post.id,
              },
              data: {
                covers: post.covers.filter((x) => x !== image),
                gallery: post.gallery.concat([image]),
              },
            });
            return {
              status: 200,
              message: "Updated Post Images.",
            };
          } else if (type == "gallery" && post.gallery.includes(image)) {
            await prisma.post.update({
              where: {
                id: post.id,
              },
              data: {
                covers: post.covers.concat([image]),
                gallery: post.gallery.filter((x) => x !== image),
              },
            });
            return {
              status: 200,
              message: "Updated Post Images.",
            };
          } else {
            throw createError({
              statusMessage: "1002",
              statusCode: 400,
            });
          }
        } else {
          throw createError({
            statusMessage: "1003",
            statusCode: 400,
          });
        }
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
      if (error.message == "1002") {
        throw createError({
          statusMessage: "No image in type.",
          statusCode: 500,
        });
      }
      if (error.message == "1003") {
        throw createError({
          statusMessage: "Invalid type.",
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
