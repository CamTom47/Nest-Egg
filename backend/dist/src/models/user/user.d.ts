import { BadRequestError } from '../../../src/ExpressError';
interface NewUser {
    first_name: string;
    last_name: string;
    username: string;
    password: string;
    email: string;
    is_admin: boolean;
}
interface UpdateUser {
    first_name?: string;
    last_name?: string;
    username?: string;
    password?: string;
    email?: string;
    is_admin?: boolean;
}
declare class User {
    static findAll(): Promise<{}>;
    static findById(user_id: number): Promise<{}>;
    static authenticate(username: string, password: string): Promise<any>;
    static register({ first_name, last_name, username, password, email, is_admin }: NewUser): Promise<any>;
    static update(id: number, data: UpdateUser): Promise<any>;
    static delete(id: number): Promise<BadRequestError | {
        message: string;
    }>;
}
export default User;
