import { prisma } from '@/prisma/db';
import { User } from "@prisma/client";
import bcrypt from 'bcryptjs';

interface UserInputs {
    email: string;
    name: string;
    oldPassword: string;
    newPassword?: string;
}

interface EventHandlerResult {
    status: number;
    message: string;
}

export default defineEventHandler(async (event): Promise<EventHandlerResult> => {
    try {    
        const id = getRouterParam(event, 'id');
        const { email, name, oldPassword, newPassword }: UserInputs = await readBody(event);
 
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
        
        let passValid: boolean = await bcrypt.compare(oldPassword, user.password);
        if(!passValid){
            throw createError({
                statusMessage: "5002",
                statusCode: 400,
            }); 
        }
        await prisma.user.update({
            where:{
                id: user.id
            },
            data: {
                email: email,
                name: name,
            },
        })
        if(newPassword){
            let encryptedPassword: string = await bcrypt.hash(newPassword, 10);
            await prisma.user.update({
                where:{
                    id: user.id
                },
                data: {
                    password: encryptedPassword,
                },
            })
        }

        return {
            status: 200,
            message: 'Account Information Updated'
        }
    } catch (error: any) {
        if (error.message === "5001") {
            throw createError({
                statusMessage: "User not found",
                statusCode: 400,
            });
        } 
        if (error.message === "5002") {
            throw createError({
                statusMessage: "Invalid credentials",
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