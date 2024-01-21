import {
    Ingredient,
    Profile,
    Recipie,
    RecipieIngredient,
    Token,
    User,
} from "../models";
import type { NextFunction, Request, Response } from "express";
import database from "../src/database";
import Sequelize, { type ModelStatic } from "sequelize";

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
const getName = (name: string): ModelStatic<any> => {
    let mNames: { [key: string]: any } = {
        recipies: Recipie,
        users: User,
        ingredients: Ingredient,
        resing: RecipieIngredient,
        tokens: Token,
        profiles: Profile,
    };
    if (mNames.hasOwnProperty(name)) {
        return mNames[name];
    }
    return mNames.users;
};
async function buildQuery(req: Request, res: Response, next: NextFunction) {
    if (req.query) {
        let queryEntries = Object.fromEntries(
            Object.entries(req.query).map(([key, value]) => {
                key = key as string;
                switch (value?.getType.toLowerCase()) {
                    case "array":
                        return [key, { [and]: value }];
                    case "object":
                        return [];
                    case "string":
                        value = value as string;
                        if (value.includes("<")) {
                            if (
                                (value?.length as number) > 0 &&
                                !isNaN(Number(value))
                            ) {
                                let num:
                                    | RegExpExecArray
                                    | null
                                    | number
                                    | undefined = /([\d\.-]){1,}/.exec(value);
                                num = num ? Number(num[0]) : undefined;

                                return [key, { [lte]: num }];
                            }
                        }
                        if (value.includes(">")) {
                            if (
                                (value?.length as number) > 0 &&
                                !isNaN(Number(value))
                            ) {
                                let num:
                                    | RegExpExecArray
                                    | null
                                    | number
                                    | undefined = /([\d\.-]){1,}/.exec(value);
                                num = num ? Number(num[0]) : undefined;

                                return [key, { [gte]: num }];
                            }
                        }
                        if (value?.includes(";")) {
                            let valArr = value
                                .split(";")
                                .map((e) =>
                                    e.length > 0 && !isNaN(Number(e))
                                        ? Number(e)
                                        : e,
                                );

                            return [key, valArr];
                        }
                        return [key, { [substring]: value }];
                        break;
                }
                return [key, value];
            }),
        );
        let queryObject = queryEntries;

        res.locals.query = queryObject;
    }
    next();
}

export default {
    getById: async (req: Request, res: Response) => {
        let model = getName(res.locals.reqData.model);
        model.findByPk(req.params.id).then((data) => {
            let json = data ? data.toJSON() : "";
            console.log(json);
            res.send(json);
        });
    },
    buildQuery: buildQuery,
    list: async (req: Request, res: Response) => {
        let model = getName(res.locals.reqData.model);
        if (res.locals.query && Object.keys(res.locals.query).length > 0) {
            try {
                let query: object = {
                    where: res.locals.query,
                };
                switch (res.locals.reqData.model) {
                    case "recipies":
                        Recipie.findAll({
                            include: [{ model: Profile }, RecipieIngredient],
                        }).then((result) => {
                            return res.json({ result });
                        });
                        break;
                    default:
                        query = {
                            where: res.locals.query,
                        };
                }
                let response = await model.findAll(query);
                res.send(response);
            } catch (error) {
                console.log("-------ERROR-------");
                console.error(error);
                res.send("ERROR");
            }
        } else {
            try {
                switch (res.locals.reqData.model) {
                    case "recipies":
                        Recipie.findAll({
                            include: {
                                model: Ingredient,
                                through: {
                                    attributes: ["unit", "amount"],
                                },
                            },
                        }).then((result) => {
                            let result_out = result.map((e) => {
                                return e.toJSON();
                            });
                            result_out.map((recipie) => {
                                recipie.ingredients = recipie.ingredients.map(
                                    (ingredient: any) => {
                                        return {
                                            id: ingredient.id,
                                            name: ingredient.name,
                                            unit: ingredient.recipieIngredient
                                                .unit,
                                            amount: ingredient.recipieIngredient
                                                .amount,
                                        };
                                    },
                                );
                            });
                            return res.json(result_out);
                        });
                        return;
                        break;
                    default:
                }
                model.findAll().then((data) => {
                    console.log("DATA", data);
                    let json = data.map((e) => {
                        let json = e.toJSON();
                        return json;
                    });
                    console.log(json);
                    res.send(json);
                });
            } catch (error) {
                console.log("-------ERROR-------");
                console.log(error);
                res.send("ERROR");
            }
        }
    },
    query: async (req: Request, res: Response) => {
        let model = database.model(res.locals.reqData.model);
        try {
            if (req.query) {
                let query = Object.fromEntries(
                    Object.entries(req.query).map(([key, value]) => {
                        let val = Number(value) ? Number(value) : value;
                        return Number(value)
                            ? [key, Number(value)]
                            : [key, { [substring]: value }];
                    }),
                );

                let response = await model.findAll({
                    where: query,
                });
                res.send(response);
            }
        } catch (error) {
            console.log("-------ERROR-------");
            console.log(error);
            res.send("ERROR");
        }
    },
};
