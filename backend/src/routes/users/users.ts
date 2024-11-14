import express, { NextFunction, Request, Response } from "express";
import User from "../../models/user/user";
import jsonschema from "jsonschema";
import mapper from "../../helpers/mapper";
import { BadRequestError } from "../../ExpressError";
import { NewUser, UpdateUser } from "@/types/types";
import newUserSchema from "../../schema/user/newUserSchema.json";
import updateUserSchema from "../../schema/user/updateUserSchema.json";

import { ensureLoggedIn, ensureCorrectUserOrAdmin, ensureAdmin } from "../../middleware/auth";

const router = express.Router();

interface UserModel {
	id?: number;
	first_name?: string;
	last_name?: string;
	username?: string;
	email?: string;
	isAdmin?: Boolean;
}

interface CustomRequest<T> extends ReadableStream {
	body: T;
	params: {
		user_id: number;
	};
}

/**
 * GET /users => {users}
 *
 * users = { id, firstName, lastName, username, email, isAdmin, dateCreated}
 *
 * Authorization require: Admin
 */

router.get("/", ensureAdmin, async function (req: Request, res: Response, next: Function): Promise<{} | void> {
	try {
		const users = await User.findAll();
		return res.status(200).json({ users });
	} catch (err: any) {
		return next(err);
	}
});

/**
 * GET /users/:user_id => {user}
 *
 * user = { id, firstName, lastName, username, email, isAdmin, dateCreated}
 *
 * Authorization require: Correct user or Admin
 */

router.get(
	"/:user_id",
	ensureCorrectUserOrAdmin,
	async function (req: CustomRequest<UserModel>, res: Response, next: NextFunction): Promise<{} | void> {
		try {
			const user = await User.findById(req.params.user_id);
			return res.status(200).json({ user });
		} catch (err: any) {
			return next(err);
		}
	}
);

/**
 * PATCH /users/:user_id => {user}
 *
 * user = { id, firstName, lastName, username, email, isAdmin, dateCreated}
 *
 * Authorization require: Correct user or Admin
 */

router.patch(
	"/:user_id",
	ensureCorrectUserOrAdmin,
	async function (req: CustomRequest<UserModel>, res: Response, next: NextFunction): Promise<{} | void> {
		try {
			const data = mapper(req.body, "user");
			const validator = jsonschema.validate(data, updateUserSchema);
			if (!validator.valid) {
				const errs: any = validator.errors.map((err) => err.stack);
				throw new BadRequestError(errs);
			}
			const user = await User.update(req.params.user_id, data);
			return res.status(200).json({ user });
		} catch (err) {
			return next(err);
		}
	}
);

/**
 * DELETE /users/:user_id => {message}
 *
 *
 * Authorization require: Correct user or Admin
 */

router.delete(
	"/:user_id",
	ensureCorrectUserOrAdmin,
	async function (req: CustomRequest<UserModel>, res: Response, next: NextFunction): Promise<{} | void> {
		try {
			const user = await User.delete(req.params.user_id);
			return res.status(200).json(user);
		} catch (err) {
			return next(err);
		}
	}
);

export default router;
