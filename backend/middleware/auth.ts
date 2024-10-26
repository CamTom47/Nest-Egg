import jwt from 'jsonwebtoken'; 
import { SECRET_KEY } from '../config';
import { NextFunction } from 'express';
import { UnauthorizedError } from '../src/ExpressError';


/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username and isAdmin field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */

const authenticateJWT = (req : Request, res: Response, next: NextFunction){
    try{
        const authHeader = req.headers && req.headers.authorization;
        if(authHeader){
            const token = authHeader.replace(/^[Bb]earer /, "").trim();
            res.locals.user = jwt.verify(token, SECRET_KEY);
        }
    } catch (err: Error){
        return next(err)
    }
}

/** Middleware to use when they must be logged in.
 *
 * If not, raises Unauthorized.
 */

const ensureLoggedIn = (req: Request, res: Response, next: NextFunction){
    try{
        if(!res.locals.user) throw new UnauthorizedError()
        return next();
    } catch(err: Error){
        return next(err)
    }
}

/** Middleware to user when a user must be logged in or needs to be an admin
 * 
 * If not, raises Unauthorized
 */

const ensureAdmin = (req: Request, res: Response, next: NextFunction){
    try{
        if(!res.locals.user.isAdmin) throw new UnauthorizedError()
        return next()       
    } catch(err: Error){
        return next(err)
    }
}


const ensureCorrectUserOrAdmin = (req: Request, res: Response, next: NextFunction){
    try{
       if(!(user && (user.isAdmin || user.username === req.params.username))){
        throw new UnauthorizedError()
       }
       return next()
    } catch(err: Error){
        return next(err)
    }
}

export {
    authenticateJWT,
    ensureLoggedIn,
    ensureCorrectUserOrAdmin
}