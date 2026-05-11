export interface AuthTokenPayload {
    sub: string;
    email: string;
    role: string;
    exp: number;
}
export declare function hashPassword(password: string): string;
export declare function verifyPassword(password: string, hashedPassword: string): boolean;
export declare function signAuthToken(payload: Omit<AuthTokenPayload, 'exp'>, secret: string, ttlSeconds: number): string;
export declare function verifyAuthToken(token: string, secret: string): AuthTokenPayload | null;
