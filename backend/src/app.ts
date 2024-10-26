import { NextFunction } from "express";

import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import {
  ExpressError,
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
  ForbiddenError,
} from './ExpressError';


//App Variables
dotenv.config();

//initialize application
const app = express();

//use dependencies
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(function (req: Request, res: Response, next: NextFunction) {
  return next(new NotFoundError());
});

app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
  if (process.env.NODE_ENV !== 'test') console.log(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

export default app;
