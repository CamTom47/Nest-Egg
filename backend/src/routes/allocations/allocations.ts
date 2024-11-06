import express, { NextFunction, Request, Response } from 'express';
import Allocation from '../../models/allocation/allocation';
import newAllocationSchema from '../../schema/allocation/newAllocationSchema.json';
import updateAllocationSchema from '../../schema/allocation/updateAllocationSchema.json';
import jsonschema from 'jsonschema';
import mapper from '../../helpers/mapper';
import { BadRequestError } from '../../ExpressError';
import { NewAllocation } from '@/types/types';

import { ensureLoggedIn, ensureCorrectUserOrAdmin } from '../../middleware/auth';

const router = express.Router();

interface AllocationModel {
  amount?: number;
  category_type?: number;
  budget_id?: number;
  user_id?: number;
}
interface CustomRequest<T> extends ReadableStream {
  body: T;
  params: {
    allocation_id: number;
  };
}

/**
 * GET /allocations => {allocations}
 *
 * allocations = { id, amount, categoryId, budgetId }
 *
 * Authorization require: logged in
 */

router.get('/', ensureCorrectUserOrAdmin, async function (req: Request, res: Response, next: Function): Promise<{} | void> {
  try {
    const allocations = await Allocation.findAll(req.query.userId, req.query.budget_id = undefined);
    return res.status(200).json({ allocations });
  } catch (err: any) {
    return next(err);
  }
});

/**
 * GET /allocations/:allocation_id => {allocation}
 *
 * allocation = { id, amount, categoryId, budgetId }
 *
 * Authorization require: Correct user or Admin
 */

router.get(
  '/:allocation_id',
  ensureCorrectUserOrAdmin,
  async function (req: Request, res: Response, next: Function): Promise<{} | void> {
    try {
      const allocation = await Allocation.findById(+req.params.allocation_id);
      return res.status(200).json({ allocation });
    } catch (err: any) {
      return next(err);
    }
  }
);

/**
 * POST /allocations => {allocation}
 *
 * allocation = { id, amount, categoryId, budgetId }
 *
 * Authorization require: logged in
 */

router.post('/', ensureLoggedIn, async function (req: Request, res: Response, next: NextFunction): Promise<{} | void> {
  try {
    const data: NewAllocation = mapper(req.body, 'allocation');
    const validator = jsonschema.validate({ ...data }, newAllocationSchema);
    if (!validator.valid) {
      const errs: any = validator.errors.map((err) => err.stack);
      throw new BadRequestError(errs);
    }
    const allocation = await Allocation.create(data);
    return res.status(201).json({ allocation });
  } catch (err) {
    return next(err);
  }
});

/**
 * PATCH /allocations/:allocation_id => {allocation}
 *
 * allocation = { id, amount, categoryId, budgetId }
 *
 * Authorization require: Correct user or Admin
 */

router.patch(
  '/:allocation_id',
  ensureCorrectUserOrAdmin,
  async function (req: CustomRequest<AllocationModel>, res: Response, next: NextFunction): Promise<{} | void> {
    try {
      const data = mapper(req.body, 'allocation');
      const validator = jsonschema.validate(data, updateAllocationSchema);
      if (!validator.valid) {
        const errs: any = validator.errors.map((err) => err.stack);
        throw new BadRequestError(errs);
      }
      const allocation = await Allocation.update(req.params.allocation_id, data);
      return res.status(200).json({ allocation });
    } catch (err) {
      return next(err);
    }
  }
);

/**
 * GET /allocations/:allocation_id => {allocation}
 *
 * allocation = { message }
 *
 * Authorization require: Correct user or Admin
 */

router.delete(
  '/:allocation_id',
  ensureCorrectUserOrAdmin,
  async function (req: CustomRequest<AllocationModel>, res: Response, next: NextFunction): Promise<{} | void> {
    try {
      await Allocation.delete(req.params.allocation_id);
      return res.status(200).json({ message: "Allocation deleted" });
    } catch (err) {
      return next(err);
    }
  }
);

export default router;
