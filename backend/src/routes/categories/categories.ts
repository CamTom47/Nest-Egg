import express, { NextFunction } from 'express';
import Category from '../../models/category/category';
import newCategorySchema from '../../schema/category/newCategorySchema.json';
import updateCategorySchema from '../../schema/category/updateCategorySchema.json';
import jsonschema from 'jsonschema';
import mapper from '../../helpers/mapper';
import { BadRequestError } from '../../ExpressError';

import { ensureLoggedIn, ensureCorrectUserOrAdmin } from '../../middleware/auth';

const router = express.Router();

/**
 * GET /categories => {categories}
 *
 * categories = { id, name, description }
 *
 * Authorization require: logged in
 */

router.get('/', ensureLoggedIn, async function(req: Request, res: Response, next: Function) {
  try {
    let categories;
    if(req.body.user_id) categories = await Category.findAll(req.body.user_id);
    else categories = await Category.findAll();
    return res.json({ categories });
  } catch (err: Error) {
    return next(err);
  }
});

router.get('/:category_id', ensureLoggedIn, async function(req: Request, res: Response, next: Function) {
    try {

      const category = await Category.findById(req.params.category_id);
      return res.status(200).json({ category });
    } catch (err: Error) {
      return next(err);
    }
  });

  router.post('/', ensureLoggedIn, async function(req: Request, res: Response, next: NextFunction){
    try{
        const data = mapper(req.body, "category");
        const validator = jsonschema.validate({...data, system_default: false}, newCategorySchema)
        if(!validator.valid){
            const errs = validator.errors.map( err => err.stack);
                throw new BadRequestError(errs)
        }
        const category = await Category.create(data);
        return res.status(201).json({category});
    } catch(err){
        return next(err)
    }
  })

  router.patch('/:category_id', ensureCorrectUserOrAdmin, async function(req: Request, res: Response, next: NextFunction){
    try{
        const data = mapper(req.body, "category");
        const validator = jsonschema.validate(data, updateCategorySchema)
        if(!validator.valid){
            const errs = validator.errors.map( err => err.stack);
                throw new BadRequestError(errs)
        }
        const category = await Category.update(req.params.category_id, data);
        return res.status(200).json({category});
    } catch(err){
        return next(err)
    }
  })

  router.delete('/:category_id', ensureCorrectUserOrAdmin, async function(req: Request, res: Response, next: NextFunction){
    try{
        const category = await Category.delete(req.params.category_id);
        return res.status(200).json({category});
    } catch(err){
        return next(err)
    }
  })

export default router;
