import { describe, test, expect, afterEach, afterAll, beforeEach, beforeAll } from '@jest/globals';
import request from 'supertest';
import app from '../../index';
import { BadRequestError, NotFoundError } from '../../ExpressError';

import {
  commonAfterAll,
  commonAfterEach,
  commonBeforeAll,
  commonBeforeEach,
  testCategoryIds,
  testUserIds,
  u1token,
  u2token,
} from '../../testCommon';

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe('GET /', () => {
});

describe('GET /categories/:category_id', () => {
})

describe("POST /", () => { })


describe("PATCH /:category_id", () => {})

describe("DELETE /:category_id", () => {})