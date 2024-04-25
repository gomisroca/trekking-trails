import { prisma } from '@/prisma/db';
import { Comment, Post, User } from "@prisma/client";

interface CommentInputs {
    commentId: string;
    content: string;
}

interface EventHandlerResult {
    status: number;
    message: string;
}

export default defineEventHandler(async (event): Promise<EventHandlerResult> => {
    try {    
        const { commentId }: CommentInputs = await readBody(event);

        if (!(commentId)) {
            throw createError({
                statusMessage: "4002",
                statusCode: 400,
            }); 
        }
 
        const comment: Comment | null = await prisma.comment.findUnique({ 
            where: {
                id: commentId,
            },
        })

        if (!comment) {
            throw createError({
                statusMessage: "4001",
                statusCode: 400,
            }); 
        }
        await prisma.comment.update({
            where:{
                id: comment.id
            },
            data: {
                content: '',
            },
        })

        return {
            status: 200,
            message: 'Comment Removed'
        }
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
            statusCode: 500
        });
    } finally {
        await prisma.$disconnect();
    }
});