import { prisma } from '@/prisma/db';
import { Post } from '@prisma/client';

export default defineEventHandler(async (event) => {
    try{
        const posts: Post[] | null = await prisma.post.findMany({include: { 
            author: true,
            comments: {
                include: {
                    author: true,
                }
            },
         }});
        if(posts){
            return {
                status: 200,
                posts: posts
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
                statusMessage: "No posts found in database.",
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