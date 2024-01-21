import type { NextFunction, Request, Response } from "express";
import database from "../src/database";
import Sequelize from "sequelize";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config/auth.config";
const { or, iLike } = Sequelize.Op;
const User = database.model("user");

export default {};
