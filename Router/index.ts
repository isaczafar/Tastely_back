import { Model } from "sequelize";
const express = require("express");
import type { NextFunction, Request, Response } from "express";
import recipieRouter from "./recipies";
import userRounter from "./user";
import authRouter from "./auth";
import ingredientRouter from "./ingredients";
import commonRouter from "./common.router";
import authController from "../Controllers/auth.controller";
/*
const router = express.Router();

router.use("/recipie/?*", recipieRouter);
router.use("/:model/user", userRounter);
router.use("/user", userRounter);
router.use("/ingredient/?*", ingredientRouter);
router.use("/auth/?*", authRouter);
router.use("/:test", (req: Request, res: Response, next: NextFunction) => {
    console.log(res.locals.reqData.model);
    console.log(req);
    switch (res.locals.reqData.model) {
        case "recipies":
        case "users":
        case "ingredients":
        case "auths":
            return commonRouter(req, res, next);
        default:
            res.json({ error: "No route defined" });
    }
});
export default router; */
export {
    recipieRouter,
    userRounter,
    authRouter,
    ingredientRouter,
    commonRouter,
};
