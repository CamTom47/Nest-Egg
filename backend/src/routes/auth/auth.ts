import express, { Request, Response, NextFunction } from 'express';
import jsonschema from 'jsonschema';
import loginSchema from '../../schema/auth/loginSchema.json';
import newUserSchema from '../../schema/auth/newUserSchema.json';

import User from '../../models/user/user';
import mapper from '../../helpers/mapper';

import { BadRequestError } from '../../ExpressError';
import createToken from '../../helpers/token';

const router = express.Router();

router.post('/login', async function(req: Request, res: Response, next: NextFunction){
    try{
        const { username, password } = req.body
        
        const validator = await jsonschema.validate(req.body, loginSchema)
        if(!validator.valid){
            const errs = validator.errors.map( err => err.stack)
            throw new BadRequestError(errs)
        }
        const user = await User.authenticate(username, password);
        const token = createToken(user)
        return res.status(200).json({token});

    } catch(err){
        return next(err)
    }
})

router.post('/register', async function(req: Request, res: Response, next: NextFunction){
    try{
        const data = mapper(req.body, 'user');
        const validator = await jsonschema.validate(data, newUserSchema)
        if(!validator.valid){
            const errs = validator.errors.map( err => err.stack)
            throw new BadRequestError(errs)
        }
        
        const newUser = await User.register(data);
        const token = createToken(newUser)

        return res.status(201).json({token});

    } catch(err){
        return next(err)
    }
})

export default router;