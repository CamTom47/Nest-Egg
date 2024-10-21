declare const SECRET_KEY: string;
declare const PORT: string | number;
declare function getDatabaseUri(): string;
declare const BCRYPT_WORK_FACTOR: number;
export { SECRET_KEY, PORT, BCRYPT_WORK_FACTOR, getDatabaseUri };
