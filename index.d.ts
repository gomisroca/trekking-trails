interface JWTUser {
    id: string;
    email: string;
    name: string;
    role: Role
}
interface Response {
    status: number;
    message: string;
}