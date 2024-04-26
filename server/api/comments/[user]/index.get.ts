import { Comment, User } from "@prisma/client";
import { prisma } from "~/prisma/db";
interface EventHandlerResult {
    status: number;
    comments: Comment[];
    message: string;
}

export default defineEventHandler(async(event): Promise<EventHandlerResult> => {
    try{
        const userId = getRouterParam(event, 'user')
        const user: User | null = await prisma.user.findUnique({
            where: {
                id: userId,
            }
        });
        if (!user){
            throw createError({
                statusMessage: "1001",
                statusCode: 400
            });
        }

        const comments: Comment[] | null = await prisma.comment.findMany({
            where: {
                authorId: user.id,
            },
            include:{
                author: true
            }
        })
        if (!comments){
            throw createError({
                statusMessage: "1002",
                statusCode: 400
            });
        }
        return{
            status: 200,
            message: 'Fetched Comments',
            comments: comments
        }

    }catch(error: any){
        if(error.message == '1001'){
            throw createError({
                statusMessage: "No such user found in database.",
                statusCode: 500
            });
        }
        if(error.message == '1002'){
            throw createError({
                statusMessage: "No comment by user found in database.",
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