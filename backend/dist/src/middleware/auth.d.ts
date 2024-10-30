import { Request, Response, NextFunction } from 'express';
/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username and isAdmin field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */
declare const authenticateJWT: (req: Request, res: Response, next: NextFunction) => void;
/** Middleware to use when they must be logged in.
 *
 * If not, raises Unauthorized.
 */
declare const ensureLoggedIn: (req: Request, res: Response, next: NextFunction) => void;
declare const ensureCorrectUserOrAdmin: (req: Request, res: Response, next: NextFunction) => void;
export { authenticateJWT, ensureLoggedIn, ensureCorrectUserOrAdmin };
