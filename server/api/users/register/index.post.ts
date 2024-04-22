import { prisma } from '@/prisma/db';
import { Role, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface EventHandlerResult {
    status: number;
    message: string;
    token: string;
}

interface RegisterInputs {
    email: string;
    name: string;
    password: string;
    role?: Role;
}

export default defineEventHandler(async (event): Promise<EventHandlerResult> => {
    try {
        const { name, email, password, role }: RegisterInputs = await readBody(event);
        
        if (!(email && password && name)) {
            throw createError({
                statusMessage: "1002",
                statusCode: 400,
            }); 
        }
 
        const existingUser: User | null = await prisma.user.findUnique({ 
            where: {
                email: email.toLowerCase(),
            },
        })
        if (existingUser) {
            throw createError({
                statusMessage: "1001",
                statusCode: 400,
            }); 
        }
    
        //Encrypt user password
        let encryptedPassword: string = await bcrypt.hash(password, 10);
    
        // Create user in our database
        let user: User = await prisma.user.create({ 
            data: { 
                name: name,
                email: email.toLowerCase(),
                password: encryptedPassword,
                role: role ? role : 'USER'
            }
        });
        
        let access_token: string = jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                name: user.name, 
                role: user.role  
            },
            process.env.TOKEN_KEY as jwt.Secret
        );
    
        return {
            status: 200,
            message: 'User Register Successful',
            token: access_token
        }
    } catch (error: any) {
        if (error.message === "1001") {
            throw createError({
                statusMessage: "User already exists.",
                statusCode: 400,
            });
        }
        if (error.message === "1002") {
            throw createError({
                statusMessage: "Input fields missing.",
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

})