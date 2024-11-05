import formidable from "formidable";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import prisma from "~/prisma/prisma";
import { IncomingMessage } from "http";

interface FormFile {
  filepath: string;
  mimetype: string;
  size: number;
}

interface ParsedFormData {
  covers: FormFile[];
  gallery: FormFile[];
  user: string;
  title: string;
  categories: string;
  date: string;
  content: string;
}

interface EventHandlerResult {
  status: number;
  message: string;
}

export default defineEventHandler(
  async (event): Promise<EventHandlerResult> => {
    try {
      const id = getRouterParam(event, "id");
      let body: ParsedFormData = await parseMultipartNodeRequest(
        event.node.req
      );
      const post = await prisma.post.findUnique({
        where: {
          id: id,
        },
        include: {
          author: true,
          comments: true,
        },
      });
      if (post) {
        let covers: string[] = [];
        if (body.covers && body.covers.length > 0) {
          for (let i = 0; i < body.covers.length; i++) {
            const image = uploadImage("covers", body.covers[i], post.id);
            covers.push(image);
          }
        }
        let gallery: string[] = [];
        if (body.gallery && body.gallery.length > 0) {
          for (let i = 0; i < body.gallery.length; i++) {
            const image = uploadImage("gallery", body.gallery[i], post.id);
            gallery.push(image);
          }
        }
        // Split categories
        const categoryRegex = /([^,]+)/gm;
        let categoryArray: any = body.categories[0].match(categoryRegex);
        if (categoryArray) {
          for (let i = 0; i < categoryArray.length; i++) {
            let result = categoryArray[i]
              .toLowerCase()
              .trim()
              .split(" ")
              .join("-");
            categoryArray[i] = result;
          }
        }
        // Parse the date
        const date = new Date(body.date[0]);

        await prisma.post.update({
          where: {
            id: post.id,
          },
          data: {
            title: body.title[0],
            categories: categoryArray,
            date: date,
            content: body.content[0],
            covers: post.covers.concat(covers),
            gallery: post.gallery.concat(gallery),
          },
        });

        return {
          status: 200,
          message: "Updated Post",
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

function parseMultipartNodeRequest(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: true });
    form.parse(req, (error, fields, files) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }
      resolve({ ...fields, ...files });
    });
  });
}

function uploadImage(type: string, file: FormFile, id: string): string {
  const filepath = file.filepath;
  const mimetype = file.mimetype;
  const filesize = file.size;
  const maxSize = 1024 * 1024 * 5;
  if (!mimetype?.startsWith("image")) {
    throw createError({
      statusMessage: "2001",
      statusCode: 400,
    });
  }
  if (filesize > maxSize) {
    throw createError({
      statusMessage: "2002",
      statusCode: 400,
    });
  }

  let imageName = `${uuidv4()}.${mimetype.split("/")[1]}`;
  let newPath = path.join("public", id, type);
  if (!fs.existsSync(newPath)) {
    fs.mkdirSync(newPath, { recursive: true });
  }
  newPath = path.join(newPath, imageName);
  fs.copyFileSync(filepath, newPath);
  let relativePath = path.join(id, type, imageName);
  return relativePath;
}
