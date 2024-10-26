import db from '../../db'
import bcrypt from'bcrypt'
import {
    ExpressError,
    NotFoundError,
    BadRequestError,
    UnauthorizedError
} from'../../ExpressError'

const BCRYPT_WORK_FACTOR = require('../../config.js');

import express from 'express'

const router = express.Router();

/** Related functions for category */

class Category