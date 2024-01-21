import type { NextFunction, Request, Response } from "express";
import database from "../src/database";
import Sequelize from "sequelize";
const { or, iLike } = Sequelize.Op;
import { User } from "../models";
export default {
    checkExistingUser: async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const { username, email, password } = req.body;
        res.locals.user = req.body;
        let existingUser = await User.findOne({
            where: {
                [or]: [
                    { email: { [iLike]: email } },
                    { username: { [iLike]: username } },
                ],
            },
        });
        if (existingUser) {
            let usr = existingUser.toJSON();
            let msg =
                username.toLowerCase() == usr!.username.toLowerCase()
                    ? "This username is already taken"
                    : "This email is already registerd";
            res.status(409).json({ error: msg });
            res.end();
            return;
        }
        next();
    },
    checkRole: async (req: Request, res: Response, next: NextFunction) => {
        if (req.body.roles) {
            let roles = req.body.roles;

            if (typeof roles == "string") {
                if (roles.includes(";")) {
                    roles = roles.split(";");
                } else {
                    roles = [roles];
                }
            }
            for (let role of roles) {
                if (!database.roles.includes(role)) {
                    res.status(400).send({
                        message: "Failed! Role does not exist = " + role,
                    });
                    return;
                }
            }
            res.locals.roles = roles;
        }
        next();
    },
    isAdmin: (req: Request, res: Response, next: NextFunction) => {
        User.findByPk(res.locals.userId).then((user) => {
            user!.getRoles()?.then((roles) => {
                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === "admin") {
                        next();
                        return;
                    }
                }

                res.status(403).send({
                    message: "Require Admin Role!",
                });
                return;
            });
        });
    },
    isModerator: (req: Request, res: Response, next: NextFunction) => {
        User.findByPk(res.locals.userId).then((user) => {
            user!.getRoles()?.then((roles) => {
                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === "moderator") {
                        next();
                        return;
                    }
                }

                res.status(403).send({
                    message: "Require Moderator Role!",
                });
            });
        });
    },
    isModeratorOrAdmin: (req: Request, res: Response, next: NextFunction) => {
        User.findByPk(res.locals.userId).then((user) => {
            user!.getRoles()?.then((roles) => {
                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === "moderator") {
                        next();
                        return;
                    }

                    if (roles[i].name === "admin") {
                        next();
                        return;
                    }
                }

                res.status(403).send({
                    message: "Require Moderator or Admin Role!",
                });
            });
        });
    },
};
