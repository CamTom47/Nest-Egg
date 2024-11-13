import express, { NextFunction, Request, Response } from "express";
import Contributor from "../../models/contributor/contributor";
import newContributorSchema from "../../schema/contributor/newContributorSchema.json";
import updateContributorSchema from "../../schema/contributor/updateContributorSchema.json";
import jsonschema from "jsonschema";
import mapper from "../../helpers/mapper";
import { BadRequestError } from "../../ExpressError";
import { NewContributor } from "@/types/types";

import { ensureLoggedIn, ensureCorrectUserOrAdmin } from "../../middleware/auth";

const router = express.Router();

interface ContributorModel {
	id?: number;
	name?: string;
	user_id?: number;
}

interface CustomRequest<T> extends ReadableStream {
	body: T;
	params: {
		contributor_id: number;
	};
}

/**
 * GET /contributors => {contributors}
 *
 * contributors = { id, name, user_id }
 *
 * Authorization require: logged in
 */

router.get("/", ensureLoggedIn, async function (req: Request, res: Response, next: Function): Promise<{} | void> {
	try {
		let contributors = await Contributor.findAll(req.body);
		return res.status(200).json({ contributors });
	} catch (err: any) {
		return next(err);
	}
});

/**
 * GET /contributors/:contributor_id => {contributor}
 *
 * contributor = { id, name, user_id }
 *
 * Authorization require: Correct user or Admin
 */

router.get(
	"/:contributor_id",
	ensureCorrectUserOrAdmin,
	async function (req: CustomRequest<ContributorModel>, res: Response, next: Function): Promise<{} | void> {
		try {
			const contributor = await Contributor.findById(req.params.contributor_id);
			return res.status(200).json({ contributor });
		} catch (err: any) {
			return next(err);
		}
	}
);

/**
 * POST /contributors => {contributor}
 *
 * contributor = { id, name, user_id }
 *
 * Authorization require: logged in
 */

router.post("/", ensureLoggedIn, async function (req: Request, res: Response, next: NextFunction): Promise<{} | void> {
	try {
		const data: NewContributor = mapper(req.body, "contributor");
		const validator = jsonschema.validate(data, newContributorSchema);
		if (!validator.valid) {
			const errs: any = validator.errors.map((err) => err.stack);
			throw new BadRequestError(errs);
		}
		const contributor = await Contributor.create(data);
		return res.status(201).json({ contributor });
	} catch (err) {
		return next(err);
	}
});

/**
 * PATCH /contributors/:contributor_id => {contributor}
 *
 * contributor = { id, name, description, user_id }
 *
 * Authorization require: Correct user or Admin
 */

router.patch(
	"/:contributor_id",
	ensureCorrectUserOrAdmin,
	async function (req: CustomRequest<ContributorModel>, res: Response, next: NextFunction): Promise<{} | void> {
		try {
			const data = mapper(req.body, "contributor");
			const validator = jsonschema.validate(data, updateContributorSchema);
			if (!validator.valid) {
				const errs: any = validator.errors.map((err) => err.stack);
				throw new BadRequestError(errs);
			}
			const contributor = await Contributor.update(req.params.contributor_id, data);
			return res.status(200).json({ contributor });
		} catch (err) {
			return next(err);
		}
	}
);

/**
 * GET /contributors/:contributor_id => {contributor}
 *
 * contributor = { message }
 *
 * Authorization require: Correct user or Admin
 */

router.delete(
	"/:contributor_id",
	ensureCorrectUserOrAdmin,
	async function (req: CustomRequest<ContributorModel>, res: Response, next: NextFunction): Promise<{} | void> {
		try {
			const contributor = await Contributor.delete(req.params.contributor_id);
			return res.status(200).json({ contributor });
		} catch (err) {
			return next(err);
		}
	}
);

export default router;
