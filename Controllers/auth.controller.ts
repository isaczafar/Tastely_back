import database from "../src/database";
import type { Request, Response, NextFunction } from "express";
import { hashSync, compareSync } from "bcryptjs";
import Sequelize, { Model, where } from "sequelize";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config/auth.config";
import { User, Token, Role } from "../models";
import { UserModel } from "../models/types";
const {
    like,
    gt,
    gte,
    lte,
    and,
    or,
    in: Op,
    iLike,
    substring,
    contains,
} = Sequelize.Op;

export default {
    signup: async (req: Request, res: Response) => {
        try {
            let userInfo = { username: "", email: "", password: "" };
            try {
                let { username, email, password } = req.body;
                userInfo = {
                    username: username,
                    email: email,
                    password: hashSync(password, 8),
                };
            } catch (err) {
                let { username, email, password } = res.locals;
                userInfo = {
                    username: username,
                    email: email,
                    password: hashSync(password, 8),
                };
            }

            User.create(userInfo).then((user) => {
                user.createProfile({ user_id: user.id });
                if (res.locals.roles) {
                    Role.findAll({
                        where: {
                            name: {
                                [or]: res.locals.roles,
                            },
                        },
                    }).then((roles) => {
                        user!.setRoles(roles).then(() => {
                            res.send({
                                message: "User was registered successfully!",
                            });
                        });
                    });
                } else {
                    user!.setRoles([1]).then(() => {
                        res.send({
                            message: "User was registered successfully!",
                        });
                    });
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    },
    logout: async (req: Request, res: Response, next: NextFunction) => {
        User.findOne({
            where: {
                id: Number(res.locals.userId),
            },
        }).then(async (user) => {
            let cookie = JSON.parse(req.cookies["x-access"]);
            let token = await Token.findOne({
                where: { token: cookie.refreshToken },
            });
            token?.destroy();
            res.cookie(
                "x-access",
                JSON.stringify({
                    refreshToken: "",
                    accessToken: "",
                }),
            );
            res.json({ message: "Logged out!" });
        });
    },
    login: async (req: Request, res: Response, next: NextFunction) => {
        if (req.body.password) {
            let { username, password } = req.body;
            let query = username.includes("@")
                ? { email: { [iLike]: username } }
                : { username: { [iLike]: username } };
            console.log(query);

            let user = await User.findOne({
                where: query,
            });

            if (!user) {
                return res.status(404).send({ message: "invalid login" });
            }
            user = user as UserModel;
            let passwordIsValid = compareSync(password, user.password);
            console.log(passwordIsValid);

            const jwtToken = jwt.sign(
                {
                    id: user.id,
                },
                config.secret,
                {
                    expiresIn: config.jwtExp,
                },
            );

            let auth: string[] = [];
            let userRoles = user.getRoles().then((roles) => {
                for (let role of roles) {
                    auth.push("ROLE_" + role.name);
                }
                let time = new Date();
                user!
                    .createToken({
                        user_id: user!.id,
                    })
                    .then(async (token) => {
                        res.cookie(
                            "x-access",
                            JSON.stringify({
                                refreshToken: token.token,
                                accessToken: jwtToken,
                            }),
                        );
                        res.status(200).send({
                            id: user!.id,
                            username: user!.username,
                            email: user!.email,
                            roles: auth,
                            refreshToken: token.token,
                            accessToken: jwtToken,
                        });
                    });
            });
        } else {
            res.status(500).send({ message: "bajs" });
        }
    },
    refreshToken: async (req: Request, res: Response, next: NextFunction) => {
        let { refreshToken: requestToken } = req.body;
        console.log(req);
        try {
            let cookie = JSON.parse(req.headers["x-access"] as string);
        } catch (err) {
            return res.json({
                accessToken: "",
                refreshToken: "",
            });
        }
        let cookie = JSON.parse(req.headers["x-access"] as string);
        console.log(cookie);

        if (requestToken == null || requestToken == "") {
            return res
                .status(403)
                .json({ message: "Refresh Token is required!" });
        }

        try {
            let testToken = await Token.findOne({
                where: { token: requestToken },
            });

            console.log(testToken);

            if (!testToken) {
                res.status(403).json({
                    message: "Refresh token is not in database!",
                });
                return;
            }
            const user = await testToken.getUser();
            if (!Token.verifyExp(testToken)) {
                testToken.removeUser(user);
                testToken.destroy();
                //Token.destroy({ where: { id: testToken.id } });
                res.cookie(
                    "x-access",
                    JSON.stringify({
                        accessToken: "",
                        refreshToken: "",
                    }),
                );
                res.status(403).json({
                    message: "Token was expired",
                });
                return;
            }
            console.log("sameUSer?: ", user!.id, res.locals.userId);
            let newAccessToken = jwt.sign({ id: user!.id }, config.secret, {
                expiresIn: config.jwtExp,
            });
            return res.status(200).json({
                accessToken: newAccessToken,
                refreshToken: testToken.token,
            });
        } catch (err) {
            return res.status(500).send({ message: err });
        }
    },
    verifyToken: (req: Request, res: Response, next: NextFunction) => {
        console.log(req.cookies);
        let token = "";
        if (req.cookies["x-access"]) {
            let cookie = JSON.parse(req.cookies["x-access"]);
            token = cookie.accessToken;
        } else {
            token = req.headers["x-access-token"] as string;
        }
        if (!token) {
            return res.status(403).send({
                message: "No token provided!",
            });
        }

        jwt.verify(token, config.secret, (err, json) => {
            if (err) {
                res.cookie(
                    "x-access",
                    JSON.stringify({
                        accessToken: "",
                        refreshToken: "",
                    }),
                );
                return res.status(401).send({
                    message: "Unauthorized!",
                });
            }
            res.locals.userId = (json as JwtPayload).id;
            next();
        });
    },
};
