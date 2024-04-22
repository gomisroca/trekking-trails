import jwt from 'jsonwebtoken';

interface EventHandlerResult {
    status: number;
    user?: JWTUser;
}

export default defineEventHandler(async (event): Promise<EventHandlerResult> => {
    try {
        const authorization = await event.req.headers.cookie;
        if(authorization){
            const token = authorization.split('=')[1];
            const user = jwt.verify(token, process.env.TOKEN_KEY as jwt.Secret);
            return {
                status: 200,
                user: user as JWTUser,
            }
        }
        return {
            status: 400,
        }
    } catch (error) {
        return {
            status: 400,
        }
    }
})