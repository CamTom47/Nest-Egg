"use strict"

import { Request, Response, NextFunction } from 'express';
import categoriesRoutes from './routes/categories/categories';
import subcategoriesRoutes from './routes/subcategories/subcategories';
import budgetsRoutes from './routes/budgets/budgets';
import usersRoutes from './routes/users/users'
import authRoutes from './routes/auth/auth'
import allocationsRoutes from './routes/allocations/allocations'
import adminsRoutes from './routes/admins/admins'

import dotenv from 'dotenv';
import express, {Express} from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { ExpressError, NotFoundError, UnauthorizedError, BadRequestError, ForbiddenError } from './ExpressError';
import { authenticateJWT } from './middleware/auth';

//App Variables
dotenv.config();

//initialize application
const app: Express = express();

//use dependencies
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(authenticateJWT);

app.use("/categories", categoriesRoutes);
app.use("/subcategories", subcategoriesRoutes);
app.use("/budgets", budgetsRoutes);
app.use("/users", usersRoutes);
app.use("/auth", authRoutes);
app.use("/allocations", allocationsRoutes);
app.use("/admin", adminsRoutes);

app.use(function (req: Request, res: Response, next: NextFunction) {
  return next(new NotFoundError());
});

app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV !== 'test') console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;

    return res.status(status).json({
        error: {message, status }
    });
});


export default app;
