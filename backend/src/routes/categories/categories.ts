import express, { NextFunction, Request, Response } from "express";
import Category from "../../models/category/category";
import newCategorySchema from "../../schema/category/newCategorySchema.json";
import updateCategorySchema from "../../schema/category/updateCategorySchema.json";
import jsonschema from "jsonschema";
import mapper from "../../helpers/mapper";
import { BadRequestError } from "../../ExpressError";
import { NewCategory } from "@/types/types";

import { ensureLoggedIn, ensureCorrectUserOrAdmin } from "../../middleware/auth";

const router = express.Router();

interface CategoryModel {
	id?: number;
	name?: string;
	description?: string;
	user_id?: number;
	system_default?: boolean;
}

interface CustomRequest<T> extends ReadableStream {
	body: T;
	params: {
		category_id: number;
	};
}

/**
 * GET /categories => {categories}
 *
 * categories = { id, name, description, user_id }
 *
 * Authorization require: logged in
 */

router.get("/", ensureLoggedIn, async function (req: Request, res: Response, next: Function): Promise<{} | void> {
	try {
		let user_id: number | undefined = undefined;
		if (req.query){
			user_id = Number(req.query.userId)
		}
		let categories = await Category.findAll(user_id);
		return res.status(200).json({ categories });
	} catch (err: any) {
		return next(err);
	}
});

/**
 * GET /categories/:category_id => {category}
 *
 * category = { id, name, description, user_id }
 *
 * Authorization require: Correct user or Admin
 */

router.get(
	"/:category_id",
	ensureCorrectUserOrAdmin,
	async function (req: CustomRequest<CategoryModel>, res: Response, next: Function): Promise<{} | void> {
		try {
			const category = await Category.findById(req.params.category_id);
			return res.status(200).json({ category });
		} catch (err: any) {
			return next(err);
		}
	}
);

/**
 * POST /categories => {category}
 *
 * category = { id, name, description, user_id }
 *
 * Authorization require: logged in
 */

router.post("/", ensureLoggedIn, async function (req: Request, res: Response, next: NextFunction): Promise<{} | void> {
	try {
		const data: NewCategory = mapper(req.body, "category");
		const validator = jsonschema.validate({ ...data, system_default: false }, newCategorySchema);
		if (!validator.valid) {
			const errs: any = validator.errors.map((err) => err.stack);
			throw new BadRequestError(errs);
		}
		const category = await Category.create(data);
		return res.status(201).json({ category });
	} catch (err) {
		return next(err);
	}
});

/**
 * PATCH /categories/:category_id => {category}
 *
 * category = { id, name, description, user_id }
 *
 * Authorization require: Correct user or Admin
 */

router.patch(
	"/:category_id",
	ensureCorrectUserOrAdmin,
	async function (req: CustomRequest<CategoryModel>, res: Response, next: NextFunction): Promise<{} | void> {
		try {
			const data = mapper(req.body, "category");
			const validator = jsonschema.validate(data, updateCategorySchema);
			if (!validator.valid) {
				const errs: any = validator.errors.map((err) => err.stack);
				throw new BadRequestError(errs);
			}
			const category = await Category.update(req.params.category_id, data);
			return res.status(200).json({ category });
		} catch (err) {
			return next(err);
		}
	}
);

/**
 * GET /categories/:category_id => {category}
 *
 * category = { message }
 *
 * Authorization require: Correct user or Admin
 */

router.delete(
	"/:category_id",
	ensureCorrectUserOrAdmin,
	async function (req: CustomRequest<CategoryModel>, res: Response, next: NextFunction): Promise<{} | void> {
		try {
			const category = await Category.delete(req.params.category_id);
			return res.status(200).json({ category });
		} catch (err) {
			return next(err);
		}
	}
);

export default router;
