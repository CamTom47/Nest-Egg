import express, { NextFunction, Request, Response } from 'express';
import Allocation from '../../models/allocation/allocation';
import newAllocationSchema from '../../schema/allocation/newAllocationSchema.json';
import updateAllocationSchema from '../../schema/allocation/updateAllocationSchema.json';
import jsonschema from 'jsonschema';
import mapper from '../../helpers/mapper';
import { BadRequestError } from '../../ExpressError';
import { NewAllocation } from '@/types/types';

import { ensureLoggedIn, ensureAdmin } from '../../middleware/auth';
import Budget from '../../models/budget/budget';
import Category from '../../models/category/category';
import Subcategory from '../../models/subcategory/subcategory';
import User from '../../models/user/user';

const router = express.Router();
/**
 * GET /allocations => {allocations}
 *
 * allocations = { id, amount, categoryId, budgetId }
 *
 * Authorization require: logged in
 */

router.get('/allocations', ensureAdmin, async function(req: Request, res: Response, next: Function): Promise<{} | void> {
  try {
        const allocations = await Allocation.findAll(req.query.user_id = undefined, req.query.budget_id = undefined)
        return res.status(200).json({ allocations });
    } catch (err: any) {
    return next(err);
  }});


/**
 * GET /allocations/:allocation_id => {allocation}
 *
 * allocation = { id, amount, categoryId, budgetId }
 *
 * Authorization require: Correct user or Admin
 */

router.get('/budgets', ensureAdmin, async function(req: Request,  res: Response , next: Function): Promise<{} | void> {
    try {
      const budgets = await Budget.findAll();
      return res.status(200).json({ budgets });
    } catch (err: any) {
      return next(err);
    }
  });

/**
 * GET /allocations/:allocation_id => {category}
 *
 * category = { id, amount, categoryId, budgetId }
 *
 * Authorization require: Correct user or Admin
 */

router.get('/categories', ensureAdmin, async function(req: Request, res: Response , next: Function): Promise<{} | void> {
    try {
      const category = await Category.findAll();
      return res.status(200).json({ category });
    } catch (err: any) {
      return next(err);
    }
  });

/**
 * GET /allocations/:allocation_id => {subcategory}
 *
 * subcategory = { id, amount, categoryId, budgetId }
 *
 * Authorization require: Correct user or Admin
 */

router.get('/subcategories', ensureAdmin, async function(req: Request, res: Response , next: Function): Promise<{} | void> {
    try {
      const subcategory = await Subcategory.findAll();
      return res.status(200).json({ subcategory });
    } catch (err: any) {
      return next(err);
    }
  });

/**
 * GET /allocations/:allocation_id => {user}
 *
 * user = { id, amount, categoryId, budgetId }
 *
 * Authorization require: Correct user or Admin
 */

router.get('/users', ensureAdmin, async function(req: Request, res: Response , next: Function): Promise<{} | void> {
    try {
      const user = await User.findAll();
      return res.status(200).json({ user });
    } catch (err: any) {
      return next(err);
    }
  });

export default router;
