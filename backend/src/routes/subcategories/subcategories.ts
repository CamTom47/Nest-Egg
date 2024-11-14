import express, { NextFunction, Request, Response } from 'express';
import Subcategory from '../../models/subcategory/subcategory';
import newSubcategorySchema from '../../schema/subcategory/newSubcategorySchema.json';
import updateSubcategorySchema from '../../schema/subcategory/updateSubcategorySchema.json';
import jsonschema from 'jsonschema';
import mapper from '../../helpers/mapper';
import { BadRequestError } from '../../ExpressError';
import { NewSubcategory } from '@/types/types';

import { ensureLoggedIn, ensureCorrectUserOrAdmin } from '../../middleware/auth';

const router = express.Router();

interface SubcategoryModel {
  id?: number,
  name?: string,
  user_id?: number,
  category_id?: number,
  system_default?: boolean
}

interface CustomRequest<T> extends ReadableStream {
  body: T,
  params: {
    subcategory_id: number
  }
}

/**
 * GET /subcategories => {subcategories}
 *
 * subcategories = { id, name, description, category_id, user_id }
 *
 * Authorization require: logged in
 */

router.get('/', ensureLoggedIn, async function(req: Request, res: Response, next: Function): Promise<{} | void> {
  try {
    let subcategories;
    if(req.body.user_id) subcategories = await Subcategory.findAll(req.body.user_id);
    else subcategories = await Subcategory.findAll();
    return res.status(200).json({ subcategories });
  } catch (err: any) {
    return next(err);
  }
});

/**
 * GET /subcategories/:subcategory_id => {subcategory}
 *
 * subcategory = { id, name, description, category_id, user_id }
 *
 * Authorization require: Correct user or Admin
 */

router.get('/:subcategory_id', ensureCorrectUserOrAdmin, async function(req: CustomRequest<SubcategoryModel>, res: Response , next: Function): Promise<{} | void> {
    try {
      const subcategory = await Subcategory.findById(req.params.subcategory_id);
      return res.status(200).json({ subcategory });
    } catch (err: any) {
      return next(err);
    }
  });

  /**
 * POST /subcategories => {subcategory}
 *
 * subcategory = { id, name, description, category_id, user_id }
 *
 * Authorization require: logged in
 */


  router.post('/', ensureLoggedIn, async function(req: Request, res: Response, next: NextFunction): Promise<{} | void>{
    try{
        const data: NewSubcategory = mapper(req.body, "subcategory");
        const validator = jsonschema.validate({...data, system_default: false}, newSubcategorySchema)
        if(!validator.valid){
            const errs: any = validator.errors.map( err => err.stack);
                throw new BadRequestError(errs)
        }
        const subcategory = await Subcategory.create(data);
        return res.status(201).json({subcategory});
    } catch(err){
        return next(err)
    }
  })

  /**
 * PATCH /subcategories/:subcategory_id => {subcategory}
 *
 * subcategory = { id, name, description, user_id }
 *
 * Authorization require: Correct user or Admin
 */


  router.patch('/:subcategory_id', ensureCorrectUserOrAdmin, async function(req: CustomRequest<SubcategoryModel>, res: Response, next: NextFunction): Promise<{} | void>{
    try{
        const data = mapper(req.body, "subcategory");
        const validator = jsonschema.validate(data, updateSubcategorySchema)
        if(!validator.valid){
            const errs: any = validator.errors.map( err => err.stack);
                throw new BadRequestError(errs)
        }
        const subcategory = await Subcategory.update(req.params.subcategory_id, data);
        return res.status(200).json({subcategory});
    } catch(err){
        return next(err)
    }
  })

  /**
 * GET /subcategories/:subcategory_id => {subcategory}
 *
 * subcategory = { message }
 *
 * Authorization require: Correct user or Admin
 */


  router.delete('/:subcategory_id', ensureCorrectUserOrAdmin, async function(req: CustomRequest<SubcategoryModel>, res: Response, next: NextFunction): Promise<{} | void>{
    try{
        const subcategory = await Subcategory.delete(req.params.category_id);
        return res.status(200).json({subcategory});
    } catch(err){
        return next(err)
    }
  })

export default router;