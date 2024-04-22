import type { User } from "@prisma/client";

export const useUser = () => useState<User>('user');