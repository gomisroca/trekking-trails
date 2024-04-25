import { User } from '@prisma/client';
import { prisma } from '~/prisma/db';

interface EventHandlerResult {
    status: number;
    users: User[];
}

export default defineEventHandler(async (event): Promise<EventHandlerResult> => {
    try {
        const users: User[] | null = await prisma.user.findMany({})
        if(!users){
            throw createError({
                statusMessage: "1001",
                statusCode: 400,
            }); 
        }
        return {
            status: 200,
            users: users
        }
    } catch (error: any) {
        if(error.statusMessage == '1001'){
            throw createError({
                statusMessage: "No users found",
                statusCode: 400,
            }); 
        }
        throw createError({
            statusMessage: "An unknown error occurred",
            statusCode: 500,
        }); 
    }
})