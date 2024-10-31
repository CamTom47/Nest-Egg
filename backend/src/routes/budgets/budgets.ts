import { ensureCorrectUserOrAdmin, ensureLoggedIn } from '../../middleware/auth';
import express, { Request, Response, NextFunction } from 'express';
import jsonschema from 'jsonschema'

import { NewBudget, UpdateBudget} from '@/types/types';
import Budget from '../../models/budget/budget';
import mapper from '../../helpers/mapper';

import newBudgetSchema from '../../schema/budget/newbudgetSchema.json'
import updateBudgetSchema from '../../schema/budget/updateBudgetSchema.json'
import { BadRequestError } from '../../ExpressError';
import { resolve } from 'dns';

const router = express.Router();

router.get('/', ensureLoggedIn, async function(req: Request, res: Response, next: NextFunction){
    try{
        const budgets: {} = await Budget.findAll();
        return res.status(200).json({budgets});

    } catch(err){
        return next(err)
    }
})

router.get('/:budget_id', ensureCorrectUserOrAdmin, async function(req: Request, res: Response, next: NextFunction){
    try{
        
        const budget: {} = await Budget.findById(req.params.budget_id);
        return res.status(200).json({budget});

    } catch(err){
        return next(err)
    }
})

router.post('/', ensureLoggedIn, async function(req: Request, res: Response, next:NextFunction){
    try{
        const data: NewBudget = mapper(req.body, 'budget');
        const validator = await jsonschema.validate(data, newBudgetSchema);
        if(!validator.valid) {
            const errs = validator.errors.map( err => err.stack )
            throw new BadRequestError(errs)
        }

        const budget = await Budget.create(data)
        return res.status(201).json({budget})
    } catch(err){
        return next(err)
    }
})

router.patch('/:budget_id', ensureCorrectUserOrAdmin, async function(req: Request, res: Response, next:NextFunction){
    try{
        const data: UpdateBudget = mapper(req.body, 'budget');
        const validator = jsonschema.validate(data, updateBudgetSchema);
        if(!validator.valid) {
            const errs = validator.errors.map( err => err.stack )
            throw new BadRequestError(errs)
        }

        const budget = await Budget.update(+req.params.budget_id, data)
        return res.status(200).json({budget})
    } catch(err){
        return next(err)
    }
})

router.delete('/:budget_id', ensureCorrectUserOrAdmin, async function (req: Request, res: Response, next: NextFunction){
    try{ 
        const budget = await Budget.delete(req.params.budget_id)
        return res.status(200).json(budget)
    } catch(err){
        return next (err)

    }
})

export default router;