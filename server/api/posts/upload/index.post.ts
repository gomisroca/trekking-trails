import formidable from "formidable";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/prisma/db";
import { IncomingMessage } from "http";
import { Post, User } from "@prisma/client";
import uploadImage from "~/utils/uploadImage";

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
  post: Post;
  message: string;
}

export default defineEventHandler(
  async (event): Promise<EventHandlerResult> => {
    try {
      const post_id: string = uuidv4();
      let body: ParsedFormData = await parseMultipartNodeRequest(
        event.node.req
      );

      // Image Handling
      let covers: string[] = [];
      const coverFiles = body.covers as unknown as File[];
      for (const file of coverFiles) {
        const image = await uploadImage(file, "PostCover");
        covers.push(image);
      }
      let gallery: string[] = [];
      const galleryFiles = body.gallery as unknown as File[];
      for (const file of galleryFiles) {
        const image = await uploadImage(file, "PostGallery");
        gallery.push(image);
      }

      // Check for user
      const user: User | null = await prisma.user.findUnique({
        where: {
          email: body.user[0],
        },
      });
      if (!user) {
        throw createError({
          statusMessage: "2003",
          statusCode: 400,
        });
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

      const post = await prisma.post.create({
        data: {
          id: post_id,
          title: body.title[0],
          authorId: user.id,
          categories: categoryArray,
          date: date,
          content: body.content[0],
          covers: covers,
          gallery: gallery,
        },
      });
      return {
        status: 200,
        post: post,
        message: "Upload Successful",
      };
    } catch (error: any) {
      if (error.message === "2001") {
        throw createError({
          statusMessage: "Only image allowed.",
          statusCode: 400,
        });
      }

      if (error.code === "2002") {
        throw createError({
          statusMessage: `File is larger than 5 MB.`,
          statusCode: 400,
        });
      }
      if (error.code === "2003") {
        throw createError({
          statusMessage: `No such user found.`,
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
