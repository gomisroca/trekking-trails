import formidable from "formidable";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '@/prisma/db';
import { IncomingMessage } from 'http'; 

interface FormFile {
    filepath: string;
    mimetype: string;
    size: number;
}
interface ParsedFormData {
    covers: FormFile[];
    gallery: FormFile[];
    
}

interface EventHandlerResult {
    status: number;
    message: string;
}

export default defineEventHandler(async (event): Promise<EventHandlerResult> => {
    const post_id: string = uuidv4();
    console.log(post_id)
    try {
        let body: ParsedFormData =  await parseMultipartNodeRequest(event.node.req);

        // Image Handling
        let covers: string[] = [];
        for(let i = 0; i < body.covers.length; i++){
            const image = uploadImage('covers', body.covers[i], post_id);
            covers.push(image);
        } 
        let gallery: string[] = [];
        for(let i = 0; i < body.gallery.length; i++){
            const image = uploadImage('gallery', body.gallery[i], post_id);
            gallery.push(image);
        }
        console.log(covers)
        console.log(gallery)
        // const post = await prisma.post.create({
        //     data: {
        //         title: body.title[0],

        //     }
        // })

        return {
            status: 200,
            message: 'Upload Successful'
        }
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
    
        throw createError({
            statusMessage: "An unknown error occurred",
            statusCode: 500
        });
    } finally {
        await prisma.$disconnect();
    }
});

function parseMultipartNodeRequest(req: IncomingMessage): Promise<any> {
    return new Promise((resolve, reject) => {
      const form = formidable({ multiples: true })
      form.parse(req, (error, fields, files) => {
        if (error) {
            console.log(error)
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
    if(!mimetype?.startsWith("image")){
        throw createError({
            statusMessage: "2001",
            statusCode: 400,
        }); 
    }
    if(filesize > maxSize){
        throw createError({
            statusMessage: "2002",
            statusCode: 400,
        })
    }

    let imageName = `${uuidv4()}.${mimetype.split('/')[1]}`;
    let newPath = path.join("public", id, type);
    if (!fs.existsSync(newPath)){
        fs.mkdirSync(newPath, { recursive: true });
    }
    newPath = path.join(newPath, imageName)
    fs.copyFileSync(filepath, newPath);
    return newPath;
}