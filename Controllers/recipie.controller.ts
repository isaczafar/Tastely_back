import { NextFunction } from "express";
import { Recipie, Ingredient, RecipieIngredient } from "./../models";
import database from "../src/database";
import { Request, Response } from "express";
import { IngredientModel, RecipieIngredientModel } from "../models/types";

export default {
    create: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let ingredients = JSON.parse(JSON.stringify(req.body.ingredients));
            let {
                id,
                name,
                description,
                instructions,
                image_url,
                dificulty,
                time,
                profile_id,
            } = req.body;

            Recipie.create({
                id,
                name,
                description,
                instructions,
                image_url,
                dificulty,
                time,
                profile_id,
            }).then(async (res_recipie) => {
                let ingredientsPromise: any = [];
                for (let i of ingredients) {
                    ingredientsPromise.push(Ingredient.findByPk(i.id));
                }
                Promise.all(ingredientsPromise).then(
                    (res_ingredient: IngredientModel[]) => {
                        let recipiePromise: Promise<RecipieIngredientModel>[] =
                            [];
                        res_ingredient.forEach((e, i) => {
                            if (!e) {
                                return;
                            }
                            console.log(res_ingredient);
                            recipiePromise.push(
                                res_recipie.addIngredient(e, {
                                    through: {
                                        unit: ingredients[i].unit,
                                        amount: ingredients[i].amount,
                                    },
                                }),
                            );
                        });
                        Promise.all(recipiePromise).then((res_recIng) => {
                            res.json(res_recIng);
                        });
                    },
                );
            });
        } catch (error) {
            res.json({ msg: error });
        }
    },
    createBulk: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let recipies = req.body.map((e: any) => ({
                id: e.id,
                name: e.name,
                description: e.description,
                instructions: e.instructions,
                image_url: e.image_url,
                dificulty: e.dificulty,
                time: e.time,
            }));
            let bulkIngredients = JSON.parse(
                JSON.stringify(
                    req.body.map((e: any) => {
                        return e.ingredients;
                    }),
                ),
            );
            Recipie.bulkCreate(recipies).then(async (res_recipies) => {
                let recipiesPromise: any = [];

                res_recipies.forEach((e, i) => {
                    let currentRecipie = e;
                    let ingredients = bulkIngredients[i];
                    let ingredientsPromise: any = [];
                    for (let i of ingredients) {
                        ingredientsPromise.push(Ingredient.findByPk(i.id));
                    }
                    let newRecipiePromise = new Promise(async (res) => {
                        Promise.all(ingredientsPromise).then(
                            (res_ingredient) => {
                                let recipieIngredientPromise: Promise<RecipieIngredientModel>[] =
                                    [];
                                res_ingredient.forEach((e, i) => {
                                    if (!e) return;
                                    let reing = currentRecipie.addIngredient(
                                        e,
                                        {
                                            through: {
                                                unit: ingredients[i].unit,
                                                amount: ingredients[i].amount,
                                            },
                                        },
                                    );
                                    recipieIngredientPromise.push(reing);
                                });
                                Promise.all(recipieIngredientPromise).then(
                                    (recIng) => {
                                        res(recIng);
                                    },
                                );
                            },
                        );
                    });
                    recipiesPromise.push(newRecipiePromise);
                });
                Promise.all(recipiesPromise).then((recipies_out) => {
                    res.json(recipies_out);
                });
            });
        } catch (error) {
            res.json({ msg: error });
        }
    },
};
