import { Post } from "@prisma/client";
import { prisma } from "~/prisma/db";
interface EventHandlerResult {
    status: number;
    post: Post;
    message: string;
}

export default defineEventHandler(async(event): Promise<EventHandlerResult> => {
    try{
        const id = getRouterParam(event, 'id')
        const post: Post | null = await prisma.post.findUnique({
            where: {
            id: id
            },
            include: { author: true }
        });
        if(post){
            return {
                status: 200,
                message: 'Got Post',
                post: post
            }
        } else{
            throw createError({
                statusMessage: "1001",
                statusCode: 400
            });
        }
    } catch(error: any){
        if(error.message == '1001'){
            throw createError({
                statusMessage: "No such post found in database.",
                statusCode: 500
            });
        }
        throw createError({
            statusMessage: "An unknown error occurred",
            statusCode: 500
        });
    } finally {
        await prisma.$disconnect();
    }
})