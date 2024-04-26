import { prisma } from '@/prisma/db';
import { User } from "@prisma/client";
import bcrypt from 'bcryptjs';

interface EventHandlerResult {
    status: number;
    message: string;
}

export default defineEventHandler(async (event): Promise<EventHandlerResult> => {
    try {    
        const id = getRouterParam(event, 'id');
 
        const user: User | null = await prisma.user.findUnique({ 
            where: {
                id: id,
            },
        })

        if (!user) {
            throw createError({
                statusMessage: "5001",
                statusCode: 400,
            }); 
        }

        let encryptedEmail: string = await bcrypt.hash(user.email + user.password + Math.floor(Math.random() * 10000), 10);
        let encryptedPassword: string = await bcrypt.hash(encryptedEmail + user.password + Math.floor(Math.random() * 10000), 10);
        await prisma.user.update({
            where:{
                id: user.id
            },
            data: {
                name: '',
                email: encryptedEmail,
                password: encryptedPassword,
            },
        })
        await prisma.post.updateMany({
            where: {
                authorId: user.id,
            },
            data: {
                published: false
            }
        })
        return {
            status: 200,
            message: 'Account Deleted'
        }
    } catch (error: any) {
        if (error.message === "5001") {
            throw createError({
                statusMessage: "User not found",
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