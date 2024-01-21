import type { NextFunction, Request, Response } from "express";
import database from "../src/database";
import Sequelize from "sequelize";
import User from "./user.contoller";
import Ingredient from "./ingredient.controller";
import Common from "./common.controller";
import Auth from "./auth.controller";
import Recipie from "./recipie.controller";
import Token from "./token.controller";

const {
    like,
    gt,
    gte,
    lte,
    and,
    or,
    in: Op,
    substring,
    contains,
} = Sequelize.Op;

function getInstance(obj: any): string {
    let string = "unknown";
    if (typeof obj == "object") {
        string = obj instanceof Array ? "array" : "object";
    } else {
        string = typeof obj;
    }
    return string;
}

export { User, Ingredient, Common, Auth, Recipie, Token };
