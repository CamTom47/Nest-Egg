const db = require('../../db');
const bcrypt = require('bcrypt');
const {
    ExpressError,
    NotFoundError,
    BadRequestError,
    UnauthorizedError
} = require('../../ExpressError');

const BCRYPT_WORK_FACTOR = require('../../config.js');

const e = require('express');

/** Related functions for category */

class Category