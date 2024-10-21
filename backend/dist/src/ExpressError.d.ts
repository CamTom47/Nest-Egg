declare class ExpressError extends Error {
    constructor(message: string, status: number);
}
/** 404 Not Found Error */
declare class NotFoundError extends ExpressError {
    constructor(message?: string);
}
/** 401 Unauthorized Error */
declare class UnauthorizedError extends ExpressError {
    constructor(message?: string);
}
/** 400 Bad Request Error */
declare class BadRequestError extends ExpressError {
    constructor(message?: string);
}
/** 403 Bad Request Error */
declare class ForbiddenError extends ExpressError {
    constructor(message?: string);
}
export { ExpressError, NotFoundError, UnauthorizedError, BadRequestError, ForbiddenError, };
